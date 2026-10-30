/** Scoped production-browser checks using the portfolio's installed Playwright/viewer workflow. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { checkViewer } from './check-viewer.mjs';

const req = createRequire(resolve('package.json'));
const next = createRequire(req.resolve('next/package.json'));
const ts = req('typescript');
const { chromium, expect } = next('@playwright/test');
const base = process.env.EVIDENCE_BASE_URL || 'http://127.0.0.1:3126';
await expect
  .poll(
    async () => {
      try {
        return (await fetch(base)).status;
      } catch {
        return 0;
      }
    },
    { timeout: 60000 },
  )
  .toBe(200);
const out = resolve(
  process.env.EVIDENCE_OUTPUT || '/tmp/fats-vigil-verification',
);
await mkdir(out, { recursive: true });
const modules = new Map();
function compile(path, source) {
  if (!source && modules.has(path)) return modules.get(path);
  const text = source || execFileSync('cat', [path], { encoding: 'utf8' });
  const mod = { exports: {} };
  const js = ts.transpileModule(text, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('require', 'module', 'exports', js)(
    (name) =>
      name.startsWith('.')
        ? compile(resolve(dirname(path), name + '.ts'))
        : req(name),
    mod,
    mod.exports,
  );
  if (!source) modules.set(path, mod.exports);
  return mod.exports;
}
const { projects } = compile(resolve('src/data/projects.ts'));
const studies = compile(resolve('src/data/case-studies.ts'));
const baseline = (file) =>
  execFileSync('git', ['show', `HEAD:apps/main/${file}`], { encoding: 'utf8' });
// Unrelated case studies and media retain their original evidence.
const originalStudies = compile(
  resolve('src/data/case-studies.ts'),
  baseline('src/data/case-studies.ts'),
);
for (const name of ['hospitalStudy', 'pixshareStudy', 'marcusStudy'])
  assert.deepEqual(studies[name], originalStudies[name]);
const demos = compile(resolve('src/data/media-refresh.ts')).productDemos;
const oldDemos = compile(
  resolve('src/data/media-refresh.ts'),
  baseline('src/data/media-refresh.ts'),
).productDemos;
for (const slug of [
  'pulse-hospital-devops-platform',
  'pixshare',
  'marcus-chess',
])
  assert.deepEqual(demos[slug], oldDemos[slug]);

const selected = projects.slice(0, 2);
for (const project of selected) {
  assert.ok(project.demo, 'Projects must configure their app URL');
  const study = Object.values(studies).find(
    (s) => project.caseStudy.href === `/projects/${s.slug}`,
  );
  assert.equal(study.repository, project.github);
  for (const item of [...study.architecture, ...study.references])
    execFileSync(
      'git',
      [
        '-C',
        `../../../${project.slug.startsWith('vigil') ? 'flow' : 'ats'}`,
        'cat-file',
        '-e',
        `${study.revision}:${item.path}`,
      ],
      { stdio: 'pipe' },
    );
}

const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    '/etc/profiles/per-user/edtosoy/bin/chromium',
  chromiumSandbox: true,
});
const results = [],
  pixels = [];
const axe = await readFile(next.resolve('axe-core/axe.min.js'), 'utf8');
try {
  for (const width of [390, 1440])
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        colorScheme: theme,
        reducedMotion: 'reduce',
      });
      await context.addInitScript(
        (value) => localStorage.setItem('theme', value),
        theme,
      );
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const errors = [],
        missing = [];
      page.on('pageerror', (error) => errors.push(error.name));
      page.on('response', (response) => {
        if (response.status() >= 400 && new URL(response.url()).origin === base)
          missing.push({
            path: new URL(response.url()).pathname,
            status: response.status(),
          });
      });
      for (const project of selected) {
        const study = Object.values(studies).find(
          (s) => project.caseStudy.href === `/projects/${s.slug}`,
        );
        await page.goto(base + '/#projects');
        const card = page.locator(`[data-project="${project.slug}"]`);
        await expect(card.getByRole('link', { name: /^Live App/ })).toHaveCount(
          0,
        );
        const github = card.getByRole('link', { name: /^Source Code/ });
        await expect(github).toHaveAttribute('href', project.github);
        await expect(github).toHaveAttribute('rel', 'noopener noreferrer');
        await expect(github).toHaveAttribute('target', '_blank');
        const thumbnail = card.locator('.project-evidence-link');
        await expect(thumbnail).toHaveAttribute('href', project.demo);
        await expect(thumbnail).toHaveAttribute('target', '_blank');
        await thumbnail.locator('img').evaluate((el) => el.decode());
        await card.screenshot({
          path: `${out}/${project.slug}-${width}-${theme}.png`,
        });
        await card.getByRole('link', { name: /^View Case Study/ }).focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(base + project.caseStudy.href);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(
          project.title,
        );
        await expect(
          page.getByRole('link', { name: /^Live App/ }),
        ).toHaveAttribute('href', project.demo);
        await expect(
          page.getByRole('link', { name: /^GitHub/ }),
        ).toHaveAttribute('href', project.github);
        for (const item of [
          ...study.steps,
          ...(study.secondaryEvidence?.steps || []),
        ])
          assert.equal(
            (await context.request.get(base + item.image.src)).status(),
            200,
            item.image.src,
          );
        await page
          .getByRole('link', { name: 'Decisions', exact: true })
          .click();
        await expect(page).toHaveURL(/#decisions-title$/);
        await expect(page.locator('#decisions-title')).toBeInViewport();
        await page
          .getByRole('link', { name: 'Walkthrough', exact: true })
          .click();
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
        // Existing gallery links still open the authentic full image securely.
        await expect(
          page
            .locator('.evidence-walkthrough')
            .first()
            .getByRole('link', { name: /Inspect full image/ }),
        ).toHaveAttribute('rel', 'noopener noreferrer');
        const video = page.locator('video');
        await expect(video).toHaveAttribute('preload', 'none');
        await expect(video).toHaveAttribute('controls', '');
        assert.equal(
          (
            await context.request.get(
              base + (await video.getAttribute('poster')),
            )
          ).status(),
          200,
        );
        await video.scrollIntoViewIfNeeded();
        await video.focus();
        await page.keyboard.press('Space');
        await expect
          .poll(() => video.evaluate((v) => v.currentTime), { timeout: 20000 })
          .toBeGreaterThan(0);
        await page.keyboard.press('Space');
        await expect.poll(() => video.evaluate((v) => v.paused)).toBe(true);
        const media = await video.evaluate((v) => ({
          duration: v.duration,
          width: v.videoWidth,
          height: v.videoHeight,
          error: v.error?.code || null,
        }));
        assert.equal(media.error, null);
        assert.equal(media.width, 1440);
        assert.equal(media.height, 1000);
        assert.ok(media.duration > 10 && media.duration < 90);
        await page.evaluate(axe);
        const violations = await page.evaluate(async () =>
          (
            await window.axe.run(document, {
              runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
              },
            })
          ).violations.map((v) => ({
            id: v.id,
            targets: v.nodes.map((n) => n.target),
          })),
        );
        assert.deepEqual(violations, []);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page
          .getByRole('link', { name: 'All projects', exact: true })
          .click();
        await expect(
          page.locator(`[data-project="${project.slug}"]`),
        ).toBeVisible();
        await page
          .locator(`[data-project="${project.slug}"]`)
          .getByRole('link', { name: /^View Case Study/ })
          .click();
        await expect(page).toHaveURL(base + project.caseStudy.href);
        await page
          .locator('.case-footer')
          .getByRole('link', { name: /^Explore/ })
          .click();
        await expect(page).toHaveURL(
          base +
            (project.slug.startsWith('vigil')
              ? '/projects/fats-pdf-tools'
              : '/projects/pulse-hospital-devops-platform'),
        );
        results.push({
          project: project.slug,
          width,
          theme,
          status: 'PASS',
          media,
        });
      }
      // Guard unrelated card behavior without changing it.
      await page.goto(base + '/#projects');
      for (const slug of ['pixshare', 'pulse-hospital-devops-platform']) {
        const project = projects.find((p) => p.slug === slug);
        const card = page.locator(`[data-project="${slug}"]`);
        await expect(card.locator('.project-evidence-link')).toHaveAttribute(
          'href',
          project.demo,
        );
        await expect(
          card.getByRole('link', { name: /^Source Code/ }),
        ).toHaveAttribute('href', project.github);
      }
      await page.goto(base + '/?projectsPage=2#projects');
      await expect(
        page.locator('[data-project="marcus-chess"] .project-evidence-link'),
      ).toHaveAttribute('href', 'https://marcus.edtosoy.com');
      assert.deepEqual(errors, []);
      assert.deepEqual(missing, []);
      await context.close();
    }
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const project of selected) {
    await page.goto(base + project.caseStudy.href);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      project.title,
    );
    await page
      .getByText('Read every walkthrough step as text', { exact: true })
      .click();
    await expect(page.locator('.case-transcript').first()).toContainText(
      'Inspect corresponding screenshot',
    );
    assert.ok((await page.locator('#demo-transcript li').count()) >= 4);
  }
  await context.close();
} finally {
  await browser.close();
  await writeFile(
    `${out}/results.json`,
    JSON.stringify({ results, pixels }, null, 2) + '\n',
  );
}
console.log(
  JSON.stringify({
    scenarios: results.length,
    status: 'PASS',
    unrelatedDataUnchanged: true,
    galleryRegression: true,
    assetChecks: true,
    noJavaScriptTranscripts: true,
  }),
);
