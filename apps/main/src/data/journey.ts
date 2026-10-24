import { JourneyItem } from "@/types";

export const journeyTimelineConfig = { initialVisibleCount: 3 };

export const journey: JourneyItem[] = [
  {
    startDate: "2026-09",
    period: "Sep 2026 — Present",
    title: "Gaining firsthand startup experience",
    tasks: [
      {
        description:
          "Began collaborating with an early-stage international startup, gaining exposure to business development, strategic discussions, and the challenges of building a company.",
      },
      {
        description:
          "Contributed to research and preparation for international startup initiatives while learning more about accelerator programs, market expansion, and early-stage business decisions.",
      },
    ],
  },
  {
    startDate: "2026-08",
    period: "Aug 2026",
    title: "Exploring startups and entrepreneurship",
    tasks: [
      {
        description:
          "Began actively pursuing opportunities at early-stage startups through Wellfound, drawn to the opportunity to work closely with founders, take greater ownership, and contribute across engineering and product development.",
      },
      {
        description:
          "Explored entrepreneurship, startup business models, and the process of turning ideas into viable products. Developed a stronger interest in eventually founding a company of my own.",
      },
      {
        description:
          "Started exploring startup literature, including The Lean Startup, and concepts such as validated learning and Build-Measure-Learn.",
        emphasis: "The Lean Startup",
      },
    ],
  },
  {
    startDate: "2025-07",
    period: "Jul 2025 — Present",
    title: "Independent full-stack and backend engineering",
    tasks: [
      // {
      //   description:
      //     "Started experimenting with AI development using Amazon Bedrock, Claude, Google AI, and many other providers, only to discover the classic founder’s challenge: great ideas, but limited resources.",
      // },
      // {
      //   description:
      //     "Expanded my skill set by learning n8n, data structures & algorithms, Go, and Arch Linux while continuously building projects.",
      // },
      {
        description:
          "Completely rebuilt my development environment on NixOS, switched to the Dvorak keyboard layout, moved to Neovim, and built a keyboard-driven workstation.",
      },
      {
        description:
          "Built a strong DevOps foundation with Docker, CI/CD, Terraform, AWS, Prometheus, Grafana, and Kubernetes basics.",
      },
      {
        description:
          "Expanded my independent projects with NestJS, Nx monorepos, RabbitMQ, event-driven architecture, and backend services.",
      },
    ],
  },
  {
    startDate: "2021-09",
    period: "Sep 2021 — Jun 2025",
    title: "College and continued engineering learning",
    tasks: [
      {
        description:
          "Completed a Bachelor of Science in Information Technology at FEU Roosevelt Marikina in June 2025.",
      },
      {
        description:
          "Joined an IT organization, traveled, attended startup and tech events, and read books that reshaped my perspective.",
      },
      {
        description:
          "Deepened my understanding of computer networking by learning DNS, HTTP/HTTPS, subnetting, firewalls, ACLs, load balancing, Nginx, reverse proxies, and VPNs.",
      },
      // {
      //   description:
      //     "Applied everything I learned by building our capstone project with React, Redux Toolkit, Socket.IO, i18next, and Cloudinary.",
      // },
    ],
  },
  {
    startDate: "2021-02",
    period: "Feb 2021 — Jul 2022",
    title: "First commercial software engineering role",
    tasks: [
      {
        description:
          "Worked as a Software Engineer at Metrobank (via 98Labs Inc.) while continuing college through remote work.",
      },
      {
        description:
          "Worked across multiple teams, integrating front-end applications with REST APIs and maintaining end-to-end tests with Cypress.",
      },
      {
        description:
          "Built reusable banking interfaces using React, TypeScript, Ant Design, React Hook Form, Redux, and SCSS.",
      },
    ],
  },
  {
    startDate: "2020-03",
    period: "Mar 2020 — Feb 2021",
    title: "Turning Lockdown into an Opportunity",
    tasks: [
      {
        description:
          "Used the lockdown to teach myself HTML, CSS, JavaScript, React, SCSS, Node.js, Firebase, Figma, and UI/UX design while building projects to reinforce what I learned.",
      },
      {
        description: "Built my first practice project:",
        url: "https://edtosoy-match.firebaseapp.com/",
        label: "edtosoy-match.firebaseapp.com",
      },
      {
        description: "Created my first portfolio:",
        url: "https://edtportfolio.netlify.app/",
        label: "edtportfolio.netlify.app",
      },
      {
        description:
          "Expanded into full-stack development with Next.js, Apollo GraphQL, TypeGraphQL, TypeORM, Express, PostgreSQL, MongoDB, JWT, Cypress, and Jest, then launched my second portfolio:",
        url: "https://ed-tosoy-portfolio.vercel.app/",
        label: "ed-tosoy-portfolio.vercel.app",
      },
    ],
  },
  {
    startDate: "2018-01-26",
    period: "January 26, 2018",
    title: "The Spark That Started It All",
    tasks: [
      {
        description:
          "Like many kids, I thought hackers were the coolest people alive—black hoodies, Linux terminals, and endless command lines. That curiosity led me to Linux, Bash, and Git.",
      },
      {
        description:
          "Started with Python, NumPy, and Pandas during the data science boom, but eventually discovered I enjoyed building something more than analyzing data, so I transitioned to backend development with Django and Flask.",
      },
      {
        description: "Created my first GitHub account:",
        url: "https://github.com/WilbertTosoy",
        label: "github.com/WilbertTosoy",
      },
    ],
  },
];
