import type { WalkthroughStep } from '@/components/evidence/types';

export interface CaseStudy {
  slug: string;
  name: string;
  category: string;
  headline: string;
  overview: string;
  audience?: string;
  decisions?: { title: string; body: string }[];
  secondaryEvidence?: {
    title: string;
    scope: string;
    steps: WalkthroughStep[];
  };
  sourceBase?: string;
  sourceNote?: string;
  contributionSummary?: string;
  scope: string;
  stack: string[];
  problem: string;
  contributions: { title: string; body: string }[];
  architecture: { title: string; body: string; path: string }[];
  steps: WalkthroughStep[];
  verification: { label: string; body: string }[];
  limitations: string[];
  repository: string;
  revision: string;
  references: { label: string; path: string }[];
}

export const flowStudy: CaseStudy = {
  slug: 'flow-financial-reconciliation',
  name: 'Vigil — Financial Reconciliation & Exception Management',
  category: 'Financial reconciliation & operational assurance',
  audience:
    'Financial operations teams investigating payment, processor, settlement and bank records. Local captures use synthetic data; a separate hosted report verifies real Stripe sandbox charge and fee ingestion.',
  decisions: [
    {
      title: 'Separate closure from correctness',
      body: 'A resolved exception does not make a missing bank movement reconciled. Historical outcomes, current allocation proof and case status are separate statements.',
    },
    {
      title: 'Preserve an honest unknown',
      body: 'Successful ingestion cannot establish independent source completeness. The controls retain UNKNOWN when account-period closure has no independent evidence.',
    },
  ],
  headline: 'Find the financial records that do not agree.',
  overview:
    'Trace payment evidence from signed ingestion through deterministic settlement interpretation and bank reconciliation. An operator dashboard exposes exceptions, financial controls and recoverable work without treating successful processing as proof that money arrived.',
  contributionSummary:
    'Built immutable ingestion, Stripe sandbox enrichment, versioned processor and bank interpretations, exact 1:1 and declared N:1 reconciliation, exception lifecycles, completeness controls, durable workers and the read-only operator dashboard. Prepared and verified an ephemeral AWS deployment separately from the local visual walkthrough.',
  scope:
    'Fresh Playwright captures from an existing local production build and disposable PostgreSQL, using the real ingestion and reconciliation pipeline with synthetic processor and bank records. The dashboard is read-only. Stripe sandbox and historical AWS evidence below comes from the upstream Phase 15 report, not these screenshots; the planned public domain remains pending.',
  stack: [
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Stripe sandbox',
    'AWS / Terraform',
    'Next.js',
    'Exact money',
    'Durable workers',
  ],
  problem:
    'A successful payment job is not proof that the money reconciles. Processor records, settlements and bank observations can disagree, arrive twice, or lack independent completeness evidence. Operators need an explanation that preserves those distinctions.',
  contributions: [
    {
      title: 'Financial correctness',
      body: 'Implemented integer minor-unit money and a PostgreSQL-enforced immutable double-entry ledger. Exact 1:1 and explicitly declared N:1 settlement matching use frozen populations and unique whole-item allocations; ambiguous candidates remain unmatched or ineligible.',
    },
    {
      title: 'Recoverable processing',
      body: 'Verified Stripe signatures over raw bytes, committed immutable receipts with transactional outbox intent, and moved API enrichment to workers. Semantic idempotency, database-clock leases, fencing and bounded retries prevent duplicate effects and reject expired ownership.',
    },
    {
      title: 'Operational evidence',
      body: 'Built a read-only Next.js investigation surface over approved PostgreSQL reads, separating financial state, operational case status and current allocation proof.',
    },
  ],
  architecture: [
    {
      title: 'Exact amounts across boundaries',
      body: 'Money uses bigint internally and integer strings at serialization boundaries. Currency stays explicit; the browser does not calculate authoritative financial truth.',
      path: 'libs/money/src/index.ts',
    },
    {
      title: 'Domain rules, PostgreSQL enforcement',
      body: 'The modular monolith separates financial domains from database adapters. Frozen reconciliation populations preserve historical outcomes while current proof is evaluated separately.',
      path: 'libs/reconciliation-domain/src/index.ts',
    },
    {
      title: 'Server-side operations reads',
      body: 'The operations app consumes a server-only read layer. Bounded, parameterized queries and explicit unavailable states avoid turning failed queries into healthy empty dashboards.',
      path: 'apps/ops/server/read.ts',
    },
    {
      title: 'Evidence is not payment authority',
      body: 'Stripe capture, fee, refund, dispute and payout contracts interpret observations; they do not authorize payments or automatically post journals. Bank observations are synthetic. Settlement membership requires explicit evidence, not similar amounts or dates.',
      path: 'docs/architecture/current-system.md',
    },
    {
      title: 'Auditability and resilient work',
      body: 'Financial changes, audit and work intent commit together. Immutable provenance and versioned interpretations explain replay and recovery. Exception classification, assignment and resolution remain distinct from reconciliation; accepted risk stays unreconciled.',
      path: 'docs/architecture/invariants.md',
    },
    {
      title: 'AWS architecture with bounded trust',
      body: 'The historical demo verified non-root ECS Fargate containers behind ALB/ACM HTTPS, private Single-AZ RDS, scoped IAM and database roles, SSM SecureString and CloudWatch logs. Public task IPs allow outbound access without a NAT Gateway; security groups restrict ingress. Current Sydney/Cloudflare configuration is prepared separately and needs hosted verification.',
      path: 'docs/phase15/sydney-redeployment.md',
    },
    {
      title: 'Scoped human access',
      body: 'Current source adds Better Auth database sessions, Admin/Operator/Viewer roles and explicit book grants. Authentication runtime and account seeding use separate restricted database roles. The local recording signs in a synthetic Viewer against a single demo book before recording; this does not establish a hosted authentication rollout.',
      path: 'apps/ops/server/auth-service.ts',
    },
  ],
  steps: [
    {
      title: 'Read financial assurance',
      image: {
        src: '/evidence/fats-vigil-20261029/flow/overview-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Vigil dashboard with FAIL financial assurance, PASS structural integrity and UNKNOWN completeness checks.',
        caption: 'Operations overview · real database-backed assurance states.',
        status: 'Functional app · synthetic data',
      },
      description:
        'The dashboard separates financial assurance, structural integrity, operational cases and terminal work. The intentionally imperfect dataset keeps failed and unknown checks visible.',
      annotation:
        'Source Completeness is UNKNOWN. Successful ingestion alone does not establish independent account-period closure.',
    },
    {
      title: 'Inspect reconciliation results',
      image: {
        src: '/evidence/fats-vigil-20261029/flow/reconciliation-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Two completed reconciliation runs with matched, unmatched and ineligible outcomes and active current proof.',
        caption:
          'Reconciliation runs · frozen outcomes alongside current allocation proof.',
        status: 'Functional app · synthetic data',
      },
      focus: { x: 0.2, y: 0.3, width: 0.72, height: 0.3 },
      description:
        'Run summaries preserve processor and bank populations separately. The anomalous run contains matched, unmatched and ineligible items instead of presenting a misleading all-green summary.',
      annotation:
        'Frozen outcomes are historical; the CURRENT PROOF column is a separate statement about present allocations.',
    },
    {
      title: 'Trace settlement evidence',
      image: {
        src: '/evidence/fats-vigil-20261029/flow/settlement-inspection-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Reconciliation detail showing rule version, PHP currency, window, processor and bank populations and population hash.',
        caption:
          'Run detail · frozen population, rule version and source provenance.',
        status: 'Functional app · synthetic data',
      },
      focus: { x: 0.2, y: 0.27, width: 0.66, height: 0.38 },
      description:
        'A completed run retains its rule version, time window, currency, member counts and population hash. The next section links the decision to processor provenance.',
      annotation:
        'RULE VERSION and CURRENCY make the matching context explicit. The full population contains 12 processor items and 10 bank items; COMPLETED does not mean every item matched.',
    },
    {
      title: 'Check completeness controls',
      image: {
        src: '/evidence/fats-vigil-20261029/flow/controls-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Vigil completeness and integrity controls over synthetic financial records.',
        caption:
          'Controls separate structural checks from independent source assurance.',
        status: 'Functional app · synthetic data',
      },
      description:
        'Inspect completeness and assurance controls alongside reconciliation. Missing independent evidence remains visible instead of being inferred from successful processing.',
      annotation:
        'A healthy worker does not prove complete financial records. Unknown controls stay unknown.',
      focus: {
        x: 0.2,
        y: 0.28,
        width: 0.65,
        height: 0.3,
      },
    },
    {
      title: 'Investigate exceptions',
      image: {
        src: '/evidence/fats-vigil-20261029/flow/exceptions-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Exception queue with open unreconciled cases and a resolved accepted-risk case that is still unreconciled.',
        caption:
          'Exception queue · operational closure remains separate from financial state.',
        status: 'Functional app · synthetic data',
      },
      focus: { x: 0.2, y: 0.32, width: 0.7, height: 0.3 },
      description:
        'The exception queue exposes classification, assignment and linked runs. Accepting a risk can close the operational case while the missing bank movement remains financially unreconciled.',
      annotation:
        'The accepted-risk case is RESOLVED / ACCEPTED RISK and still UNRECONCILED. Its PHP amount is a case value, not an extra amount to add to total exposure.',
    },
    {
      title: 'Inspect retained failures',
      image: {
        src: '/evidence/fats-vigil-20261029/flow/workers-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Worker operations showing durable processing states and retained retryable and terminal failures.',
        caption: 'Worker operations · explicit synthetic failure injection.',
        status: 'Functional app · synthetic data',
      },
      focus: { x: 0.6, y: 0.26, width: 0.32, height: 0.15 },
      description:
        'The demo provisioner deliberately introduces transient and poison work. Retaining these states makes recovery needs visible without treating worker success as financial reconciliation.',
      annotation:
        'Failures here are deliberately injected demo scenarios. The screenshot does not establish production resilience or an uptime guarantee.',
    },
  ],
  verification: [
    {
      label: 'Fresh synthetic operator walkthrough',
      body: 'This refresh executed the real local pipeline and captured six database-backed screens at desktop and mobile widths: overview, reconciliation, run detail, exceptions, controls and workers. Both journeys passed without observed page or HTTP errors. A short continuous recording uses the same synthetic dataset.',
    },
    {
      label: 'Recorded Stripe and recovery proof',
      body: 'The upstream Phase 15 report (9 October 2026) records a real signed Stripe sandbox charge.succeeded event through HTTPS ingestion, durable processing and Charge/Balance Transaction enrichment into charge/fee interpretations. Two overlapping backfills retained one raw event, one completion and stable economic derivation identities. Refund, dispute and payout evidence remains local contract/integration scope.',
    },
    {
      label: 'Recorded regression and AWS evidence',
      body: 'Phase 15 records the full pnpm verify gate, including 293 real PostgreSQL integration tests, plus 8 final deployment/access regressions. A 92-resource AWS runtime was created and actually destroyed; a fresh 92-create plan was checked without a second apply. These are attributed upstream results, not suites or cloud operations rerun by this portfolio refresh.',
    },
  ],
  limitations: [
    'Deployment Pending: vigil.edtosoy.com is planned for 30 October 2026. On 29 October it did not resolve, so application readiness and dashboard access could not be verified. No public Live App link is activated.',
    'Stripe is sandbox-only and bank observations are synthetic. Vigil neither initiates live payments nor integrates with a real bank. Successful ingestion cannot establish all-time source completeness; missing independent evidence stays UNKNOWN.',
    'The operator dashboard is read-only. Reconciliation, controls and exception mutations use separate command boundaries; screenshots do not imply that operators can trigger those commands through the interface.',
    'Matching supports exact 1:1 and complete-declaration N:1. Arbitrary N:M, partial allocations, FX, independent payment authorization and business-to-ledger orchestration remain deferred.',
    'Historical hosted proof used a disposable Single-AZ database and shared demo access. Current Sydney deployment/authentication preparation is not a verified public rollout, HA/restore guarantee, compliance certification or production SLA. AI work remains deferred.',
  ],
  repository: 'https://github.com/EdTosoy/vigil',
  revision: 'a479cd7cb896b960c65f2b083673d54c3f8f95a2',
  sourceNote:
    'Source links are pinned to the inspected Vigil revision. Fresh local synthetic media, historical hosted Stripe/AWS proof and pending public availability have separate evidence. The refresh report records commands and media provenance.',
  references: [
    {
      label: 'Current architecture and financial authority boundaries',
      path: 'docs/architecture/current-system.md',
    },
    {
      label: 'Stripe sandbox scope and developer workflow',
      path: 'docs/phase14/README.md',
    },
    {
      label: 'Current Sydney deployment preparation',
      path: 'docs/phase15/sydney-redeployment.md',
    },
    {
      label: 'Operations architecture and local reproduction',
      path: 'docs/phase12/README.md',
    },
    {
      label: 'Financial invariants',
      path: 'docs/architecture/invariants.md',
    },
    {
      label: 'Historical ephemeral deployment and actual teardown',
      path: 'docs/phase15/verification.md',
    },
    {
      label: 'Reconciliation integration tests',
      path: 'tests/reconciliation.integration.test.ts',
    },
    {
      label: 'Resilience integration tests',
      path: 'tests/resilience.integration.test.ts',
    },
  ],
};

