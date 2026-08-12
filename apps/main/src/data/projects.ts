import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "pulse-hospital-devops-platform",
    title: "Hospital Management Platform",

    shortDescription:
      "Full-stack hospital management application deployed on AWS with Docker, Kubernetes, Terraform, and GitHub Actions.",

    longDescription:
      "A full-stack hospital management application covering authentication, patients, appointments, billing, and queue management. The application is containerized with Docker and deployed to a self-managed Kubernetes cluster on AWS EC2. AWS infrastructure is provisioned with Terraform, while GitHub Actions uses OIDC to publish container images to ECR and automate application delivery. PostgreSQL runs with persistent Kubernetes storage, with Prometheus and Grafana providing application and infrastructure monitoring.",

    status: "Actively Maintained",
    featured: true,

    technologies: [
      "Next.js",
      "React",
      "NestJS",
      "PostgreSQL",
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
    slug: "nestjs-microservices-platform",
    title: "NestJS Microservices Platform",

    shortDescription:
      "Event-driven e-commerce backend built with NestJS, RabbitMQ, PostgreSQL, Prisma, and Docker.",

    longDescription:
      "An e-commerce backend composed of authentication, catalog, search, and media services built with NestJS. RabbitMQ supports service communication and event-driven workflows, while PostgreSQL and Prisma provide persistence. The Search service maintains a denormalized product index from catalog events, demonstrating asynchronous integration and service-level data ownership. Docker provides isolated development environments across the services.",

    status: "Completed",
    featured: true,

    technologies: [
      "NestJS",
      "RabbitMQ",
      "PostgreSQL",
      "Prisma",
      "Docker",
      "Cloudinary",
    ],

    github: "https://github.com/EdTosoy/nestjs-microservices",
  },
  {
    slug: "pixshare",
    title: "PixShare",

    shortDescription:
      "Full-stack image-sharing platform built to explore application architecture, media handling, and scalable backend workflows.",

    longDescription:
      "A full-stack image-sharing platform focused on building a complete application from the user interface through backend services and data persistence. The project explores authentication, image management, sharing workflows, API design, database modeling, and the infrastructure required to operate a modern web application.",

    status: "Actively Maintained",
    featured: true,

    technologies: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Docker"],

    github: "https://github.com/EdTosoy/PixShare",
  },
];
