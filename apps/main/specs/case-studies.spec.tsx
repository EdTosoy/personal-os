import { render, screen, within } from '@testing-library/react';
import { CaseStudyPage } from '../src/components/evidence/CaseStudyPage';
import {
  flowStudy,
  fatsStudy,
  hospitalStudy,
  pixshareStudy,
  marcusStudy,
} from '../src/data/case-studies';

describe('Case study pages', () => {
  it.each([
    [
      flowStudy,
      'https://vigil.edtosoy.com',
      '/#projects',
      '/projects/fats-pdf-tools',
    ],
    [
      fatsStudy,
      'https://fats.edtosoy.com',
      '/#projects',
      '/projects/pulse-hospital-devops-platform',
    ],
    [
      hospitalStudy,
      'https://abox.edtosoy.com',
      '/#projects',
      '/projects/pixshare',
    ],
    [
      pixshareStudy,
      'https://pixshare.edtosoy.com',
      '/#projects',
      '/projects/marcus-chess',
    ],
    [
      marcusStudy,
      'https://marcus.edtosoy.com',
      '/?projectsPage=2#projects',
      '/projects/flow-financial-reconciliation',
    ],
  ] as const)(
    'renders $0.slug with its app and navigation links',
    (study, app, back, next) => {
      const { container } = render(<CaseStudyPage study={study} />);
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
        study.name,
      );
      const intro = within(
        container.querySelector('.case-intro') as HTMLElement,
      );
      const live = intro.getByRole('link', { name: /^Live App/ });
      expect(live.getAttribute('href')).toBe(app);
      expect(live.getAttribute('target')).toBe('_blank');
      expect(live.getAttribute('rel')).toBe('noopener noreferrer');
      expect(
        intro.getByRole('link', { name: /^GitHub/ }).getAttribute('href'),
      ).toBe(study.repository);
      expect(
        screen
          .getByRole('link', { name: 'All projects', exact: true })
          .getAttribute('href'),
      ).toBe(back);
      expect(
        screen.getByRole('link', { name: /^Explore / }).getAttribute('href'),
      ).toBe(next);
      for (const link of container.querySelectorAll('.case-jump-links a')) {
        expect(
          container.querySelector(link.getAttribute('href')!),
        ).toBeTruthy();
      }
    },
  );
});
