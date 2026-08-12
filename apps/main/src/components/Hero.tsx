import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { TfiLinkedin } from "react-icons/tfi";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

export default function Hero() {
  return (
    <section className="relative grid-container overflow-hidden border-b border-line">
      <div className="grid-bg absolute inset-0" aria-hidden />

      <main className="relative col-start-2 col-end-3">
        <div className="py-20 md:py-28">
          {/* Status banner — signature element */}
          <div className="panel mono inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs text-fg-muted">
            <span className="status-dot" />
            <span className="text-ok">operational</span>
            <span className="text-line">·</span>
            <span>open to new opportunities</span>
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-[1.05] text-fg md:text-7xl">
            Edberto Tosoy
          </h1>

          <p className="eyebrow mt-4 text-sm uppercase">
            Software Engineer · Full Stack · Cloud & DevOps
          </p>

          <p className="mt-8 max-w-2xl text-base leading-8 text-fg-muted md:text-lg">
            Software Engineer with production experience building and supporting
            enterprise banking applications. I work across frontend, backend,
            databases, and APIs, and have expanded into cloud-native development
            through hands-on work with AWS, Docker, Kubernetes, Terraform,
            CI/CD, and observability.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#projects"
              className="btn-primary rounded-full px-7 py-3"
            >
              View projects
            </Link>

            <Link
              href="/Edberto_Tosoy_Resume.pdf"
              target="_blank"
              className="btn-outline flex items-center gap-2 rounded-full px-7 py-3"
            >
              <HiOutlineDocumentArrowDown />
              Resume
            </Link>
          </div>

          {/* Socials */}
          <div className="mt-10 flex items-center gap-3">
            <Link
              href="https://github.com/edtosoy"
              target="_blank"
              aria-label="GitHub"
              className="panel panel-hover grid h-11 w-11 place-content-center rounded-full text-fg-muted hover:text-amber"
            >
              <FaGithub size={18} />
            </Link>

            <Link
              href="https://linkedin.com/in/edtosoy"
              target="_blank"
              aria-label="LinkedIn"
              className="panel panel-hover grid h-11 w-11 place-content-center rounded-full text-fg-muted hover:text-amber"
            >
              <TfiLinkedin size={17} />
            </Link>
          </div>

          {/* Stack strip — treated like a service catalog readout */}
          <div className="scanline-fade mono mt-16 overflow-hidden border-t border-line-soft pt-6 text-xs text-fg-dim">
            <div className="flex w-max gap-x-8 marquee sm:animate-none">
              {[
                "typescript",
                "angular",
                "react",
                "nextjs",
                "nestjs",
                "python",
                "FastAPI",
                "postgresql",
                "rest-apis",
                "aws",
                "docker",
                "kubernetes",
                "terraform",
                "github-actions",
              ].map((tool, i) => (
                <span key={`a-${i}`}>{tool}</span>
              ))}

              {/* duplicate set — creates the seamless loop */}
              {[
                "typescript",
                "angular",
                "react",
                "nextjs",
                "nestjs",
                "python",
                "FastAPI",
                "postgresql",
                "rest-apis",
                "aws",
                "docker",
                "kubernetes",
                "terraform",
                "github-actions",
              ].map((tool, i) => (
                <span key={`b-${i}`} aria-hidden="true" className="sm:hidden">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
