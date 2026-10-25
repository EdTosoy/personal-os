/** Compare actual rendered pixels: darken source detail outside, preserve it inside. */
import assert from 'node:assert/strict';
export async function checkDimming(page, viewer, before, after) {
  const region = await viewer.locator('.evidence-focus').evaluate((el) => {
    const a = el.getBoundingClientRect(),
      b = el.closest('.evidence-viewport').getBoundingClientRect(),
      style = getComputedStyle(el);
    const inset =
      Math.ceil(
        Math.max(
          (parseFloat(style.borderLeftWidth) * a.width) /
            parseFloat(style.width),
          (parseFloat(style.borderTopWidth) * a.height) /
            parseFloat(style.height),
        ),
      ) + 2;
    return {
      x: (a.left - b.left) / b.width,
      y: (a.top - b.top) / b.height,
      w: a.width / b.width,
      h: a.height / b.height,
      inset,
    };
  });
  const pixels = await page.evaluate(
    async ({ before, after, region }) => {
      const images = await Promise.all(
        [before, after].map(async (data) => {
          const img = new Image();
          img.src = 'data:image/png;base64,' + data;
          await img.decode();
          return img;
        }),
      );
      const { width, height } = images[0];
      if (images[1].width !== width || images[1].height !== height)
        throw Error('Screenshot dimensions changed');
      const data = images.map((img) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, width, height).data;
      });
      const left = region.x * width,
        right = (region.x + region.w) * width,
        top = region.y * height,
        bottom = (region.y + region.h) * height;
      let outsideBefore = 0,
        outsideAfter = 0,
        outsideCount = 0,
        insideDelta = 0,
        insideCount = 0;
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4,
            a = (data[0][i] + data[0][i + 1] + data[0][i + 2]) / 3,
            b = (data[1][i] + data[1][i + 1] + data[1][i + 2]) / 3;
          if (
            x < left - region.inset ||
            x > right + region.inset ||
            y < top - region.inset ||
            y > bottom + region.inset
          ) {
            // A tinted overlay can brighten near-black pixels; sample visible source detail.
            if (a > 40) {
              outsideBefore += a;
              outsideAfter += b;
              outsideCount++;
            }
          } else if (
            x > left + region.inset &&
            x < right - region.inset &&
            y > top + region.inset &&
            y < bottom - region.inset
          ) {
            insideDelta += Math.abs(a - b);
            insideCount++;
          }
        }
      return {
        outsideRatio: outsideAfter / outsideBefore,
        insideDelta: insideDelta / insideCount,
        outsideCount,
        insideCount,
      };
    },
    {
      before: before.toString('base64'),
      after: after.toString('base64'),
      region,
    },
  );
  assert.ok(
    pixels.outsideCount > 100 && pixels.insideCount > 100,
    'Enough source pixels must be compared',
  );
  assert.ok(
    pixels.outsideRatio < 0.75,
    'Surrounding detail must visibly darken',
  );
  assert.ok(
    pixels.insideDelta < 1,
    'Focused evidence must retain its brightness',
  );
  return pixels;
}
