import type {
  EvidenceImage,
  WalkthroughStep,
} from "@/components/evidence/types";

export interface CaseStudy {
  slug: string;
  name: string;
  category: string;
  headline: string;
  overview: string;
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

const flowImage = (
  file: string,
  alt: string,
  caption: string,
): EvidenceImage => ({
  src: `/evidence/flow/${file}.png`,
  width: 1440,
  height: 1000,
  alt,
  caption,
  status: "Functional app · synthetic data",
});
const fatsImage = (
  file: string,
  alt: string,
  caption: string,
  production = false,
): EvidenceImage => ({
  src: `/evidence/fats/${file}.png`,
  width: 1440,
  height: 1000,
  alt,
  caption,
  status: production
    ? "Existing editor · synthetic PDF"
    : "Development candidate · real PDF processing",
});

export const flowStudy: CaseStudy = {
  slug: "flow-financial-reconciliation",
  name: "Flow",
  category: "FINANCIAL SYSTEMS / CASE STUDY 01",
  headline: "Making discrepancies explainable.",
  overview:
    "A financial reconciliation system that traces processor and bank evidence through exact-money accounting, deterministic matching, and operational investigation.",
  contributionSummary:
    "Exact-money accounting, deterministic reconciliation, recoverable workers, and the read-only investigation interface.",
  scope:
    "Captured from the local production build against a disposable PostgreSQL database. All financial records are synthetic. This is an engineering demonstration, with read-only operations screens.",
  stack: [
    "TypeScript",
    "PostgreSQL",
    "Next.js",
    "Exact money",
    "Durable workers",
  ],
  problem:
    "A successful payment job is not proof that the money reconciles. Processor records, settlements and bank observations can disagree, arrive twice, or lack independent completeness evidence. Operators need an explanation that preserves those distinctions.",
  contributions: [
    {
      title: "Financial correctness",
      body: "Implemented exact integer money, an immutable double-entry ledger, and deterministic reconciliation with explicit unmatched and ineligible outcomes.",
    },
    {
      title: "Recoverable processing",
      body: "Built ingestion and durable worker paths around stable identities, transactional intent, retries and retained failures so processing history remains inspectable.",
    },
    {
      title: "Operational evidence",
      body: "Built a read-only Next.js investigation surface over approved PostgreSQL reads, separating financial state, operational case status and current allocation proof.",
    },
  ],
  architecture: [
    {
      title: "Exact amounts across boundaries",
      body: "Money uses bigint internally and integer strings at serialization boundaries. Currency stays explicit; the browser does not calculate authoritative financial truth.",
      path: "libs/money/src/index.ts",
    },
    {
      title: "Domain rules, PostgreSQL enforcement",
      body: "The modular monolith separates financial domains from database adapters. Frozen reconciliation populations preserve historical outcomes while current proof is evaluated separately.",
      path: "libs/reconciliation-domain/src/index.ts",
    },
    {
      title: "Server-side operations reads",
      body: "The operations app consumes a server-only read layer. Bounded, parameterized queries and explicit unavailable states avoid turning failed queries into healthy empty dashboards.",
      path: "apps/ops/server/read.ts",
    },
  ],
  steps: [
    {
      title: "Read financial assurance",
      image: flowImage(
        "overview",
        "Flow dashboard with FAIL financial assurance, PASS structural integrity and UNKNOWN completeness checks.",
        "Operations overview · real database-backed assurance states.",
      ),
      description:
        "The dashboard separates financial assurance, structural integrity, operational cases and terminal work. The intentionally imperfect dataset keeps failed and unknown checks visible.",
      annotation:
        "Source Completeness is UNKNOWN. Successful ingestion alone does not establish independent account-period closure.",
    },
    {
      title: "Inspect reconciliation results",
      image: flowImage(
        "reconciliation",
        "Two completed reconciliation runs with matched, unmatched and ineligible outcomes and active current proof.",
        "Reconciliation runs · frozen outcomes alongside current allocation proof.",
      ),
      focus: { x: 0.5, y: 0.41, width: 0.34, height: 0.3 },
      description:
        "Run summaries preserve processor and bank populations separately. The anomalous run contains matched, unmatched and ineligible items instead of presenting a misleading all-green summary.",
      annotation:
        "Frozen outcomes are historical; the CURRENT PROOF column is a separate statement about present allocations.",
    },
    {
      title: "Trace settlement evidence",
      image: flowImage(
        "settlement-inspection",
        "Reconciliation detail showing rule version, PHP currency, window, processor and bank populations and population hash.",
        "Run detail · frozen population, rule version and source provenance.",
      ),
      focus: { x: 0.58, y: 0.39, width: 0.25, height: 0.2 },
      description:
        "A completed run retains its rule version, time window, currency, member counts and population hash. The next section links the decision to processor provenance.",
      annotation:
        "RULE VERSION and CURRENCY make the matching context explicit. The full population contains 12 processor items and 10 bank items; COMPLETED does not mean every item matched.",
    },
    {
      title: "Investigate exceptions",
      image: flowImage(
        "exceptions",
        "Exception queue with open unreconciled cases and a resolved accepted-risk case that is still unreconciled.",
        "Exception queue · operational closure remains separate from financial state.",
      ),
      focus: { x: 0.18, y: 0.725, width: 0.265, height: 0.08 },
      description:
        "The exception queue exposes classification, assignment and linked runs. Accepting a risk can close the operational case while the missing bank movement remains financially unreconciled.",
      annotation:
        "The final row is RESOLVED / ACCEPTED RISK and still UNRECONCILED. Its PHP amount is a case value, not an extra amount to add to total exposure.",
    },
    {
      title: "Inspect retained failures",
      image: flowImage(
        "workers",
        "Worker operations showing durable processing states and retained retryable and terminal failures.",
        "Worker operations · explicit synthetic failure injection.",
      ),
      focus: { x: 0.58, y: 0.35, width: 0.4, height: 0.1 },
      description:
        "The demo provisioner deliberately introduces transient and poison work. Retaining these states makes recovery needs visible without treating worker success as financial reconciliation.",
      annotation:
        "Failures here are deliberately injected demo scenarios. The screenshot does not establish production resilience or an uptime guarantee.",
    },
  ],
  verification: [
    {
      label: "Executed browser capture",
      body: "Playwright loaded six real database-backed screens: overview, reconciliation, run detail, exceptions, controls and workers. No unhandled page errors were observed.",
    },
    {
      label: "Executed correctness tests",
      body: "All 15 unit-test targets, 5 boundary checks, 4 Stripe HTTP contract tests and 9 deployment/access tests passed. A further 87 PostgreSQL integration, browser and resilience tests passed locally. See the report for exact scope and commands.",
    },
    {
      label: "Source-backed architecture",
      body: "Pinned source links connect the money model, reconciliation domain and server-side operations reads to this capture revision. Local regression evidence covers the selected suites; it does not establish a live deployment or all repository gates.",
    },
  ],
  limitations: [
    "The operations interface is investigation-first and read-only. Ingestion and reconciliation were performed through the existing local pipeline; the walkthrough does not simulate UI commands to run them.",
    "No standalone transaction inspection screen was found. The captured run detail provides settlement population and provenance evidence, rather than a fabricated transaction browser.",
    "No AWS or Stripe calls were made for this task. These local captures do not establish production readiness, authentication, compliance, scale or real-bank completeness.",
    "The operations, operations-browser, reconciliation, exceptions and resilience integration suites passed against disposable PostgreSQL. Other integration files and live deployment checks were not run; this is not the full repository release gate.",
  ],
  repository: "https://github.com/EdTosoy/flow",
  revision: "d18efb3d65c7b164c45ca3f4571150cb8ce15a25",
  references: [
    {
      label: "Operations architecture and local reproduction",
      path: "docs/phase12/README.md",
    },
    { label: "Financial invariants", path: "docs/architecture/invariants.md" },
    {
      label: "Reconciliation integration tests",
      path: "tests/reconciliation.integration.test.ts",
    },
    {
      label: "Resilience integration tests",
      path: "tests/resilience.integration.test.ts",
    },
  ],
};

export const fatsStudy: CaseStudy = {
  slug: "fats-pdf-tools",
  name: "FATS PDF Tools",
  category: "DOCUMENT ENGINEERING / CASE STUDY 02",
  headline: "From local document to verified copy.",
  overview:
    "A browser-based PDF workspace for signing, arranging pages and preparing separate copies, built within FATS, a job-search companion.",
  contributionSummary:
    "Local PDF processing, signature and page-edit history, and verified export, extraction, and split workflows in the development-only v2 candidate.",
  scope:
    "The existing editor is separate from the development-only v2 candidate shown here. V2 processes real local PDFs; the separate design prototype is simulated and is not used in this walkthrough. Nothing shown establishes release readiness.",
  stack: ["Next.js", "React", "PDF.js", "pdf-lib", "Web Workers"],
  problem:
    "Completing a document is more than moving marks on a canvas. Page coordinates, rotations, edit history and the bytes actually downloaded must agree, while the original file and current session remain intact.",
  contributions: [
    {
      title: "A local processing boundary",
      body: "Implemented browser-worker PDF inspection and writing, bounded operations and in-memory editing. Selected PDF bytes do not need an upload or an external PDF service.",
    },
    {
      title: "One document, one history",
      body: "Connected signature placement and page organization to stable original page identities and shared Undo/Redo, with explicit compatibility checks for unsupported structures.",
    },
    {
      title: "Verify before handoff",
      body: "Built output reopening, geometry checks and page rendering before download, with separate preparation and explicit browser handoff for extracted and split copies.",
    },
  ],
  architecture: [
    {
      title: "Render and write with distinct libraries",
      body: "PDF.js renders pages; pdf-lib writes PDF bytes in a dedicated worker. View coordinates map back into PDF space so responsive zoom is a display concern.",
      path: "apps/web/src/lib/pdf-tools-engine.ts",
    },
    {
      title: "Preserve original page identity",
      body: "An ordered page plan references immutable source-page indices. Reordering changes the plan; it does not retarget existing marks to a different source page.",
      path: "apps/web/src/lib/pdf-tools-organization.ts",
    },
    {
      title: "Check the generated output",
      body: "Export reopens completed bytes and verifies output pages before browser handoff. Extract/split planning stays separate from the current editing snapshot.",
      path: "apps/web/src/lib/pdf-tools-quick-export.ts",
    },
  ],
  steps: [
    {
      title: "Open a local PDF",
      image: fatsImage(
        "workspace",
        "FATS v2 Quick Sign workspace showing the synthetic three-page offer PDF, local-only status and page thumbnails.",
        "V2 candidate · a real synthetic PDF opened locally.",
      ),
      description:
        "The local file picker opens a three-page synthetic offer. The document, thumbnail rail and page controls are rendered by the running application, using actual PDF bytes.",
      annotation:
        "The header says In this tab only. This is session-local editing, not a saved document or a Career Vault upload.",
    },
    {
      title: "Place a signature",
      image: fatsImage(
        "signature",
        "A typed Demo Reviewer signature selected on the synthetic offer, with size and movement controls.",
        "V2 candidate · typed signature placement and adjustment.",
      ),
      focus: { x: 0.3, y: 0.58, width: 0.31, height: 0.16 },
      description:
        "A typed signature becomes a placed mark with movement and proportional size controls. The same artwork is embedded in the completed PDF.",
      annotation:
        "This is a visual personal mark. It is not a cryptographic signature, identity verification or certification.",
    },
    {
      title: "Organize the pages",
      image: fatsImage(
        "organization",
        "Organize pages dialog with original page 2 first and original page 1 selected in position 2, plus move, rotate and remove controls.",
        "V2 candidate · actual page reordering with original identity visible.",
      ),
      focus: { x: 0.315, y: 0.455, width: 0.12, height: 0.275 },
      description:
        "Moving the first page later changes the order to original pages 2, 1, 3. The selected thumbnail retains its original-page label, and the operation can be undone.",
      annotation:
        "The second thumbnail is current page 2 / original page 1. Stable source identity keeps its signature attached to the correct page.",
    },
    {
      title: "Extract or split copies",
      image: fatsImage(
        "extraction",
        "Extract pages dialog selecting current pages 1 and 3 and preparing a separate two-page PDF.",
        "V2 candidate · noncontiguous selection, prepared as a separate PDF.",
      ),
      focus: { x: 0.185, y: 0.285, width: 0.14, height: 0.145 },
      description:
        "Extraction selects current pages 1 and 3 without replacing the editing session. A separate split workflow divides the three-page document after page 1 into one-page and two-page outputs.",
      annotation:
        "The capture selected 2 pages. The downloaded extraction reopened with 2 pages; the two downloaded split files reopened with 1 and 2 pages.",
    },
    {
      title: "Reopen the real output",
      image: fatsImage(
        "reopened-output",
        "The completed PDF reopened in the FATS renderer with the Demo Reviewer signature embedded in its page content.",
        "V2 candidate · downloaded completed bytes reopened in a fresh page.",
      ),
      focus: { x: 0.3, y: 0.58, width: 0.31, height: 0.16 },
      description:
        "The completed file was downloaded through the browser, parsed with pdf-lib to check its three pages, then reopened through the actual PDF.js workspace in a fresh browser page.",
      annotation:
        "The signature is now part of the reopened document. This verifies this synthetic export, not all PDF structures or other viewers.",
    },
  ],
  verification: [
    {
      label: "Executed output checks",
      body: "Playwright downloaded the completed PDF (3 pages), extraction (2 pages), and two split outputs (1 and 2 pages). Each file was reopened with pdf-lib; the completed copy also rendered in a fresh FATS page.",
    },
    {
      label: "Existing editor captured",
      body: "The existing /resumes/pdf-tools editor opened the same synthetic PDF. V2 captures come from /dev/pdf-tools-v2 under next dev, where that candidate is explicitly available.",
    },
    {
      label: "Evidence boundaries",
      body: "All five synthetic assets independently reopened in Poppler with page counts 3 / 3 / 2 / 1 / 2. The broader FATS unit run has one failing hash assertion; the selected browser run has five developer-overlay click failures. See the report for exact results and scope.",
    },
  ],
  limitations: [
    "V2 remains development-only. The separate interactive design prototype has simulated actions; no prototype captures or prototype export claims are used here.",
    "Signatures are raster artwork. Added text/marks do not establish searchable, tagged or accessible PDF output. OCR and arbitrary original-paragraph editing are outside this workflow.",
    "Encrypted files, existing digital signatures and some page-dependent structures are rejected. Split/extract support a constrained subset, not every PDF.",
    "Edits live in memory and are not persistent backups. A browser download event does not prove that the user saved the file on a physical device.",
    "Physical-device, spoken screen-reader and non-Chromium viewer checks remain unverified here. This sample is not a universal compatibility claim.",
  ],
  repository: "https://github.com/EdTosoy/FATS",
  revision: "8afbf3da66baa06a7ea03c93af46fbbc46d34eb1",
  references: [
    { label: "Existing PDF Tools architecture", path: "docs/PDF_TOOLS.md" },
    {
      label: "Page organization verification",
      path: "docs/PDF_TOOLS_2_PHASE_4A_VERIFICATION.md",
    },
    {
      label: "Split and extract verification",
      path: "docs/PDF_TOOLS_2_PHASE_4B_VERIFICATION.md",
    },
    {
      label: "Output browser tests",
      path: "tests/pdf-v2-e2e/page-outputs.spec.ts",
    },
  ],
};

const hospitalImage = (
  file: string,
  alt: string,
  caption: string,
): EvidenceImage => ({
  src: `/evidence/hospital/${file}.png`,
  width: 1440,
  height: 1000,
  alt,
  caption,
  status: "Functional local app · fictional patient records",
});
const pixshareImage = (
  file: string,
  alt: string,
  caption: string,
): EvidenceImage => ({
  src: `/evidence/pixshare/${file}.png`,
  width: 1440,
  height: 1000,
  alt,
  caption,
  status: "Functional API · repository demo fixtures",
});

export const hospitalStudy: CaseStudy = {
  slug: "pulse-hospital-devops-platform",
  name: "Hospital Management Platform",
  category: "WORKFLOW SYSTEMS / CASE STUDY 03",
  headline: "Connecting each step of a patient visit.",
  overview:
    "Pulse Medical connects patient registration, scheduling, queue coordination, consultation notes and billing through a Next.js workspace and a NestJS API.",
  scope:
    "Captured from the actual local frontend and a freshly built API against a new, migrated PostgreSQL database. Names, appointments and notes are fictional demonstration records. Existing uncommitted Hospital work was preserved; these captures reflect that local working tree.",
  stack: [
    "Next.js",
    "NestJS",
    "PostgreSQL",
    "Drizzle ORM",
    "Role-based access",
  ],
  problem:
    "An appointment, a queue position, a clinical note and a payment record describe different parts of the same visit. Keeping them connected requires explicit transitions, role boundaries, persistent records and interfaces that make the next action clear.",
  contributions: [
    {
      title: "Connected operational workflows",
      body: "Built patient, appointment, queue, consultation and billing APIs with shared TypeScript contracts and role-aware workspaces. The interface reads real persisted state instead of decorative dashboard metrics.",
    },
    {
      title: "Protected state changes",
      body: "Added transactional queue coordination, server-side role and session checks, mutation audit records, and explicit restrictions around completed visits and paid charges.",
    },
    {
      title: "Reproducible delivery",
      body: "Organized the application in a pnpm/Turbo workspace, with Docker packaging, PostgreSQL migrations, Kubernetes manifests and Terraform configuration. This showcase verifies local behavior; it does not claim a fresh cloud deployment.",
    },
  ],
  architecture: [
    {
      title: "A session boundary at the API",
      body: "Login establishes an HttpOnly cookie. Cookie-authenticated mutations validate the browser origin, while backend role guards enforce access beyond the frontend navigation.",
      path: "apps/backend/src/auth/session.ts",
    },
    {
      title: "Queue transitions inside transactions",
      body: "Adding a patient uses an advisory transaction lock to allocate the next queue number and reject a duplicate active visit. Calling next locks the selected waiting row and skips rows already claimed by another transaction.",
      path: "apps/backend/src/queue/queue.service.ts",
    },
    {
      title: "Persisted changes with an audit trail",
      body: "The Drizzle database service commits each audited mutation and its audit event together. Audit details record changed field names while filtering password/token names rather than copying clinical contents or credentials.",
      path: "apps/backend/src/database/database.service.ts",
    },
  ],
  steps: [
    {
      title: "Coordinate the visit",
      image: hospitalImage(
        "overview",
        "Pulse Medical administration overview with three synthetic appointments, two waiting patients, one in care and four registered records.",
        "Administration overview · counts come from the isolated demo database.",
      ),
      description:
        "The administration dashboard combines today's schedule and queue state with links to patient registration and billing. The visible counts reflect actual records created through the local API.",
      annotation:
        "Three demo appointments coexist with two waiting visits and one in care. These are different measures, not interchangeable counts or real clinical activity.",
    },
    {
      title: "Find the patient record",
      image: hospitalImage(
        "patients",
        "Patient directory showing Alex Demo, John Doe, Riley Example and Sam Synthetic, with search, queue and consultation actions.",
        "Patient directory · synthetic identities and role-aware actions.",
      ),
      focus: { x: 0.79, y: 0.35, width: 0.18, height: 0.06 },
      description:
        "The patient directory provides search and explicit links into queue and consultation workflows. Contact and demographic details remain collapsed until requested.",
      annotation:
        "Add to Queue and Consult target the selected patient. The directory capture includes an existing local UI change; the source snapshot is recorded in the evidence manifest.",
    },
    {
      title: "Move from waiting to care",
      image: hospitalImage(
        "queue",
        "Patient queue with Alex Demo in progress, Sam Synthetic and Riley Example waiting, and controls to call next or complete a visit.",
        "Queue coordination · one real call-next transition in the synthetic dataset.",
      ),
      focus: { x: 0.69, y: 0.58, width: 0.28, height: 0.07 },
      description:
        "The API called the next waiting patient before this capture. Alex Demo is now in progress, while the other two visits remain waiting. Foreground polling refreshes the mounted view every five seconds.",
      annotation:
        "The active row shows IN PROGRESS and a Complete action. Capturing one successful transition does not establish concurrent-load safety; the transaction design is separately inspectable in source.",
    },
    {
      title: "Inspect the consultation",
      image: hospitalImage(
        "consultation",
        "Read-only consultation view for Alex Demo with a persisted SOAP note containing explicitly synthetic text.",
        "Consultation record · persisted SOAP sections, read through an admin session.",
      ),
      focus: { x: 0.21, y: 0.49, width: 0.38, height: 0.14 },
      description:
        "A doctor-session API request created this SOAP note. The administration session can inspect its subjective, objective, assessment and plan sections; the captured view correctly shows read-only access.",
      annotation:
        "Every section contains fictional verification text. The screenshot demonstrates persisted structure and the admin reading state, not a real clinical assessment or doctor-form submission.",
    },
    {
      title: "Record a payment received",
      image: hospitalImage(
        "billing-paid",
        "Billing screen showing a synthetic PHP 1250 charge paid and PHP 750 overdue, with one outstanding bill and one paid bill.",
        "Billing · real Mark paid confirmation, verified again after reload.",
      ),
      focus: { x: 0.21, y: 0.74, width: 0.5, height: 0.15 },
      description:
        "The browser confirmed Mark paid on the synthetic consultation charge. The record changed to PAID, the outstanding amount became PHP 750, and the paid state survived a page reload.",
      annotation:
        "This records a payment received by staff. It does not charge a card or connect to a payment processor. The remaining overdue charge stays outstanding.",
    },
  ],
  verification: [
    {
      label: "Executed workflow capture",
      body: "Playwright captured seven real screens/states: overview, patients, appointments, queue, consultation, billing, and billing after payment. The payment transition and persistence after reload passed; no unhandled page errors were observed.",
    },
    {
      label: "Executed focused tests",
      body: "The existing billing service, queue service, authentication service and role-guard checks passed: 4 suites, 8 tests. The NestJS API was rebuilt successfully before capture.",
    },
    {
      label: "Real database evidence",
      body: "The dedicated database contained 4 fictional patient records, 3 appointments, 1 SOAP note and 17 audit events after the capture journey. These are demonstration counts, not product performance metrics.",
    },
  ],
  limitations: [
    "The source checkout already had changes to the patient page, a workflow file and an untracked verification document. They were preserved. Source links point to the base revision; local file hashes record the captured working-tree state.",
    "The full upstream PostgreSQL integration and multi-session browser suites were not rerun. The focused tests and real capture journey do not replace that complete regression gate.",
    "The frontend uses five-second polling for the captured queue/scheduling refresh behavior. The existence of a Socket.IO gateway is not evidence that this browser journey used a socket connection.",
    "Infrastructure manifests and Terraform were inspected as source only. No Kubernetes rollout, AWS operation, deployment, availability claim or clinical compliance certification was performed for this showcase.",
    "Billing records payments received and uses explicit PHP amounts. Legacy unreviewed amounts require a separate review path; this capture does not exercise that legacy workflow.",
  ],
  repository: "https://github.com/EdTosoy/hospitalProject",
  revision: "bd5ee49c44c33f1321905311731240b4dd9d88ee",
  references: [
    { label: "Local setup and workflow boundaries", path: "README.md" },
    {
      label: "Database migration and preservation decisions",
      path: "docs/database-migration.md",
    },
    {
      label: "State, session and billing verification history",
      path: "docs/code-quality-fixes.md",
    },
    {
      label: "Existing multi-session browser tests",
      path: "apps/frontend/test/quality.spec.ts",
    },
  ],
};

export const pixshareStudy: CaseStudy = {
  slug: "pixshare",
  name: "PixShare",
  category: "MEDIA API ENGINEERING / CASE STUDY 04",
  headline: "Treating an image as more than a file.",
  overview:
    "A FastAPI media API with PostgreSQL persistence, validated image uploads, ownership checks and storage lifecycle handling, paired with a Next.js frontend.",
  scope:
    "These captures show the real running FastAPI documentation, public responses and local image serving. The Next.js frontend could not run without a configured Clerk publishable key. No substitute gallery, mocked screenshot responses or live Clerk session is presented; the walkthrough focuses on verified backend behavior.",
  stack: ["FastAPI", "SQLAlchemy", "PostgreSQL", "Pillow", "Next.js"],
  problem:
    "An uploaded filename and MIME header are not proof of a valid image. A media service also needs to keep ownership, database records and stored bytes consistent when files are listed, replaced or deleted.",
  contributions: [
    {
      title: "Verified media inputs",
      body: "Implemented a server-side upload boundary that checks allowed MIME types, a 10 MiB size limit, Pillow decoding and the actual image format before storage.",
    },
    {
      title: "Ownership and replacement behavior",
      body: "Built authenticated create/update/delete paths, with owner checks before mutation. Replacement uploads the new object first, commits the database change, and then removes the old object, with cleanup on commit failure.",
    },
    {
      title: "An inspectable service boundary",
      body: "Separated async database sessions, response schemas, local storage and post routes. Added Alembic migrations and integration tests alongside a minimal Next.js client.",
    },
  ],
  architecture: [
    {
      title: "Validate bytes, not just labels",
      body: "The upload validator maps JPEG, PNG and WebP MIME values to expected formats, verifies and decodes the image with Pillow, rejects invalid/mismatched content, then rewinds the file for storage.",
      path: "app/core/upload.py",
    },
    {
      title: "Order replacement operations deliberately",
      body: "PATCH verifies ownership before uploading. On commit/refresh failure it cleans up the new file; after a successful commit it deletes the old one. Database and filesystem operations are separate, so this ordering reduces specific failure modes rather than creating a distributed transaction.",
      path: "app/api/routes/posts.py",
    },
    {
      title: "Keep storage behind an interface",
      body: "The local adapter writes under a configured upload directory, generates a UUID-based filename and returns an /uploads URL. Route code consumes the storage interface. No S3 adapter or remote object-store execution is claimed by this capture.",
      path: "app/storage/local.py",
    },
  ],
  steps: [
    {
      title: "Inspect the API contract",
      image: pixshareImage(
        "api-overview",
        "The actual PixShare FastAPI Swagger documentation listing post reads, authenticated create/update/delete routes, current-user lookup and health.",
        "Running FastAPI documentation · generated from the real application routes.",
      ),
      description:
        "The running service exposes an OpenAPI contract for post listing, detail reads, authenticated mutations and health. This is the application's actual API documentation, captured in a browser.",
      annotation:
        "The visible mutation routes require bearer authentication. No token was entered, no live Clerk account was used, and the Next.js gallery is not represented as available.",
    },
    {
      title: "Read persisted media records",
      image: pixshareImage(
        "list-posts",
        "Swagger's live GET posts response showing repository demo artwork, sunset and city records from a real PostgreSQL database.",
        "Public GET /posts · actual server response from the isolated database.",
      ),
      focus: { x: 0.09, y: 0.04, width: 0.44, height: 0.46 },
      description:
        "GET /posts returned three records seeded into the migrated demo database. They reference the repository's bundled city, sunset and artwork fixtures; the capture does not simulate an authenticated upload.",
      annotation:
        "Inspect the live Server response section. Swagger also displays generated Example Value schema content; that example is not the persisted data or an additional response.",
    },
    {
      title: "Filter and bound a query",
      image: pixshareImage(
        "filter-posts",
        "Live Swagger request parameters with limit 1 and file_type image/png, plus the executed URL and successful response.",
        "Public filtering · one PNG record returned with limit=1.",
      ),
      focus: { x: 0.03, y: 0.05, width: 0.32, height: 0.34 },
      description:
        "The query selects PNG records and limits the response to one item. The real endpoint applies type filtering, sort order, offset and limit through a SQLAlchemy select.",
      annotation:
        "The capture uses limit=1 and file_type=image/png. The API check confirmed one PNG record. The source bounds limit to 1–100; no UI pagination feature is inferred from this API capability.",
    },
    {
      title: "Trace one post to its file",
      image: pixshareImage(
        "post-detail",
        "Live GET post by UUID response showing the city fixture's caption, image/png MIME value, /uploads path and stored filename.",
        "Public GET /posts/{post_id} · real detail response, not the schema example.",
      ),
      focus: { x: 0.09, y: 0.29, width: 0.45, height: 0.18 },
      description:
        "A detail request resolves the selected UUID to its persisted caption, filename, MIME value and storage URL. This links the public resource identity to the object served by the local adapter.",
      annotation:
        "The live body references /uploads/sample_city.png and image/png. These fields came from seeded demo data; they do not prove that the captured session uploaded or validated the file.",
    },
    {
      title: "Verify the served image",
      image: pixshareImage(
        "stored-image",
        "The repository's city image fixture opened directly from the running PixShare /uploads endpoint.",
        "Actual /uploads response · served bytes matched the repository demo fixture.",
      ),
      focus: { x: 0.28, y: 0.22, width: 0.4, height: 0.42 },
      description:
        "The browser opened the stored PNG from the actual FastAPI static-files route. The capture script compared the HTTP response bytes with the repository fixture and confirmed they were identical.",
      annotation:
        "This verifies the local storage/read path for this fixture. The 50-test backend suite separately exercises upload rejection, ownership and replacement behavior with explicit test identities.",
    },
  ],
  verification: [
    {
      label: "Executed real API capture",
      body: "The public list returned 3 demo posts, the PNG query returned 1 record, detail lookup succeeded, and the stored image rendered. Its HTTP bytes matched the original bundled fixture. No screenshot API response was mocked.",
    },
    {
      label: "Executed backend tests",
      body: "The existing suite passed: 50 tests, using a separate disposable PostgreSQL database and filesystem/test fixtures. It covers invalid/oversized image rejection, ownership failures, safe replacement and storage operations.",
    },
    {
      label: "Frontend prerequisite checked",
      body: "The unmodified Next.js /posts route returned HTTP 500 with the missing Clerk publishable-key error. Automatic keyless setup was disabled for the final check. Authenticated browser workflows and live Clerk verification remain untested.",
    },
  ],
  limitations: [
    "There is no authenticated Next.js gallery capture. Clerk configuration was unavailable; no credentials, account provisioning, auth bypass or replacement frontend was used to manufacture working product evidence.",
    "The captured database was seeded with the repository's bundled demo images. It establishes public reads and serving behavior, not a real user upload through the frontend.",
    "The test suite substitutes test identities and selected failure conditions. Its passing results establish those tested service behaviors, not end-to-end validation against a live Clerk instance.",
    "The storage and database are not one atomic transaction. The inspected replacement cleanup handles specific failures; this does not establish crash-proof cross-system consistency or complete orphan-file recovery.",
    "Public GET routes expose posts, and /uploads serves local files. This demo is not presented as a private document vault. S3, production deployment, multi-browser behavior and load testing were not exercised.",
  ],
  repository: "https://github.com/EdTosoy/PixShare",
  revision: "2edca2c8d8fe813589b0770e0a5e73e8077f0aa1",
  references: [
    { label: "Project setup and documented scope", path: "README.md" },
    {
      label: "Upload validation and rejection tests",
      path: "tests/api/posts/test_create.py",
    },
    {
      label: "Ownership and replacement failure tests",
      path: "tests/api/posts/test_update.py",
    },
    {
      label: "Next.js frontend and Clerk boundary",
      path: "web/app/providers.tsx",
    },
  ],
};
