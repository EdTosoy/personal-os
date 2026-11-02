# Editable portfolio résumé

The current published portfolio résumé is `public/Edberto_Tosoy_Resume_2026-11-02.pdf`, the one-page final version updated with the toraru CTO apprenticeship. The site's Hero and Contact links both use `profile.resume`. This PDF is imported from the owner's updated résumé rather than built by the legacy HTML renderer.

`Edberto_Tosoy_Resume.html` is the editable source for the older `public/Edberto_Tosoy_Resume.pdf`. Edit and regenerate the HTML only for that legacy PDF; do not patch PDF bytes.

This local edition is derived from the owner's [Google Docs master résumé](https://docs.google.com/document/d/15tiaezXpwWVVExVQc_xWVQst8tcbqJFWbMEukHqQ-nw/edit), inspected on October 23, 2026, and reconciled with the previously downloadable PDF, portfolio content, and verified case studies. The Google Docs master had contact and education placeholders and differed from the public PDF. The public PDF's institution, graduation month, phone, and employment details were retained as owner-provided evidence. No new employment or project dates were inferred.

The task requested local implementation. The cloud master is therefore an upstream reference and remains unchanged; this local editable edition remains the source of truth for the legacy generated PDF. It is not claimed that the older PDF was originally generated from this particular Google Docs revision. Copying the final wording back to Google Docs requires explicit authorization for that external write.

Generate the PDF from `apps/main`:

```sh
PLAYWRIGHT_PROJECT=/absolute/path/to/existing-playwright-project node scripts/build-resume.mjs
```

The script reuses the existing sibling Flow Playwright installation and system Chromium, with its sandbox enabled. Set `PLAYWRIGHT_PROJECT` to another existing Playwright project and `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if needed. No package or browser is installed. The source uses system fonts, semantic headings, a single column, selectable text, and real link annotations. The renderer performs no external requests. PDF pagination, extraction, link annotations, and visual output are checked separately during verification.

Legacy renderer output: `public/Edberto_Tosoy_Resume.pdf`, which is no longer the portfolio's active résumé link. The latest published PDF lives at `public/Edberto_Tosoy_Resume_2026-11-02.pdf`. The public PDF and editable HTML were migrated together from portfolio commit `c4eda17da95d378f322aef79e05af043482821f1`.
