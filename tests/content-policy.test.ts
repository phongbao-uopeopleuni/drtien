import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { doiUrl, localAssetPath, publicationIsReady, publicationLink, safeHttpsUrl, visiblePublications } from '../src/lib/content-policy.ts';
import type { PublicationSeed, PortfolioSeed } from '../src/data/types.ts';

const seed: PortfolioSeed = JSON.parse(readFileSync(new URL('../src/data/portfolio-content.seed.json', import.meta.url), 'utf8'));
// Synthetic records are test fixtures only; they are never portfolio content.
const ready: PublicationSeed = {
  id: 'test-only', year: 2024, titleFromCv: 'CV title', journalFromCv: 'CV journal',
  authorExcerptFromCv: 'Incomplete excerpt', contributionFromCv: 'Unverified role',
  canonicalTitle: 'Synthetic test title', journal: 'Synthetic test journal', authors: ['Test Author'],
  doi: '10.12345/test-fixture', publisherUrl: null, verified: true, publicReleaseReady: true,
};

test('all supplied unverified citations are withheld from a public release', () => {
  assert.equal(seed.publications.length, 4);
  assert.equal(visiblePublications(seed.publications, false).length, 0);
  assert.equal(visiblePublications(seed.publications, true).length, 4);
  seed.publications.forEach(publication => assert.equal(publicationLink(publication), null));
});
test('changing only the DOI never activates an unverified publication link', () => {
  assert.equal(publicationLink({ ...seed.publications[0], doi: '10.12345/test-fixture' }), null);
});
test('release publication gating requires canonical metadata and complete authors', () => {
  assert.equal(publicationIsReady(ready), true);
  for (const patch of [
    { verified: false }, { publicReleaseReady: false }, { canonicalTitle: '' },
    { journal: '' }, { authors: [] }, { authors: [''] }, { doi: null },
    { canonicalTitleNeedsVerification: true },
  ]) assert.equal(publicationIsReady({ ...ready, ...patch }), false);
});
test('explicitly hidden records stay hidden in draft and release; sorting is non-mutating', () => {
  const records = [{ ...ready, year: 2023 }, { ...ready, id: 'hidden', visible: false }];
  assert.equal(visiblePublications(records, true).length, 1);
  assert.equal(visiblePublications(records, false).length, 1);
  assert.equal(records[0].year, 2023);
});
test('DOI and external URL validation rejects empty and unsafe destinations', () => {
  for (const value of [null, '', 'not-a-doi', 'http://doi.org/10.1234/test', '10.1234/a b', '10.1234/a#fragment']) assert.equal(doiUrl(value), null);
  assert.equal(doiUrl('https://doi.org/10.1234/test'), 'https://doi.org/10.1234/test');
  for (const value of [null, '', 'javascript:alert(1)', 'http://example.com', '//example.com', 'https://user:password@example.com']) assert.equal(safeHttpsUrl(value), null);
});
test('approved local assets cannot escape public image/CV folders', () => {
  for (const value of [null, '', '/cv/../../private.pdf', '/cv/test.pdf?x=1', 'https://example.com/cv.pdf', '//example.com/cv.pdf', '/images/file.svg']) assert.equal(localAssetPath(value), null);
  assert.equal(localAssetPath('/cv/academic-cv.pdf'), '/cv/academic-cv.pdf');
  assert.equal(localAssetPath('/images/portrait.webp'), '/images/portrait.webp');
});
test('seed preserves academic status and private-data safeguards', () => {
  assert.equal(seed.profile.currentTitle, 'Ph.D. Candidate');
  assert.equal(seed.profile.dissertationMilestone.display, 'Anticipated Dissertation Defense: August 2027');
  for (const key of ['showPhone', 'showBirthYear', 'showRefereeContacts', 'showUnpublishedResults', 'showDraftManuscriptTitles'] as const) assert.equal(seed.privacy[key], false);
  assert.equal(seed.profile.publicCvPath, null);
  assert.equal(seed.profile.linkedinUrl, null);
});
