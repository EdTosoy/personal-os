import { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'pulse-hospital-devops-platform',
    title: 'Hospital Management Platform',
    shortDescription:
      'Self-managed Kubernetes deployment of a hospital management system on AWS, built end-to-end with Docker, Terraform, GitHub Actions CI, and Prometheus/Grafana observability.',
    longDescription:
      'A NestJS + Next.js hospital appointment booking app, self-hosted on a Kubernetes cluster on AWS EC2. Infrastructure — VPC, EC2, ECR, IAM — is defined in Terraform, with GitHub Actions building and pushing images to ECR. Postgres runs as a StatefulSet with persistent storage; backend and frontend run as Deployments pulling private images from ECR. Prometheus and Grafana monitor the cluster. Cluster setup is automated via shell scripts.',
    status: 'Actively Maintained',
    featured: true,
    technologies: [
      'Kubernetes',
      'kubeadm',
      'Docker',
      'Terraform',
      'AWS (EC2, ECR, IAM, VPC)',
      'GitHub Actions',
      'Prometheus',
      'Grafana',
      'NestJS',
      'Next.js',
    ],
    github: 'https://github.com/EdTosoy/hospitalProject',
    demo: '',
  },
  {
    slug: 'nestjs-microservices-platform',
    title: 'NestJS Microservices Platform',
    shortDescription:
      'Event-driven e-commerce backend built with NestJS microservices, RabbitMQ, PostgreSQL, and Docker.',
    longDescription:
      'Built an event-driven e-commerce backend using NestJS microservices. Gateway, Authentication, Catalog, Search, and Media services communicate asynchronously through RabbitMQ, with PostgreSQL, Prisma, Docker, and Cloudinary powering the platform.',
    status: 'Completed',
    featured: true,
    technologies: [
      'NestJS',
      'RabbitMQ',
      'PostgreSQL',
      'Prisma',
      'Docker',
      'Cloudinary',
    ],
    github: 'https://github.com/EdTosoy/nestjs-microservices',
    demo: '',
  },
  {
    slug: 'nixos-development-environment',
    title: 'NixOS Development Environment',
    shortDescription:
      'Declarative Linux development environment built with NixOS Flakes, Home Manager, Neovim, and Sway.',
    longDescription:
      'A reproducible NixOS development environment powered by Flakes. Features a modular Neovim setup, Sway, tmux, and developer tooling managed entirely through Nix for consistent, maintainable workflows.',
    status: 'Actively Maintained',
    featured: true,
    technologies: ['NixOS', 'Nix Flakes', 'Linux', 'Neovim', 'tmux'],
    github: 'https://github.com/EdTosoy/my-nixos-setup',
    demo: '',
  },
];
