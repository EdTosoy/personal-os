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
          "Built and maintained production React and TypeScript banking interfaces for teller and administrative workflows.",
      },
      {
        description:
          "Integrated REST APIs and implemented forms with Redux, Ant Design, React Hook Form, and SCSS.",
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
          "Worked with QA engineers, business analysts, and developers on requirements, defect resolution, code reviews, and delivery.",
      },
      {
        description:
          "Consolidated FX transaction charge logic and form-state handling, reducing the component from approximately 1,600 to just over 700 lines of code. This is a code-size reduction; no runtime performance improvement was measured.",
      },
    ],
  },
];
