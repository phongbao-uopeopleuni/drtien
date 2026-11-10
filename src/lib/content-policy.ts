import type { PublicationSeed } from '../data/types.ts';

export function safeHttpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function doiUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const doi = value.replace(/^https:\/\/doi\.org\//i, '');
  return /^10\.\d{4,9}\/[^\s?#]+$/i.test(doi) ? `https://doi.org/${doi}` : null;
}

export function publicationIsReady(publication: PublicationSeed): boolean {
  return publication.verified === true && publication.publicReleaseReady === true &&
    publication.canonicalTitleNeedsVerification !== true &&
    Boolean(publication.canonicalTitle?.trim()) && Boolean(publication.journal?.trim()) &&
    Boolean(publication.authors?.length && publication.authors.every(author => author.trim())) &&
    Boolean(doiUrl(publication.doi) || safeHttpsUrl(publication.publisherUrl));
}

export function publicationLink(publication: PublicationSeed): string | null {
  return publicationIsReady(publication)
    ? doiUrl(publication.doi) || safeHttpsUrl(publication.publisherUrl)
    : null;
}

export function visiblePublications(publications: PublicationSeed[], draft: boolean): PublicationSeed[] {
  return publications
    .filter(publication => publication.visible !== false && (draft || publicationIsReady(publication)))
    .toSorted((a, b) => b.year - a.year || a.id.localeCompare(b.id));
}

export function localAssetPath(path: string | null | undefined): string | null {
  if (!path || !/^\/(images|cv)\/[a-zA-Z0-9/_-]+\.(webp|avif|png|jpe?g|pdf)$/i.test(path)) return null;
  return path;
}
