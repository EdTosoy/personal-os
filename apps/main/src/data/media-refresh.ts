/** Phase 5D evidence comes from real Playwright sessions; see docs/PHASE5D_MEDIA_REFRESH.md. */
export interface ProductDemo {
  project: string;
  mediaBase?: string;
  title: string;
  scope: string;
  transcript: string[];
  mobile: { file: string; alt: string }[];
}
export const productDemos: Record<string, ProductDemo> = {
  'flow-financial-reconciliation': {
    project: 'flow',
    mediaBase: '/evidence/fats-vigil-20261029/flow',
    title: 'Investigate a synthetic reconciliation',
    scope:
      'Refreshed 29 October 2026: local Vigil production build, disposable PostgreSQL and synthetic financial inputs. The real pipeline prepares reconciliation before recording; the UI is read-only. Hosted Stripe evidence is documented separately.',
    transcript: [
      'Read the financial overview and distinguish FAIL, PASS and UNKNOWN.',
      'Review completed reconciliation runs, matched records and unresolved populations.',
      'Open the anomalous run and inspect settlement and bank evidence.',
      'Review operational exceptions, independent completeness controls and processing workers.',
    ],
    mobile: [
      {
        file: 'overview',
        alt: 'Vigil financial dashboard at 390 pixels with synthetic data.',
      },
      { file: 'reconciliation', alt: 'Vigil reconciliation runs on mobile.' },
    ],
  },
  'fats-pdf-tools': {
    project: 'fats',
    mediaBase: '/evidence/fats-vigil-20261029/fats',
    title: 'Follow a job seeker’s next steps',
    scope:
      'Refreshed 29 October 2026: local production build, fictional job and interview in a fresh guest workspace. Status changes persist locally. Resumes, Career Vault and Offer Desk show their genuine account/file-service prerequisites. AI remains disabled; no hosted account or accepted upload is claimed.',
    transcript: [
      'Review the main dashboard and application tracker with a fictional saved job.',
      'Open the job description, set the stage to Applied, reload and verify persistence. This does not submit an application.',
      'Schedule a fictional technical conversation in Asia/Manila and review preparation notes.',
      'Inspect interview management, resume guidance, Career Vault and the Offer Desk account prerequisite.',
      'Visit PDF Tools as secondary functionality; no document acceptance or AI analysis is claimed.',
    ],
    mobile: [
      {
        file: 'dashboard',
        alt: 'FATS main dashboard on mobile with a fictional saved job.',
      },
      {
        file: 'interview-preparation',
        alt: 'FATS fictional interview preparation on mobile.',
      },
    ],
  },
  'pulse-hospital-devops-platform': {
    project: 'hospital',
    title: 'Review a fictional administrative visit',
    scope:
      'Local standalone abox frontend and cached Phase 3A API; real cookie session and disposable migrated PostgreSQL. All patients, appointments and charges are fictional.',
    transcript: [
      'Read the administration dashboard, then inspect fictional patient records.',
      'Review appointment scheduling and queue management.',
      'Open billing and confirm a synthetic charge as paid.',
      'Reload billing and verify the PAID state persists in PostgreSQL.',
    ],
    mobile: [
      {
        file: 'overview',
        alt: 'abox administration dashboard on mobile with fictional records.',
      },
      {
        file: 'billing-paid',
        alt: 'abox persisted synthetic paid charge on mobile.',
      },
    ],
  },
  pixshare: {
    project: 'pixshare',
    title: 'Browse a real local photo collection',
    scope:
      'Current local standalone frontend, cached release API and disposable PostgreSQL with bundled demo photographs. Real frontend interactions and API responses. Fresh authenticated upload/management is blocked; prior release evidence is retained and labeled. The public frontend responds, but its gallery was unavailable on 27 October 2026.',
    transcript: [
      'Browse the local album and open the public gallery.',
      'Open a photograph and inspect its image details.',
      'Filter the persisted collection to PNG, restore all formats and change its sort order.',
      'Inspect the upload and personal-gallery sign-in prerequisites without bypassing authentication.',
    ],
    mobile: [
      {
        file: 'gallery',
        alt: 'PixShare local public gallery on mobile with bundled photographs.',
      },
      { file: 'details', alt: 'PixShare image details on mobile.' },
    ],
  },
  'marcus-chess': {
    project: 'marcus',
    title: 'Find a threat, then play Stockfish',
    scope:
      'Read-only public deployment verified on 27 October 2026. Lesson and game progress stay in a fresh browser context; all non-read HTTP methods were blocked. No measured learning improvement is claimed.',
    transcript: [
      'Read Is Your Piece Safe?, start the lesson and identify the rook on d8.',
      'Read the real feedback and inspect the available learning practice.',
      'Start a new game against the real Stockfish worker, play e2–e4 and wait for its legal reply.',
      'Resign the demonstration game, open decision review and inspect local learning results and their limitations.',
    ],
    mobile: [
      { file: 'lesson', alt: 'Marcus lesson and chessboard on mobile.' },
      {
        file: 'play',
        alt: 'Marcus real Stockfish game after a legal engine reply on mobile.',
      },
    ],
  },
};
