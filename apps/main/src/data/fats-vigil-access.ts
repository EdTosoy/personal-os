/** Enable a public link only after checking the actual app, readiness and anonymous access. */
interface ProjectAccess {
  caseStudySlug: string;
  url: string;
  publicVerified: boolean;
  label: string;
  checkedAt: string;
  detail: string;
}

export const fatsVigilAccess: Record<string, ProjectAccess> = {
  'vigil-financial-reconciliation': {
    caseStudySlug: 'flow-financial-reconciliation',
    url: 'https://vigil.edtosoy.com',
    publicVerified: false,
    label: 'Deployment Pending',
    checkedAt: '2026-10-29',
    detail:
      'Public availability is planned for 30 October 2026. The domain did not resolve on 29 October; application readiness and dashboard access could not be verified. Historical AWS demo evidence does not establish current availability.',
  },
  'fats-job-application-platform': {
    caseStudySlug: 'fats-pdf-tools',
    url: 'https://fats.edtosoy.com',
    publicVerified: false,
    label: 'Private Preview',
    checkedAt: '2026-10-29',
    detail:
      'The configured custom domain and recorded Vercel alias redirect anonymous visitors to Vercel login. The protected guest preview is not a publicly accessible app; hosted accounts, email delivery and private file storage still need separate verification.',
  },
};

export function verifiedProjectUrl(slug: string): string | undefined {
  const access = fatsVigilAccess[slug];
  return access?.publicVerified ? access.url : undefined;
}
