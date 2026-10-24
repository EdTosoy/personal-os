import { render, screen } from '@testing-library/react';
import Page from '../src/app/(home)/page';
import { MenuProvider } from '../src/context/MenuContext';

describe('Portfolio homepage', () => {
  it('renders the migrated homepage with its primary links and sections', () => {
    render(
      <MenuProvider>
        <Page />
      </MenuProvider>,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Edberto Tosoy');
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'View projects', exact: true }).getAttribute('href')).toBe('#projects');
    expect(screen.getByRole('link', { name: 'Resume', exact: true }).getAttribute('href')).toBe('/Edberto_Tosoy_Resume.pdf');
    expect(screen.getByRole('heading', { name: 'Certifications', exact: true })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /View Case Study/ })).toHaveLength(4);
    expect(screen.getByRole('button', { name: /^Show \d+ earlier milestones$/ }).getAttribute('aria-expanded')).toBe('false');
  });
});
