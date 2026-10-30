# FATS and Vigil portfolio refresh — 29 October 2026

This refresh changes only the two project entries, their case studies/media, scoped link handling and relevant verification/capture tooling. Existing routes are retained to preserve inbound links. No deployment, production-data mutation, push, dependency change, theme, typography, navigation or layout redesign was performed.

## Source of truth

- Vigil: sibling `flow`, inspected revision [`a479cd7cb896b960c65f2b083673d54c3f8f95a2`](https://github.com/EdTosoy/vigil/commit/a479cd7cb896b960c65f2b083673d54c3f8f95a2). README, current architecture/invariants, Stripe implementation, operations/authentication source, Phase 15 hosted evidence and Sydney preparation were inspected. Its existing unrelated `.gitignore` change was preserved.
- FATS: sibling `ats`, inspected revision [`918d8eafc7698184cdc439fe9d174c0dc6279fef`](https://github.com/EdTosoy/FATS/commit/918d8eafc7698184cdc439fe9d174c0dc6279fef). README, application/domain components, product integration, private-beta hardening, Hallmark document guidance, matching and D1/D2 reports were inspected.
- Upstream test numbers are attributed to those reports. This refresh did not rerun the complete application suites, call Stripe/AI/email providers, provision AWS, configure scanners or use real personal records.

Vigil covers immutable payment ingestion, Stripe sandbox enrichment, deterministic settlement interpretation, exact 1:1/declared N:1 synthetic-bank reconciliation, exception lifecycles, independent completeness, auditability, leases/fencing/recovery and the operator read model. Historical hosted charge/fee and AWS evidence is separate from fresh synthetic captures and future availability. External evidence does not authorize payments or automatically post journals.

FATS covers personal applications, Sidekick capture, resume/version rules, interviews, Career Vault and Offer Desk before secondary PDF tools. Paused AI matching, development-only PDF v2, real-scanner acceptance, guest storage boundaries and hosted-account delivery limitations remain explicit. D2's 318/319 serial unit result is disclosed rather than described as an entirely passing gate.

## Public URLs and activation

[Sanitized read-only access checks](./fats-vigil-access-check.json) record the exact targets, timestamp, HTTP status/redirect origin or DNS failure. No login URLs, cookies or credentials are included.

| Product             | Retained URL                                | Observed result                                                        | Portfolio behavior                                                      |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Vigil               | `https://vigil.edtosoy.com`                 | DNS `ENOTFOUND` for `/`, `/health/ready` and `/reconciliation`         | **Deployment Pending**; planned for 30 October 2026; no public app link |
| FATS                | `https://fats.edtosoy.com`                  | Anonymous `/`, `/applications` and `/api/account` return 302 to Vercel | **Private Preview**; no public app link                                 |
| FATS recorded alias | `https://fats-edtosoys-projects.vercel.app` | Anonymous root returns 302 to Vercel                                   | Protected deployment evidence only                                      |
| GitHub              | `EdTosoy/vigil`, `EdTosoy/FATS`             | Both repositories and checked pinned source pages return 200           | Explicit **GitHub** links                                               |

The FATS custom domain is observed today; the D1 report predates that attachment and records the protected Vercel alias. A login page's final 200 is not application availability. Vigil's readiness route must return `READY` and real dashboard/reconciliation content must be accessible before activation; process liveness alone is insufficient.

App URLs now live directly in `src/data/projects.ts`; the separate access-flag module has been removed. Project card images open those URLs in a new tab, while **View Case Study** opens the internal study. Each study also offers a **Live App** link from the same project data. These links do not establish current public availability; the access checks above remain historical evidence. Case-study galleries stay independent. Only refreshed FATS/Vigil media URLs carry a dated asset directory, preventing old optimized thumbnails or CDN media from being reused under the new content. Global cache configuration is unchanged. An attempted query-string version was rejected by installed Next.js 16.1.7 local-image validation; dated paths resolve that failure without changing global image settings. The [official localPatterns explanation](https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns) was checked alongside the installed runtime error.

Recheck without writes to either application:

```sh
ACCESS_CHECK_OUTPUT=/tmp/fats-vigil-access.json node apps/main/scripts/check-fats-vigil-public.mjs
```

## Authentic media

The existing Playwright recorder, fixed viewports, installed sandboxed Chromium, Sharp and FFmpeg pipeline were reused. No new dependency, UI mock, authentication bypass, generated image or production fixture was introduced. Existing local production builds were used; the source revisions are inspection provenance rather than a claim that these builds were freshly compiled from HEAD.

| Product | Fresh screenshot states (each desktop 1440×1000 and mobile 390×844)                                                                                         | Short continuous recording                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Vigil   | `overview`, `reconciliation`, `settlement-inspection`, `exceptions`, `controls`, `workers` — 12 screenshots                                                 | `fats-vigil-20261029/flow/demo.mp4`, 20.96 seconds |
| FATS    | `dashboard`, `applications`, `details`, `updated`, `interview-preparation`, `interviews`, `resumes`, `career-vault`, `offers`, `pdf-tools` — 20 screenshots | `fats-vigil-20261029/fats/demo.mp4`, 33.92 seconds |

Public screenshots are lossless WebP. Videos are silent H.264, 24 fps, CRF 28, fast-start MP4; posters come from actual frames. The optimizer gained validated project selection and a named evidence output directory. `CAPTURE_PROJECTS=flow,fats CAPTURE_ASSET_ROOT=/evidence/fats-vigil-20261029` writes only this refresh. Original Phase 5D assets remain byte-for-byte intact. [Capture receipts, dimensions, original/optimized byte sizes, asset hashes and provenance](./fats-vigil-media.json) identify the final media.

Vigil creates a new disposable loopback PostgreSQL container from a cached image, migrates it, generates the existing synthetic simulator inputs and runs the real seed/reconciliation pipeline. A separately scoped synthetic Viewer is created through the existing account seeder and signed in through the actual auth endpoint before the recorded page exists. The server receives separate auth/operations credentials; seed/owner connections never become application credentials. The container is removed by the owning script after capture. Every screen checks its actual route, rejecting sign-in redirects. Initial inspection caught and rejected an obsolete recorder's sign-in-page captures; those are not published as application evidence.

FATS starts with a fresh guest context, saves a fictional job, changes its stage, reloads and verifies persistence, then schedules a fictional interview in Asia/Manila. Resume/Career Vault/Offer Desk captures show real prerequisites and restricted file guidance, not accepted uploads or authenticated offer management. The first attempt's outdated save-button selector was updated; only the successful capture is published.

Good historical evidence remains: FATS Sidekick capture, scanner-refusal image, authenticated Offer Desk, PDF editor/v2 screenshots and synthetic PDF downloads. They remain explicitly historical/development evidence. Original Phase 5D media for every project remains byte-for-byte intact. New media lives under `/evidence/fats-vigil-20261029/`; only those new FATS/Vigil entries are appended to the existing asset index.

Raw final PNG/WebM captures remain local under `/tmp/fats-vigil-refresh-flow-final` and `/tmp/fats-vigil-refresh-fats-final`; the public optimized assets and JSON provenance are committed. Recordings were visually sampled and desktop/mobile screenshots inspected. Final captures show synthetic records without sign-in credentials.

Reproduce with new output directories, existing dependencies/builds and Docker access:

```sh
CAPTURE_OUTPUT=/tmp/fats-new CAPTURE_VIDEO=1 node apps/main/scripts/media/fats.mjs
TSX_TSCONFIG_PATH=/mnt/storage/projects/flow/tsconfig.base.json \
  CAPTURE_OUTPUT=/tmp/vigil-new CAPTURE_VIDEO=1 \
  node --conditions=react-server --import /mnt/storage/projects/flow/node_modules/tsx/dist/loader.mjs \
  apps/main/scripts/media/flow.mjs
CAPTURE_OUTPUT=/tmp/fats-new CAPTURE_PROJECTS=fats CAPTURE_ASSET_ROOT=/evidence/fats-vigil-20261029 node apps/main/scripts/media/optimize.mjs
CAPTURE_OUTPUT=/tmp/vigil-new CAPTURE_PROJECTS=flow CAPTURE_ASSET_ROOT=/evidence/fats-vigil-20261029 node apps/main/scripts/media/optimize.mjs
```

## Verification

- **PASS:** final source-application capture journeys: Vigil 6 screens × 2 viewports, FATS 10 screens × 2 viewports; no observed page/HTTP errors. Vigil additionally checks real database readiness and exact post-authentication routes. FATS verifies stage persistence after reload.
- **PASS:** public-read checks established pending/protected status and working GitHub destinations; neither application passed a public availability check.
- **PASS:** portfolio TypeScript, ESLint, scoped Prettier and production build. **PASS:** 8 targeted Playwright scenarios (2 projects × 2 widths × 2 themes), existing gallery/dimming pixel checks, video playback, navigation, exact link attributes, no-JavaScript transcripts, no missing local assets, and no observed page errors or horizontal overflow. [Executed browser receipt](./fats-vigil-browser-check.json). The final dated-asset run passed all 8 scenarios against a fresh production server on port 3130; its temporary server stopped automatically afterward.
- The first browser invocation ran before Nx finished starting its dependent server and received connection-refused; a later duplicate Nx continuous start waited for the existing target, so final verification served the already-built app directly with `pnpm exec next start --port=3130 --hostname=127.0.0.1`; an explicit readiness wait was added and the subsequent scoped suite passed. The initial restricted build exited without compiler diagnostics and Nx Cloud could not resolve its cache endpoint. A separate production build with network/process access and `NX_NO_CLOUD=true` was used for final verification; this does not establish a source-code failure.

Run the scoped production-browser verification from the workspace root:

```sh
NX_DAEMON=false NX_NO_CLOUD=true pnpm nx run @org/main:build
NX_DAEMON=false NX_NO_CLOUD=true pnpm nx run @org/main:start --port=3126 --hostname=127.0.0.1
# In another terminal:
NX_DAEMON=false NX_NO_CLOUD=true pnpm nx run @org/main:verify-fats-vigil
```

The scoped test checks desktop/mobile, both themes, keyboard thumbnail navigation, case-study/back/next navigation, section links, exact GitHub attributes, pending-link suppression and activation gating, every referenced screenshot, video/poster decoding and keyboard playback, the existing full gallery/zoom/dimming/reset behavior, reduced motion, automated WCAG scans, overflow and no-JavaScript transcripts. It compares unrelated project/study/demo objects to the Git baseline and guards their existing card destinations. This is bounded Chromium verification, not a physical-device or complete screen-reader audit.

Full Jest: **32 passed / 1 failed (33)** after updating only the stale Vigil-slug expectation. The remaining `renders Marcus alone … retains older work` case expects `.older-projects`; the same assertion is present at the Git baseline and no baseline JSX renders that class (only unused CSS rules remain). The Marcus data and card behavior are unchanged and their scoped browser guard passes. That unrelated assertion/component was deliberately left intact. The FATS/Vigil first-page homepage unit case passed separately: `pnpm nx run @org/main:test --runInBand --testNamePattern="keeps the primary links"` (1 passed, 32 unselected). A restricted Jest invocation also exited without diagnostics before the executed suite was run with the required process access.

The existing Phase 5 verifier now resolves the new project-specific access configuration and expects the current Vigil slug. Its broader historical workflow was **NOT RUN**; the scoped browser suite reuses its gallery verifier and exercises the requested paths. Full upstream FATS/Vigil suites, real providers, physical devices and screen readers were **NOT RUN**.

**PASS:** updated FATS/Vigil asset hashes match their files; unrelated media-index entries and unrelated project/study/demo objects equal the baseline. No global CSS, layout, navigation, theme, About, Resume, Timeline, Contact, dependency or deployment configuration changed.

## Remaining blockers

Public Vigil readiness/dashboard availability and anonymous FATS access remain unverified. FATS hosted email/authentication, provider recovery and accepted-file scanning require their own application work. None blocks accurate case-study publication with pending/private status. No push or deployment is authorized or performed by this task.

Formatting was checked across all task files; the edited top section of the historical Phase 5 helper used Prettier range checking to preserve unrelated baseline formatting. The generated Next.js type-reference change was restored.
