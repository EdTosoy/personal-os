# Portfolio app

This app contains the portfolio migrated from `EdTosoy/portfolio` at commit
`c4eda17da95d378f322aef79e05af043482821f1`. Runtime code lives in `src/` and
public assets live in `public/`. The Nx workspace and its other apps are preserved.

From the workspace root:

```sh
pnpm install --frozen-lockfile
pnpm nx dev @org/main
pnpm nx build @org/main
pnpm nx lint @org/main
pnpm nx test @org/main --runInBand
pnpm nx run @org/main:typecheck
pnpm nx run @org/main:start --port=3126 --hostname=127.0.0.1
# In another terminal, with the production server ready:
pnpm nx run @org/main:verify-phase5
```

The app includes the homepage, five project case studies, certifications,
expandable timeline, resume, metadata routes, and branding. Security and cache
headers are configured in `next.config.js`. Next.js supports this `src/app` and
`public` layout and response headers:

- https://nextjs.org/docs/app/getting-started/project-structure
- https://nextjs.org/docs/app/api-reference/config/next-config-js/headers

The destination keeps its existing locked framework and dependency versions.
Its Next.js 16.1.7 package does not bundle `dist/docs`; the migration was checked
against the official documentation above and the installed build and runtime.

The editable resume and regeneration instructions are in `resume/`.

Featured projects use native, server-rendered pagination at
`/?projectsPage=2#projects`: four cards per page, two desktop columns, and one
mobile column. Earlier engineering work remains available below the grid. Each
case-study URL works independently. The homepage receives a server-rendered
Projects slot inside the existing client shell. Route-level loading boundaries
are avoided so native pagination and evidence transcripts remain visible without
JavaScript; the former loading view is retained in `components/LoadingState.tsx`.

The browser verification target reuses the locked Next.js Playwright and axe
packages; it adds no dependencies. It expects the existing Chromium executable
at `/etc/profiles/per-user/edtosoy/bin/chromium`, or
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Set `EVIDENCE_BASE_URL` to verify another
local port. Source-reference checks expect the sibling application repositories.
See `../../docs/PHASE5_PROJECT_OVERHAUL.md` for provenance, test results and limits.

PixShare prewarming runs in `components/PixSharePrewarm.tsx`, mounted once in the
root layout. After client hydration it starts a fire-and-forget GET to
`https://pixshare-api-edtosoy.onrender.com/health`. The public health URL is defined
there because this app has no existing PixShare API environment configuration.
It renders nothing and never waits for readiness, changes navigation, or polls.
`no-cors` permits an opaque response without requiring backend CORS changes;
the response is ignored. Credentials and referrer information are omitted,
`no-store` bypasses the browser cache, and `keepalive` lets the browser attempt to
finish the request if the visitor leaves. See the
[Fetch Standard](https://fetch.spec.whatwg.org/) and
[React effect reference](https://react.dev/reference/react/useEffect).

The `sessionStorage` key `pixshare:last-prewarm-at` limits attempts to one per
10 minutes per tab/session, including failed attempts and reloads. An in-memory
timestamp also suppresses Strict Mode replay and remounts when storage is blocked.
After the cooldown, another page load or component mount can try again; leaving
the portfolio open does not schedule another request, and client route changes
preserve the root layout. With storage unavailable, deduplication lasts only for
the current document. Separate tabs can make separate attempts. Browsers may
block or cancel the request, and JavaScript must be enabled. Render still needs
its cold-start time (currently about 50 seconds); this only starts that work
earlier and cannot guarantee PixShare is ready when opened.

To check manually in a browser:

1. Build and start locally using the commands above. Open DevTools on the local
   portfolio, choose Network, enable Preserve log, and filter for
   `pixshare-api-edtosoy.onrender.com/health`.
2. In Console run `sessionStorage.removeItem('pixshare:last-prewarm-at')`, then
   reload. Expect one GET after hydration. The homepage should render and remain
   usable while that request is pending. An opaque response or network failure
   is expected to have no portfolio UI/error-boundary effect.
3. Immediately use a portfolio link to a case study, navigate back, and reload.
   Confirm navigation works and no additional health GET occurs within 10 minutes.
4. To simulate cooldown expiry without waiting, run
   `sessionStorage.setItem('pixshare:last-prewarm-at', String(Date.now() - 600001))`
   and reload. Expect one new health GET. A reload resets the in-memory fallback.
5. For a deterministic failure check, use DevTools request blocking for
   `*pixshare-api-edtosoy.onrender.com/health*`, clear the session key, and reload.
   Confirm the page still renders and case-study navigation works. Remove the
   blocking rule afterward. The browser may report a network error in DevTools;
   the component itself logs nothing and shows no error UI.

Prewarming verification (2026-10-27), from the workspace root with
`NX_DAEMON=false NX_ISOLATE_PLUGINS=false NX_NO_CLOUD=true`:

| Status | Check | Result |
| --- | --- | --- |
| PASS | `pnpm nx run-many -t lint typecheck -p @org/main --parallel=2` | App ESLint and TypeScript. |
| PASS | `pnpm nx test @org/main --runInBand --testPathPatterns=pixshare-prewarm.spec.tsx --outputStyle=stream` | 15 focused tests: client-only request, Strict Mode/remount deduplication, persisted cooldown, expiry, invalid timestamps, blocked storage, failures, and responsive client interactions. |
| PASS | `pnpm nx build @org/main --outputStyle=stream` | Next.js 16.1.7 production build; the existing project-reference warning remains. |
| PASS | Chromium against `pnpm nx run @org/main:start --port=3126 --hostname=127.0.0.1` | Real Next.js client navigation and rendering with health response held pending; reload cooldown/expiry; failed requests at 390px; blocked storage; no JavaScript. Zero page errors or unhandled rejections. Health transport was intercepted, so live Render readiness was not tested. |
| FAIL (pre-existing) | `pnpm nx test @org/main --runInBand --outputStyle=stream` | 32 pass, 1 fails: the unchanged homepage test expects `Previous`, while the existing link reads `Prev`. An untouched HEAD snapshot reproduced the same failure (17 pass, 1 fails). No unrelated pagination files were changed. |

Restricted process-sandbox test/build attempts exited without diagnostic output;
the successful runs used approved local process access. The temporary browser
script and receipt are `/tmp/personal-os-prewarm-browser.mjs` and
`/tmp/personal-os-prewarm-browser-results.json`. These are local verification
artifacts; the manual procedure above is the durable browser check.
