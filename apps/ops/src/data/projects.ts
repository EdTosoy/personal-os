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
    coverImage: '/images/projects/pulse-devops.png',
    lessonsLearned: [
      "Multi-stage Docker builds and pnpm's monorepo symlink structure require understanding exactly where a package manager places real files versus symlinks — not just trusting the build to 'just work.'",
      "OIDC trust between GitHub Actions and AWS eliminates long-lived credentials, but GitHub's ID-based subject claims (owner@id/repo@id) can silently break trust policies written for the plain-name format most docs show.",
      'Self-managed Kubernetes (kubeadm) requires explicitly installing a StorageClass — unlike EKS, nothing provisions persistent storage automatically.',
      'Cost-conscious infrastructure design (single NodePort-exposed node, no NAT/ALB/RDS) is a legitimate architectural choice for a demo-toggle workflow, not just a compromise.',
    ],
    challenges: [
      "Diagnosed and fixed a missing Prisma-generated client after switching to pnpm's trimmed `deploy` output, which excludes gitignored build artifacts like `dist/` by default.",
      'Debugged a GitHub Actions OIDC authentication failure down to the exact JWT claim format by decoding the token in a temporary workflow step.',
      'Resolved Grafana OOMKills by right-sizing memory limits after an EC2 instance resize (t3.small → t3.medium).',
    ],
    futureImprovements: [
      'Automate cluster bootstrap with Ansible and Ansible Vault for secrets, replacing the current shell scripts.',
      'Extend GitHub Actions with a CD stage that rolls out new images via kubectl automatically.',
      'Move Terraform state to a remote S3 + DynamoDB backend to fully automate the EC2 IP → GitHub variable handoff.',
      'Add application-level Prometheus metrics for backend/frontend-specific observability.',
    ],
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
    coverImage: '/images/projects/devops.png',
    lessonsLearned: [
      'Designed services around business domains for better separation of concerns.',
      'Learned the trade-offs of asynchronous communication with RabbitMQ.',
    ],
    challenges: [
      'Implemented authentication across multiple services.',
      'Maintained data consistency across event-driven services.',
    ],
    futureImprovements: [
      'Add OpenTelemetry for distributed tracing.',
      'Deploy to Kubernetes with Helm.',
      'Implement GitHub Actions CI/CD and monitoring.',
    ],
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
    coverImage: '/images/projects/fullstack.png',
    lessonsLearned: [
      'Declarative configuration makes development environments reproducible.',
      'Modular Home Manager configurations improve maintainability.',
    ],
    challenges: [
      'Resolved Home Manager activation conflicts.',
      'Worked around Prisma compatibility issues on NixOS.',
      'Debugged PipeWire audio configuration.',
    ],
    futureImprovements: [
      'Add GitHub Actions to validate flake builds.',
      'Expand reusable Nix modules.',
      'Improve setup documentation.',
    ],
  },
];
