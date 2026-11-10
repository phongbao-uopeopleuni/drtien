import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { localAssetPath, publicationIsReady, safeHttpsUrl } from '../src/lib/content-policy.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
export function validateContent({ release = false } = {}) {
  const content = JSON.parse(readFileSync(resolve(root, 'src/data/portfolio-content.seed.json'), 'utf8'));
  const approval = JSON.parse(readFileSync(resolve(root, 'src/data/approval.json'), 'utf8'));
  const errors = [];
  const warnings = [];
  if (!content.profile?.name || !content.profile.currentTitle || !content.profile.affiliation) errors.push('Profile name, current title and affiliation are required.');
  if (!content.profile?.dissertationMilestone?.display) errors.push('An explicit dissertation milestone is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.profile?.email ?? '')) errors.push('The public email address is invalid.');
  if (!Array.isArray(content.publications) || !Array.isArray(content.researchThemes)) errors.push('Publication and research arrays are required.');
  const privateFlags = ['showPhone', 'showBirthYear', 'showRefereeContacts', 'showUnpublishedResults', 'showDraftManuscriptTitles'];
  for (const key of privateFlags) if (content.privacy?.[key] !== false) errors.push(`Privacy policy ${key} must remain false.`);
  const ids = [...(content.publications ?? []), ...(content.researchThemes ?? [])].map(item => item.id);
  if (ids.length !== new Set(ids).size) errors.push('Content identifiers must be unique.');

  for (const [pathKey, approvalKey, folder, extension] of [
    ['publicCvPath', 'publicCvApproved', 'cv', 'pdf'],
    ['portraitPath', 'portraitApproved', 'images', '(?:webp|avif|png|jpe?g)'],
  ]) {
    if (!approval[approvalKey]) continue;
    const path = localAssetPath(content.profile[pathKey]);
    if (!path || !new RegExp(`^/${folder}/.+\\.${extension}$`, 'i').test(path)) errors.push(`Approved ${pathKey} needs a valid local /${folder}/ asset.`);
    else if (!existsSync(resolve(root, `public${path}`))) errors.push(`Approved asset is missing: public${path}`);
  }
  for (const [field, flag] of [['linkedinUrl', 'linkedinVerified'], ['orcidUrl', 'orcidVerified'], ['googleScholarUrl', 'googleScholarVerified']]) {
    if (approval[flag] && !safeHttpsUrl(content.profile[field])) errors.push(`Verified ${field} must contain a valid HTTPS URL.`);
  }
  const pending = (content.publications ?? []).filter(item => item.visible !== false && !publicationIsReady(item));
  if (pending.length) warnings.push(`${pending.length} CV citations remain unverified; no publisher links or contribution claims will be shown for these records.`);
  if (!approval.publicCvApproved) warnings.push('No approved public CV: download links are omitted.');
  if (!approval.portraitApproved) warnings.push('No approved portrait: typography-only hero is used.');
  if (release) {
    const required = ['profileApproved', 'researchApproved', 'expertiseApproved', 'educationApproved', 'experienceApproved', 'awardsApproved', 'postdocInterestsApproved'];
    for (const key of required) if (!approval[key]) errors.push(`Candidate/content approval is missing: ${key}.`);
    if (!content.profile.bioApproved) errors.push('The biography has not been approved.');
    if (!safeHttpsUrl(process.env.SITE_URL)) errors.push('SITE_URL must be an approved HTTPS production URL.');
    if (pending.length) errors.push(`Verify canonical title, journal, complete author list and DOI/publisher link, or set visible:false: ${pending.map(item => item.id).join(', ')}.`);
    if (content.education?.some(item => item.institutionNameVerified === false)) warnings.push('Unverified education institutions are omitted from release output.');
  }
  return { errors, warnings };
}

export function assertReleaseReady() {
  if (process.env.PORTFOLIO_RELEASE !== 'true') return;
  const { errors } = validateContent({ release: true });
  if (errors.length) throw new Error(`Public release is blocked:\n${errors.map(error => `- ${error}`).join('\n')}`);
}
