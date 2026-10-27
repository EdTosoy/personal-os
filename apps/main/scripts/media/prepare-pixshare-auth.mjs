/** Build an unchanged temporary source copy with existing development configuration; install nothing. */
import { mkdir, symlink, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';
import { repo } from './capture.mjs';
const build =
  process.env.PIXSHARE_CAPTURE_BUILD || '/tmp/phase5d-pixshare-auth/web';
for (const file of [
  repo('PixShare/web/.env.local'),
  repo('PixShare/web/.env.e2e.local'),
])
  process.loadEnvFile(file);
if (
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_') ||
  !process.env.CLERK_SECRET_KEY?.startsWith('sk_test_') ||
  !process.env.E2E_USER_EMAIL?.includes('+clerk_test')
)
  throw Error('Dedicated development configuration required');
await mkdir(dirname(build));
const archive = execFileSync(
  'git',
  ['-C', repo('PixShare'), 'archive', 'HEAD', 'web'],
  { maxBuffer: 30 * 1024 * 1024 },
);
execFileSync('tar', ['-x', '-C', dirname(build)], { input: archive });
await symlink(repo('PixShare/web/node_modules'), build + '/node_modules');
try {
  execFileSync(
    process.execPath,
    [
      repo('PixShare/web/node_modules/next/dist/bin/next'),
      'build',
      '--webpack',
    ],
    {
      cwd: build,
      env: {
        ...process.env,
        NEXT_PUBLIC_API_URL: 'http://127.0.0.1:33320',
        PIXSHARE_ENVIRONMENT: 'test',
        NEXT_TELEMETRY_DISABLED: '1',
      },
      stdio: 'ignore',
    },
  );
} catch {
  throw Error(
    'Temporary development-auth production build failed; no private diagnostics emitted',
  );
}
console.log(
  JSON.stringify({
    status: 'PASS',
    build,
    buildId: (await readFile(build + '/.next/BUILD_ID', 'utf8')).trim(),
    source: 'Unchanged HEAD; existing dependencies; development keys only',
  }),
);
