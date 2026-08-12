import { SkillCategory } from '@/types';

export const skills: SkillCategory[] = [
  {
    title: 'Cloud & DevOps',
    skills: [
      'AWS',
      'Docker',
      'Kubernetes',
      'Terraform',
      'GitHub Actions',
      'Prometheus',
      'Grafana',
    ],
  },

  {
    title: 'Backend',
    skills: ['Node.js', 'NestJS', 'FastAPI', 'RabbitMQ', 'REST APIs'],
  },

  {
    title: 'Frontend',
    skills: ['Angular', 'React', 'Next.js', 'TypeScript'],
  },

  {
    title: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Prisma', 'Drizzle ORM'],
  },

  {
    title: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'Go'],
  },

  {
    title: 'Systems & Tools',
    skills: ['Linux', 'Git', 'NixOS', 'Neovim'],
  },
];