export const fatsStudy: CaseStudy = {
  slug: 'fats-pdf-tools',
  name: 'FATS — Friendly Applicant Tracking System',
  category: 'Job-search workflow',
  headline: 'Keep the next opportunity in view.',
  overview:
    'A personal job-search workspace that connects saved listings, application stages, interview preparation and exact resume versions. Offer Desk and Career Vault carry the record forward into an offer decision and employment, while local PDF tools support the documents along the way.',
  contributionSummary:
    'Built the application and interview workflows, account-scoped persistence, Sidekick capture handoff, document/version boundaries, Offer Desk and Career Vault, plus the supporting local PDF tools.',
  scope:
    'Fresh desktop/mobile captures and a short recording use the real local production build, a new guest workspace and fictional jobs/interviews. Sidekick, authenticated offers and PDF v2 images are retained historical evidence. The current library explains unavailable file services before upload; no accepted private document or hosted account workflow is claimed by this guest recording.',
  stack: [
    'Next.js',
    'TypeScript',
    'PostgreSQL',
    'Better Auth',
    'Chrome extension',
    'Playwright',
  ],
  problem:
    'A job search fragments quickly across browser tabs, notes, resume copies and deadlines. The seeker needs a reliable record of what they saved, what they submitted and what they need to prepare next.',
  contributions: [
    {
      title: 'Capture and follow through',
      body: 'Connected Chrome job capture to an explicit review/save handoff, manual application stages, interview preparation and time-zone-aware scheduling.',
    },
    {
      title: 'Keep account records coherent',
      body: 'Built server-backed account workspaces, scoped document versions and lifecycle rules, with a separate browser-local guest mode and explicit backup/import boundaries.',
    },
    {
      title: 'Support decisions and documents',
      body: 'Built Offer Desk terms, revision history, questions and explicit decisions, plus Career Vault employment records and document checklists. Browser PDF tools edit and export real local bytes; extraction/splitting have separate development evidence. Explainable AI matching is paused and disabled by default pending evaluation.',
    },
  ],
  architecture: [
    {
      title: 'Listing to saved opportunity',
      body: 'A bounded capture contract checks origin, freshness and listing fields before confirmation. The extension hands off data without becoming an automatic job application agent.',
      path: 'libs/domain/src/capture.ts',
    },
    {
      title: 'Product rules stay independent',
      body: 'Domain rules govern applications, interviews and offers; account adapters persist them in PostgreSQL. Guest storage remains a separate local path.',
      path: 'docs/PRODUCT_INTEGRATION_VERIFICATION.md',
    },
    {
      title: 'Document processing is a separate boundary',
      body: 'Private intake requires scanning and constrained parsing. Supporting browser PDF tools use PDF.js for rendering and pdf-lib in a worker for output; local edits are not saved library versions.',
      path: 'apps/web/src/lib/pdf-tools-engine.ts',
    },
    {
      title: 'Authentication and account safety',
      body: 'Better Auth uses live database sessions, verified-email access, origin checks and owner-scoped queries. Single-use verification/recovery, reset-driven session revocation, explicit guest transfer and erasure guards protect account boundaries. Hosted preparation adds transaction-pinned advisory locks for pooled PostgreSQL and a bounded Resend adapter; actual hosted inbox delivery remains unverified.',
      path: 'docs/FATS_D2_HOSTED_ACCOUNTS_VERIFICATION.md',
    },
    {
      title: 'Versioned career records',
      body: 'Applications link the exact submitted resume version; uploading a newer copy does not rewrite history. Offer acceptance, application stage and employment creation are separate user decisions. Career Vault keeps employment metadata, checklists and document history; restricted file storage does not make metadata workflows disappear.',
      path: 'docs/PRODUCT_INTEGRATION_VERIFICATION.md',
    },
  ],
  steps: [
    {
      title: 'See the next job-search action',
      description:
        'The fresh guest dashboard brings application stages and next actions into one workspace. Its fictional saved job is stored in this browser; no account document acceptance is demonstrated.',
      annotation:
        'The counts are synthetic test records, not user adoption or hiring outcomes.',
      image: {
        src: '/evidence/fats-vigil-20261029/fats/dashboard-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'See the next job-search action in the actual FATS application with fictional records.',
        caption: 'Authentic local application capture; synthetic records.',
        status: 'Verified local workflow; synthetic data',
      },
    },
    {
      title: 'Capture and confirm a job',
      description:
        'Sidekick captures a listing through the Chrome extension. Review and correct the fields before explicitly saving the opportunity.',
      annotation:
        'This screenshot shows the guest handoff; the separate product journey verifies authenticated capture. Saving never submits an application.',
      image: {
        src: '/evidence/fats/capture.png',
        width: 1440,
        height: 1470,
        alt: 'Capture and confirm a job in the actual FATS application with fictional records.',
        caption:
          'Retained prior local capture; synthetic records; not freshly rerun.',
        status: 'Historical workflow evidence',
      },
      focus: {
        x: 0.21,
        y: 0.28,
        width: 0.72,
        height: 0.32,
      },
    },
    {
      title: 'Track applications through their stages',
      description:
        'Keep saved jobs, descriptions and manual application stages together. The fresh guest capture verifies a stage change after reload in local storage; account persistence is described by the earlier evidence.',
      annotation:
        'Guest data stays browser-local. Stage changes are user decisions, separate from interview and offer events.',
      image: {
        src: '/evidence/fats-vigil-20261029/fats/applications-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Track applications through their stages in the actual FATS application with fictional records.',
        caption: 'Authentic local application capture; synthetic records.',
        status: 'Verified local workflow; synthetic data',
      },
      focus: { x: 0.2, y: 0.32, width: 0.7, height: 0.22 },
    },
    {
      title: 'Review the saved job and persist an update',
      description:
        'Read the fictional job description, set its manual stage to Applied and reload. The recorded guest workflow verifies local persistence.',
      annotation:
        'Changing the tracker stage never submits an application to an employer.',
      image: {
        src: '/evidence/fats-vigil-20261029/fats/updated-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'FATS application details after a real persisted Applied status update.',
        caption: 'Fresh local guest workflow; synthetic job.',
        status: 'Local browser persistence verified',
      },
      focus: { x: 0.74, y: 0.2, width: 0.23, height: 0.3 },
    },
    {
      title: 'Prepare for each interview',
      description:
        'Schedule conversations in explicit time zones and keep preparation and reflection notes attached to the opportunity.',
      annotation:
        'Completing an interview does not automatically advance an application.',
      image: {
        src: '/evidence/fats-vigil-20261029/fats/interviews-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Prepare for each interview in the actual FATS application with fictional records.',
        caption: 'Authentic local application capture; synthetic records.',
        status: 'Verified local workflow; synthetic data',
      },
      focus: { x: 0.2, y: 0.32, width: 0.7, height: 0.24 },
    },
    {
      title: 'Inspect interview preparation',
      description:
        'A fictional technical interview is scheduled in Asia/Manila. Its detail view keeps the preparation notes beside the interview information.',
      annotation:
        'This is a local planning record; no meeting invitation or email is sent.',
      image: {
        src: '/evidence/fats-vigil-20261029/fats/interview-preparation-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'FATS interview details with fictional preparation notes.',
        caption: 'Fresh local guest interview; fictional meeting.',
        status: 'Local synthetic workflow',
      },
      focus: { x: 0.2, y: 0.24, width: 0.52, height: 0.45 },
    },
    {
      title: 'Understand the document safety boundary',
      description:
        'The implemented library supports categorization, immutable versions, default resumes and exact submitted-version links. This retained screenshot predates the improved availability guidance: current intake disables uploads before opening the form when required scanning is unavailable; server endpoints still fail closed.',
      annotation:
        'Historical scanner-refusal evidence, not an accepted upload. Earlier populated libraries used scanner fixtures; current real-scanner acceptance remains unverified.',
      image: {
        src: '/evidence/fats/scanner-unavailable.png',
        width: 600,
        height: 640,
        alt: 'Keep document versions behind safety checks in the actual FATS application with fictional records.',
        caption:
          'Retained prior local capture; synthetic records; not freshly rerun.',
        status: 'Historical workflow evidence',
      },
      focus: {
        x: 0.05,
        y: 0.72,
        width: 0.9,
        height: 0.12,
      },
    },
    {
      title: 'Inspect private workspace prerequisites',
      description:
        'The current resume workspace explains file-service restrictions before sign-in and keeps local PDF actions usable. Private document management and Offer Desk require an account; this guest recording does not claim authenticated operation.',
      annotation:
        'Private file storage and a healthy scanner are independent prerequisites. AI matching stays disabled; the PDF v2 route remains a development-only candidate.',
      image: {
        src: '/evidence/fats-vigil-20261029/fats/resumes-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'FATS resume and document workspace with the genuine private-library sign-in prerequisite.',
        caption: 'Fresh local workspace; private documents require an account.',
        status: 'Authentication prerequisite',
      },
      focus: { x: 0.2, y: 0.24, width: 0.73, height: 0.36 },
    },
    {
      title: 'Carry the record into Career Vault',
      description:
        'Career Vault records employment details, document checklists and immutable history after an explicit transition. This fresh guest capture shows the account prerequisite; the earlier product and later metadata reports cover authenticated persistence.',
      annotation:
        'No employment record or private document is created by the guest walkthrough. Employment creation remains separate from accepting an offer.',
      image: {
        src: '/evidence/fats-vigil-20261029/fats/career-vault-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Actual FATS Career Vault showing its guest account prerequisite and document guidance.',
        caption: 'Fresh local guest capture; account prerequisite.',
        status: 'Authentication prerequisite',
      },
    },
    {
      title: 'Compare offers and choose next steps',
      description:
        'Offer Desk records terms, questions, revisions and a deliberate decision. Career Vault supports an explicit transition into employment and document checklists.',
      annotation:
        'No employer is contacted. Accepting an offer does not silently create employment or alter an application stage.',
      image: {
        src: '/evidence/fats/offers.png',
        width: 820,
        height: 2563,
        alt: 'Compare offers and choose next steps in the actual FATS application with fictional records.',
        caption:
          'Retained prior local capture; synthetic records; not freshly rerun.',
        status: 'Historical workflow evidence',
      },
      focus: {
        x: 0.3,
        y: 0.2,
        width: 0.64,
        height: 0.3,
      },
    },
  ],
  verification: [
    {
      label: 'Product workflows and fresh media',
      body: 'The earlier product integration report records two desktop/narrow journeys through registration, packaged Sidekick capture, stages, interviews, offers, explicit employment, PDF export and backup/import. This refresh independently records guest stage persistence after reload, a fictional interview, and the real Resume, Career Vault and Offer Desk prerequisites at desktop/mobile widths.',
    },
    {
      label: 'Recorded hosted-account preparation',
      body: 'The D2 report records 32/32 account/safety/data-protection integration tests both directly and through transaction PgBouncer, 3/3 hosted-account integrations and 6/6 configuration/mail unit checks. Browser evidence records 36 account-flow cases, 2 no-storage cases, 50 guest/PDF cases and 8 fail-closed document/erasure cases. These local synthetic results are not proof of live Neon or inbox delivery.',
    },
    {
      label: 'Protected preview and explicit gaps',
      body: 'D1 records 24/24 browser tests on a protected hosted guest deployment. Current anonymous checks of fats.edtosoy.com and the recorded Vercel alias reach Vercel login, not the workspace. D2 records 318/319 serial unit tests passing with the existing matching-plan checksum failure; actual scanner acceptance, live mail delivery and public beta readiness remain unverified.',
    },
  ],
  limitations: [
    'Private Preview: fats.edtosoy.com currently redirects anonymous visitors to Vercel login. The stable Vercel alias is also protected. No public Live App link is enabled; hosted account preparation is implemented locally but not established as deployed.',
    'Private document uploads/library access require persistent private storage and a healthy scanner. Current no-storage/scanner environments explain the restriction and fail closed. Real configured-scanner acceptance and accepted-file browser workflows remain unverified.',
    'Explainable AI job matching is paused and disabled by default. It compares reviewed resume/job text after explicit consent, uses structured outputs and validates supporting quotations; it does not establish live-model quality, hiring outcomes or validated recommendations.',
    'Production PDF tools edit and export local documents without uploading them. Extraction, splitting, merging and advanced page organization have development-only v2 evidence; the separate design prototype simulates actions. PDF compatibility and accessibility remain bounded.',
    'Guest records stay in this browser and can be lost when site data is cleared. Accounts add PostgreSQL persistence and explicit transfer; hosted inbox delivery, provider recovery/retention and real-person beta readiness still need their own verification.',
    'The upstream D2 full unit suite retains one matching-plan source-hash failure. Earlier parallel parser contention and candidate-browser failures remain historical evidence; selected later passes are not represented as an entirely green release gate.',
  ],
  repository: 'https://github.com/EdTosoy/FATS',
  revision: '918d8eafc7698184cdc439fe9d174c0dc6279fef',
  sourceNote:
    'Links are pinned to the inspected FATS revision. D1/D2 and Hallmark reports record prior upstream checks; this refresh reruns the synthetic guest media journey and portfolio checks, not the full application suite. Historical PDF-v2 captures retain their original candidate status.',
  references: [
    {
      label: 'Protected hosted guest deployment and 24 browser checks',
      path: 'docs/FATS_D1_DEPLOYMENT_VERIFICATION.md',
    },
    {
      label: 'Hosted-account preparation, checks and remaining blockers',
      path: 'docs/FATS_D2_HOSTED_ACCOUNTS_VERIFICATION.md',
    },
    {
      label: 'Current document guidance and Career Vault regression',
      path: 'docs/HALLMARK_F08_VERIFICATION.md',
    },
    {
      label: 'Explainable matching and evidence limits',
      path: 'docs/MATCHING.md',
    },
    {
      label: 'Product journey and executed checks',
      path: 'docs/PRODUCT_INTEGRATION_VERIFICATION.md',
    },
    {
      label: 'Current scanner and operational limitations',
      path: 'docs/PRIVATE_BETA_HARDENING_2_VERIFICATION.md',
    },
    {
      label: 'Theme verification and historical failures',
      path: 'docs/UI_THEME_REFINEMENT_VERIFICATION.md',
    },
    {
      label: 'PDF extraction and split candidate',
      path: 'docs/PDF_TOOLS_2_PHASE_4B_VERIFICATION.md',
    },
  ],
  audience:
    'Early-career job seekers managing their own employment search, especially graduates keeping listings, conversations, documents and next steps across several websites.',
  decisions: [
    {
      title: 'Guest convenience versus account isolation',
      body: "Local guest records and authenticated PostgreSQL workspaces use distinct persistence boundaries. Imports, retries and account changes must not merge another person's data.",
    },
    {
      title: 'Keep user decisions explicit',
      body: 'Capture does not apply, interviews do not advance stages, offer acceptance does not create employment automatically, and unavailable scanning never promotes a document.',
    },
    {
      title: 'Explainability before activation',
      body: 'Matching uses consent-gated extraction, structured model outputs and evidence validation. The feature remains disabled by default: live-model quality, safety and usefulness have not been established.',
    },
  ],
  secondaryEvidence: {
    title: 'PDF Tools: document-processing engineering',
    scope:
      'The existing editor is separate from the development-only v2 candidate shown here. V2 processes real local PDFs; the separate design prototype is simulated and is not used in this walkthrough. Nothing shown establishes release readiness.',
    steps: [
      {
        title: 'Open a local PDF',
        image: {
          src: '/evidence/fats/workspace.png',
          width: 1440,
          height: 1000,
          alt: 'FATS v2 Quick Sign workspace showing the synthetic three-page offer PDF, local-only status and page thumbnails.',
          caption: 'V2 candidate · a real synthetic PDF opened locally.',
          status: 'Development candidate · real PDF processing',
        },
        description:
          'The local file picker opens a three-page synthetic offer. The document, thumbnail rail and page controls are rendered by the running application, using actual PDF bytes.',
        annotation:
          'The header says In this tab only. This is session-local editing, not a saved document or a Career Vault upload.',
      },
      {
        title: 'Place a signature',
        image: {
          src: '/evidence/fats/signature.png',
          width: 1440,
          height: 1000,
          alt: 'A typed Demo Reviewer signature selected on the synthetic offer, with size and movement controls.',
          caption: 'V2 candidate · typed signature placement and adjustment.',
          status: 'Development candidate · real PDF processing',
        },
        focus: {
          x: 0.3,
          y: 0.58,
          width: 0.31,
          height: 0.16,
        },
        description:
          'A typed signature becomes a placed mark with movement and proportional size controls. The same artwork is embedded in the completed PDF.',
        annotation:
          'This is a visual personal mark. It is not a cryptographic signature, identity verification or certification.',
      },
      {
        title: 'Organize the pages',
        image: {
          src: '/evidence/fats/organization.png',
          width: 1440,
          height: 1000,
          alt: 'Organize pages dialog with original page 2 first and original page 1 selected in position 2, plus move, rotate and remove controls.',
          caption:
            'V2 candidate · actual page reordering with original identity visible.',
          status: 'Development candidate · real PDF processing',
        },
        focus: {
          x: 0.315,
          y: 0.455,
          width: 0.12,
          height: 0.275,
        },
        description:
          'Moving the first page later changes the order to original pages 2, 1, 3. The selected thumbnail retains its original-page label, and the operation can be undone.',
        annotation:
          'The second thumbnail is current page 2 / original page 1. Stable source identity keeps its signature attached to the correct page.',
      },
      {
        title: 'Extract or split copies',
        image: {
          src: '/evidence/fats/extraction.png',
          width: 1440,
          height: 1000,
          alt: 'Extract pages dialog selecting current pages 1 and 3 and preparing a separate two-page PDF.',
          caption:
            'V2 candidate · noncontiguous selection, prepared as a separate PDF.',
          status: 'Development candidate · real PDF processing',
        },
        focus: {
          x: 0.185,
          y: 0.285,
          width: 0.14,
          height: 0.145,
        },
        description:
          'Extraction selects current pages 1 and 3 without replacing the editing session. A separate split workflow divides the three-page document after page 1 into one-page and two-page outputs.',
        annotation:
          'The capture selected 2 pages. The downloaded extraction reopened with 2 pages; the two downloaded split files reopened with 1 and 2 pages.',
      },
      {
        title: 'Reopen the real output',
        image: {
          src: '/evidence/fats/reopened-output.png',
          width: 1440,
          height: 1000,
          alt: 'The completed PDF reopened in the FATS renderer with the Demo Reviewer signature embedded in its page content.',
          caption:
            'V2 candidate · downloaded completed bytes reopened in a fresh page.',
          status: 'Development candidate · real PDF processing',
        },
        focus: {
          x: 0.3,
          y: 0.58,
          width: 0.31,
          height: 0.16,
        },
        description:
          'The completed file was downloaded through the browser, parsed with pdf-lib to check its three pages, then reopened through the actual PDF.js workspace in a fresh browser page.',
        annotation:
          'The signature is now part of the reopened document. This verifies this synthetic export, not all PDF structures or other viewers.',
      },
    ],
  },
};

