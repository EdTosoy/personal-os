/** Run with --conditions=react-server and the source repository's tsx loader; source is read-only. */
import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import {
  record,
  repo,
  serve,
  ready,
  exec,
  expect,
  output,
  receipt,
} from './capture.mjs';
const cwd = repo('flow');
const { migrate } = await import(cwd + '/tools/migrations.ts');
const { seedDemo } = await import(cwd + '/tools/ops-demo-seed.ts');
const { seedAccount } = await import(cwd + '/apps/ops/server/seed-account.ts');
const { authPool } = await import(cwd + '/apps/ops/server/auth-service.ts');
const { Pool } = createRequire(cwd + '/package.json')('pg');
const name = 'phase5d-vigil-' + Date.now(),
  pools = {};
let server,
  created = false;
try {
  await exec('docker', [
    'run',
    '--pull=never',
    '--detach',
    '--rm',
    '--name',
    name,
    '--publish',
    '127.0.0.1::5432',
    '--env',
    'POSTGRES_USER=evidence_admin',
    '--env',
    'POSTGRES_DB=portfolio_flow_test',
    '--env',
    'POSTGRES_HOST_AUTH_METHOD=trust',
    'postgres:18',
  ]);
  created = true;
  const { stdout } = await exec('docker', ['port', name, '5432/tcp']);
  const url = `postgresql://evidence_admin@127.0.0.1:${stdout.trim().split(':').at(-1)}/portfolio_flow_test`;
  pools.admin = new Pool({ connectionString: url });
  await expect
    .poll(
      async () => {
        try {
          await pools.admin.query('SELECT 1');
          return true;
        } catch {
          return false;
        }
      },
      { timeout: 30000 },
    )
    .toBe(true);
  await migrate(pools.admin);
  const roles = {
    ingestion: 'ingestion_writer',
    processor: 'processor_writer',
    bank: 'bank_writer',
    reconciliation: 'reconciliation_writer',
    exceptions: 'exception_writer',
    controls: 'control_writer',
    worker: 'worker',
    integrity: 'integrity_reader',
    operations: 'operations_reader',
    auth: 'auth_runtime',
    auth_seed: 'auth_seeder',
  };
  for (const [key, role] of Object.entries(roles)) {
    await pools.admin.query(
      `CREATE ROLE evidence_${key} LOGIN IN ROLE flow_${role}`,
    );
    const connectionString = url.replace('evidence_admin@', `evidence_${key}@`);
    pools[key] = key.startsWith('auth')
      ? authPool(connectionString)
      : new Pool({ connectionString });
  }
  const inputs = [];
  await mkdir(output + '/flow-inputs', { recursive: true });
  for (const [i, config] of [
    { seed: 71200, paymentCount: 20, batchSizeRange: [5, 10] },
    {
      seed: 71201,
      paymentCount: 12,
      batchSizeRange: [1, 1],
      anomalies: {
        'missing-bank-transaction': { count: 2 },
        'duplicate-bank-observation': { count: 2 },
        'incorrect-amount': { count: 2 },
      },
    },
  ].entries()) {
    const path = `${output}/flow-inputs/config-${i}.json`,
      out = `${output}/flow-inputs/public-${i}-${Date.now()}`;
    await writeFile(path, JSON.stringify(config));
    await exec(
      process.execPath,
      [
        '--import',
        'tsx',
        'tools/simulator.ts',
        'generate',
        '--config',
        path,
        '--out',
        out,
      ],
      { cwd },
    );
    inputs.push(JSON.parse(await readFile(out + '/input.json', 'utf8')));
  }
  const demo = await seedDemo(pools, inputs, 'phase5d-synthetic-evidence', 2);
  const password = randomBytes(24).toString('hex');
  const email = 'portfolio-demo@vigil.example';
  await seedAccount(pools.auth_seed, {
    email,
    password,
    name: 'Portfolio Demo',
    role: 'Viewer',
    books: [demo.bookId],
  });
  const base = 'http://127.0.0.1:33302';
  server = serve(
    cwd,
    [
      'apps/ops/node_modules/next/dist/bin/next',
      'start',
      'apps/ops',
      '--hostname',
      '127.0.0.1',
      '--port',
      '33302',
    ],
    {
      DATABASE_ADMIN_URL: '',
      DATABASE_AUTH_SEED_URL: '',
      DATABASE_AUTH_URL: url.replace('evidence_admin@', 'evidence_auth@'),
      BETTER_AUTH_URL: base,
      BETTER_AUTH_SECRET: randomBytes(32).toString('hex'),
      VIGIL_DEPLOYMENT_MODE: 'application',
      VIGIL_VISITOR_LOGIN: 'false',
      OPS_BOOK_ID: '',
      DATABASE_OPERATIONS_URL: url.replace(
        'evidence_admin@',
        'evidence_operations@',
      ),
    },
  );
  await ready(base + '/health/ready');
  const query = `?book=${demo.bookId}&evaluation=${demo.evaluationId}`;
  await record({
    name: 'flow',
    base,
    setup: async (context) => {
      // Real authentication before creating the recorded page: no credentials in media.
      const response = await context.request.post(
        base + '/api/auth/sign-in/email',
        {
          headers: { Origin: base },
          data: { email, password, rememberMe: false },
        },
      );
      assert.equal(
        response.status(),
        200,
        'Synthetic Viewer sign-in must succeed',
      );
    },
    journey: async ({ page, go, snap, beat }) => {
      for (const [path, label, text] of [
        [
          '/',
          'overview',
          'Inspect the synthetic financial dashboard and its assurance status.',
        ],
        [
          '/reconciliation',
          'reconciliation',
          'Review actual matched and unmatched reconciliation outcomes.',
        ],
        [
          '/reconciliation/' + demo.reconciliationRunIds[1],
          'settlement-inspection',
          'Open a reconciliation run and inspect settlement and bank evidence.',
        ],
        [
          '/exceptions',
          'exceptions',
          'Inspect discrepancies and operational exceptions.',
        ],
        [
          '/controls',
          'controls',
          'Review independent completeness and assurance controls. UNKNOWN remains distinct from PASS.',
        ],
        [
          '/workers',
          'workers',
          'Inspect processing workers and recoverable delivery state.',
        ],
      ]) {
        await go(path + query);
        assert.equal(
          new URL(page.url()).pathname,
          path,
          'Reject authentication redirects',
        );
        await expect(
          page.getByRole('heading', { name: 'Sign in to Vigil' }),
        ).toHaveCount(0);
        await expect(
          page.getByText('Invalid request', { exact: true }),
        ).toHaveCount(0);
        await snap(label);
        await beat(text);
      }
    },
  });
  await receipt('flow-setup', {
    revision: (await exec('git', ['rev-parse', 'HEAD'], { cwd })).stdout.trim(),
    source:
      'Existing production build, original simulator inputs, isolated migrated PostgreSQL; genuine ingestion and reconciliation pipeline, read-only UI. No UI reconciliation command exists.',
    seeds: [71200, 71201],
  });
} finally {
  server?.kill();
  for (const p of Object.values(pools)) await p.end();
  if (created) await exec('docker', ['stop', name]);
}
