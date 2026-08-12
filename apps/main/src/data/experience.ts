import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    company: "Metrobank (via 98Labs Inc.)",
    role: "Software Engineer",
    period: "Feb 2021 – Jul 2022",
    location: "Remote",

    summary:
      "Developed and supported production banking applications used by internal tellers and administrative staff.",

    technologies: [
      "React",
      "TypeScript",
      "Redux",
      "Ant Design",
      "React Hook Form",
      "SCSS",
      "REST APIs",
      "Cypress",
    ],

    highlights: [
      {
        description:
          "Developed and maintained production banking applications supporting teller and administrative workflows.",
      },
      {
        description:
          "Delivered frontend features using React and TypeScript, integrating REST APIs with Redux, Ant Design, React Hook Form, and SCSS.",
      },
      {
        description:
          "Investigated and resolved production defects, tracing issues across application logic and user workflows.",
      },
      {
        description:
          "Developed and maintained Cypress end-to-end tests covering critical banking workflows and regression scenarios.",
      },
      {
        description:
          "Collaborated with developers, QA engineers, and business analysts in an Agile environment, participating in code reviews and technical discussions.",
      },
      {
        description:
          "Refactored an FX transaction charge component from approximately 1,600 to just over 700 lines by consolidating requirements, reworking form-state handling, and introducing debouncing to reduce unnecessary recalculation.",
      },
    ],
  },
];
