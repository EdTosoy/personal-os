# Original ET brand assets

The supplied artwork is preserved without regeneration, recoloring, cropping, or
re-encoding. `ET-original.png` is the original 1254×1254 image. `icon-256.png`
and `mstile-150x150.png` are unused source variants kept outside the public assets.
`README.txt` and `site.webmanifest` preserve the supplied instructions/template.

The seven required image files are served from `public/`, with explicit root
layout metadata. `app/favicon.ico` was already removed before installation and
remains absent, avoiding competing file-based favicon metadata and URL conflicts.
The served `public/site.webmanifest` adds `/` as its ID, start URL, and scope so
installing from a case-study page still launches the portfolio homepage. It uses
the supplied 192/512 PNGs with their normal `any` purpose; maskable support and
offline behavior are not claimed.

The supplied `icon-192.png` / `icon-512.png` were identical to the Android PNGs;
`app/ET-Monogram.png` was identical to the original. Those duplicate aliases were
consolidated after byte comparison. `asset-manifest.json` records source paths,
installed paths, sizes, and SHA-256 hashes. The original and unused variants are
not imported by the application or copied into `public/`.

## Verification

The saved local production-browser run at `/tmp/portfolio-et-icons/` passed on
the homepage and all four case studies at 390px and 1440px. It checked icon and
manifest links, canonical/social metadata, image dimensions, and delivery hashes
for all seven public images. Chromium reported no manifest or installability
errors; its saved favicon cache mapped all five pages to `/favicon.ico`. These
results do not establish installation behavior on a physical iOS/Android device
or offline support.

On resumption on October 24, 2026, `npm run lint`,
`./node_modules/.bin/tsc --noEmit`, `git diff --check`, and a fresh SHA-256 check
of all ten provenance entries passed. A fresh `npm run build` failed because
Turbopack could not bind its worker port (`Operation not permitted`), including
the retry with elevated execution. `npm run build -- --webpack` also failed,
reporting that it could not parse TypeScript's `--showConfig` output. The earlier
successful production build and browser results remain saved evidence; no fresh
successful build or browser run is claimed for this resumption. No dependency or
build configuration was changed to work around these failures.

The metadata configuration follows the installed Next.js 16.4.2 documentation in
`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
(`icons` and `manifest` sections). No deployment or Git publication was performed.