export const hospitalStudy: CaseStudy = {
  slug: 'pulse-hospital-devops-platform',
  name: 'Hospital Management Platform',
  category: 'Healthcare administration',
  audience:
    'Administrative staff coordinating patient records, appointments, queues and billing; the local showcase uses fictional patient records only.',
  contributionSummary:
    'Built patient, appointment, queue and billing workflows, PostgreSQL data paths, revocable cookie sessions, server-side role checks and mutation audit trails; integrated supplied abox branding and prepared delivery infrastructure.',
  decisions: [
    {
      title: 'Keep linked records consistent',
      body: 'Patient, appointment, queue and billing records cross workflow boundaries. Server-side relationship validation and authorization complement the interface; a convenient UI alone cannot enforce them.',
    },
    {
      title: 'Represent money and refresh honestly',
      body: 'Billing distinguishes legacy amounts requiring review from explicit PHP minor units. The captured frontend refreshes by five-second polling; gateway source does not prove WebSocket use.',
    },
    {
      title: 'Separate infrastructure from operation',
      body: 'Historical Kubernetes, Terraform, CI/CD and monitoring definitions remain source evidence. The newer EC2/Compose preparation adds file secrets, bounded services and backup/restore tooling, but the intended deployment environment has not passed its eligibility gate. No running AWS or Kubernetes system is claimed.',
    },
  ],
  headline: 'Connecting each step of a patient visit.',
  overview:
    'abox connects patient registration, appointments, queue coordination, consultation notes and billing through a Next.js workspace and a NestJS/PostgreSQL API.',
  scope:
    'Fresh captures from the current abox production frontend, a local API container and isolated migrated PostgreSQL 17. Login, records, queue transitions and payment persistence use real application paths. All patient records are fictional. The consultation image is retained from the prior Phase 5 capture and is labeled separately. No cloud runtime is implied.',
  stack: [
    'Next.js',
    'NestJS',
    'PostgreSQL',
    'Drizzle ORM',
    'Role-based access',
  ],
  problem:
    'An appointment, a queue position, a clinical note and a payment record describe different parts of the same visit. Keeping them connected requires explicit transitions, role boundaries, persistent records and interfaces that make the next action clear.',
  contributions: [
    {
      title: 'Connected operational workflows',
      body: 'Built patient, appointment, queue, consultation and billing APIs with shared TypeScript contracts and role-aware workspaces. The interface reads real persisted state instead of decorative dashboard metrics.',
    },
    {
      title: 'Protected state changes',
      body: 'Added transactional queue coordination, server-side role and session checks, mutation audit records, and explicit restrictions around completed visits and paid charges.',
    },
    {
      title: 'Reproducible delivery',
      body: 'Organized the pnpm/Turbo application, Docker packages and PostgreSQL migrations. Prepared a separate EC2/Compose path with a nonpublishing image workflow and backup/restore safeguards; historical Kubernetes and monitoring configurations remain source evidence.',
    },
  ],
  architecture: [
    {
      title: 'A session boundary at the API',
      body: 'Login establishes an HttpOnly cookie. Cookie-authenticated mutations validate the browser origin, while backend role guards enforce access beyond the frontend navigation.',
      path: 'apps/backend/src/auth/session.ts',
    },
    {
      title: 'Queue transitions inside transactions',
      body: 'Adding a patient uses an advisory transaction lock to allocate the next queue number and reject a duplicate active visit. Calling next locks the selected waiting row and skips rows already claimed by another transaction.',
      path: 'apps/backend/src/queue/queue.service.ts',
    },
    {
      title: 'Persisted changes with an audit trail',
      body: 'The Drizzle database service commits each audited mutation and its audit event together. Audit details record changed field names while filtering password/token names rather than copying clinical contents or credentials.',
      path: 'apps/backend/src/database/database.service.ts',
    },
    {
      title: 'Delivery and recovery boundaries',
      body: 'The new Compose path isolates database access, loads file secrets, bounds services and makes migration/backup/restore steps explicit. Local amd64 preparation does not verify the intended cloud account, ARM64 runtime or full instance recovery.',
      path: 'deploy/aws-demo/README.md',
    },
  ],
  steps: [
    {
      title: 'Coordinate the visit',
      image: {
        src: '/evidence/phase5d/hospital/overview-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'abox administration overview with three fictional appointments, two waiting patients, one in care and four registered records.',
        caption:
          'Administration overview · counts come from the isolated demo database.',
        status: 'Functional local app · fictional patient records',
      },
      description:
        "The administration dashboard combines today's schedule and queue state with links to patient registration and billing. The visible counts reflect actual records created through the local API.",
      annotation:
        'Three demo appointments coexist with two waiting visits and one in care. These are different measures, not interchangeable counts or real clinical activity.',
    },
    {
      title: 'Find the patient record',
      image: {
        src: '/evidence/phase5d/hospital/patients-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Patient directory showing Alex Demo, John Doe, Riley Example and Sam Synthetic, with search, queue and consultation actions.',
        caption:
          'Patient directory · synthetic identities and role-aware actions.',
        status: 'Functional local app · fictional patient records',
      },
      focus: {
        x: 0.79,
        y: 0.35,
        width: 0.18,
        height: 0.06,
      },
      description:
        'The patient directory provides search and explicit links into queue and consultation workflows. Contact and demographic details remain collapsed until requested.',
      annotation:
        'Add to Queue and Consult target the selected patient. This is a fresh capture of the current abox application, not the earlier Pulse Medical interface.',
    },
    {
      title: 'Schedule the next visit',
      description:
        'Appointments keep the patient, clinician, time, reason and explicit visit state together. These three confirmed visits were created through the real API and loaded from PostgreSQL.',
      annotation:
        'Scheduling and queue status are separate workflows. Confirmation does not mean the patient is already in care; polling refreshes the mounted schedule every five seconds.',
      focus: {
        x: 0.21,
        y: 0.4,
        width: 0.52,
        height: 0.22,
      },
      image: {
        src: '/evidence/phase5d/hospital/appointments-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Actual abox scheduling screen with three confirmed appointments for fictional patients and the appointment form.',
        caption:
          'Current abox application; fictional PostgreSQL-backed appointments.',
        status: 'Functional local app; fictional records',
      },
    },
    {
      title: 'Move from waiting to care',
      image: {
        src: '/evidence/phase5d/hospital/queue-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Patient queue with Alex Demo in progress, Sam Synthetic and Riley Example waiting, and controls to call next or complete a visit.',
        caption:
          'Queue coordination · one real call-next transition in the synthetic dataset.',
        status: 'Functional local app · fictional patient records',
      },
      focus: {
        x: 0.69,
        y: 0.58,
        width: 0.28,
        height: 0.07,
      },
      description:
        'The fresh queue separates waiting visits, care in progress and completed visits. Two fictional visits are waiting in this capture. Foreground polling refreshes the mounted view every five seconds.',
      annotation:
        'Call Next and per-patient actions belong to the actual queue. This capture shows the waiting state; the separate earlier transition evidence and transaction design remain inspectable.',
    },
    {
      title: 'Inspect the consultation',
      image: {
        src: '/evidence/hospital/consultation.png',
        width: 1440,
        height: 1000,
        alt: 'Read-only consultation view for Alex Demo with a persisted SOAP note containing explicitly synthetic text.',
        caption:
          'Earlier Phase 5 capture · persisted fictional SOAP sections read through an admin session.',
        status: 'Functional local app · fictional patient records',
      },
      focus: {
        x: 0.21,
        y: 0.49,
        width: 0.38,
        height: 0.14,
      },
      description:
        'A doctor-session API request created this SOAP note. The administration session can inspect its subjective, objective, assessment and plan sections; the captured view correctly shows read-only access.',
      annotation:
        'Every section contains fictional verification text. The screenshot demonstrates persisted structure and the admin reading state, not a real clinical assessment or doctor-form submission.',
    },
    {
      title: 'Record a payment received',
      image: {
        src: '/evidence/phase5d/hospital/billing-paid-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Billing screen showing a synthetic PHP 1250 charge paid and PHP 750 overdue, with one outstanding bill and one paid bill.',
        caption:
          'Billing · real Mark paid confirmation, verified again after reload.',
        status: 'Functional local app · fictional patient records',
      },
      focus: {
        x: 0.21,
        y: 0.74,
        width: 0.5,
        height: 0.15,
      },
      description:
        'The browser confirmed Mark paid on the synthetic consultation charge. The record changed to PAID, the outstanding amount became PHP 750, and the paid state survived a page reload.',
      annotation:
        'This records a payment received by staff. It does not charge a card or connect to a payment processor. The remaining overdue charge stays outstanding.',
    },
  ],
  verification: [
    {
      label: 'Fresh database-backed capture',
      body: 'Seven abox screens/states were captured from the real local application. The synthetic PHP 1,250 charge changed to PAID and stayed paid after reload. The isolated PostgreSQL fixture contained four patients, three appointments, one note and 17 audit events. These are test records, not adoption metrics.',
    },
    {
      label: 'Recorded workflow and branding checks',
      body: 'The Phase 1A report records 32 backend unit tests, 42 PostgreSQL end-to-end tests and eight browser cases including all six roles. The later branding report records 19 rendering states using synthetic API stubs; those establish branding only. Frontend lint/format wrapper failures and the successful direct Biome fallback remain documented.',
    },
    {
      label: 'Prepared infrastructure, no deployment',
      body: 'The current preparation report records offline safety tests, Compose checks, amd64 image builds and a disposable local runtime/restore rehearsal. The intended account eligibility gate is unresolved; native ARM64, remote bootstrap, live HTTPS and full instance recovery are not established.',
    },
  ],
  limitations: [
    'Fictional records and a disposable local database establish selected application paths, not clinical use, regulatory compliance or production readiness.',
    'The frontend build contains a loopback API origin. During capture, browser requests were forwarded to the isolated real API on an unused port; no API responses, sessions or database writes were mocked. Capture details are recorded in the Phase 5 report.',
    'The current app uses supplied abox assets. Earlier Pulse screenshots are retained in the before evidence; branding-only upstream captures used API stubs and are not presented as product workflow verification.',
    'Application suites were not rerun for this portfolio task. Prior checks have their own scope: frontend wrapper lint/format startup failures, an existing sidebar warning, and Chromium/physical-device gaps remain documented.',
    'AWS deployment remains blocked by its intended-environment prerequisites. Historical Kubernetes/Terraform and monitoring files, local amd64 builds and a limited restore rehearsal do not establish a running cluster, ARM64 behavior or disaster-recovery objectives.',
    'The captured queue/scheduling views use five-second polling. Billing records money received by staff and does not charge a payment processor; legacy amount review needs its separate explicit workflow.',
  ],
  repository: 'https://github.com/EdTosoy/hospitalProject',
  revision: '21d9b79c85f5aa52d0d8cd696a670edc5faf37dc',
  references: [
    {
      label: 'Workflow and database verification',
      path: 'docs/verification-gates.md',
    },
    {
      label: 'abox brand provenance and rendering-only checks',
      path: 'docs/brand-integration.md',
    },
    {
      label: 'Latest deployment preparation and unresolved gates',
      path: 'docs/aws-demo-preparation.md',
    },
    {
      label: 'Production Compose and recovery runbook',
      path: 'deploy/aws-demo/README.md',
    },
    {
      label: 'Backend ownership and role boundaries',
      path: 'apps/backend/src/auth/roles/roles.guard.ts',
    },
    {
      label: 'Existing real multi-session browser tests',
      path: 'apps/frontend/test/workflows.spec.ts',
    },
  ],
  sourceNote:
    'Source links use inspected revision 21d9b79. The workflow screenshots were recaptured for this portfolio change with genuine sessions and a disposable database. Branding-only stub captures and historical infrastructure reports are identified separately.',
};

