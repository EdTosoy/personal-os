/** Genuine development Clerk session; mutations are restricted to the disposable local API. */
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import {
  record,
  repo,
  serve,
  ready,
  exec,
  expect,
  receipt,
} from './capture.mjs';
const require = createRequire(repo('PixShare/web/package.json'));
for (const file of [
  repo('PixShare/web/.env.local'),
  repo('PixShare/web/.env.e2e.local'),
])
  process.loadEnvFile(file);
const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (
  !key?.startsWith('pk_test_') ||
  !process.env.CLERK_SECRET_KEY?.startsWith('sk_test_') ||
  !process.env.E2E_USER_EMAIL?.includes('+clerk_test')
)
  throw Error('Existing dedicated Clerk development account required');
const {
  clerkSetup,
  clerk,
  setupClerkTestingToken,
} = require('@clerk/testing/playwright');
// SDK diagnostics can contain session paths, keys or account addresses. Never emit them.
console.warn = () => {
  /* Private Clerk diagnostics intentionally suppressed. */
};
const stamp = 'phase5d-pixshare-auth-' + Date.now(),
  db = stamp + '-db',
  api = stamp + '-api',
  base = 'http://127.0.0.1:33321',
  apiBase = 'http://127.0.0.1:33320';
let networkCreated = false,
  dbCreated = false,
  apiCreated = false,
  server;
