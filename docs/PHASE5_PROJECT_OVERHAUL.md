# Phase 5 — featured projects and case studies

Verified locally on 26 October 2026 in `personal-os/apps/main`. Preview:
http://127.0.0.1:3126/#projects. No commit, push, deployment, Vercel configuration
change or upstream application source edit was made.

## Delivered behavior

Five purpose-first project cards and five consistently structured case studies
now explain the product, audience, problem, personal contribution, workflow,
engineering decisions, implementation evidence and remaining limitations.
Architecture and source references remain available for deeper review.

- Page 1: Flow, FATS, Hospital Management Platform and PixShare.
- Page 2: Marcus Chess. Older NestJS engineering work remains below the grid.
- Native Previous/Next and numbered links use `?projectsPage=N#projects`, with
  current-page and disabled-boundary semantics. Keyboard and browser history work.
- A shared pagination function slices any project count into pages of four.
  Desktop uses two columns and at most two populated rows; mobile uses one
  column. Fixed minimum desktop row sizing avoids image-induced card movement;
  a short final page has only its real row, without a fake blank second row.
- Existing project routes remain independently accessible. FATS deliberately
  retains `/projects/fats-pdf-tools` for compatibility, despite its broader focus.
  Hospital retains `/projects/pulse-hospital-devops-platform`.
- Existing real-image zoom/focus, dimming, reset, original-resolution links,
  guided steps, keyboard navigation and reduced-motion behavior are preserved.
  Native expandable transcripts give useful evidence without JavaScript.
- Light/dark styles reuse the existing identity and tokens. ET brand, favicon,
  main header/footer, résumé, certifications and journey features are preserved.
  Pre-existing certification copy changes were retained without editing that
  component. No dependency or lockfile version changed.

## Product evidence and contribution boundaries

| Project | Source revision reviewed | Evidence and current boundaries |
| --- | --- | --- |
| Flow | `d18efb3d65c7b164c45ca3f4571150cb8ce15a25` | Real synthetic-data financial dashboard, reconciliation, completeness/assurance controls, exceptions and recoverable workers. Exact-money ledger and PostgreSQL decisions remain inspectable. The ephemeral AWS demo was torn down according to its report; this work establishes no currently running cloud service, compliance or production scale. |
| FATS | `8afbf3da66baa06a7ea03c93af46fbbc46d34eb1` | Main dashboard replaces PDF Tools as the featured image. Workflow follows extension job capture, applications, interviews, resume/version organization and offers. Captures come from genuine prior local application/extension runs with synthetic records. Current document intake fails closed without its scanner; storing successful newly accepted documents is not established in that environment. AI matching remains disabled by default pending evaluation. PDF editor evidence, development candidate v2 and simulated prototype are explicitly separated in the secondary section. |
| Hospital / abox | `21d9b79c85f5aa52d0d8cd696a670edc5faf37dc` | Latest abox branding and patient, appointment, queue, consultation and billing workflows. Seven fresh screenshots use the real existing production frontend, existing Phase 3A backend image, genuine cookie sessions and isolated PostgreSQL 17. Payment persisted after reload. Revocable sessions, backend role guards and Drizzle/PostgreSQL workflows lead the narrative; infrastructure follows. |
| PixShare | `0ade8101236286c251f10fb8cfce35d4628978b3` | Actual frontend album, gallery, upload and mobile captures replace API documentation as primary evidence. Source supports authenticated owner-only upload/update/delete, optimization, PostgreSQL and local/S3-compatible media storage. The latest release report records 141 backend tests including 14 MinIO cases, 30 genuine Clerk browser cases and 53 captures. Those are attributed historical results, not newly rerun suites. API documentation remains secondary. |
| Marcus / Quiet Chess | `e7c678725295b4f2da2d5339d7608400e2eff669` | Phase 2B and later committed Phase 2C evidence support guided lessons, adaptive practice, actual Stockfish play and coached review. Phase 2B records 177 unit tests plus a separate engine check and 34 Chromium cases; Phase 2C records 46 browser cases and source/build receipts. Real Phase 2C screenshots show the current Quiet Chess working title. Concurrent uncommitted upstream changes are excluded from these pinned claims. |

These are independent engineering projects. The case studies distinguish personal
implementation from external libraries, engines, services and infrastructure.
Synthetic records, fixture results and local verification are not adoption,
business-impact or educational-outcome measurements.