export const pixshareStudy: CaseStudy = {
  slug: 'pixshare',
  name: 'PixShare',
  category: 'Image sharing',
  audience:
    'People browsing public photographs and signed-in owners managing their own images and captions.',
  decisions: [
    {
      title: 'Database commit versus object cleanup',
      body: 'PostgreSQL and media storage cannot commit atomically. New media is cleaned on commit failure, old media after success, and explicit reconciliation handles possible orphans.',
    },
    {
      title: 'Bounded image work',
      body: 'Decode limits protect the API, while WebP variants reduce selected payload size. Fixture-scoped byte savings support an engineering decision without claiming production latency or scale.',
    },
  ],
  headline: 'Keeping photographs and their data together.',
  overview:
    'A simple online photo album with a Next.js interface, FastAPI backend, PostgreSQL persistence and genuine Clerk authentication.',
  contributionSummary:
    'Built and verified the album interface, media validation and variants, authenticated ownership boundaries, and safe local/S3-compatible storage lifecycle.',
  scope:
    'Fresh current standalone frontend captures with bundled demo photographs, a cached release API and isolated PostgreSQL. The retained authenticated upload screenshot comes from the earlier real Clerk release suite and masks the avatar. The public frontend returned HTTP 200 on 27 October 2026, but its gallery could not reach the API.',
  stack: [
    'Next.js',
    'FastAPI',
    'PostgreSQL',
    'Clerk',
    'Pillow',
    'S3-compatible storage',
  ],
  problem:
    'An image upload needs more than a filename: the application must verify content, enforce ownership, select appropriate image sizes and keep storage references safe during replacement or failure.',
  contributions: [
    {
      title: 'A focused photo album',
      body: 'Applied Hallmark Atelier with Sentient, Hanken Grotesk, warm paper and muted slate. Photograph composition, responsive rows, caption limits, visible focus and real recovery states lead the interface.',
    },
    {
      title: 'Authenticated media changes',
      body: 'Used genuine Clerk sessions and API owner checks. PostgreSQL row locks serialize replacement/deletion; old media is removed after commit, while a refresh failure cannot delete an already committed replacement.',
    },
    {
      title: 'Responsive and replaceable storage',
      body: 'Generated bounded WebP variants with original fallback. Local development needs no cloud account; an S3-compatible adapter uses immutable namespaces, private manifests and bounded SDK calls, verified against local MinIO.',
    },
  ],
  architecture: [
    {
      title: 'Validate bytes before storage',
      body: 'The API verifies MIME/format agreement and bounded Pillow decoding, with independent 10 MiB, 16-megapixel, side-length and request-envelope limits.',
      path: 'app/core/upload.py',
    },
    {
      title: 'Keep the commit boundary explicit',
      body: 'Owner-only mutations lock the row. Failed commits clean new uploads; successful commits precede old-media cleanup. Database and storage cannot share an atomic transaction, so orphan limitations remain documented.',
      path: 'app/api/routes/posts.py',
    },
    {
      title: 'Preserve originals and select variants',
      body: 'The browser chooses actual-width WebP sources through the existing picture component, while originals remain available. Storage routing preserves old local references when new writes use object storage.',
      path: 'web/components/posts/PostImage.tsx',
    },
  ],
  steps: [
    {
      title: 'Open the photo album',
      image: {
        src: '/evidence/phase5d/pixshare/home-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'PixShare Atelier homepage showing real demo photos and the upload action.',
        caption: 'Actual local production build; bundled demonstration photos.',
        status: 'Verified local app; demo photographs',
      },
      description:
        'The landing screen opens directly onto the working album, using the selected Atelier typography and restrained surfaces.',
      annotation:
        'The photographs come from repository demo assets. Counts and photos are real backend data; no user-growth or production claims are implied.',
    },
    {
      title: 'Browse full compositions',
      focus: { x: 0.06, y: 0.34, width: 0.86, height: 0.46 },
      image: {
        src: '/evidence/phase5d/pixshare/gallery-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Current light Explore gallery displaying original bundled photographs.',
        caption:
          'Fresh light-mode capture; real isolated PostgreSQL-backed album.',
        status: 'Verified local app; demo photographs',
      },
      description:
        'Dimension-aware rows preserve the source order and whole photograph. Filtering, sorting and pagination keep their existing API behavior.',
      annotation:
        'Images are public. Mutation ownership is a backend authorization boundary, separate from public image URLs.',
    },
    {
      title: 'Inspect an image and its metadata',
      description:
        'Open a real image from the local gallery and inspect its caption, format and original file metadata.',
      annotation:
        'The photograph comes from the repository demo fixtures and is served by the real isolated backend.',
      image: {
        src: '/evidence/phase5d/pixshare/details-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'PixShare photograph detail view with real demo-image metadata.',
        caption: 'Fresh local frontend interaction; bundled demo photograph.',
        status: 'Local real API and PostgreSQL',
      },
      focus: { x: 0.16, y: 0.15, width: 0.68, height: 0.64 },
    },
    {
      title: 'Add a photograph and caption',
      focus: {
        x: 0.24,
        y: 0.25,
        width: 0.52,
        height: 0.36,
      },
      image: {
        src: '/evidence/pixshare/album-upload.jpg',
        width: 1440,
        height: 1000,
        alt: 'Historical authenticated PixShare upload form with a file picker beside the optional caption.',
        caption:
          'Prior release capture; genuine Clerk session; account avatar masked. Fresh upload capture is blocked.',
        status: 'Historical authenticated release evidence',
      },
      description:
        'The real picker and caption form retain validation, progress, error focus and public-visibility guidance.',
      annotation:
        'The full browser suite separately verifies signup, sign-in, account switching, upload, caption edit, replacement, ownership denial and deletion with real Clerk sessions.',
    },
    {
      title: 'Read the album on a phone',
      focus: {
        x: 0.06,
        y: 0.35,
        width: 0.86,
        height: 0.44,
      },
      image: {
        src: '/evidence/phase5d/pixshare/gallery-mobile.webp',
        width: 390,
        height: 844,
        alt: 'Mobile PixShare album with readable filters and a full portrait photo.',
        caption: '390px mobile viewport; actual browser capture.',
        status: 'Verified local app; demo photographs',
      },
      description:
        'Mobile uses one source-ordered column, bounded captions, comfortable controls and the same light/dark system.',
      annotation:
        'Captured in Chromium at a mobile viewport. Physical-device and complete assistive-technology verification are not claimed.',
    },
  ],
  verification: [
    {
      label: 'Backend regression',
      body: '141 tests passed with a separate disposable PostgreSQL database, including 14 real local MinIO integration cases and demo-seed preservation/idempotence. Ruff and basedpyright passed.',
    },
    {
      label: 'Full browser regression',
      body: '30 cases passed on the final Atelier production build, including setup, 24 public/device checks and five genuine Clerk journeys. Frontend lint, TypeScript and production build passed.',
    },
    {
      label: 'Accessibility and payload evidence',
      body: '53 final workflow/state captures reported no axe violations or horizontal overflow. For three normalized demo photos at DPR 1, selected bodies totaled 91,058 bytes versus 3,333,388 original bytes, a 97.27% reduction. This is fixture-scoped payload evidence, not a latency or capacity benchmark.',
    },
  ],
  limitations: [
    'This task made no deployment. The public frontend URL responds, but its gallery was unavailable during browser verification even when API health returned 200. Local MinIO compatibility does not establish AWS IAM, CDN or recovery behavior.',
    'Media is public and originals retain metadata. Private albums, moderation and account-deletion workflows are outside scope.',
    'PostgreSQL and storage are not one atomic transaction. Crashes or failed cleanup can leave orphans; reconciliation is operator-invoked.',
    'Axe and keyboard checks do not establish complete WCAG/screen-reader conformance. Chromium viewport captures are not physical-device certification.',
    'Sentient loads through the official Fontshare service with a fallback. Authenticated local verification is distinct from the keyless public CI job.',
  ],
  repository: 'https://github.com/EdTosoy/PixShare',
  revision: '0ade8101236286c251f10fb8cfce35d4628978b3',
  references: [
    {
      label: 'Final release and executed checks',
      path: 'docs/FINAL_RELEASE.md',
    },
    {
      label: 'Architecture and lifecycle',
      path: 'docs/ARCHITECTURE.md',
    },
    {
      label: 'Image delivery and measurements',
      path: 'docs/IMAGE_DELIVERY.md',
    },
    {
      label: 'Ownership and concurrency',
      path: 'app/api/routes/posts.py',
    },
    {
      label: 'Actual responsive image component',
      path: 'web/components/posts/PostImage.tsx',
    },
  ],
};