async function docker(args) {
  try {
    return (await exec('docker', args)).stdout.trim();
  } catch {
    throw Error(
      'Isolated PixShare auth operation failed; private diagnostics suppressed',
    );
  }
}
try {
  try {
    await Promise.race([
      clerkSetup({ dotenv: false, publishableKey: key }),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(Error('Clerk development setup timed out after 30 seconds')),
          30000,
        ),
      ),
    ]);
  } catch {
    throw Error(
      'Clerk development setup unavailable; no private diagnostics emitted',
    );
  }
  await docker(['network', 'create', stamp]);
  networkCreated = true;
  await docker([
    'run',
    '--pull=never',
    '--detach',
    '--rm',
    '--name',
    db,
    '--network',
    stamp,
    '--network-alias',
    'database',
    '--tmpfs',
    '/var/lib/postgresql',
    '--env',
    'POSTGRES_USER=evidence_admin',
    '--env',
    'POSTGRES_DB=portfolio_pixshare_test',
    '--env',
    'POSTGRES_HOST_AUTH_METHOD=trust',
    'postgres:18',
  ]);
  dbCreated = true;
  await expect
    .poll(
      async () => {
        try {
          await docker([
            'exec',
            db,
            'pg_isready',
            '--username',
            'evidence_admin',
            '--dbname',
            'portfolio_pixshare_test',
          ]);
          return true;
        } catch {
          return false;
        }
      },
      { timeout: 30000 },
    )
    .toBe(true);
  await docker([
    'run',
    '--pull=never',
    '--detach',
    '--rm',
    '--name',
    api,
    '--network',
    stamp,
    '--publish',
    '127.0.0.1:33320:8000',
    '--env',
    'DATABASE_URL=postgresql+asyncpg://evidence_admin@database:5432/portfolio_pixshare_test',
    '--env',
    'ENVIRONMENT=test',
    '--env',
    'CLERK_SECRET_KEY=' + process.env.CLERK_SECRET_KEY,
    '--env',
    'CLERK_PUBLISHABLE_KEY=' + key,
    '--env',
    'CLERK_AUTHORIZED_PARTIES=' + base,
    '--env',
    'CORS_ORIGINS=' + base,
    '--env',
    'UPLOADS_DIR=/app/uploads',
    'pixshare-phase11-api:final',
  ]);
  apiCreated = true;
  await docker(['exec', api, '/app/.venv/bin/alembic', 'upgrade', 'head']);
  await docker(['exec', api, '/app/.venv/bin/python', '-m', 'scripts.seed_db']);
  await ready(apiBase + '/health');
  const build =
    process.env.PIXSHARE_CAPTURE_BUILD || '/tmp/phase5d-pixshare-auth/web';
  server = serve(
    build,
    [
      'node_modules/next/dist/bin/next',
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      '33321',
    ],
    { PIXSHARE_ENVIRONMENT: 'test', NEXT_PUBLIC_API_URL: apiBase },
  );
  await ready(base);
  // Use the same bundled normalized fixture used by the actual release. No user files.
  const fixture = await docker([
    'exec',
    api,
    '/app/.venv/bin/python',
    '-c',
    'import base64;print(base64.b64encode(open("/app/uploads/sample_sunset.jpg","rb").read()).decode())',
  ]);
  const photo = Buffer.from(fixture, 'base64');
  const results = await record({
    name: 'pixshare',
    base,
    mutationOrigins: [apiBase, 'https://' + process.env.CLERK_FAPI],
    prepare: async ({ page }) => {
      try {
        await setupClerkTestingToken({ page });
        await page.goto(base);
        await clerk.signIn({ page, emailAddress: process.env.E2E_USER_EMAIL });
        await expect(page.locator('.cl-userButtonTrigger')).toBeVisible({
          timeout: 30000,
        });
      } catch {
        throw Error(
          'Dedicated development sign-in failed; no credentials or session tokens logged',
        );
      }
    },
    journey: async ({ page, go, snap, beat }) => {
      await go('/');
      await expect(page.locator('.photo-card').first()).toBeVisible();
      await snap('home');
      await beat(
        'Browse the real album with a genuine dedicated Clerk development session.',
      );
      await go('/explore');
      await expect(page.locator('.photo-card')).toHaveCount(3);
      await snap('gallery');
      await beat('Open the public collection of bundled demo photographs.');
      await page.locator('.photo-card').first().click();
      await page.locator('.detail-image img').waitFor();
      await snap('details');
      await beat('Inspect a real image and its metadata.');
      await go('/upload');
      await page.locator('.post-form').waitFor();
      await page.getByLabel('Image', { exact: true }).setInputFiles({
        name: 'synthetic-demo-sunset.jpg',
        mimeType: 'image/jpeg',
        buffer: photo,
      });
      await page
        .getByLabel('Caption', { exact: true })
        .fill('Synthetic portfolio sunset — bundled demonstration photograph');
      await snap('upload');
      await beat(
        'Choose a bundled photograph and enter a fictional caption in the authenticated upload form.',
      );
      const created = page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === '/posts' &&
          r.request().method() === 'POST',
      );
      await page
        .getByRole('button', { name: 'Share image', exact: true })
        .click();
      expect((await created).status()).toBe(201);
      await page.locator('.owner-actions').waitFor();
      await snap('uploaded');
      await beat(
        'Upload to the disposable local API and inspect the persisted owner controls.',
      );
      await page.getByRole('link', { name: 'Edit post', exact: true }).click();
      await page
        .getByLabel('Caption', { exact: true })
        .fill('Synthetic portfolio sunset — caption updated locally');
      await page
        .getByRole('button', { name: 'Save changes', exact: true })
        .click();
      await expect(
        page.getByRole('heading', {
          name: 'Synthetic portfolio sunset — caption updated locally',
          exact: true,
        }),
      ).toBeVisible();
      await page.reload();
      await expect(
        page.getByRole('heading', {
          name: 'Synthetic portfolio sunset — caption updated locally',
          exact: true,
        }),
      ).toBeVisible();
      await snap('updated');
      await beat(
        'Edit the caption and reload to verify persistence through the real API and PostgreSQL.',
      );
      await go('/me');
      await expect(
        page
          .locator('.photo-card')
          .filter({ hasText: 'Synthetic portfolio sunset' })
          .first(),
      ).toBeVisible();
      await snap('management');
      await beat(
        'Review the uploaded photograph in the authenticated personal album.',
      );
    },
  });
  if (!results.every((r) => r.status === 'PASS' && r.errors.length === 0))
    throw Error('Authenticated workflow did not complete');
  await receipt('pixshare-setup', {
    source:
      'Unchanged HEAD frontend rebuilt in /tmp with existing development Clerk configuration; cached release API; real development sign-in ticket; isolated migrated PostgreSQL and bundled photographs. Upload and caption edit occurred only on loopback API.',
    backendImage: 'pixshare-phase11-api:final',
    frontendBuildId: (await readFile(build + '/.next/BUILD_ID', 'utf8')).trim(),
    authentication:
      'Existing dedicated +clerk_test account; no users created or account/profile settings changed. Session tokens, addresses and keys omitted.',
    assertions: { upload201: true, captionPersistedAfterReload: true },
  });
} catch {
  await receipt('pixshare-auth-setup', {
    status: 'BLOCKED',
    reason:
      'Dedicated development configuration exists and unchanged frontend builds successfully, but a genuine Clerk setup/session could not be established within the bounded capture attempt. No authentication bypass, new user, or production write was used.',
  });
  console.log(
    'PixShare authenticated capture BLOCKED; sanitized receipt saved.',
  );
  process.exitCode = 1;
} finally {
  server?.kill();
  if (apiCreated) await docker(['stop', api]);
  if (dbCreated) await docker(['stop', db]);
  if (networkCreated) await docker(['network', 'rm', stamp]);
}
