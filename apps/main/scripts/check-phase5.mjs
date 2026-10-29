/** Local Phase 5 verification. Reuses the existing Playwright, TypeScript and axe installations. */
import assert from 'node:assert/strict';
import { checkViewer } from './check-viewer.mjs';
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const projectRequire = createRequire(resolve('package.json'));
const nextRequire = createRequire(projectRequire.resolve('next/package.json'));
const { chromium, expect } = nextRequire('@playwright/test');
const ts = projectRequire('typescript');
const base = process.env.EVIDENCE_BASE_URL || 'http://127.0.0.1:3126';
const out = resolve(process.env.EVIDENCE_OUTPUT || '../../docs/phase5/after');
const axe = await readFile(nextRequire.resolve('axe-core/axe.min.js'), 'utf8');
await mkdir(out, { recursive: true });
async function evaluate(path, dependencies = {}) {
  const { outputText } = ts.transpileModule(await readFile(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const fixtureModule = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(
    (name) => dependencies[name] || projectRequire(name),
    fixtureModule,
    fixtureModule.exports,
  );
  return fixtureModule.exports;
}
const { paginate } = await evaluate('src/lib/pagination.ts');
const { projects } = await evaluate('src/data/projects.ts', {
  './fats-vigil-access': await evaluate('src/data/fats-vigil-access.ts'),
});
const { flowStudy, fatsStudy, hospitalStudy, pixshareStudy, marcusStudy } =
  await evaluate('src/data/case-studies.ts');
const studies = [
  flowStudy,
  fatsStudy,
  hospitalStudy,
  pixshareStudy,
  marcusStudy,
];
const expected = projects.filter((project) => project.featured);
assert.deepEqual(
  expected.map((project) => project.slug),
  [
    'vigil-financial-reconciliation',
    'fats-job-application-platform',
    'pulse-hospital-devops-platform',
    'pixshare',
    'marcus-chess',
  ],
);
assert.ok(
  projects.some((project) => project.slug === 'nestjs-microservices-platform'),
);
const pagination = [];
for (const count of [0, 1, 4, 5, 8, 9, 17]) {
  const items = Array.from({ length: count }, (_, i) => i);
  const pages = Array.from(
    { length: Math.max(1, Math.ceil(count / 4)) },
    (_, i) => paginate(items, String(i + 1)),
  );
  assert.deepEqual(
    pages.flatMap((page) => page.items),
    items,
  );
  assert.ok(pages.every((page) => page.items.length <= 4));
  assert.equal(paginate(items, '999').page, pages.length);
  for (const input of [
    undefined,
    'bad',
    '-1',
    '0',
    '1.5',
    'Infinity',
    '9e9',
    '99999999999999999999999',
  ])
    assert.equal(paginate(items, input).page, 1);
  pagination.push({ count, pages: pages.length, lossless: true });
}
assert.throws(() => paginate([], '1', 0), RangeError);
const repos = {
  'flow-financial-reconciliation': 'flow',
  'fats-pdf-tools': 'ats',
  'pulse-hospital-devops-platform': 'hospitalProject',
  pixshare: 'PixShare',
  'marcus-chess': 'marcus',
};
const sources = [];
for (const study of studies) {
  for (const item of [...study.architecture, ...study.references]) {
    if (study.sourceBase) {
      const bytes = await readFile(`public${study.sourceBase}${item.path}.txt`);
      assert.ok(bytes.length);
      sources.push({
        study: study.slug,
        path: item.path,
        kind: 'local working-tree snapshot',
        sha256: createHash('sha256').update(bytes).digest('hex'),
      });
    } else {
      execFileSync(
        'git',
        [
          '-C',
          `../../../${repos[study.slug]}`,
          'cat-file',
          '-e',
          `${study.revision}:${item.path}`,
        ],
        { stdio: 'pipe' },
      );
      sources.push({
        study: study.slug,
        path: item.path,
        revision: study.revision,
        exists: true,
      });
    }
  }
}
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    '/etc/profiles/per-user/edtosoy/bin/chromium',
  chromiumSandbox: true,
});
const results = [],
  accessibility = [],
  runtime = [],
  pixels = [],
  features = [];
