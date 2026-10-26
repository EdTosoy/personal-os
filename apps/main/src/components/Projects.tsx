import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import { paginate } from '@/lib/pagination';
import { Pagination } from '@/components/ui/Pagination';

export default function Projects({
  requestedPage,
}: {
  requestedPage?: string;
}) {
  const featured = projects.filter((project) => project.featured);
  const { page, pageCount, items } = paginate(featured, requestedPage);
  return (
    <section
      id="projects"
      className="featured-projects border-b border-line py-24 md:py-28"
      aria-labelledby="projects-title"
    >
      <div className="project-section-heading">
        <div>
          <h2
            id="projects-title"
            className="text-3xl font-bold text-fg md:text-4xl"
          >
            Personal projects
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-fg-muted">
            Explore the working interfaces, the engineering behind them, and the
            evidence that defines their limits.
          </p>
        </div>
        <span className="project-count">
          {featured.length} featured projects
        </span>
      </div>
      <div className="projects-grid" data-project-page={page}>
        {items.map((project, index) => (
          <article
            key={project.slug}
            className="project-card"
            data-project={project.slug}
          >
            <div className="project-card-copy">
              <h3>{project.title}</h3>
              <p>{project.shortDescription}</p>
            </div>
            {project.caseStudy && (
              <Link
                href={project.caseStudy.href}
                className="project-evidence-link mt-0"
                aria-label={`Inspect ${project.title}`}
              >
                <Image
                  src={project.caseStudy.image}
                  alt={project.caseStudy.alt}
                  width={1440}
                  height={1000}
                  loading="eager"
                  unoptimized
                  sizes="(min-width: 1280px) 390px, (min-width: 768px) 45vw, 90vw"
                />
                <span>{project.caseStudy.caption}</span>
              </Link>
            )}
            <div className="project-card-links">
              {project.caseStudy && (
                <Link href={project.caseStudy.href}>
                  Explore case study
                  <span className="sr-only">: {project.title}</span>
                </Link>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source code
                  <span className="sr-only">
                    {' '}
                    for {project.title} (opens in a new tab)
                  </span>
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Demo<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        href={(number) => `?projectsPage=${number}#projects`}
        label="Featured project pages"
      />
      <div className="mt-16 xl:hidden">
        <h3 className="text-xl font-semibold text-fg">Technologies</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {skills.map((category) => (
            <div key={category.title} className="panel p-6">
              <p className="text-sm text-fg-muted">{category.title}</p>
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
    </section>
  );
}
