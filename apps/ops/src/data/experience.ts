import { Experience } from '@/types';

export const experiences: Experience[] = [
  {
    company: 'Metrobank (via 98Labs Inc.)',

    role: 'Software Engineer',

    period: 'Feb 2021 – Jul 2022',

    location: 'Remote',

    summary:
      'Developed and maintained internal banking applications used by bank tellers and administrative staff in a live production environment.',

    technologies: [
      'React',
      'TypeScript',
      'Redux',
      'Ant Design',
      'React Hook Form',
      'SCSS',
      'REST APIs',
      'Cypress',
    ],

    highlights: [
      {
        description:
          'Developed and maintained internal banking applications used by bank tellers and administrative staff in a live production environment.',
      },
      {
        description:
          'Built transaction workflow features supporting cash deposits, cash withdrawals, and encashment transactions.',
      },
      {
        description:
          'Collaborated with backend engineers across multiple teams to integrate frontend applications with REST APIs.',
      },
      {
        description:
          'Wrote and maintained Cypress end-to-end tests for critical banking workflows.',
      },
      {
        description:
          'Developed reusable UI components with React, TypeScript, Redux, Ant Design, React Hook Form, and SCSS.',
      },
    ],
  },
];