const { journey, journeyTimelineConfig } = await evaluate(
  'src/data/journey.ts',
);
const { awsAiPractitioner } = await evaluate('src/data/certifications.ts');
async function scan(page, label) {
  await page.evaluate(axe);
  const audit = await page.evaluate(async () => {
    const { violations, incomplete } = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    });
    return {
      violations: violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
      incomplete: incomplete.map((v) => ({
        id: v.id,
        count: v.nodes.length,
        targets: v.nodes.map((n) => n.target),
      })),
    };
  });
  accessibility.push({ label, ...audit });
  assert.deepEqual(audit.violations, [], label);
}
async function decode(page, selector) {
  for (const image of await page.locator(selector).all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((el) => el.decode());
  }
}
async function captureProjects(page, path) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    const section = document.getElementById('projects');
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY - headerHeight - 16,
      behavior: 'instant',
    });
  });
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const clip = await page.locator('#projects').evaluate((section) => {
    const rect = section.getBoundingClientRect();
    return { x: rect.left + window.scrollX, y: rect.top + window.scrollY,
      width: rect.width, height: rect.height };
  });
  // Document clipping preserves the chosen scroll position; element screenshots
  // automatically recenter tall sections beneath the sticky header.
  await page.screenshot({ path, fullPage: true, clip });
}
try {
  for (const width of [390, 768, 1440, 1920])
    for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: 'reduce',
        hasTouch: width === 390,
      });
      await context.addInitScript(
        (value) => localStorage.setItem('theme', value),
        theme,
      );
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      page.on('response', (r) => {
        if (r.status() >= 400)
          errors.push(`HTTP ${r.status()} ${new URL(r.url()).pathname}`);
      });
      assert.equal((await page.goto(base + '/#projects')).status(), 200);
      await decode(page, '.projects-grid img');
      const cards = page.locator('.projects-grid > article');
      assert.deepEqual(
        await cards.evaluateAll((elements) =>
          elements.map((el) => el.dataset.project),
        ),
        expected.slice(0, 4).map((p) => p.slug),
      );
      const bounds = await cards.evaluateAll((elements) =>
        elements.map((el) => {
          const b = el.getBoundingClientRect();
          return { x: b.x, y: b.y, width: b.width, height: b.height };
        }),
      );
      if (width >= 768) {
        assert.ok(bounds[1].x > bounds[0].x);
        assert.equal(bounds[0].y, bounds[1].y);
        assert.equal(bounds[2].y, bounds[3].y);
        assert.ok(bounds[2].y > bounds[0].y);
      } else {
        assert.ok(bounds.every((b) => Math.abs(b.x - bounds[0].x) < 1));
      }
      const featuredImage = new URL(await page
        .locator('[data-project="fats-job-application-platform"] img')
        .getAttribute('src'), base);
      assert.equal(featuredImage.searchParams.get('url') || featuredImage.pathname,
        expected[1].caseStudy.image);

      const nav = page.getByRole('navigation', {
        name: 'Featured project pages',
      });
      await expect(
        nav.getByRole('link', { name: 'Page 1', exact: true }),
      ).toHaveAttribute('aria-current', 'page');
      const gridHeight = await page
        .locator('.projects-grid')
        .evaluate((el) => el.getBoundingClientRect().height);
      await captureProjects(page, `${out}/projects-${width}-${theme}.png`);
      await scan(page, `home-${width}-${theme}`);
      const next = nav.getByRole('link', { name: 'Next', exact: true });
      await next.focus();
      assert.notEqual(
        await next.evaluate((el) => getComputedStyle(el).outlineStyle),
        'none',
      );
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/projectsPage=2#projects$/);
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute(
        'data-project',
        'marcus-chess',
      );
      await decode(page, '.projects-grid img');
      await expect(nav.getByRole('status')).toHaveText('Page 2 of 2');
      const secondHeight = await page
        .locator('.projects-grid')
        .evaluate((el) => el.getBoundingClientRect().height);
      if (width >= 768)
        assert.ok(
          Math.abs(bounds[0].height - secondHeight) < 2,
          `Page 2 must retain one stable card row without an empty second row: ${bounds[0].height}/${secondHeight}`,
        );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      await captureProjects(page, `${out}/page2-${width}-${theme}.png`);
      await scan(page, `page2-${width}-${theme}`);
      await page.goBack();
      await expect(cards).toHaveCount(4);
      await page.goForward();
      await expect(cards).toHaveCount(1);
      await nav.getByRole('link', { name: 'Page 1', exact: true }).click();
      await expect(cards).toHaveCount(4);
      await nav.getByRole('link', { name: 'Page 2', exact: true }).click();
      await expect(cards).toHaveCount(1);
      await nav.getByRole('link', { name: 'Previous', exact: true }).click();
      await expect(cards).toHaveCount(4);
      await page.locator('.older-projects summary').click();
      await expect(
        page.getByRole('heading', {
          name: 'NestJS Microservices Platform',
          exact: true,
        }),
      ).toBeVisible();
      const resume = await context.request.get(
        base + '/Edberto_Tosoy_Resume.pdf',
      );
      assert.equal(resume.status(), 200);
      const manifest = JSON.parse(
        await readFile('resume/build-manifest.json', 'utf8'),
      );
      assert.equal(
        createHash('sha256')
          .update(await resume.body())
          .digest('hex'),
        manifest.pdfSha256,
      );
      assert.equal(
        await page.getByRole('link', { name: /Verify Credential/ }).count(),
        1,
      );
      const badge = page.getByRole('img', {
        name: 'Official AWS Certified AI Practitioner badge',
        exact: true,
      });
      await badge.evaluate((el) => el.decode());
      assert.equal(await badge.evaluate((el) => el.naturalWidth), 600);
      const credential = page.getByRole('link', { name: /Verify Credential/ });
      assert.equal(
        await credential.getAttribute('href'),
        awsAiPractitioner.verificationUrl,
      );
      // Enter keyboard modality: programmatic focus after a pointer click
      // intentionally does not activate the browser's :focus-visible state.
      await page.keyboard.press('Tab');
      await credential.focus();
      assert.equal(
        await credential.evaluate((el) => el.matches(':focus-visible')),
        true,
      );
      assert.notEqual(
        await credential.evaluate((el) => getComputedStyle(el).outlineStyle),
        'none',
      );
      const badgeResponse = await context.request.get(
        base + awsAiPractitioner.badgeImage,
      );
      assert.equal(badgeResponse.status(), 200);
      assert.deepEqual(
        await badgeResponse.body(),
        await readFile('public' + awsAiPractitioner.badgeImage),
      );
      // Exercise Journey in its own settled navigation, independently of the
      // pagination screenshots and their temporary scrolling/capture state.
      await page.goto(base + '/#journey');
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator('#journey'),
        milestones = section.locator('ol > li'),
        toggle = section.getByRole('button');
      assert.equal(await milestones.count(), journey.length);
      await expect(milestones.filter({ visible: true })).toHaveCount(
        journeyTimelineConfig.initialVisibleCount,
      );
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(milestones.filter({ visible: true })).toHaveCount(
        journey.length,
      );
      // Expanding moves the still-focused control below the viewport. Put it
      // back in view before measuring collapse anchoring, as a person would.
      await toggle.evaluate((el) =>
        el.scrollIntoView({ block: 'center', behavior: 'instant' }),
      );
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      const priorTop = await toggle.evaluate(
        (el) => el.getBoundingClientRect().top,
      );
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      const nextTop = await toggle.evaluate(
        (el) => el.getBoundingClientRect().top,
      );
      assert.ok(
        Math.abs(priorTop - nextTop) < 3,
        `Journey collapse control moved from ${priorTop} to ${nextTop} at ${width}px`,
      );
      await expect(milestones.filter({ visible: true })).toHaveCount(
        journeyTimelineConfig.initialVisibleCount,
      );
      features.push({
        width,
        theme,
        journey: true,
        credentialLinkAndBadge: true,
        resumeHash: true,
      });
      results.push({
        kind: 'project-index',
        width,
        theme,
        cardsPerPage: [4, 1],
        columns: width >= 768 ? 2 : 1,
        keyboard: true,
        history: true,
        numbered: true,
        gridHeight,
        secondHeight,
        resume: true,
        olderProject: true,
      });
      if (width === 390 || width === 1440)
        for (const study of studies) {
          assert.equal(
            (await page.goto(base + `/projects/${study.slug}`)).status(),
            200,
          );
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(
            study.name,
          );
          for (const id of [
            'product-title',
            'problem-title',
            'contributions-title',
            'inspection-title',
            'decisions-title',
            'verification-title',
            'limits-title',
            'source-title',
          ])
            assert.equal(await page.locator(`#${id}`).count(), 1);
          await page
            .locator('.evidence-image')
            .first()
            .evaluate((el) => el.decode());
          await page.screenshot({
            path: `${out}/${study.slug}-${width}-${theme}.png`,
            fullPage: true,
          });
          await scan(page, `${study.slug}-${width}-${theme}`);
          for (const step of [
            ...study.steps,
            ...(study.secondaryEvidence?.steps ?? []),
          ]) {
            const response = await context.request.get(base + step.image.src);
            assert.equal(response.status(), 200);
            assert.deepEqual(
              await response.body(),
              await readFile('public' + step.image.src),
            );
          }
          const report = await context.request.get(
            base + '/evidence/phase5-verification.md',
          );
          assert.equal(report.status(), 200);
          for (const link of await page
            .locator('a[href^="/evidence/"]')
            .all()) {
            const href = await link.getAttribute('href');
            assert.equal(
              (await context.request.get(base + href)).status(),
              200,
              href,
            );
          }
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
          );
          await checkViewer({
            page,
            context,
            base,
            study,
            width,
            theme,
            out,
            pixels,
          });
          if (study.slug === 'marcus-chess')
            assert.equal(
              await page
                .getByRole('link', { name: 'Back to projects', exact: true })
                .getAttribute('href'),
              '/?projectsPage=2#projects',
            );
          if (study.slug === 'fats-pdf-tools') {
            await page
              .getByText('PDF Tools: document-processing engineering', {
                exact: true,
              })
              .click();
            const secondary = page.getByRole('region', {
              name: 'FATS — Job Search Companion PDF engineering walkthrough',
            });
            await expect(secondary).toBeVisible();
            await secondary
              .getByRole('button', { name: /02.*Place a signature/ })
              .click();
            await secondary
              .getByRole('button', { name: 'Zoom to evidence', exact: true })
              .click();
            await expect(
              secondary.locator('.evidence-viewport'),
            ).toHaveAttribute('data-focused', 'true');
          }
          results.push({
            kind: 'case-study',
            slug: study.slug,
            width,
            theme,
            sections: true,
            screenshotBytes: true,
            sourceAssets: true,
          });
        }
      assert.deepEqual(errors, [], `${width}/${theme}`);
      runtime.push({ width, theme, errors });
      await context.close();
    }
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 1000 },
    });
    const page = await context.newPage();
      page.setDefaultTimeout(15000);
    await page.goto(base + '/#projects');
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('.projects-grid > article')).toHaveCount(4);
    await page
      .getByRole('navigation', { name: 'Featured project pages' })
      .getByRole('link', { name: 'Next', exact: true })
      .focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.projects-grid > article')).toHaveCount(1);
    await expect(page.locator('[data-project="marcus-chess"]')).toBeVisible();
    for (const study of studies) {
      await page.goto(base + `/projects/${study.slug}`);
      const transcript = page.locator('.case-transcript').first();
      await transcript.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(transcript.locator('ol > li')).toHaveCount(
        study.steps.length,
      );
      await expect(transcript.locator('ol > li').last()).toBeVisible();
    }
    results.push({
      kind: 'no-JavaScript',
      width,
      pagination: true,
      allTranscripts: true,
    });
    await context.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
      page.setDefaultTimeout(15000);
  for (const input of ['bad', '0', '-1', '1.5', '999']) {
    await page.goto(base + `/?projectsPage=${input}#projects`);
    await expect(page.locator('.projects-grid')).toHaveAttribute(
      'data-project-page',
      input === '999' ? '2' : '1',
    );
  }
  await context.close();
  const summary = {
    status: 'PASS',
    pagination,
    sources,
    results,
    accessibility,
    runtime,
    pixels,
    features,
  };
  await writeFile(
    `${out}/results.json`,
    JSON.stringify(summary, null, 2) + '\n',
  );
  console.log(
    JSON.stringify({
      status: 'PASS',
      scenarios: results.length,
      axeScans: accessibility.length,
      pixelComparisons: pixels.length,
      sources: sources.length,
      artifacts: out,
    }),
  );
} finally {
  await browser.close();
}