### Fresh Hospital capture

The supplied Hospital updates were inspected through the latest source and
Phase 1A, 2A and 3A reports. Phase 2A brand screenshots use stubbed APIs, so they
were not reused as proof of application workflows.

The fresh capture instead ran existing compiled builds with a dedicated disposable
PostgreSQL database. The frontend's compiled loopback API address was forwarded
to the isolated real backend; responses were not mocked and authentication was
not bypassed. An existing service on port 3000 was left alone. Fictional records
produced four patients, three appointments, one consultation and 17 audit events.
The billing change survived reload, with no captured runtime errors. Only the
capture's own labelled containers, network and temporary frontend were cleaned up.

[Capture receipt](phase5/hospital-capture.json) records the frontend build ID,
backend image digest, routes and assertions. The
[exact capture script](phase5/capture-hospital.mjs.txt) documents the setup.
This is targeted workflow evidence, not a complete rerun of the Hospital suites.

## Executed verification

Commands ran from the Nx root with
`NX_DAEMON=false NX_ISOLATE_PLUGINS=false NX_NO_CLOUD=true`.

| Status | Command or observable check | Result |
| --- | --- | --- |
| PASS | `pnpm nx test @org/main --runInBand` | 18 tests in two suites: homepage/pagination integration and lossless pagination across changing counts, invalid input and page sizes. |
| PASS | `pnpm nx run-many -t lint typecheck -p @org/main --parallel=2` | ESLint and standalone TypeScript complete; no lint warnings. |
| PASS | `pnpm nx run @org/main:build --outputStyle=stream` | Next.js 16.1.7 production build includes all five case studies and server-rendered query pagination. Start target subsequently rebuilt successfully before serving. |
| PASS | `pnpm nx run @org/main:verify-phase5` | 30 browser scenarios; 36 axe scans with zero reported violations; 20 pixel comparisons; 41 pinned source paths verified in local Git objects. |
| PASS | Responsive index and history | 390, 768, 1440 and 1920px, both themes; card order/count, desktop two columns/max two rows, mobile one column, single Marcus card, native numbered/Previous/Next links, back/forward, malformed page parameters, older-project preservation. |
| PASS | Five case studies and evidence | 390/1440px, both themes; section structure, decoded screenshot dimensions/bytes, local evidence links, full originals, FATS secondary PDF walkthrough, Marcus back link to page 2 and no horizontal overflow. |
| PASS | Viewer interactions | Every main walkthrough step, zoom/reset image reuse, contained focus regions, keyboard steps, background dimming and reduced-motion/no-preference transitions. Pixel checks show surroundings at roughly 55–57% of original luminance with focused regions unchanged. |
| PASS | No JavaScript | Mobile/desktop native pagination and all five expandable transcripts remain visible; targeted probes found no hidden streamed evidence segments. |
| PASS | Existing features | Résumé response hash matches the existing PDF; certification badge and Credly link, keyboard focus, journey expand/collapse and stable anchored position pass across eight width/theme combinations. Zero runtime errors recorded across these index runs. |
| PASS | Integrity/preservation | 45 evidence assets match their SHA-256 manifest; 15 reused upstream captures match byte-for-byte. Ten protected baseline files/assets, including lockfile, résumé, branding and timeline paths, remain unchanged. `git diff --check` passes. |
| PASS | Hallmark review | Component sweep: zero FAIL/REFLEX/WARN. Independent finish review: ship after correcting the empty second-row reservation and neutral-focus screenshot framing. |
| NOT RUN | Hallmark Puppeteer rendering | Puppeteer dependency unavailable; actual Playwright production rendering, screenshot inspection and responsive checks provide the rendering evidence instead. |
| NOT RUN | Full upstream application suites / remote URL availability / physical devices | Outside this portfolio check. Source-link destinations were verified against local pinned Git objects; no cloud service or remote deployment availability was inferred. |

The Next.js build warns that TypeScript project references are not fully
supported and uses incremental mode; the independent typecheck passes. Restricted
sandbox build attempts exited before worker output; running the same local build
with approved process access passed. Nx subsequently marked that task flaky based
on the failed attempts. An early combined command mistakenly forwarded Jest's
`--runInBand` to ESLint; the corrected independent lint command passed.

