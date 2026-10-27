/** Shared authentic evidence recorder. No dependency installation or production writes. */
import { createRequire } from 'node:module';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
export const exec = promisify(execFile);
export const root = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../..',
);
export const output = resolve(
  process.env.CAPTURE_OUTPUT || `${root}/docs/phase5d/captures`,
);
export const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
};
const req = createRequire(`${root}/apps/main/package.json`);
export const { chromium, expect } = createRequire(
  req.resolve('next/package.json'),
)('@playwright/test');
export const repo = (name) =>
  resolve(process.env.SOURCE_ROOT || resolve(root, '..'), name);
export async function receipt(name, value) {
  await mkdir(output, { recursive: true });
  await writeFile(
    `${output}/${name}.json`,
    JSON.stringify(value, null, 2) + '\n',
  );
}
export async function ready(url) {
  await expect
    .poll(
      async () => {
        try {
          return (await fetch(url)).status;
        } catch {
          return 0;
        }
      },
      { timeout: 60000, intervals: [100, 250, 500, 1000] },
    )
    .toBe(200);
}
export function serve(cwd, args, env = {}) {
  return spawn(process.execPath, args, {
    cwd,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', ...env },
    stdio: 'ignore',
  });
}
export async function record({
  name,
  base,
  setup,
  prepare,
  mutationOrigins = [],
  journey,
  production = false,
}) {
  const dir = `${output}/${name}`;
  await mkdir(output, { recursive: true });
  await mkdir(dir);
  const browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
      '/etc/profiles/per-user/edtosoy/bin/chromium',
    chromiumSandbox: true,
  });
  const results = [];
  try {
    for (const [size, viewport] of Object.entries(viewports)) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        locale: 'en-US',
        timezoneId: 'UTC',
        colorScheme: 'light',
        reducedMotion: 'reduce',
        ...(process.env.CAPTURE_VIDEO === '1' && size === 'desktop'
          ? { recordVideo: { dir: `${dir}/original`, size: viewport } }
          : {}),
      });
      // Production and cross-origin services are read-only, including authentication services.
      await context.route('**/*', (route) => {
        const request = route.request(),
          url = new URL(request.url());
        if (
          !['GET', 'HEAD', 'OPTIONS'].includes(request.method()) &&
          (production ||
            (url.origin !== new URL(base).origin &&
              !mutationOrigins.includes(url.origin)))
        )
          return route.abort('blockedbyclient');
        return route.continue();
      });
      const errors = [],
        httpErrors = [],
        screens = [],
        steps = [];
      let page,
        recordingOffsetSeconds = 0;
      try {
        await setup?.(context);
        page = await context.newPage();
        page.setDefaultTimeout(20000);
        const recordingStartedAt = Date.now();
        page.on('pageerror', () => errors.push('Uncaught browser error'));
        page.on('response', (r) => {
          if (r.status() >= 400)
            httpErrors.push({
              path: new URL(r.url()).pathname,
              status: r.status(),
            });
        });
        await prepare?.({ page, context });
        if (prepare)
          recordingOffsetSeconds = (Date.now() - recordingStartedAt) / 1000;
        const go = async (path, selector = 'h1') => {
          const response = await page.goto(new URL(path, base).href, {
            waitUntil: 'domcontentloaded',
          });
          assert.equal(response.status(), 200);
          await page.locator(selector).first().waitFor({ state: 'visible' });
          await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
          await expect(
            page
              .getByRole('status')
              .filter({ hasText: /^(Restoring|Loading)/ }),
          ).toHaveCount(0);
          await page.evaluate(() => document.fonts.ready);
        };
        const snap = async (label, selector = 'main') => {
          await page.locator(selector).first().waitFor({ state: 'visible' });
          await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
          await expect(
            page
              .getByRole('status')
              .filter({ hasText: /^(Restoring|Loading)/ }),
          ).toHaveCount(0);
          await page.evaluate(() => document.fonts.ready);
          for (const img of await page.locator('img:visible').all())
            await img.evaluate((i) => i.decode());
          await page.screenshot({
            path: `${dir}/${label}-${size}.png`,
            animations: 'disabled',
          });
          screens.push({
            file: `${label}-${size}.png`,
            path: new URL(page.url()).pathname,
            viewport,
            overflow: await page.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
          });
        };
        // A deliberate reading beat after readiness is established, never a readiness substitute.
        const beat = async (text) => {
          steps.push(text);
          if (process.env.CAPTURE_VIDEO === '1' && size === 'desktop')
            await new Promise((r) => setTimeout(r, 3000));
        };
        await journey({ page, context, go, snap, beat, size, expect });
        results.push({
          size,
          status: 'PASS',
          recordingOffsetSeconds,
          screens,
          steps,
          errors,
          httpErrors,
        });
      } catch (error) {
        await page
          ?.screenshot({ path: `${dir}/failure-${size}.png` })
          .catch(() => {
            /* A closed page may prevent failure evidence. */
          });
        results.push({
          size,
          status: 'FAIL',
          screens,
          steps,
          errors,
          httpErrors,
          reason: String(error.message)
            .split('\n')
            .slice(0, 3)
            .join(' ')
            .replace(/https?:\/\/[^\s)]+/g, '[URL]'),
        });
      } finally {
        const video = page?.video();
        await context.close();
        if (video)
          await rename(
            await video.path(),
            `${dir}/original/${name}-desktop.webm`,
          );
      }
    }
  } finally {
    await browser.close();
    await receipt(name, {
      capturedAt: new Date().toISOString(),
      base,
      production,
      results,
    });
  }
  console.log(
    JSON.stringify({
      name,
      results: results.map(
        ({ size, status, screens, errors, httpErrors, reason }) => ({
          size,
          status,
          screens: screens.length,
          errors,
          httpErrors,
          reason,
        }),
      ),
    }),
  );
  if (results.some((r) => r.status !== 'PASS' || r.errors.length))
    process.exitCode = 1;
  return results;
}
