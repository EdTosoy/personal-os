# Phase 2 evidence verification — 23 October 2026

This is the current verification supplement. The original [capture report](verification.md) retains the capture history and earlier, superseded failures. Flow and FATS screenshots were not replaced or retouched for this review.

## Portfolio checks

- PASS — `npm run lint`: full ESLint run, without rule suppression. The theme toggle uses a hydration-safe external-store snapshot; the unused second theme provider was removed. The unused error binding was removed.
- PASS — `npx tsc --noEmit`.
- PASS — `npm run build`: Next.js 16.2.10 production build, homepage and all four case-study routes prerendered.
- PASS — `git diff --check`.
- PASS — `EVIDENCE_BASE_URL=http://127.0.0.1:3103 node scripts/check-evidence.mjs`: eight desktop/mobile case-study scenarios, all steps, keyboard and touch controls, zoom/reset/dimming, focus bounds, reduced motion, both themes, original PDF downloads, preserved project/résumé links, no horizontal overflow. All four text transcripts also work without JavaScript.
- PASS — `EVIDENCE_BASE_URL=http://127.0.0.1:3103 node scripts/check-evidence-loading.mjs`: cards load original images eagerly before scrolling; all walkthrough originals preload; no optimizer/srcset swaps, no extra zoom downloads, no inherited zoom on Next, no horizontal overflow at 1440px and 390px.
- PASS — `EVIDENCE_BASE_URL=http://127.0.0.1:3103 node scripts/check-employer-review.mjs`: employer and dates, evidence CTA in the first screen, mobile navigation, persistent light/dark preference across reloads, case-section shortcuts, and manual focus inspection at 1440px and 390px.
- PASS — no unhandled page errors, error-level console messages, failed HTTP responses, or local Vercel Analytics requests in the portfolio browser checks.

These scripts reuse the existing sibling Flow installation of Playwright and the workstation's sandboxed Chromium. They do not install dependencies or disable the browser sandbox. There is no separate portfolio unit-test runner; these are browser integration checks, complemented by lint, TypeScript, and build checks.

## Independent screenshot dimming

The latest viewer change lets “Dim surroundings” work before or after zooming. It starts unchecked; overview steps without a focus target disable both controls and explain how to enable them. Dimming draws the highlight and darkens its surroundings without moving the image. Resetting a zoomed view or changing steps clears dimming.

- PASS — `EVIDENCE_BASE_URL=http://127.0.0.1:3103 EVIDENCE_OUTPUT=docs/evidence/dimming node scripts/check-evidence-dimming.mjs`: all four case studies at 1440px and 390px, with keyboard activation on desktop and touch activation on mobile. Sixteen pixel comparisons verify that surroundings darken while pixels inside the target retain their brightness, in both full and zoomed views. Image URLs remain unchanged, reset and step changes clear the control, and no page errors or horizontal overflow occur. Results and screenshots are retained in `docs/evidence/dimming/`.
- PASS — the subsequent `scripts/check-evidence.mjs` run covers all eight viewport scenarios and no-JavaScript transcripts. Its results are retained in `docs/evidence/dimming/browser-results.json`.
- PASS — the production build after the viewer change; `npm run lint`, `npx tsc --noEmit`, and `git diff --check` were also checked during the resumed handoff.

These browser results were retained from the completed local runs before the interruption; they were inspected during the resumed handoff. Physical devices and other browser engines remain unverified.

## Analytics diagnosis

The layout previously mounted Vercel Analytics on every host. A local production server does not provide `/_vercel/insights/script.js`, so the request returned 404. Analytics now mounts only when `VERCEL=1` at build time. Local production requests were verified absent; no fake endpoint or network interception was added.

Vercel's [Analytics quickstart](https://vercel.com/docs/analytics/quickstart) describes enabling Analytics and deployment-provided endpoints. Its [system environment-variable reference](https://vercel.com/docs/environment-variables/system-environment-variables#vercel) documents `VERCEL=1`. Hosted Analytics still requires enabling the service in the Vercel project; live event delivery was NOT RUN. A build made locally retains its local choice when later served elsewhere; build on Vercel for that integration.

## Capture and source integrity

- PASS — all 25 original screenshot hashes and all five synthetic PDF hashes still match the existing capture manifest.
- PASS — all 11 recorded Flow/FATS inspected source-file hashes still match the source used for capture.
- PASS — all 14 pinned Flow/FATS architecture, test and documentation URLs returned HTTP 200 without authentication.
- PASS — the résumé is byte-identical to the starting Git HEAD.

Flow revision: `d18efb3d65c7b164c45ca3f4571150cb8ce15a25`.

FATS revision: `8afbf3da66baa06a7ea03c93af46fbbc46d34eb1`.

Screenshots are authentic running-app captures using disposable synthetic financial records and fictional PDF input. Source inspection verifies the described implementation; it does not independently establish employment, sole authorship, production adoption, or business impact.

## Flow regressions

PASS — from the unchanged Flow checkout:

```sh
NX_DAEMON=false NX_ISOLATE_PLUGINS=false pnpm test:unit
```

All 15 Nx test targets passed with the cache skipped, followed by 5 boundary tests, 4 Stripe HTTP contract tests, and 9 deployment/access tests. The contract and deployment tests do not contact Stripe or deploy infrastructure.

PASS — selected actual PostgreSQL/browser/resilience suites:

