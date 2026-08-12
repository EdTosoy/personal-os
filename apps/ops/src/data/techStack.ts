import { IconType } from 'react-icons';
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiAngular,
  SiNestjs,
  SiNx,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiLinux,
  SiGithubactions,
  SiTerraform,
  SiPrometheus,
  SiGrafana,
  SiTypescript,
  SiPython,
  SiGo,
  SiNeovim,
  SiTmux,
  SiNixos,
  SiNodedotjs,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa6';

export interface TechStackItem {
  name: string;
  icon: IconType;
  href: string;
  color: string;
}

export interface TechStackCategory {
  category: string;
  items: TechStackItem[];
}

// Every technology listed in data/skills.ts + data/projects.ts, deduped, grouped by category.
// Items ordered by popularity/importance within each category.
export const techStack: TechStackCategory[] = [
  {
    category: 'DevOps & Infra',
    items: [
      {
        name: 'Docker',
        icon: SiDocker,
        href: 'https://www.docker.com',
        color: '#2496ED',
      },
      {
        name: 'Kubernetes',
        icon: SiKubernetes,
        href: 'https://kubernetes.io',
        color: '#326CE5',
      },
      {
        name: 'AWS',
        icon: FaAws,
        href: 'https://aws.amazon.com',
        color: '#FF9900',
      },
      {
        name: 'Git',
        icon: SiGit,
        href: 'https://git-scm.com',
        color: '#F05032',
      },
      {
        name: 'Linux',
        icon: SiLinux,
        href: 'https://www.linux.org',
        color: '#FCC624',
      },
      {
        name: 'GitHub Actions',
        icon: SiGithubactions,
        href: 'https://github.com/features/actions',
        color: '#2088FF',
      },
      {
        name: 'Terraform',
        icon: SiTerraform,
        href: 'https://www.terraform.io',
        color: '#7B42BC',
      },
      {
        name: 'Prometheus',
        icon: SiPrometheus,
        href: 'https://prometheus.io',
        color: '#E6522C',
      },
      {
        name: 'Grafana',
        icon: SiGrafana,
        href: 'https://grafana.com',
        color: '#F46800',
      },
    ],
  },
  {
    category: 'Programming Languages',
    items: [
      {
        name: 'TypeScript',
        icon: SiTypescript,
        href: 'https://www.typescriptlang.org',
        color: '#3178C6',
      },
      {
        name: 'Python',
        icon: SiPython,
        href: 'https://www.python.org',
        color: '#FFD43B',
      },
      { name: 'Go', icon: SiGo, href: 'https://go.dev', color: '#00ADD8' },
    ],
  },
  {
    category: 'Web Development',
    items: [
      {
        name: 'React',
        icon: SiReact,
        href: 'https://react.dev',
        color: '#61DAFB',
      },
      {
        name: 'Next.js',
        icon: SiNextdotjs,
        href: 'https://nextjs.org',
        color: '#0d1117',
      },
      {
        name: 'Tailwind CSS',
        icon: SiTailwindcss,
        href: 'https://tailwindcss.com',
        color: '#06B6D4',
      },
      {
        name: 'Node.js',
        icon: SiNodedotjs,
        href: 'https://nodejs.org',
        color: '#5FA04E',
      },
      {
        name: 'NestJS',
        icon: SiNestjs,
        href: 'https://nestjs.com',
        color: '#E0234E',
      },
      {
        name: 'Angular',
        icon: SiAngular,
        href: 'https://angular.dev',
        color: '#DD0031',
      },
      {
        name: 'PostgreSQL',
        icon: SiPostgresql,
        href: 'https://www.postgresql.org',
        color: '#4169E1',
      },
      {
        name: 'MongoDB',
        icon: SiMongodb,
        href: 'https://www.mongodb.com',
        color: '#47A248',
      },

      { name: 'Nx', icon: SiNx, href: 'https://nx.dev', color: '#143055' },
    ],
  },
  {
    category: 'Systems & Tooling',
    items: [
      {
        name: 'Neovim',
        icon: SiNeovim,
        href: 'https://neovim.io',
        color: '#57A143',
      },
      {
        name: 'tmux',
        icon: SiTmux,
        href: 'https://github.com/tmux/tmux',
        color: '#1BB91F',
      },
      {
        name: 'NixOS',
        icon: SiNixos,
        href: 'https://nixos.org',
        color: '#5277C3',
      },
    ],
  },
];
