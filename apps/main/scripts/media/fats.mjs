import { record, repo, serve, ready, expect } from './capture.mjs';
const cwd = repo('ats/apps/web'),
  base = 'http://127.0.0.1:33301';
const server = serve(
  cwd,
  [
    'node_modules/next/dist/bin/next',
    'start',
    '--hostname',
    '127.0.0.1',
    '--port',
    '33301',
  ],
  {
    DATABASE_URL: '',
    BETTER_AUTH_URL: base,
    BETTER_AUTH_SECRET: '',
    FATS_AI_MATCHING_ENABLED: '0',
    FATS_AI_PROVIDER: '',
    OPENAI_API_KEY: '',
    FATS_PRIVATE_BETA: '0',
  },
);
try {
  await ready(base);
  await record({
    name: 'fats',
    base,
    journey: async ({ page, go, snap, beat }) => {
      await go('/');
      await page
        .getByRole('button', { name: 'Save your first job', exact: true })
        .click();
      const form = page.getByRole('dialog');
      await form.getByLabel(/^Job title/).fill('Graduate Software Engineer');
      await form.getByLabel(/^Company/).fill('Northstar Synthetic Demo');
      await form.getByLabel(/^Location/).fill('Manila · Hybrid');
      await form
        .getByLabel(/^Source URL/)
        .fill('https://example.com/careers/demo');
      await form
        .getByLabel(/^Job description/)
        .fill(
          'Fictional job for portfolio capture. Build accessible interfaces and review TypeScript services. No real job application will be submitted.',
        );
      await form.getByRole('button', { name: 'Save job', exact: true }).click();
      await expect(form).not.toBeVisible();
      await expect(page).toHaveURL(/\/applications\//);
      const detail = new URL(page.url()).pathname;
      await go('/');
      await snap('dashboard');
      await beat(
        'Review the main job-search dashboard with a fictional saved job.',
      );
      await go('/applications');
      await snap('applications');
      await beat('Find the saved job in the application tracker.');
      await page
        .getByRole('link', { name: 'Graduate Software Engineer', exact: true })
        .click();
      await snap('details');
      await beat('Review the job description and application details.');
      await page
        .getByRole('combobox', { name: 'Application status', exact: true })
        .selectOption('Applied');
      await expect(page.getByRole('status')).toHaveText(
        'Status updated to Applied.',
      );
      await page.reload();
      await expect(
        page.getByRole('combobox', { name: 'Application status', exact: true }),
      ).toHaveValue('Applied');
      await snap('updated');
      await beat(
        'Update the application to Applied and verify it persists after reload. This does not submit a job application.',
      );
      await page
        .getByRole('button', { name: 'Schedule interview', exact: true })
        .click();
      const interview = page.getByRole('dialog');
      await interview
        .getByLabel(/^Interview title/)
        .fill('Synthetic technical conversation');
      await interview.getByLabel('Interview stage').selectOption('Technical');
      await interview.getByLabel(/^Date/).fill('2026-11-16');
      await interview.getByLabel(/^Time \(/).fill('10:00');
      await interview.getByLabel(/^Timezone/).fill('Asia/Manila');
      await interview
        .getByLabel('Meeting URL', { exact: true })
        .fill('https://example.com/synthetic-interview');
      await interview
        .getByLabel(/^Preparation notes/)
        .fill(
          'Review the portfolio, accessibility decisions and PostgreSQL transactions. Fictional preparation only.',
        );
      await interview
        .getByRole('button', { name: 'Save interview', exact: true })
        .click();
      await expect(interview).not.toBeVisible();
      await expect(page).toHaveURL(/\/interviews\//);
      await snap('interview-preparation');
      await beat(
        'Schedule a fictional technical interview and inspect its preparation notes.',
      );
      await go('/interviews');
      await snap('interviews');
      await beat('Review interview management.');
      await go('/resumes');
      await snap('resumes');
      await beat(
        'Inspect the resume workspace. Private documents require an account and the safety scanner.',
      );
      await go('/career-vault');
      await snap('career-vault');
      await beat(
        'Inspect Career Vault and its account prerequisite. No employment record or private file is created in this guest recording.',
      );
      await go(detail);
      await page
        .getByRole('combobox', { name: 'Application status', exact: true })
        .selectOption('Offer');
      await expect(page.locator('#offer-desk')).toBeVisible();
      await snap('offers');
      await beat(
        'Inspect the Offer Desk account prerequisite. This guest demonstration does not claim authenticated offer management.',
      );
      await go('/resumes/pdf-tools');
      await snap('pdf-tools');
      await beat(
        'PDF Tools remains secondary to the job-search workflow. AI matching is disabled.',
      );
    },
  });
} finally {
  server.kill();
}
