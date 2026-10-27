/** Phase 5D browser checks, complementary to the preserved complete Phase 5 regression. */
import assert from 'node:assert/strict';
import { checkViewer } from './check-viewer.mjs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const req = createRequire(resolve('package.json')),
  next = createRequire(req.resolve('next/package.json'));
const { chromium, expect } = next('@playwright/test');
const base = process.env.EVIDENCE_BASE_URL || 'http://127.0.0.1:3126';
const out = resolve(
  process.env.EVIDENCE_OUTPUT || '../../docs/phase5d/verification',
);
await mkdir(out, { recursive: true });
const slugs = [
  'flow-financial-reconciliation',
  'fats-pdf-tools',
  'pulse-hospital-devops-platform',
  'pixshare',
  'marcus-chess',
];
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    '/etc/profiles/per-user/edtosoy/bin/chromium',
  chromiumSandbox: true,
});
const ts = req('typescript');
const compiled = ts.transpileModule(
  await readFile('src/data/case-studies.ts', 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const mod = { exports: {} };
new Function('require', 'module', 'exports', compiled)(req, mod, mod.exports);
const studies = Object.values(mod.exports);
const axe = await readFile(next.resolve('axe-core/axe.min.js'), 'utf8');
const results = [],
  accessibility = [],
  pixels = [];
async function scan(page, label) {
  await page.evaluate(axe);
  const audit = await page.evaluate(async () => {
    const { violations, incomplete } = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    });
    return {
      violations: violations.map((x) => ({
        id: x.id,
        impact: x.impact,
        targets: x.nodes.map((n) => n.target),
      })),
      incomplete: incomplete.map((x) => ({ id: x.id, count: x.nodes.length })),
    };
  });
  accessibility.push({ label, ...audit });
  assert.deepEqual(audit.violations, []);
}

