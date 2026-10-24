# Editable portfolio résumé

`Edberto_Tosoy_Resume.html` is the editable source for the portfolio's primary PDF. Edit this file and regenerate; do not patch PDF bytes.

This local edition is derived from the owner's [Google Docs master résumé](https://docs.google.com/document/d/15tiaezXpwWVVExVQc_xWVQst8tcbqJFWbMEukHqQ-nw/edit), inspected on October 23, 2026, and reconciled with the previously downloadable PDF, portfolio content, and verified case studies. The Google Docs master had contact and education placeholders and differed from the public PDF. The public PDF's institution, graduation month, phone, and employment details were retained as owner-provided evidence. No new employment or project dates were inferred.

The task requested local implementation. The cloud master is therefore an upstream reference and remains unchanged; this local editable edition is the source of truth for this repository's PDF. It is not claimed that the older PDF was originally generated from this particular Google Docs revision. Copying the final wording back to Google Docs requires explicit authorization for that external write.

Generate the PDF from `apps/main`:

```sh
PLAYWRIGHT_PROJECT=/absolute/path/to/existing-playwright-project node scripts/build-resume.mjs
```

The script reuses the existing sibling Flow Playwright installation and system Chromium, with its sandbox enabled. Set `PLAYWRIGHT_PROJECT` to another existing Playwright project and `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if needed. No package or browser is installed. The source uses system fonts, semantic headings, a single column, selectable text, and real link annotations. The renderer performs no external requests. PDF pagination, extraction, link annotations, and visual output are checked separately during verification.

Output: `public/Edberto_Tosoy_Resume.pdf`, served through the existing hero and contact links. The public PDF and editable HTML were migrated together from portfolio commit `c4eda17da95d378f322aef79e05af043482821f1`.