Automated accessibility is not a conformance certification. Axe retained 276
incomplete contrast-node checks across repeated scans, including existing hero
text and image/overlay surfaces; targets remain in the JSON for manual assessment.
Keyboard, focus and native transcript checks passed, but screen-reader and
physical-device validation were not performed.

The final structured receipt is [after/results.json](phase5/after/results.json).
It is written only after the complete suite succeeds. Browser scripts are in
`apps/main/scripts/check-phase5.mjs`, `check-viewer.mjs` and `check-dimming.mjs`.

## Defect found and repaired

The existing automatic `app/loading.tsx` boundary initially left no-JavaScript
visitors seeing only “Loading...” while project HTML lived in a hidden streamed
segment. Scoping that boundary to case studies fixed the homepage but reproduced
the same defect in case-study transcripts. The final repair retains the view as
an ordinary `components/LoadingState.tsx`, removing automatic loading boundaries
from these evidence routes. Targeted probes and the final suite verify all routes.
The tradeoff is server-response waiting instead of a generic streamed placeholder.

The async query handling follows installed Next.js 16.1.7 declarations and
[current page documentation](https://nextjs.org/docs/app/api-reference/file-conventions/page).
The server-rendered Projects slot follows
[server/client composition](https://nextjs.org/docs/app/getting-started/server-and-client-components).
The loading-boundary diagnosis is consistent with
[the loading convention's automatic Suspense wrapping](https://nextjs.org/docs/app/api-reference/file-conventions/loading).

## Preserved failures and unverified claims

- FATS: scanner-dependent document acceptance is unavailable in the recorded
  configuration; AI matching remains off pending live-model evaluation. A frozen
  source-hash assertion, parallel parser capacity failures and five earlier
  development-overlay browser failures remain disclosed. Later specific backup
  and extension passes do not retroactively establish every suite as green.
  PDF v2 and prototype evidence are not release claims.
- Hospital: the Phase 1A wrapper encountered host Biome launcher failures while
  direct checks passed; a sidebar cookie warning remains. Historical Terraform,
  Kubernetes and monitoring files are source evidence. Phase 3A local amd64
  runtime/restore preparation does not establish AWS eligibility, native ARM64,
  HTTPS, live Kubernetes, cloud restore or clinical compliance.
- PixShare: the reported 97.27% image-byte reduction concerns three normalized
  fixtures at DPR 1, not general latency, cost or production performance. Genuine
  Clerk verification is recorded upstream; no fresh remote Clerk configuration
  or cloud S3 policies were tested here.
- Marcus: educator review, learner pilot, physical-device/browser validation and
  licensing/corresponding-source release packaging remain incomplete. Deployment
  verification is blocked in its source report. No measured learning improvement,
  adoption, validated pedagogical effectiveness or 10× claim is made.
- Flow: synthetic data and selected local test evidence do not establish a live
  service, financial compliance, production scale or business outcomes.

## Employer-perspective assessment

A recruiter can now identify each product's user and purpose from the card and
follow a coherent product workflow rather than a tool inventory. FATS reads as a
job seeker's companion, Hospital as administration software and PixShare as a
photo-sharing application. Marcus adds interaction and learning-system decisions
without overstating effectiveness.

For an engineering reviewer, the stronger signals are inspectable ownership,
state persistence, exact-money and recovery choices, authentication boundaries,
media lifecycle decisions, real engine integration and preserved failure evidence.
Pinned source references and authentic captures make those claims reviewable.
The remaining weakness is external validation: these are local independent
projects, not evidence of production operations, adoption or user outcomes.
The most useful next material would be documented real-user feedback and,
for Marcus, educator review plus a carefully scoped learner pilot.

## Review artifacts

- [Before/after comparison](phase5/comparison.html): desktop/mobile project section
  and Hospital case study; original-resolution images open independently.
- [After captures](phase5/after/) include both themes, page 2, all five studies and
  actual dimming states. No screenshots were simulated or composited.
- [Capture provenance](phase5/capture-provenance.json),
  [asset hashes](phase5/asset-manifest.json),
  [preservation receipt](phase5/preservation.json).
- A self-contained text copy is served at `/evidence/phase5-verification.md`
  for portfolio reviewers. Supporting artifacts remain in this local repository;
  they are identified by path in the served copy.