try {
  for (const width of [390, 1440])
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: 'reduce',
        colorScheme: theme,
      });
      await context.addInitScript(
        (value) => localStorage.setItem('theme', value),
        theme,
      );
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on('pageerror', () => errors.push('pageerror'));
      for (const slug of slugs) {
        const requests = [];
        const listener = (r) => {
          if (new URL(r.url()).pathname.endsWith('.mp4'))
            requests.push(r.url());
        };
        page.on('request', listener);
        await page.goto(`${base}/projects/${slug}`, {
          waitUntil: 'networkidle',
        });
        const video = page.locator('video');
        await expect(video).toHaveCount(1);
        assert.equal(await video.getAttribute('preload'), 'none');
        assert.equal(await video.getAttribute('autoplay'), null);
        assert.equal(await video.getAttribute('loop'), null);
        assert.notEqual(await video.getAttribute('controls'), null);
        assert.deepEqual(
          requests,
          [],
          'No video payload may download before user playback',
        );
        const poster = await video.getAttribute('poster');
        assert.equal((await context.request.get(base + poster)).status(), 200);
        await video.scrollIntoViewIfNeeded();
        await video.focus();
        await expect(video).toBeFocused();
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
        assert.ok(media.duration > 0);
        assert.equal(media.width, 1440);
        assert.equal(media.height, 1000);
        assert.equal(media.error, null);
        assert.ok((await page.locator('#demo-transcript li').count()) >= 4);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await scan(page, `${slug}-${width}-${theme}`);
        await checkViewer({
          page,
          context,
          base,
          study: studies.find((s) => s.slug === slug),
          width,
          theme,
          out,
          pixels,
        });
        await page.screenshot({
          path: `${out}/demo-${slug}-${width}-${theme}.png`,
        });
        // Prove the same transcript and poster remain useful when playback is unavailable.
        await page.route('**/demo.mp4', (route) => route.abort());
        await page.reload({ waitUntil: 'networkidle' });
        await expect(page.locator('#demo-transcript')).toContainText(
          'Recording transcript',
        );
        assert.equal(
          await page.locator('video').getAttribute('poster'),
          poster,
        );
        await page.unroute('**/demo.mp4');
        page.off('request', listener);
        results.push({
          width,
          slug,
          theme,
          status: 'PASS',
          noEagerVideo: true,
          keyboardPlaybackAndPause: true,
          posterFallback: true,
          transcript: true,
          media,
        });
      }
      await page.goto(base + '/?projectsPage=2#projects');
      const marcus = page.locator('[data-project="marcus-chess"]');
      const live = marcus.getByRole('link', { name: /^Live App/ });
      await expect(live).toHaveAttribute('href', 'https://marcus.edtosoy.com');
      await expect(live).toHaveAttribute('target', '_blank');
      await expect(marcus.locator('.project-evidence-link')).toHaveAttribute(
        'href',
        'https://marcus.edtosoy.com',
      );
      await expect(
        marcus.getByRole('link', { name: /^View Case Study/ }),
      ).toHaveAttribute('href', '/projects/marcus-chess');
      await live.focus();
      assert.notEqual(
        await live.evaluate((el) => getComputedStyle(el).outlineStyle),
        'none',
      );
      await page.goto(base + '/#projects');
      await expect(page.locator('.projects-grid > article')).toHaveCount(4);
      await expect(
        page.locator('[data-project="pixshare"] .project-evidence-link'),
      ).toHaveAttribute('href', '/projects/pixshare');
      assert.equal(await page.locator('a a, a button, button a').count(), 0);
      await expect(page.locator('[data-project="pixshare"]')).toContainText(
        'gallery unavailable',
      );
      const nav = page.getByRole('navigation', {
        name: 'Featured project pages',
      });
      await nav.getByRole('link', { name: 'Page 2', exact: true }).click();
      await expect(page.locator('.projects-grid > article')).toHaveCount(1);
      await page.goBack();
      await expect(page.locator('.projects-grid > article')).toHaveCount(4);
      await page.goForward();
      await expect(page.locator('.projects-grid > article')).toHaveCount(1);
      await page.goto(base + '/?projectsPage=bad#projects');
      await expect(page.locator('.projects-grid > article')).toHaveCount(4);
      const bounds = await page
        .locator('.projects-grid > article')
        .evaluateAll((xs) =>
          xs.map((x) => {
            const b = x.getBoundingClientRect();
            return { x: b.x, y: b.y };
          }),
        );
      assert.equal(bounds[0].y === bounds[1].y, width >= 768);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      await scan(page, `home-${width}-${theme}`);
      for (const image of await page.locator('.projects-grid img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((el) => el.decode());
      }
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement)
          document.activeElement.blur();
        const section = document.querySelector('#projects');
        window.scrollTo({
          top:
            section.getBoundingClientRect().top +
            scrollY -
            (document.querySelector('header')?.getBoundingClientRect().height ||
              0) -
            16,
          behavior: 'instant',
        });
      });
      const clip = await page.locator('#projects').evaluate((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.x + scrollX,
          y: r.y + scrollY,
          width: r.width,
          height: r.height,
        };
      });
      await page.screenshot({
        fullPage: true,
        clip,
        path: `${out}/projects-${width}-${theme}.png`,
      });
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
      await expect(
        page.getByRole('link', { name: /Verify Credential/ }),
      ).toHaveAttribute('href', /credly/);
      const journey = page.locator('#journey button[aria-expanded]');
      await journey.click();
      await expect(journey).toHaveAttribute('aria-expanded', 'true');
      await journey.click();
      await expect(journey).toHaveAttribute('aria-expanded', 'false');
      assert.ok((await page.locator('a[href^="mailto:"]').count()) > 0);
      assert.ok((await page.locator('#contact').count()) > 0);
      assert.deepEqual(errors, []);
      await context.close();
    }
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const textPage = await nojs.newPage();
  textPage.setDefaultTimeout(15000);
  for (const slug of slugs) {
    await textPage.goto(`${base}/projects/${slug}`);
    assert.ok((await textPage.locator('#demo-transcript li').count()) >= 4);
    await textPage
      .getByText('Read every walkthrough step as text', { exact: true })
      .click();
    assert.ok(
      (await textPage.locator('.case-transcript[open] li').count()) > 0,
    );
  }
  await nojs.close();
  await writeFile(
    `${out}/media-results.json`,
    JSON.stringify(
      {
        status: 'PASS',
        results,
        accessibility,
        pixels,
        noJavaScriptTranscripts: 5,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    JSON.stringify({
      status: 'PASS',
      scenarios: results.length,
      axeScans: accessibility.length,
      pixelComparisons: pixels.length,
      keyboardPlayback: true,
      noEagerVideo: true,
    }),
  );
} finally {
  await browser.close();
}
