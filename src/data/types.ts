export interface PublicationSeed {
  id: string;
  year: number;
  titleFromCv: string;
  journalFromCv: string;
  authorExcerptFromCv: string;
  contributionFromCv: string;
  doi: string | null;
  publisherUrl: string | null;
  verified: boolean;
  publicReleaseReady: boolean;
  canonicalTitleNeedsVerification?: boolean;
  canonicalTitle?: string;
  journal?: string;
  authors?: string[];
  authorshipNote?: string | null;
  authorshipVerified?: boolean;
  visible?: boolean;
}

export interface PortfolioSeed {
  meta: { version: string; source: string; notes: string[] };
  site: { locale: string; goal: string; style: string; navigation: string[] };
  profile: {
    name: string;
    currentTitle: string;
    tagline: string;
    affiliation: string;
    dissertationMilestone: { event: string; month: string; display: string };
    email: string;
    linkedinUrl: string | null;
    orcidUrl: string | null;
    googleScholarUrl: string | null;
    portraitPath: string | null;
    publicCvPath: string | null;
    bioDraft: string;
    bioApproved: boolean;
    postdocInterestsDraft: string;
  };
  researchThemes: { id: string; title: string; summary: string; publicSafe: boolean }[];
  expertise: {
    experimentalVirology: string[];
    molecularBiology: string[];
    pathology: string[];
    pastProjectsRequireCompetencyReview: string[];
  };
  education: {
    institution: string;
    unit?: string;
    program: string;
    location: string;
    start: string;
    end: string | null;
    current?: boolean;
    institutionNameVerified?: boolean;
    topic?: string;
  }[];
  experience: {
    role: string | null;
    organization: string;
    start: string;
    end: string | null;
    requiresClarification?: boolean;
    parentInstitutionNeedsVerification?: boolean;
  }[];
  publications: PublicationSeed[];
  awards: { year: number; name: string; event: string; location?: string }[];
  privacy: {
    showPortrait: boolean;
    showEmail: boolean;
    showCvOnlyWhenApproved: boolean;
    showLinkedInOnlyWhenVerified: boolean;
    showPhone: boolean;
    showBirthYear: boolean;
    showRefereeContacts: boolean;
    showUnpublishedResults: boolean;
    showDraftManuscriptTitles: boolean;
  };
}
