import { record, expect } from './capture.mjs';
const name = process.argv[2];
if (name === 'marcus')
  await record({
    name,
    base: 'https://marcus.edtosoy.com',
    production: true,
    journey: async ({ page, go, snap, beat, size }) => {
      await go('/');
      await page
        .getByRole('button', { name: 'Let’s try it', exact: true })
        .waitFor();
      await snap('lesson');
      await beat(
        'Read the current Is Your Piece Safe? lesson and inspect the threat on the board.',
      );
      await page
        .getByRole('button', { name: 'Let’s try it', exact: true })
        .click();
      await expect(
        page.getByRole('heading', { name: 'Find the threat', exact: true }),
      ).toBeVisible();
      await beat('Start the lesson and identify the attacking piece.');
      await page.getByRole('button', { name: /^d8 / }).click();
      await expect(
        page.getByRole('heading', { name: 'That’s the idea.', exact: true }),
      ).toBeVisible();
      await snap('lesson-feedback');
      await beat(
        'Select the black rook on d8 and read the actual lesson feedback.',
      );
      await go('/learn');
      await snap('practice');
      await beat(
        'Inspect the available adaptive practice and its evidence boundaries.',
      );
      await go('/play');
      await page
        .getByRole('button', { name: 'Start game', exact: true })
        .click();
      await expect(
        page.getByRole('heading', { name: 'Your decision', exact: true }),
      ).toBeVisible({ timeout: 30000 });
      await snap('play-start');
      await beat(
        'Start a new browser-local game against the real Stockfish worker.',
      );
      await page.getByRole('button', { name: /^e2 / }).click();
      await page.getByRole('button', { name: /^e4 / }).click();
      await expect
        .poll(
          () =>
            page.evaluate(
              () =>
                JSON.parse(localStorage.getItem('marcus:games:v1')).active.moves
                  .length,
            ),
          { timeout: 30000 },
        )
        .toBe(2);
      await expect(
        page.getByRole('heading', { name: 'Your decision', exact: true }),
      ).toBeVisible();
      await snap('play');
      await beat('Play e2–e4 and wait for the engine’s legal reply.');
      await page
        .getByRole('button', { name: 'Resign game', exact: true })
        .click();
      await expect(
        page.getByRole('heading', { name: 'You resigned.', exact: true }),
      ).toBeVisible();
      await go('/review');
      await page.getByRole('heading', { name: /^Before / }).waitFor();
      await page
        .getByRole('button', {
          name: 'I looked for opponent threats',
          exact: true,
        })
        .click();
      await snap('review');
      await beat(
        'Resign the demonstration game and inspect a real decision in the coaching workspace. No learning improvement is inferred.',
      );
      await go('/evaluation');
      await snap('evaluation');
      await beat(
        'Inspect locally recorded learning results and their limitations.',
      );
    },
  });
else if (name === 'pixshare')
  await record({
    name: 'pixshare-public',
    base: 'https://pixshare.edtosoy.com',
    production: true,
    journey: async ({ page, go, snap, beat }) => {
      await go('/');
      await expect(
        page.locator('.photo-card, .state-panel').first(),
      ).toBeVisible({ timeout: 45000 });
      await snap('home');
      await beat('Inspect the public deployment.');
      await go('/explore');
      await expect(
        page.locator('.photo-card, .state-panel').first(),
      ).toBeVisible({ timeout: 45000 });
      await snap('gallery');
      await expect(
        page.locator('.photo-card').first(),
        'Public gallery must contain actual loaded images',
      ).toBeVisible({ timeout: 10000 });
      await beat('Inspect gallery availability without mutating production.');
    },
  });
else throw Error('Choose marcus or pixshare');
