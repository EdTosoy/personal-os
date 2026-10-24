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
```

The app includes the homepage, four project case studies, certifications,
expandable timeline, resume, metadata routes, and branding. Security and cache
headers are configured in `next.config.js`. Next.js supports this `src/app` and
`public` layout and response headers:

- https://nextjs.org/docs/app/getting-started/project-structure
- https://nextjs.org/docs/app/api-reference/config/next-config-js/headers

The destination keeps its existing locked framework and dependency versions.
Its Next.js 16.1.7 package does not bundle `dist/docs`; the migration was checked
against the official documentation above and the installed build and runtime.

The editable resume and regeneration instructions are in `resume/`.
