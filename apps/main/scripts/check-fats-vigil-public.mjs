/** Read-only anonymous checks. Redirect/login pages never establish application health. */
import { writeFile } from 'node:fs/promises';
const targets = [
  [
    'Vigil',
    'https://vigil.edtosoy.com',
    ['/', '/health/ready', '/reconciliation'],
  ],
  ['FATS', 'https://fats.edtosoy.com', ['/', '/applications', '/api/account']],
  ['FATS protected alias', 'https://fats-edtosoys-projects.vercel.app', ['/']],
  [
    'Vigil GitHub',
    'https://github.com/EdTosoy/vigil',
    ['', '/blob/a479cd7cb896b960c65f2b083673d54c3f8f95a2/README.md'],
  ],
  [
    'FATS GitHub',
    'https://github.com/EdTosoy/FATS',
    [
      '',
      '/blob/918d8eafc7698184cdc439fe9d174c0dc6279fef/docs/FATS_D2_HOSTED_ACCOUNTS_VERIFICATION.md',
    ],
  ],
];
const checks = [];
for (const [project, origin, paths] of targets)
  for (const path of paths) {
    try {
      const response = await fetch(origin + path, {
        redirect: 'manual',
        signal: AbortSignal.timeout(15000),
      });
      const location = response.headers.get('location');
      const body = await response.text();
      const result = {
        project,
        url: origin + path,
        status: response.status,
        redirectOrigin: location ? new URL(location, origin).origin : null,
        brandedApplication:
          response.status === 200 &&
          !project.includes('GitHub') &&
          /Vigil|FATS/.test(body) &&
          /<main[\s>]/.test(body),
        readiness:
          path === '/health/ready' &&
          response.status === 200 &&
          body.includes('"status":"READY"'),
      };
      checks.push(result);
    } catch (error) {
      checks.push({
        project,
        url: origin + path,
        status: null,
        error: error.cause?.code || error.name,
      });
    }
  }
const vigil = checks.filter((r) => r.project === 'Vigil');
const fats = checks.filter((r) => r.project === 'FATS');
const result = {
  checkedAt: new Date().toISOString(),
  publicVerified: {
    vigil:
      vigil.every((r) => r.status === 200) &&
      vigil.some((r) => r.readiness) &&
      vigil.filter((r) => r.brandedApplication).length >= 2,
    fats:
      fats.every((r) => r.status === 200 && !r.redirectOrigin) &&
      fats.filter((r) => r.brandedApplication).length >= 2,
  },
  checks,
};
if (process.env.ACCESS_CHECK_OUTPUT)
  await writeFile(
    process.env.ACCESS_CHECK_OUTPUT,
    JSON.stringify(result, null, 2) + '\n',
  );
console.log(JSON.stringify(result, null, 2));
