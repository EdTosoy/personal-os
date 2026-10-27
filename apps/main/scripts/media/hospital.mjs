import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import {
  record,
  repo,
  serve,
  ready,
  exec,
  expect,
  receipt,
} from './capture.mjs';
const cwd = repo('hospitalProject'),
  name = 'phase5d-abox-' + Date.now(),
  db = name + '-db',
  api = name + '-api',
  base = 'http://localhost:33311',
  apiBase = 'http://localhost:33310';
const password = randomBytes(24).toString('base64url'),
  jwt = randomBytes(40).toString('base64url');
let server,
  networkCreated = false,
  dbCreated = false,
  apiCreated = false;
async function docker(args) {
  try {
    return (await exec('docker', args)).stdout.trim();
  } catch {
    throw Error(
      'Isolated hospital Docker operation failed; diagnostic suppressed to protect generated credentials.',
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
    '/var/lib/postgresql/data',
    '--env',
    'POSTGRES_USER=evidence_admin',
    '--env',
    'POSTGRES_DB=portfolio_hospital_test',
    '--env',
    'POSTGRES_HOST_AUTH_METHOD=trust',
    'postgres:17',
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
            'portfolio_hospital_test',
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
    'DATABASE_URL=postgresql://evidence_admin@database:5432/portfolio_hospital_test',
    '--env',
    'JWT_SECRET=' + jwt,
    '--env',
    'SEED_PASSWORD=' + password,
    '--env',
    'NODE_ENV=development',
    '--env',
    'CORS_ORIGIN=' + base,
    '--env',
    'PORT=8080',
  ];
  for (const job of ['migrate', 'seed'])
    await docker([
      'run',
      '--pull=never',
      '--rm',
      ...common,
      'abox-backend:phase3a-check',
      'node',
      `dist/src/database/${job}.js`,
    ]);
  await docker([
    'run',
    '--pull=never',
    '--detach',
    '--rm',
    '--name',
    api,
    '--publish',
    '127.0.0.1:33310:8080',
    ...common,
    'abox-backend:phase3a-check',
  ]);
  apiCreated = true;
  await ready(apiBase + '/health');
  server = serve(
    cwd + '/apps/frontend',
    ['.next/standalone/apps/frontend/server.js'],
    { HOSTNAME: '127.0.0.1', PORT: '33311' },
  );
  await ready(base + '/login');
  await record({
    name: 'hospital',
    base,
    setup: async (context) => {
      // Forward the compiled loopback API origin to our real isolated backend. No response mocks.
      await context.route('http://localhost:3000/**', (route) => {
        const u = new URL(route.request().url());
        return route.continue({ url: apiBase + u.pathname + u.search });
      });
      const headers = { Origin: base };
      const login = await context.request.post(apiBase + '/auth/login', {
        headers,
        data: { email: 'admin@hospital.com', password },
      });
      assert.equal(login.status(), 201);
      const send = async (path, data) => {
        const r = await context.request.post(apiBase + path, { headers, data });
        assert.ok(r.ok());
        return r.json();
      };
      const doctor = (
        await (await context.request.get(apiBase + '/users')).json()
      ).find((u) => u.role === 'DOCTOR');
      for (const [firstName, lastName] of [
        ['Alex', 'Demo'],
        ['Sam', 'Synthetic'],
      ]) {
        const patient = await send('/patients/register', {
          firstName,
          lastName,
          dob: '1995-06-15',
          gender: 'OTHER',
          phone: '555-0100',
          address: 'Fictional portfolio demonstration',
        });
        await send('/appointments', {
          patientId: patient.id,
          doctorId: doctor.id,
          dateTime: '2026-11-16T02:00:00.000Z',
          reason: 'Synthetic demonstration only',
          status: 'CONFIRMED',
        });
        await send('/queue/add-to-queue', {
          patientId: patient.id,
          notes: 'Fictional demo record',
        });
        await send('/billing', {
          patientId: patient.id,
          amount: 1250,
          description: 'Synthetic administrative charge',
          status: 'PENDING',
        });
      }
    },
    journey: async ({ page, go, snap, beat }) => {
      for (const [path, label, heading, text] of [
        [
          '/dashboard',
          'overview',
          'Welcome, ADMIN User',
          'Review the administration dashboard backed by isolated PostgreSQL.',
        ],
        [
          '/dashboard/patients',
          'patients',
          'Patients',
          'Inspect fictional patient records.',
        ],
        [
          '/dashboard/appointment',
          'appointments',
          'Appointments',
          'Review synthetic appointment scheduling.',
        ],
        [
          '/dashboard/queue',
          'queue',
          'Patient Queue',
          'Inspect the patient queue before proceeding to billing.',
        ],
        [
          '/dashboard/billing',
          'billing',
          'Billing',
          'Review a pending synthetic administrative charge.',
        ],
      ]) {
        await go(path);
        await page
          .getByRole('heading', { name: heading, exact: true })
          .waitFor();
        await snap(label);
        await beat(text);
      }
      const bill = page
        .getByRole('article')
        .filter({ hasText: 'Synthetic administrative charge' })
        .filter({
          has: page.getByRole('button', { name: 'Mark paid', exact: true }),
        })
        .first();
      await bill
        .getByRole('button', { name: 'Mark paid', exact: true })
        .click();
      await page
        .getByRole('dialog')
        .getByRole('button', { name: 'Confirm action', exact: true })
        .click();
      await page.getByText('PAID', { exact: false }).first().waitFor();
      await snap('billing-paid');
      await beat('Confirm the payment transition in the actual application.');
      await page.reload();
      await page.getByText('PAID', { exact: false }).first().waitFor();
      await beat(
        'Reload and verify that the PAID state persists in PostgreSQL.',
      );
    },
  });
  await receipt('hospital-setup', {
    source:
      'Unmodified standalone abox frontend, cached Phase 3A backend, real cookie sessions, disposable migrated PostgreSQL 17. Generated credentials excluded.',
    backendImageId: await docker([
      'image',
      'inspect',
      'abox-backend:phase3a-check',
      '--format',
      '{{.Id}}',
    ]),
  });
} finally {
  server?.kill();
  if (apiCreated) await docker(['stop', api]);
  if (dbCreated) await docker(['stop', db]);
  if (networkCreated) await docker(['network', 'rm', name]);
}
