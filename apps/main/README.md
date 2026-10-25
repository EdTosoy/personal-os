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
