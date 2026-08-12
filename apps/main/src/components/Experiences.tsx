import { experiences } from "@/data/experience";

export default function Experiences() {
  return (
    <section id="experience" className=" border-b border-line py-24 md:py-28">
      <div className="mb-16 max-w-3xl">
        <p className="eyebrow text-xs font-bold uppercase">Experience</p>

        <h2 className="mt-3 text-3xl font-bold text-fg md:text-4xl">
          Built in production.
        </h2>

        <p className="mt-6 text-lg leading-8 text-fg-muted">
          A collection of the roles, teams, and experiences that have shaped how
          I think, collaborate, and build software.
        </p>
      </div>

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.company} className="panel p-7 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-fg">{exp.role}</h3>
                <p className="mt-1 text-fg-muted">{exp.company}</p>
              </div>

              <span className="mono shrink-0 text-sm text-fg-dim">
                {exp.period}
              </span>
            </div>

            <ul className="mt-7 space-y-3 text-fg-muted">
              {exp.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 leading-7">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <span>{h.description}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <span key={tech} className="chip px-3 py-1">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
