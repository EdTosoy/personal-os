/** Run with the source repository's installed tsx loader; source is read-only. */
import { createRequire } from 'node:module';
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
  };
  for (const [key, role] of Object.entries(roles)) {
    await pools.admin.query(
      `CREATE ROLE evidence_${key} LOGIN IN ROLE flow_${role}`,
    );
    pools[key] = new Pool({
      connectionString: url.replace('evidence_admin@', `evidence_${key}@`),
    });
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
      DATABASE_OPERATIONS_URL: url.replace(
        'evidence_admin@',
        'evidence_operations@',
      ),
    },
  );
  await ready(base);
  const query = `?book=${demo.bookId}&evaluation=${demo.evaluationId}`;
  await record({
    name: 'flow',
    base,
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
