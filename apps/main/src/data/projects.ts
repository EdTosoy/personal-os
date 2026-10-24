import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "flow-financial-reconciliation",
    caseStudy: {
      href: "/projects/flow-financial-reconciliation",
      image: "/evidence/flow/overview.png",
      alt: "Real Flow dashboard with financial assurance and completeness checks.",
      caption: "Running application · synthetic financial data",
    },
    title: "Flow — Financial Reconciliation System",

    shortDescription:
      "Independent financial reconciliation system with exact-money accounting, deterministic matching, recoverable workers, and a read-only Next.js investigation interface.",

    longDescription:
      "An independent TypeScript, Node.js, and PostgreSQL system with exact-integer money, an immutable double-entry ledger, processor and bank ingestion, deterministic reconciliation, and recoverable workers. A read-only Next.js interface supports operational investigation. Selected unit and PostgreSQL integration suites passed locally against synthetic data. AWS and Terraform infrastructure is source evidence; this case study does not establish a live deployment, compliance, scale, or production readiness.",

    status: "In Progress",
    featured: true,
    github: "https://github.com/EdTosoy/flow",

    technologies: [
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Next.js",
      "Stripe",
      "AWS",
      "ECS Fargate",
      "RDS",
      "Terraform",
      "Docker",
    ],
  },

  {
    slug: "fats-job-application-platform",
    caseStudy: {
      href: "/projects/fats-pdf-tools",
      image: "/evidence/fats/signature.png",
      alt: "FATS PDF Tools development candidate with a signature placed on a synthetic PDF.",
      caption: "PDF Tools v2 · development candidate · real PDF processing",
    },
    title: "FATS — Job Application Platform",

    shortDescription:
      "A Next.js job-search platform with browser-based PDF tools. The showcased v2 candidate performs real PDF processing and remains development-only, with known test failures disclosed.",

    longDescription:
      "An evolving job application management platform built with Next.js, TypeScript, PostgreSQL, and Better Auth. Includes application and interview tracking, account-scoped workspaces, document uploads, and a Chrome extension handoff for job capture. Implements PDF/DOCX extraction, document versioning, consent-gated analysis workflows using the OpenAI Responses API, structured JSON Schema outputs, and evidence validation. Also includes browser-based PDF editing, page extraction, splitting, and merging tools. AI-assisted matching remains disabled by default pending live-model quality and safety evaluation. The platform is under active development, supported by automated unit and browser tests.",

    status: "Actively Maintained",
    featured: true,
    github: "https://github.com/EdTosoy/FATS",

    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Better Auth",
      "OpenAI API",
      "JSON Schema",
      "Tailwind CSS",
      "Playwright",
    ],
  },

  {
    slug: "pulse-hospital-devops-platform",
    caseStudy: {
      href: "/projects/pulse-hospital-devops-platform",
      image: "/evidence/hospital/overview.png",
      alt: "Pulse Medical administration dashboard showing synthetic appointments, patients and queue counts.",
      caption: "Running application · fictional patient records",
    },
    title: "Hospital Management Platform",

    shortDescription:
      "A Next.js and NestJS application for patient scheduling, queues, and billing, with PostgreSQL-backed workflows and infrastructure source for AWS and Kubernetes.",

    longDescription:
      "An independent Next.js, NestJS, and PostgreSQL application covering patient records, appointments, billing, and queue management, with REST APIs, JWT authentication, role-based authorization, and request validation. Captured local workflows use fictional records and five-second polling. Docker, Kubernetes, Terraform, GitHub Actions, monitoring, and Ansible files provide infrastructure source evidence; no live deployment or clinical compliance is established by this showcase.",

    status: "Actively Maintained",
    featured: true,

    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "NestJS",
      "PostgreSQL",
      "Prisma",
      "Docker",
      "Kubernetes",
      "AWS",
      "Terraform",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
      "Ansible",
    ],

    github: "https://github.com/EdTosoy/hospitalProject",
  },

  {
    slug: "pixshare",
    caseStudy: {
      href: "/projects/pixshare",
      image: "/evidence/pixshare/api-overview.png",
      alt: "PixShare’s running FastAPI documentation showing public reads and authenticated media mutation endpoints.",
      caption: "Running API · frontend requires Clerk configuration",
    },
    title: "PixShare",

    shortDescription:
      "Image-management API using FastAPI and PostgreSQL, paired with a Next.js frontend. Backend evidence is available; authenticated frontend workflows still require Clerk configuration.",

    longDescription:
      "A full-stack image management application combining a Next.js frontend with a Python FastAPI backend. Implements authenticated image uploads, listing, editing, and deletion workflows backed by PostgreSQL. Uses asynchronous database access with SQLAlchemy, Alembic migrations, and containerized development environments. The project explores API design, media storage, database modeling, and frontend-backend integration.",

    status: "Actively Maintained",
    featured: true,

    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "Docker",
    ],

    github: "https://github.com/EdTosoy/PixShare",
  },

  {
    slug: "nestjs-microservices-platform",
    title: "NestJS Microservices Platform",

    shortDescription:
      "Event-driven e-commerce backend with independent services, RabbitMQ messaging, and asynchronous search indexing.",

    longDescription:
      "A distributed e-commerce backend composed of authentication, catalog, search, and media services built with NestJS. Uses RabbitMQ for asynchronous communication and event-driven workflows. The search service maintains a denormalized product index synchronized through catalog events. Implements JWT authentication, refresh tokens, role-based authorization, and shared service libraries. PostgreSQL and Prisma handle persistence, while Docker supports local multi-service development.",

    status: "Completed",
    featured: false,

    technologies: [
      "TypeScript",
      "Node.js",
      "NestJS",
      "RabbitMQ",
      "PostgreSQL",
      "Prisma",
      "Docker",
      "Cloudinary",
    ],

    github: "https://github.com/EdTosoy/nestjs-microservices",
  },
];
