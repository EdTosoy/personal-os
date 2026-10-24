export interface Profile {
  name: string;
  title: string;
  headline: string;
  summary: string;

  email: string;
  github: string;
  linkedin: string;
  website: string;

  location: string;
  resume: string;
}

export interface ExperienceHighlight {
  description: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;

  summary: string;

  technologies: string[];

  highlights: ExperienceHighlight[];
}

export type ProjectStatus =
  | "Completed"
  | "In Progress"
  | "Archived"
  | "Actively Maintained";

export interface Project {
  slug: string;

  title: string;

  shortDescription: string;

  longDescription: string;

  status: ProjectStatus;

  featured: boolean;

  technologies: string[];

  github?: string;

  demo?: string;

  caseStudy?: { href: string; image: string; alt: string; caption: string };
}

interface TaskItem {
  description: string;
  emphasis?: string;
  url?: string;
  label?: string;
}

export interface JourneyItem {
  /** ISO date or month, retaining the precision of the known starting date. */
  startDate: string;
  period: string;
  title: string;
  tasks: TaskItem[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}
