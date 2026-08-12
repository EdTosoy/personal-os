import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { projects } from "@/data/projects";
import { ProjectStatus } from "@/types";
import { skills } from "@/data/skills";
const statusStyles: Record<ProjectStatus, string> = {
  Completed: "text-ok",
  "In Progress": "text-amber",
  "Actively Maintained": "text-amber",
  Archived: "text-fg-dim",
};

export default function Projects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="projects" className=" border-b border-line py-24 md:py-28">
      <div className="mb-16 max-w-3xl">
        <p className="eyebrow text-xs font-bold uppercase ">
          Featured Projects
        </p>

        <h2 className="mt-3 text-3xl font-bold text-fg md:text-4xl">
          Learning by building.
        </h2>

        <p className="mt-6 text-lg leading-8 text-fg-muted">
          Most of what I&apos;ve learned has come from building. These projects
          reflect the technologies I&apos;ve explored, the problems I&apos;ve
          tackled, and how I&apos;ve grown as a software engineer.
        </p>
      </div>

      <div className="grid gap-6">
        {featured.map((project) => (
          <article key={project.slug} className="panel panel-hover p-7 md:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row">
              <div className="flex-1">
                <div className="mono flex items-center gap-2 text-xs">
                  <span className={statusStyles[project.status]}>●</span>
                  <span className="text-fg-dim uppercase tracking-wide">
                    {project.status}
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-semibold text-fg">
                  {project.title}
                </h3>

                <p className="mt-4 leading-8 text-fg-muted">
                  {project.longDescription}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="chip px-3 py-1">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 self-start">
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    className="btn-outline flex items-center gap-2 rounded-full px-5 py-2 text-sm"
                  >
                    <FaGithub />
                    Code
                  </Link>
                )}

                {project.demo && (
                  <Link
                    href={project.demo}
                    target="_blank"
                    className="btn-primary flex items-center gap-2 rounded-full px-5 py-2 text-sm"
                  >
                    <FiExternalLink />
                    Demo
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}

        {/* Skills — service catalog. Hidden on 2xl+ where the sticky
              side Stack rail (components/Stack.tsx) takes over this role. */}
        <div className="mt-16 xl:hidden">
          <h3 className="text-xl font-semibold text-fg">Technologies</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {skills.map((category) => (
              <div key={category.title} className="panel p-6">
                <p className="mono text-xs uppercase tracking-wide text-fg-dim">
                  {category.title}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill} className="chip px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