export const marcusStudy: CaseStudy = {
  slug: 'marcus-chess',
  name: 'Marcus Chess',
  category: 'Chess education',
  headline: 'Learn to see the next decision.',
  overview:
    'An interactive chess education platform connecting guided lessons, adaptive practice, playable Stockfish games and reflective game review.',
  audience:
    'Beginning chess players learning to recognize threats and make considered decisions. The pedagogy is a design hypothesis awaiting educator and learner review.',
  problem:
    'A correct move alone cannot show whether a learner understood the threat or memorized a board. Practice, feedback and assessment need distinct roles, with a path back from a real game to a focused exercise.',
  contributionSummary:
    'Built the lesson and adaptive-practice experience, browser-local progress, Stockfish worker integration, playable games, coached review and source-separated evaluation exports.',
  scope:
    'Fresh screenshots and recording from the public Marcus deployment verified on 27 October 2026. Lesson and real Stockfish play use a new browser-local session. Technical references and earlier suite results remain pinned to Phase 2C; no learner outcomes are claimed.',
  stack: [
    'Next.js',
    'TypeScript',
    'chess.js',
    'Stockfish 19',
    'Web Workers',
    'Vitest',
    'Playwright',
  ],
  contributions: [
    {
      title: 'Guide, practise, transfer',
      body: 'Connected guided explanations to adaptive skill practice and separately recorded baseline, transfer and delayed checks, with validated versioned browser-local progress.',
    },
    {
      title: 'Play and review locally',
      body: 'Integrated the pinned Stockfish WASM worker for games, cancellation/restart and bounded analysis. Game reconstruction and selected-decision review lead into reflective retries.',
    },
    {
      title: 'Qualify coaching evidence',
      body: 'Added bounded tactical proofs and explicit uncertainty for alternatives, sacrifices and special moves. Opt-in timing and exports preserve the source of each observation.',
    },
  ],
  decisions: [
    {
      title: 'Practice success is not assessment mastery',
      body: 'Hints, familiar positions and gameplay review stay separate from unfamiliar checks. Earlier exposure is excluded conservatively; a simulated delayed test is not a retention study.',
    },
    {
      title: 'A worker result needs a lifecycle',
      body: 'UCI lacks request IDs. Cancellation destroys the worker; generation checks reject late results. Bounded searches and explicit restart trade resources and speed against analysis depth.',
    },
    {
      title: 'Coaching must admit uncertainty',
      body: 'Mechanical attack facts cannot evaluate every sacrifice. Bounded mate proofs support qualified feedback; deeper tactical and strategic value remains unassessed. Descriptive difficulty needs actual beginner calibration.',
    },
  ],
  architecture: [
    {
      title: 'Deterministic learning domain',
      body: 'Exercise selection and evidence rules live outside React. Versioned progress validation prevents malformed data or repeat attempts from becoming unsupported mastery.',
      path: 'src/domain/adaptive/session.ts',
    },
    {
      title: 'Typed UCI worker adapter',
      body: 'A replaceable worker port bounds resources, validates legal principal variations and handles timeout, cancellation, disposal and restart.',
      path: 'src/engine/uci-engine.ts',
    },
    {
      title: 'Selected-decision review',
      body: 'Full-game replay and review decisions remain distinct from assessment. Familiar-position observations do not enter unfamiliar evaluation denominators.',
      path: 'src/domain/review/decisions.ts',
    },
  ],
  steps: [
    {
      title: 'Notice a threat before moving',
      description:
        'The guided lesson explains a rook threat visually, then asks the learner to practise and check a new position.',
      annotation:
        'The public deployment now uses Marcus branding. This fresh capture shows its actual lesson; progress is confined to a new browser context.',
      image: {
        src: '/evidence/phase5d/marcus/lesson-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Notice a threat before moving in the public Marcus application; fresh browser-local session.',
        caption:
          'Fresh public deployment capture; isolated browser-local session.',
        status: 'Technical demonstration; efficacy unvalidated',
      },
    },
    {
      title: 'Practise a decision, not a click sequence',
      description:
        'Adaptive practice separates baseline, guided exercises, unfamiliar transfer checks and delayed review.',
      annotation:
        'Hint-assisted retries and familiar boards are not treated as independent evidence of mastery.',
      image: {
        src: '/evidence/phase5d/marcus/practice-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Current Marcus learning-practice entry with its baseline check and independent-evidence guidance.',
        caption:
          'Fresh public deployment capture; isolated browser-local session.',
        status: 'Technical demonstration; efficacy unvalidated',
      },
      focus: { x: 0.12, y: 0.27, width: 0.7, height: 0.36 },
    },
    {
      title: 'Play an actual Stockfish game',
      description:
        'A local WASM worker provides legal engine responses through the UCI adapter. Players can choose a side and a descriptive difficulty preset.',
      annotation:
        'Presets bound engine resources and native skill. They are not calibrated human Elo levels.',
      image: {
        src: '/evidence/phase5d/marcus/play-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Play an actual Stockfish game in the public Marcus application; fresh browser-local session.',
        caption:
          'Fresh public deployment capture; isolated browser-local session.',
        status: 'Technical demonstration; efficacy unvalidated',
      },
      focus: {
        x: 0.1,
        y: 0.25,
        width: 0.5,
        height: 0.42,
      },
    },
    {
      title: 'Reflect on a game decision',
      description:
        'Coached review reconstructs a game, selects decisions and offers reflection, candidate moves and qualified tactical feedback.',
      annotation:
        'This fresh capture reviews the actual browser-local demonstration game after a real Stockfish reply and resignation. Bounded proof does not establish strategic understanding or human coaching quality.',
      image: {
        src: '/evidence/phase5d/marcus/review-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Reflect on a game decision in the public Marcus application; fresh browser-local session.',
        caption:
          'Fresh public deployment capture; isolated browser-local session.',
        status: 'Technical demonstration; efficacy unvalidated',
      },
      focus: {
        x: 0.53,
        y: 0.2,
        width: 0.36,
        height: 0.35,
      },
    },
    {
      title: 'Keep learning evidence interpretable',
      description:
        'The fresh Local results screen requires a completed baseline before showing results. Source-separated assessment export is supported by the earlier attributed verification.',
      annotation:
        'This fresh session has no completed assessment; the screen truthfully asks the learner to finish the check. No evaluation totals, real pilot or learning-effectiveness result is invented.',
      image: {
        src: '/evidence/phase5d/marcus/evaluation-desktop.webp',
        width: 1440,
        height: 1000,
        alt: 'Keep learning evidence interpretable in the public Marcus application; fresh browser-local session.',
        caption:
          'Fresh public deployment capture; isolated browser-local session.',
        status: 'Technical demonstration; efficacy unvalidated',
      },
      focus: {
        x: 0.1,
        y: 0.25,
        width: 0.7,
        height: 0.3,
      },
    },
  ],
  verification: [
    {
      label: 'Phase 2B unit and real-engine checks',
      body: 'The upstream Phase 2B report records 177 passing unit tests across 13 files and one default engine skip. A separate actual pinned-engine integration passed four presets and three benchmark searches. These are prior upstream checks, not rerun by this portfolio change.',
    },
    {
      label: 'Production browser checks',
      body: 'Phase 2B records 34 Chromium scenarios; the later Phase 2C report records 46 while preserving learning/engine logic. Lint, strict TypeScript and the isolated Webpack build passed in those recorded upstream checks. None establishes physical-device readiness or educational effectiveness.',
    },
    {
      label: 'Authentic current experience evidence',
      body: 'The retained Phase 2C captures show the real lesson, learning-practice entry, playable game, reflection review and local evaluation. Synthetic assessment totals and the 14-position benchmark are test material. No real learner pilot, retention improvement or 10× effectiveness has been measured.',
    },
  ],
  limitations: [
    'Educator review and a real learner pilot have not been completed. No measured learning improvement, calibrated Elo or validated 10× effectiveness is claimed.',
    'Physical Android/iPhone, Firefox/WebKit, spoken screen-reader and battery/thermal validation remain pending. Chromium viewport checks do not substitute for those checks.',
    'Bounded tactical proofs cover a constrained set of outcomes. Strategic exchange value, deeper tactics and beginner difficulty calibration need further review.',
    'Earlier release evidence left Stockfish corresponding-source packaging and application licensing review unfinished. Public lesson and Stockfish playback now work at the verified URL; this capture does not establish closure of those release-compliance gaps.',
    'Phase 2C adds a local source/build receipt and release configuration. Complete recipient-accessible Stockfish source/build inputs and an approved application licensing treatment remain unresolved; those preparation artifacts are not a completed public release.',
  ],
  repository: 'https://github.com/EdTosoy/marcus',
  revision: 'e7c678725295b4f2da2d5339d7608400e2eff669',
  sourceNote:
    'Links point to the current committed Marcus source. Phase 2B and 2C reports are historical technical verification, not learner studies. The latest source contains release preparation, while licensing/corresponding-source and educational-validation gates remain open.',
  references: [
    {
      label: 'Phase 2B technical verification',
      path: 'docs/PHASE_2B_VERIFICATION.md',
    },
    {
      label: 'Later experience checks and pending learner/device work',
      path: 'docs/PHASE_2C_VERIFICATION.md',
    },
    {
      label: 'Source-separated learning evidence',
      path: 'docs/LEARNING_SYSTEM.md',
    },
    {
      label: 'Stockfish integration and licensing obligations',
      path: 'docs/ENGINE_INTEGRATION.md',
    },
    {
      label: 'Release blockers and corresponding-source review',
      path: 'docs/DEPLOYMENT_VERIFICATION.md',
    },
  ],
};
