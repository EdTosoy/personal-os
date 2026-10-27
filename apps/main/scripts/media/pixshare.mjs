import {
  record,
  repo,
  serve,
  ready,
  exec,
  expect,
  receipt,
} from './capture.mjs';
const name = 'phase5d-pixshare-' + Date.now(),
  db = name + '-db',
  api = name + '-api',
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
      'Isolated PixShare Docker operation failed; private diagnostics suppressed.',
    );
  }
}
try {
  await docker(['network', 'create', name]);
  networkCreated = true;
  await docker([
    'run',
    '--pull=never',
    '--detach',
    '--rm',
    '--name',
    db,
    '--network',
    name,
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
  const common = [
    '--network',
    name,
    '--env',
    'DATABASE_URL=postgresql+asyncpg://evidence_admin@database:5432/portfolio_pixshare_test',
    '--env',
    'ENVIRONMENT=test',
    '--env',
    'CLERK_SECRET_KEY=',
    '--env',
    'CLERK_PUBLISHABLE_KEY=',
    '--env',
    'CLERK_JWT_KEY=',
    '--env',
    'CORS_ORIGINS=' + base,
    '--env',
    'UPLOADS_DIR=/app/uploads',
  ];
  await docker([
    'run',
    '--pull=never',
    '--detach',
    '--rm',
    '--name',
    api,
    '--publish',
    '127.0.0.1:33320:8000',
    ...common,
    'pixshare-phase11-api:final',
  ]);
  apiCreated = true;
  await docker(['exec', api, '/app/.venv/bin/alembic', 'upgrade', 'head']);
  await docker(['exec', api, '/app/.venv/bin/python', '-m', 'scripts.seed_db']);
  await ready(apiBase + '/health');
  server = serve(repo('PixShare/web'), ['.next/standalone/server.js'], {
    HOSTNAME: '127.0.0.1',
    PORT: '33321',
  });
  await ready(base);
  await record({
    name: 'pixshare',
    base,
    setup: async (context) => {
      await context.route(
        (url) =>
          url.origin !== new URL(base).origin &&
          (url.pathname === '/posts' ||
            url.pathname.startsWith('/posts/') ||
            url.pathname.startsWith('/uploads/')),
        (route) => {
          const url = new URL(route.request().url());
          return route.continue({ url: apiBase + url.pathname + url.search });
        },
      );
    },
    journey: async ({ page, go, snap, beat }) => {
      await go('/');
      await expect(page.locator('.photo-card').first()).toBeVisible();
      await snap('home');
      await beat(
        'Review a genuine local PixShare album backed by disposable PostgreSQL and bundled demo photographs.',
      );
      await page
        .getByRole('link', { name: 'Explore all images', exact: true })
        .click();
      await expect(page.locator('.photo-card').first()).toBeVisible();
      await snap('gallery');
      await beat('Open the public gallery.');
      await page.locator('.photo-card').first().click();
      await page.locator('.detail-image img').waitFor();
      await snap('details');
      await beat('Open a photograph and read its actual details.');
      await go('/explore');
      await page.getByLabel('Format').selectOption('image/png');
      await expect(page.locator('.photo-card')).toHaveCount(1);
      await snap('filtered');
      await beat('Filter the real persisted photo collection to PNG images.');
      await page.getByLabel('Format').selectOption('');
      await page.getByLabel('Sort by').selectOption('oldest');
      await expect(page.locator('.photo-card')).toHaveCount(3);
      await beat('Restore all formats and change the gallery ordering.');
      await go('/upload');
      await page.locator('.state-panel,form').first().waitFor();
      await snap('upload-prerequisite');
      await beat(
        'Inspect the genuine authentication prerequisite. Fresh authenticated upload is not claimed.',
      );
      await go('/me');
      await page.locator('.state-panel, .photo-card').first().waitFor();
      await snap('management-prerequisite');
      await beat(
        'Inspect the owner-only media workspace prerequisite. No sign-in is mocked.',
      );
    },
  });
  await receipt('pixshare-setup', {
    source:
      'Current standalone frontend and cached release API build, isolated migrated PostgreSQL, original bundled photographs and upstream seed script. Compiled media/API origins forwarded to real local API without response mocks. No external Clerk sessions or production mutations.',
    apiImageId: await docker([
      'image',
      'inspect',
      'pixshare-phase11-api:final',
      '--format',
      '{{.Id}}',
    ]),
    authenticatedCapture:
      'BLOCKED: no authorized local-only Clerk session; retained prior release upload evidence is explicitly historical.',
  });
} finally {
  server?.kill();
  if (apiCreated) await docker(['stop', api]);
  if (dbCreated) await docker(['stop', db]);
  if (networkCreated) await docker(['network', 'rm', name]);
}