```sh
pnpm test:integration tests/operations.integration.test.ts tests/operations-browser.integration.test.ts tests/reconciliation.integration.test.ts tests/exceptions.integration.test.ts tests/resilience.integration.test.ts
```

87 passed, 0 failed, 0 skipped. The native runner created, migrated and removed its own disposable PostgreSQL 18 database container. Coverage includes operations reads, reconciliation, exceptions, crash/commit-loss recovery, real deadlock/serialization conflicts and deterministic replay. Existing databases and cloud services were not used. Other integration files, live-provider checks and live deployment gates were NOT RUN.

## FATS regressions and remaining failures

FAIL — full unchanged unit suite, `pnpm exec vitest run`: 304 passed, 5 failed (309 tests). Failures included constrained document-processing contention/timeouts and a comparison-plan source hash mismatch.

FAIL — diagnostic full serial run, `pnpm exec vitest run --maxWorkers=1`: 308 passed, 1 failed. The remaining `matching-comparison-plan.test.ts:39` assertion expects a different hash for `apps/web/src/server/resume-extraction.ts` than the current committed source provides. The four other failures did not recur serially; the original parallel run remains failed. No hashes, tests, timeouts or source were changed to obtain these results.

FAIL — selected PDF browser suites:

```sh
FATS_TEST_PORT=3116 NEXT_TELEMETRY_DISABLED=1 pnpm exec playwright test --config=playwright.pdf-v2.config.ts quick-sign.spec.ts page-organization.spec.ts page-outputs.spec.ts security.spec.ts --output=/tmp/portfolio-phase2-fats-browser
```

28 passed, 5 failed, 3 skipped, across desktop 1440px and emulated mobile 390px. The failures were one 320px organizer case in the desktop project and four mobile organizer/output cases. All five timed out clicking Undo because `nextjs-portal` development-overlay chrome intercepted pointer events; this is retained as a failed gate, not counted as functional success. The first start was interrupted by a Next.js security-upgrade notice; the unchanged command was retried. No upgrade was performed. The upstream warning remains a follow-up before releasing FATS.

Two security cases were initially skipped because the optional Poppler environment variable was unset; the third skip was the intentionally desktop-only drag case in the mobile project. A subsequent independent-renderer/security run is recorded below.

PASS — independent signature-output and security regressions, 4 passed across desktop and mobile:

```sh
PDF_TOOLS_POPPLER_BIN=/nix/store/63r5wi3sdvwalqcdibpipnyl35swdzzg-poppler-utils-26.06.0/bin FATS_TEST_PORT=3116 NEXT_TELEMETRY_DISABLED=1 pnpm exec playwright test --config=playwright.pdf-v2.config.ts quick-sign.spec.ts security.spec.ts --grep 'real Quick Sign|real encrypted' --output=/tmp/portfolio-phase2-fats-independent
```

The independent run verifies actual typed/drawn signature outputs across crops, rotations and mixed pages, including Poppler rendering/text/geometry checks. Poppler/OpenSSL validate the synthetic security fixtures; the app rejects real encrypted and cryptographically signed inputs without modifying their bytes. The initial attempt recorded 4 connection-refused failures after the Next.js advisory stopped its server; the unchanged retry passed all 4. These passes resolve the two initially skipped security checks, but do not clear the five development-overlay failures or the unit hash assertion.

The FATS checkout was clean before these runs. Generated upstream documentation screenshots were preserved and restored; application source and tests were not modified. The mismatch and overlay failures therefore occur on the same pinned source used for capture, independently of portfolio edits.

## Five synthetic PDF test assets

PASS — installed Poppler 26.06.0 independently opened all five public fixtures with page counts original 3, completed 3, extracted 2, split 1 and split 2. `pdftotext -layout` confirmed all original extractable text remains in the completed copy. `pdftoppm` rendered the original and completed first pages; visual inspection confirmed the added Demo Reviewer artwork. These are reproducible synthetic test assets, not customer documents or evidence of production usage. This sample does not prove every PDF structure, cryptographic signing, or compatibility with every viewer.

## Limits and publication scope

- FATS v2 is a development-only functional candidate. The separate simulated design prototype is excluded from these screenshots and export claims.
- Flow's operations interface is read-only. Its capture does not provide a transaction-editing interface, independent bank closure, compliance certification, uptime or scale evidence.
- Small dashboard labels require manual focus or opening the original screenshot on a phone. Step text, technical annotations and a native text transcript provide the explanation without animation.
- Original images intentionally load eagerly and walkthrough images preload, following the requested stable-resolution behavior. This spends more initial bandwidth than deferred optimized variants. No field Core Web Vitals, Lighthouse score or constrained-network performance measurement is claimed.
- Physical phones, non-Chromium browsers, spoken screen-reader checks and comprehensive accessibility conformance were NOT RUN. Chromium touch/keyboard emulation is not physical-device verification.
- Professional experience and the pre-existing approximate refactor line counts are owner-provided statements; employer code and independent employment verification were unavailable.
- No commit, push, deployment, external publication, résumé change, production database change, or cloud operation was performed.

The portfolio is suitable for employer review with these boundaries visible. FATS' upstream red gates and development-only status prevent an unqualified product-release recommendation. Publishing this portfolio remains subject to the owner's approval; hosted behavior and Analytics delivery still need deployment verification.
