# Project evidence verification

Latest status: [Phase 2 employer review and regression verification](phase2-review.md). The theme lint errors and local Analytics 404 described in this historical capture report are now fixed. Expanded upstream test results, including FATS failures, are recorded in the supplement.

Captured 23 October 2026 (Asia/Manila; UTC timestamps in the capture records).

## Implemented

- Flow case study: /projects/flow-financial-reconciliation
- FATS PDF Tools case study: /projects/fats-pdf-tools
- Reusable EvidenceScreenshot, ZoomFocusViewer and GuidedWalkthrough components.
- Responsive Next.js images, full-image inspection links, normalized focus regions, CSS camera transforms, optional dimming, reset, previous/next, keyboard step navigation and reduced-motion behavior.
- Server-rendered case-study explanations and native disclosure containing all walkthrough text for use without JavaScript.
- Original and actual completed/extracted/split synthetic PDF files are available directly from the FATS case study for inspection. The completed file precedes page reordering; split/extract outputs use the reordered session.
- Authentic screenshots and View Case Study links on the existing Flow and FATS featured cards. Other project descriptions, portfolio sections and résumé were not changed.
- Scoped the existing loading boundary to the homepage using an App Router route group. The homepage URL, content and loading UI are preserved; case-study HTML is no longer hidden behind a root streamed Suspense boundary when JavaScript is disabled.
- No dependencies added. No commit, push, deployment or publication performed.

## Authentic capture provenance

Flow: source revision d18efb3d65c7b164c45ca3f4571150cb8ce15a25.
FATS: source revision 8afbf3da66baa06a7ea03c93af46fbbc46d34eb1.
Both source worktrees were clean after capture. These links identify the inspected source; remote repository access was not tested.

Flow used the existing local production build and its real server-side operations read layer. A new, isolated PostgreSQL 18 container was migrated using the repository migration runner. Scoped database roles were provisioned only in that disposable database. Simulator seeds 71200 and 71201 generated public synthetic inputs, including deliberately missing/duplicate/incorrect observations. The repository's seedDemo pipeline performed ingestion, interpretation, reconciliation, exception/control evaluation and worker processing. The operations server received only its read-role connection. The temporary server and database container were stopped after capture. No existing database or cloud infrastructure was used.

Playwright captured six functioning Flow screens at 1440 × 1000: overview, reconciliation, exceptions, reconciliation run detail, controls and workers. No unhandled page errors were observed. UNKNOWN completeness and intentionally injected worker failures remain visible. Initial invalid transaction/settlement route probes were discarded; they are not showcase assets.

FATS ran locally in guest-only mode, with account/database and AI-provider configuration disabled for the process. A synthetic, three-page fictional offer PDF was generated with pdf-lib solely as demonstration input. Playwright opened that PDF in the existing editor and the development-only v2 candidate, placed a typed Demo Reviewer signature, moved original page 1 to position 2, extracted current pages 1 and 3, split after current page 1, and downloaded real output files. No responses or downloads were mocked. No page or console errors were observed in that capture.

Screenshots are unretouched browser captures. FATS development chrome and the application's development-candidate label remain visible. The simulated design prototype was not used.

Internal local capture records, SHA-256 hashes of every PNG and selected inspected source files, and the exact local capture helpers are retained under docs/evidence in the portfolio checkout. Helpers contain local absolute paths and require the existing sibling repositories, installed dependencies, Chromium, and Docker for Flow; they do not authorize cloud operations or production data access.

## Executed checks

PASS — `npx tsc --noEmit` in the portfolio.

PASS — `npm run build` with network access. Next.js 16.2.10 compiled, checked TypeScript and prerendered both case studies and the existing homepage. The first sandboxed attempt failed because existing next/font Google font downloads were unavailable; the network-enabled retry passed without changing font configuration.

PASS — `npx eslint components/evidence components/Projects.tsx data/case-studies.ts data/projects.ts types/index.ts scripts/check-evidence.mjs`.

PASS — `git diff --check`.

PASS — Flow focused tests, from the Flow repository:

```
node --import tsx --test libs/money/test/*.test.ts libs/reconciliation-domain/test/*.test.ts tests/operations-boundaries.test.ts tests/simulator-boundaries.test.ts
```

24 tests passed, 0 failed, 0 skipped. Includes exact-money properties, signed conservation, grouped matching, ambiguity/identity stability, no double consumption and runtime/oracle/database import boundaries.

