import seed from './portfolio-content.seed.json';
import approval from './approval.json';
import type { PortfolioSeed } from './types';
import { localAssetPath, safeHttpsUrl, visiblePublications } from '../lib/content-policy';

export const content: PortfolioSeed = seed;
export const isDraft = import.meta.env.PORTFOLIO_RELEASE !== 'true';
export const profile = content.profile;
export const approvals = approval;
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const assetUrl = (path: string) => `${base}${path}`;
export const cvPath = approval.publicCvApproved ? localAssetPath(profile.publicCvPath) : null;
export const portraitPath = approval.portraitApproved && content.privacy.showPortrait
  ? localAssetPath(profile.portraitPath) : null;
export const linkedinUrl = approval.linkedinVerified ? safeHttpsUrl(profile.linkedinUrl) : null;
export const scholarlyLinks = [
  { label: 'ORCID', url: approval.orcidVerified ? safeHttpsUrl(profile.orcidUrl) : null },
  { label: 'Google Scholar', url: approval.googleScholarVerified ? safeHttpsUrl(profile.googleScholarUrl) : null },
].filter((link): link is { label: string; url: string } => Boolean(link.url));
export const publications = visiblePublications(content.publications, isDraft);
export const research = content.researchThemes.filter(theme => theme.publicSafe);
export const education = content.education.filter(item => isDraft || item.institutionNameVerified !== false);
export const experience = content.experience.filter(item =>
  !item.requiresClarification && !item.parentInstitutionNeedsVerification && item.role,
);
export const expertise = [
  { title: 'Experimental virology', description: 'Cellular approaches to infection biology.', skills: content.expertise.experimentalVirology },
  { title: 'Molecular biology', description: 'Investigating gene and protein expression.', skills: content.expertise.molecularBiology },
  { title: 'Experimental pathology', description: 'Connecting molecular responses with tissue pathology.', skills: content.expertise.pathology },
];
export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'publications', label: 'Publications' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'academic-journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export function dateLabel(value: string | null): string {
  if (!value) return 'Present';
  if (value.length === 4) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${value}-01T00:00:00Z`));
}
