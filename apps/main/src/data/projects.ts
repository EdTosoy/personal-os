import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'vigil-financial-reconciliation',
    demo: 'https://vigil.edtosoy.com',
    caseStudy: {
      href: '/projects/flow-financial-reconciliation',
      image: '/evidence/fats-vigil-20261029/flow/overview-desktop.webp',
      alt: 'Real Vigil dashboard with financial assurance and completeness checks.',
    },
    title: 'Vigil — Financial Reconciliation & Exception System',
    shortDescription:
      'A payment tracking app that compares payment records with bank transactions and helps users find missing payments, fees, and other differences.',
    featured: true,
    github: 'https://github.com/EdTosoy/vigil',
  },
  {
    slug: 'fats-job-application-platform',
    demo: 'https://fats.edtosoy.com',
    caseStudy: {
      href: '/projects/fats-pdf-tools',
      image: '/evidence/fats-vigil-20261029/fats/dashboard-desktop.webp',
      alt: 'FATS guest job-search dashboard with application counts, a saved opportunity and interview planning.',
    },
    title: 'FATS — Friendly Applicant Tracking System',
    shortDescription:
      'A job search organizer that keeps saved jobs, applications, interviews, resumes, and job offers together so users can track their progress.',
    featured: true,
    github: 'https://github.com/EdTosoy/FATS',
  },
  {
    slug: 'pulse-hospital-devops-platform',
    demo: 'https://abox.edtosoy.com',
    caseStudy: {
      href: '/projects/pulse-hospital-devops-platform',
      image: '/evidence/phase5d/hospital/overview-desktop.webp',
      alt: 'Current abox hospital administration dashboard with fictional patients and genuine PostgreSQL-backed workflow counts.',
    },
    title: 'abox — Hospital Management System',
    shortDescription:
      'A hospital management app that helps staff manage patient records, book appointments, track waiting patients, and handle bills and payments.',
    featured: true,
    github: 'https://github.com/EdTosoy/hospitalProject',
  },
  {
    slug: 'pixshare',
    demo: 'https://pixshare.edtosoy.com',
    caseStudy: {
      href: '/projects/pixshare',
      image: '/evidence/phase5d/pixshare/home-desktop.webp',
      alt: 'PixShare photo album in its Atelier theme with real bundled photographs.',
    },
    title: 'PixShare — Online Photo Album',
    shortDescription:
      'A photo album app where users can upload and organize pictures, manage their own photos, and browse galleries on phones, tablets, and computers.',
    featured: true,
    github: 'https://github.com/EdTosoy/PixShare',
  },
  {
    slug: 'marcus-chess',
    demo: 'https://marcus.edtosoy.com',
    title: 'Marcus — Chess Learning Platform',
    shortDescription:
      'A chess learning app where users follow lessons, solve practice exercises, play against a computer, and review the decisions made during a game.',
    featured: true,
    github: 'https://github.com/EdTosoy/marcus',
    caseStudy: {
      href: '/projects/marcus-chess',
      image: '/evidence/phase5d/marcus/lesson-desktop.webp',
      alt: 'Current public Marcus lesson with its chessboard and guided threat explanation.',
    },
  },
  {
    slug: 'nestjs-microservices-platform',
    title: 'NestJS Microservices Platform',
    shortDescription:
      'An online store backend that handles user accounts, product listings, image uploads, and product search through separate services built with NestJS.',
    featured: false,
    github: 'https://github.com/EdTosoy/nestjs-microservices',
  },
];