PASS — FATS capture journey assertions: completed output reopened with 3 pages; extracted output reopened with 2 pages; split outputs reopened with 1 and 2 pages. The completed output also rendered in a fresh FATS PDF.js workspace with its signature visible. This used the same app's installed pdf-lib plus its PDF.js renderer. It is not an independent Poppler pixel comparison.

FAIL (existing repository baseline) — `npm run lint`: two react-hooks/set-state-in-effect errors in components/ui/ToggleTheme.tsx and context/ThemeContext.tsx; one unused-error warning in app/error.tsx. The same source lines exist at the starting HEAD and none of these files was modified. Scoped lint of all showcase files passes.

PASS — Production browser verification:

```
EVIDENCE_BASE_URL=http://127.0.0.1:3103 EVIDENCE_OUTPUT=/tmp/portfolio-evidence-final node scripts/check-evidence.mjs
```

Both case studies passed at 1440 × 1000 and 390 × 1000: all five steps; previous/next boundaries; touch activation on mobile; Arrow/Home/End keyboard selection and retained focus; all annotated regions fully within the image viewport; full-image links; zoom/reset/dimming; zero horizontal overflow; theme switching; zero-duration camera transitions under prefers-reduced-motion; and preserved existing project/résumé links. All five synthetic PDF links returned PDF bytes successfully. Both native text disclosures opened and exposed all five steps with JavaScript disabled at 390 × 844.

No unexpected browser console, HTTP or unhandled page errors were observed. The existing Vercel Analytics script returned HTTP 404 at /_vercel/insights/script.js on local production hosting, with its corresponding console error. The browser check records that exact known URL/status separately, without stubbing it or suppressing other failures. This is a local hosting limitation, not an all-network-clean claim.

Browser result JSON and desktop/mobile/full-page/theme/focused screenshots are local at /tmp/portfolio-evidence-final. The screenshots were visually inspected. Full automated accessibility conformance is not claimed.

PASS — Byte comparisons confirmed the homepage and its loading UI are unchanged after moving them to app/(home). The résumé has no diff. Both upstream application worktrees remained clean after capture. Screenshot/PDF checksums are recorded in docs/evidence/manifest.json.

## Verification limits

- Full Flow PostgreSQL integration/resilience regression suites were NOT RUN. The real migrated database capture is integration evidence for this demonstration, not a substitute for the full gate.
- Full FATS unit/browser regression suites, independent Poppler rendering, physical mobile devices, non-Chromium engines and spoken screen-reader checks were NOT RUN. Existing upstream reports are linked as historical documentation, not presented as tests executed in this task.
- The operations app is read-only. Ingestion/processing occurred through its real local pipeline; there are no fabricated dashboard controls to run those commands. No standalone transaction inspection route was found; the run detail shows settlement population and provenance.
- No live bank, Stripe or AWS calls, production login, production performance, financial compliance or release-readiness claims are established.
- FATS v2 remains development-only. Its original design prototype simulates interactions and is separate from the functional candidate captured here. The existing editor at /resumes/pdf-tools is shown separately.
- Visual signatures are not cryptographic signatures. Memory-only edits are not backups. Browser download handoff does not establish a physical-device save. Unsupported PDF structures remain subject to the application's compatibility guards.
- No Core Web Vitals field measurements or Lighthouse score was collected. Images reserve their aspect ratio and retain Next.js Image layout handling. Following the later image-loading refinement below, project images load eagerly from the original files and walkthrough originals preload. Only the active walkthrough image is mounted; full-image inspection remains available through an explicit link.

## Hospital and PixShare extension — 23 October 2026

Implemented /projects/pulse-hospital-devops-platform and /projects/pixshare using the same shared case-study presentation and five-step screenshot viewer. Both cards now include actual evidence thumbnails and View Case Study links. The four-card 2×2 desktop grid, single-column mobile layout and removal of per-card technology badges are preserved. Footer navigation connects all four studies. PDF-specific output/comparison sections remain exclusive to FATS.

### Hospital evidence and executed checks

Base source revision: bd5ee49c44c33f1321905311731240b4dd9d88ee.
The checkout already contained changes to .github/workflows/verify.yml and apps/frontend/src/app/dashboard/patients/page.tsx, plus untracked docs/verification-gates.md. They were preserved. The current frontend was captured, so the patient directory reflects the existing local UI change. Source links identify the base revision; SHA-256 hashes in docs/evidence/manifest.json identify the local files inspected. Next dev generated two instruction stubs during capture; only those newly generated stubs were removed afterward.

PASS — Built the NestJS API from current source with `node node_modules/@nestjs/cli/bin/nest.js build` from apps/backend.

