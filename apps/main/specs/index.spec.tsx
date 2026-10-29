import { render, screen } from '@testing-library/react';
import Page from '../src/app/(home)/page';
import { MenuProvider } from '../src/context/MenuContext';

async function renderPage(projectsPage?: string) {
  const content = await Page({
    searchParams: Promise.resolve({ projectsPage }),
  });
  return render(<MenuProvider>{content}</MenuProvider>);
}

describe('Portfolio homepage', () => {
  it('keeps the primary links and surrounding features with four first-page projects', async () => {
    const { container } = await renderPage();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Edberto Tosoy',
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(
      screen
        .getByRole('link', { name: 'View projects', exact: true })
        .getAttribute('href'),
    ).toBe('#projects');
    expect(
      screen
        .getByRole('link', { name: 'Resume', exact: true })
        .getAttribute('href'),
    ).toBe('/Edberto_Tosoy_Resume.pdf');
    expect(
      screen.getByRole('heading', { name: 'Certifications', exact: true }),
    ).toBeTruthy();
    expect(
      Array.from(container.querySelectorAll('.projects-grid > article')).map(
        (el) => el.getAttribute('data-project'),
      ),
    ).toEqual([
      'vigil-financial-reconciliation',
      'fats-job-application-platform',
      'pulse-hospital-devops-platform',
      'pixshare',
    ]);
    expect(
      screen.queryByRole('heading', { name: 'Marcus Chess', exact: true }),
    ).toBeNull();
    expect(
      screen
        .getByRole('button', { name: /^Show \d+ earlier milestones$/ })
        .getAttribute('aria-expanded'),
    ).toBe('false');
    expect(
      screen
        .getByRole('link', { name: 'Page 1', exact: true })
        .getAttribute('aria-current'),
    ).toBe('page');
  });

  it('renders Marcus alone on its independently linkable second page and retains older work', async () => {
    const { container } = await renderPage('2');
    expect(container.querySelectorAll('.projects-grid > article')).toHaveLength(
      1,
    );
    const live = screen.getByRole('link', { name: /^Live App\s*:/ });
    expect(live.getAttribute('href')).toBe('https://marcus.edtosoy.com');
    expect(live.getAttribute('target')).toBe('_blank');
    expect(
      container.querySelector('.project-evidence-link')?.getAttribute('href'),
    ).toBe('https://marcus.edtosoy.com');
    expect(
      screen
        .getByRole('link', { name: /^View Case Study\s*:/ })
        .getAttribute('href'),
    ).toBe('/projects/marcus-chess');
    expect(
      screen.getByRole('heading', { name: 'Marcus Chess', exact: true }),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'Page 2', exact: true })
        .getAttribute('aria-current'),
    ).toBe('page');
    expect(
      screen
        .getByRole('link', { name: 'Previous', exact: true })
        .getAttribute('href'),
    ).toBe('?projectsPage=1#projects');
    expect(container.querySelector('.older-projects')?.textContent).toContain(
      'NestJS Microservices Platform',
    );
  });
});
