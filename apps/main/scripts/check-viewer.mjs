import assert from 'node:assert/strict';
import { checkDimming } from './check-dimming.mjs';

export async function checkViewer({
  page,
  context,
  base,
  study,
  width,
  theme,
  out,
  pixels,
}) {
  const viewer = page.locator('.evidence-walkthrough').first(),
    image = viewer.locator('.evidence-image');
  const zoom = viewer.getByRole('button', {
      name: 'Zoom to evidence',
      exact: true,
    }),
    dim = viewer.getByRole('checkbox', {
      name: 'Dim surroundings',
      exact: true,
    });
  await image.evaluate((el) => el.decode());
  assert.equal(await zoom.isDisabled(), true);
  await page.waitForFunction(
    (urls) =>
      urls.every((url) =>
        performance
          .getEntriesByName(url)
          .some((entry) => entry.responseEnd > 0),
      ),
    study.steps.map((s) => base + s.image.src),
  );
  const additional = [];
  const track = (request) => {
    if (new URL(request.url()).pathname.startsWith('/evidence/'))
      additional.push(request.url());
  };
  page.on('request', track);
  for (let index = 1; index < study.steps.length; index++) {
    await viewer.getByRole('button', { name: 'Next →', exact: true }).click();
    await image.evaluate((el) => el.decode());
    assert.equal(
      await image.evaluate((el) => el.naturalWidth),
      study.steps[index].image.width,
    );
    assert.equal(
      await viewer.locator('.evidence-viewport').getAttribute('data-focused'),
      'false',
    );
    assert.equal(
      await viewer
        .locator('.evidence-camera')
        .evaluate((el) => getComputedStyle(el).transform),
      'none',
    );
    const src = await image.evaluate((el) => el.currentSrc);
    const beforeRequests = additional.length;
    if (study.steps[index].focus) {
      await zoom.click();
      assert.equal(
        await viewer.locator('.evidence-viewport').getAttribute('data-focused'),
        'true',
      );
      const contained = await viewer
        .locator('.evidence-focus')
        .evaluate((el) => {
          const a = el.getBoundingClientRect(),
            b = el.closest('.evidence-viewport').getBoundingClientRect();
          return (
            a.left >= b.left - 2 &&
            a.top >= b.top - 2 &&
            a.right <= b.right + 2 &&
            a.bottom <= b.bottom + 2
          );
        });
      assert.equal(contained, true);
      await dim.check();
      assert.equal(await viewer.locator('.evidence-focus-dim').count(), 1);
      await dim.uncheck();
      await viewer
        .getByRole('button', { name: 'Reset to full view', exact: true })
        .click();
      assert.equal(await dim.isChecked(), false);
      assert.equal(await image.evaluate((el) => el.currentSrc), src);
      assert.equal(
        additional.length,
        beforeRequests,
        'Zoom/reset must not load a replacement image',
      );
    }
  }
  assert.equal(
    await viewer
      .getByRole('button', { name: 'Next →', exact: true })
      .isDisabled(),
    true,
  );
  await viewer.locator('[aria-current="step"]').focus();
  await page.keyboard.press('Home');
  assert.match(
    await viewer.locator('[aria-current="step"]').textContent(),
    /^01/,
  );
  await page.keyboard.press('ArrowRight');
  assert.match(
    await viewer.locator('[aria-current="step"]').textContent(),
    /^02/,
  );
  assert.equal(
    await viewer
      .locator('[aria-current="step"]')
      .evaluate((el) => el === document.activeElement),
    true,
  );
  const viewport = viewer.locator('.evidence-viewport');
  await image.evaluate((el) => el.decode());
  if (theme === 'dark') {
    const before = await viewport.screenshot();
    await dim.check();
    const after = await viewport.screenshot({
      path: `${out}/dim-${study.slug}-${width}.png`,
    });
    pixels.push({
      slug: study.slug,
      width,
      mode: 'full',
      ...(await checkDimming(page, viewer, before, after)),
    });
    await dim.uncheck();
    await zoom.click();
    const zoomBefore = await viewport.screenshot();
    await dim.check();
    const zoomAfter = await viewport.screenshot();
    pixels.push({
      slug: study.slug,
      width,
      mode: 'zoom',
      ...(await checkDimming(page, viewer, zoomBefore, zoomAfter)),
    });
    await viewer
      .getByRole('button', { name: 'Reset to full view', exact: true })
      .click();
  }
  assert.equal(
    await viewer
      .locator('.evidence-camera')
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    '0s',
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  assert.ok(
    parseFloat(
      await viewer
        .locator('.evidence-camera')
        .evaluate((el) => getComputedStyle(el).transitionDuration),
    ) > 0,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const href = await viewer
    .getByRole('link', { name: /Inspect full image/ })
    .getAttribute('href');
  assert.equal((await context.request.get(base + href)).status(), 200);
  page.off('request', track);
}