PASS — Focused existing tests from apps/backend:

```
node node_modules/jest/bin/jest.js --runInBand --silent src/billing/billing.service.spec.ts src/queue/queue.service.spec.ts src/auth/auth.service.spec.ts src/auth/roles/roles.guard.spec.ts
```

4 suites, 8 tests passed. These focused unit checks are not a full PostgreSQL regression run.

PASS — A fresh, randomly named PostgreSQL 18 container on a loopback-only port was migrated using the existing compiled Drizzle migration runner. The additive demo seed supplied fictional accounts. API requests created Alex Demo, Sam Synthetic and Riley Example, their appointments/queue entries and two charges. A doctor-session request created an explicitly fictional SOAP note; an admin session read it. No real clinical records, passwords, tokens or environment values were captured.

PASS — Playwright captured overview, patients, appointments, queue, consultation, billing and paid billing at 1440 × 1000. The browser confirmed Mark paid for the PHP 1250 synthetic charge and verified PAID again after reload. The PHP 750 overdue charge remained outstanding. The database then contained 4 fictional patient records (including the additive seed's John Doe), 3 appointments, 1 note and 17 audit events. Those are fixture counts, not production metrics. No unhandled page errors were observed. Temporary services and their dedicated database container were stopped after capture.

The first capture attempt stopped on an incorrectly capitalized heading in the capture helper. After correcting that selector, the complete journey above passed. No application code was changed to satisfy the helper.

Hospital gaps: full database integration/concurrency suites, live socket behavior, legacy-amount review, Kubernetes/AWS execution and physical-device clinical workflows were NOT RUN. The captured frontend refreshes relevant queries through five-second polling. Docker/Kubernetes/Terraform files are source evidence, not evidence of a new deployment.

### PixShare evidence and executed checks

Source revision: 2edca2c8d8fe813589b0770e0a5e73e8077f0aa1.
The connected GitHub repository metadata and contents were inspected, then the public source was cloned into /tmp/portfolio-pixshare for local execution. Locked dependencies were installed only in that temporary checkout: `uv sync --frozen` and `pnpm install --frozen-lockfile --ignore-scripts` in web. No portfolio dependency was added. The Python process used the GCC C++ runtime library described by the repository's Nix development setup after the initial launch reported missing libstdc++.

PASS — The real, unmodified FastAPI service ran against a fresh migrated PostgreSQL demo database. The repository's three bundled images were copied into its local upload directory and associated with synthetic database records. No authenticated upload was simulated. Public list/detail/filter operations were exercised through the actual service and Swagger UI. Public GET /posts returned 3 records; file_type=image/png with limit=1 returned 1 PNG record. The selected detail resolved to the stored file URL. The served PNG's HTTP response bytes exactly matched the bundled city fixture. No screenshot responses were mocked; no unhandled page errors were observed.

PASS — Five 1440 × 1000 Playwright captures show the running API overview, live list response, executed filter parameters, live detail response and stored-image rendering. Swagger's separate generated Example Value section is explicitly distinguished from live Server response data in the annotations.

PASS — The existing backend suite ran with `.venv/bin/pytest -q` against a separate disposable, migrated test database: 50 passed. The repository fixtures substitute test identities and selected failure paths; they exercise real PostgreSQL and filesystem behavior but do not verify a live Clerk sign-in.

NOT RUN — Authenticated Next.js gallery/upload/edit workflows and live Clerk authentication. With automatic keyless setup disabled using the installed SDK's NEXT_PUBLIC_CLERK_KEYLESS_DISABLED setting, the unmodified /posts route returned HTTP 500 with the missing publishable-key error. That unavailable state is not used as product evidence. No working gallery was fabricated, no authentication boundary was removed, and no live user session is claimed.

PixShare gaps: production/S3 behavior, load tests, end-to-end live Clerk identity, and crash-proof consistency across database and file storage were not established. The captured public API and /uploads routes are public resources, not a private document vault. The temporary API, demo/test databases and their container were stopped after capture.

Exact final capture helpers, records and hashes for the two projects are retained under docs/evidence. The original Flow and FATS evidence is retained. The résumé is unchanged. No commit, push, deployment or publication was performed.

### Portfolio extension verification

PASS — `npm run build`: all four case-study routes and the homepage compiled, passed the build TypeScript check and prerendered as static content.

PASS — `npx tsc --noEmit` and scoped lint:

```
npx eslint components/evidence data/case-studies.ts data/projects.ts components/Projects.tsx app/projects scripts/check-evidence.mjs
```

PASS — Expanded production browser check:

```
EVIDENCE_BASE_URL=http://127.0.0.1:3103 EVIDENCE_OUTPUT=/tmp/portfolio-four-case-studies node scripts/check-evidence.mjs
```

8 viewport scenarios passed: Flow, FATS, Hospital and PixShare at 1440 × 1000 and 390 × 1000. Exercised every step, mobile touch activation, keyboard Arrow/Home/End controls and focus, zoom/reset/dimming, entire focus-region visibility, full-image inspection, theme changes, reduced-motion transitions and no horizontal overflow. All four card links remain available, cards have no technology badges, and existing Code/résumé links remain present. All four transcripts open without JavaScript at 390 × 844. Existing FATS synthetic PDF links still return valid PDF bytes.

There were no unexpected page, console or HTTP errors. The existing local-only Vercel Analytics script 404 and its console error remain recorded separately by exact URL/status. The previously documented full-lint baseline errors in untouched theme components remain outside this change.

Final browser results are retained in docs/evidence/portfolio-four-studies-results.json; actual desktop/mobile/full-page/theme/focused screenshots are local in /tmp/portfolio-four-case-studies and were inspected. All 25 public screenshots (12 new) and 5 synthetic FATS PDFs have manifest hashes. New screenshots are unretouched browser captures; the public report and route scope explain whether they show an application workflow or API evidence.

## Image loading refinement

The browser investigation confirmed that evidence images used the default loading="lazy" and requested Next.js optimized variants (for example, width 1080 at quality 75 for full view and width 1920 at quality 75 for a focused step). No blur placeholder or image CSS blur filter was configured. The focus-dependent sizes could request a different-resolution image while navigating/zooming.

Project card screenshots, standalone evidence screenshots and the zoom viewer now use loading="eager" with the unchanged original image source (unoptimized). The viewer no longer changes responsive image candidates when focus changes. GuidedWalkthrough issues image preloads for every step using ReactDOM.preload, as documented by the installed Next.js version. Screenshot files, focus coordinates and reduced-motion behavior are unchanged. This deliberately fetches originals earlier and may transfer more bytes than lazy optimized thumbnails, following the user's preference for immediate, consistent screenshot clarity.

PASS — Production build, `npx tsc --noEmit`, and scoped lint of components/Projects.tsx, components/evidence and scripts/check-evidence-loading.mjs.

PASS — `node scripts/check-evidence-loading.mjs` against the local production preview at 1440px and 390px. All four offscreen card images loaded before scrolling; all five original screenshots in each of the four walkthroughs were preloaded; the viewer used no srcset/image-optimizer variants; reset/zoom preserved currentSrc and generated no additional evidence-image requests; no page errors or horizontal overflow were observed. This verifies the loading and quality-switch behavior, not a universal claim of zero network/decoding delay on every connection/device.

## Step-transition clarity correction

A follow-up browser trace showed the remaining apparent resolution change came from automatic magnification and camera reuse across different screenshots. Both source images remained 1440 pixels wide and complete; the camera animated for 650 ms from full view to approximately 2.59× on one step, then reused that transform for the next bitmap before settling at approximately 1.13×. This can make raster screenshot detail look softer and then sharper without any new-resolution download. The earlier eager-loading fix addressed request behavior but did not remove this separate effect.

Each walkthrough step now starts at full view. The viewer is scoped to the selected step so it cannot inherit the previous image's transform. Zoom is an explicit button action; its camera transition and reduced-motion support remain available. Original-image eager loading and preloading are retained. Manual magnification can still reveal the finite detail of a 1440-pixel screenshot; this change does not invent additional source resolution.

PASS — Build, TypeScript, scoped lint and diff whitespace checks after the step-transition correction. `node scripts/check-evidence-loading.mjs` verified original-image preloading, unchanged source resolution, no added zoom downloads, and full-view transforms immediately and after navigation across all steps at 1440px and 390px, including leaving a magnified step.

PASS — `EVIDENCE_BASE_URL=http://127.0.0.1:3103 EVIDENCE_OUTPUT=/tmp/portfolio-explicit-zoom node scripts/check-evidence.mjs`: all 8 viewport scenarios passed with explicit zoom actions, focus containment, reset/dimming, keyboard/touch controls, reduced motion, no overflow and no-JavaScript transcripts. Only the previously documented local analytics 404 is classified separately. Results are retained in docs/evidence/portfolio-explicit-zoom-results.json. No source screenshots, résumé, commits or deployments changed.
