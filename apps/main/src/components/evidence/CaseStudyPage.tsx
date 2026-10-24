import Link from "next/link";
import type { CaseStudy } from "@/data/case-studies";
import { GuidedWalkthrough } from "./GuidedWalkthrough";
import { EvidenceScreenshot } from "./EvidenceScreenshot";
import { ThemeToggle } from "@/components/ui/ToggleTheme";

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const navigation = [
    { name: "Flow", slug: "flow-financial-reconciliation" },
    { name: "FATS PDF Tools", slug: "fats-pdf-tools" },
    {
      name: "Hospital Management Platform",
      slug: "pulse-hospital-devops-platform",
    },
    { name: "PixShare", slug: "pixshare" },
  ];
  const current = navigation.findIndex((item) => item.slug === study.slug);
  const other = navigation[(current + 1) % navigation.length];
  return (
    <div className="case-study">
      <a href="#case-content" className="case-skip">
        Skip to case study
      </a>
      <header className="case-header">
        <div className="case-container flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold">
            Edberto Tosoy
            <span className="text-fg-muted font-normal"> / engineering</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#projects" className="text-sm text-fg-muted">
              ← All projects
            </Link>
            <ThemeToggle className="case-theme" />
          </div>
        </div>
      </header>
      <main id="case-content" className="case-container" tabIndex={-1}>
        <div className="case-intro">
          <p className="eyebrow text-xs">{study.category}</p>
          <div className="case-title-row">
            <h1>{study.name}</h1>
            <span className="chip px-3 py-1">Engineering showcase</span>
          </div>
          <p className="case-headline">{study.headline}</p>
          <p className="case-overview">{study.overview}</p>
          {study.contributionSummary && (
            <p className="case-contribution-summary">
              <strong>My contribution: </strong>{study.contributionSummary}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-5">
            {study.stack.map((item) => (
              <span className="chip px-3 py-1" key={item}>
                {item}
              </span>
            ))}
          </div>
          <nav className="case-jump-links" aria-label="Case study sections">
            <a href="#inspection-title">Walkthrough</a>
            <a href="#contributions-title">What I built</a>
            <a href="#verification-title">Verification</a>
            <a href="#source-title">Source</a>
            <a href="#limits-title">Limitations</a>
          </nav>
        </div>
        <section aria-labelledby="inspection-title">
          <div className="case-section-heading">
            <h2 id="inspection-title">Inspect the work</h2>
            <span className="mono text-xs text-fg-muted">
              {study.steps.length} STEPS · EXPLORE AT YOUR PACE
            </span>
          </div>
          <p className="case-scope">{study.scope}</p>
          <GuidedWalkthrough
            steps={study.steps}
            label={`${study.name} evidence walkthrough`}
          />
          <p className="case-viewer-note">
            These are authentic project captures. Controls navigate screenshot
            evidence; they do not operate the project. Use Zoom to evidence or
            open the full image for detail. On a phone, open the original image
            to magnify small interface text. The text walkthrough is available below.
          </p>
          <details className="case-transcript">
            <summary>Read every walkthrough step as text</summary>
            <ol>
              {study.steps.map((step, index) => (
                <li key={step.title}>
                  <h3>
                    {index + 1}. {step.title}
                  </h3>
                  <p>{step.description}</p>
                  <p>{step.annotation}</p>
                  <a
                    href={step.image.src}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Inspect corresponding screenshot ↗
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </section>
        <section
          className="case-section case-problem"
          aria-labelledby="problem-title"
        >
          <div>
            <p className="eyebrow text-xs">THE PROBLEM</p>
            <h2 id="problem-title">{study.headline}</h2>
          </div>
          <p>{study.problem}</p>
        </section>
        <section className="case-section" aria-labelledby="contributions-title">
          <div className="case-section-heading">
            <h2 id="contributions-title">What I built</h2>
            <span className="mono text-xs text-fg-muted">
              IMPLEMENTATION / DECISIONS
            </span>
          </div>
          <div className="case-three-grid">
            {study.contributions.map((item, index) => (
              <article className="panel p-6" key={item.title}>
                <span className="eyebrow text-sm">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="case-section" aria-labelledby="architecture-title">
          <h2 id="architecture-title">Architecture behind the interface</h2>
          <div className="case-architecture">
            {study.architecture.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <div>
                  <p>{item.body}</p>
                  <a
                    href={`${study.repository}/blob/${study.revision}/${item.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="case-source"
                  >
                    {item.path} ↗
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="case-section" aria-labelledby="verification-title">
          <div className="case-section-heading">
            <h2 id="verification-title">Evidence, with boundaries</h2>
            <a className="case-source" href="/evidence/phase2-review.md">
              Read verification report ↗
            </a>
          </div>
          <div className="case-three-grid">
            {study.verification.map((item) => (
              <article className="case-verification" key={item.label}>
                <h3>{item.label}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          {study.slug === "fats-pdf-tools" && (
            <div className="panel p-5 mt-6">
              <h3>Inspect the actual PDF bytes</h3>
              <p className="text-sm text-fg-muted mt-2 leading-7">
                Five synthetic, reproducible test assets—not customer documents
                or evidence of production usage. Downloaded during browser verification. The
                completed copy was exported before page reordering; extraction
                and splits use the reordered document.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                {[
                  ["original", "Original · 3 pages"],
                  ["completed", "Signed copy · 3 pages"],
                  ["extracted", "Extracted copy · 2 pages"],
                  ["split-1", "Split 1 · 1 page"],
                  ["split-2", "Split 2 · 2 pages"],
                ].map(([file, label]) => (
                  <a
                    className="case-source"
                    key={file}
                    href={`/evidence/fats/synthetic-${file}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label} ↗
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          {study.slug === "fats-pdf-tools" && (
            <details className="case-transcript mt-6">
              <summary>Compare the existing editor and split workflow</summary>
              <div className="case-comparison">
                <EvidenceScreenshot
                  image={{
                    src: "/evidence/fats/production-editor.png",
                    width: 1440,
                    height: 1000,
                    status: "Existing editor",
                    alt: "Existing FATS PDF editor with the synthetic PDF opened and document controls.",
                    caption:
                      "Existing /resumes/pdf-tools editor. Separate from the v2 development candidate.",
                  }}
                />
                <EvidenceScreenshot
                  image={{
                    src: "/evidence/fats/split.png",
                    width: 1440,
                    height: 1000,
                    status: "Development candidate",
                    alt: "Development candidate split dialog with a boundary after page 1 and two PDFs planned.",
                    caption:
                      "Development-only v2 split workflow. Downloads reopened with 1 and 2 pages.",
                  }}
                />
              </div>
            </details>
          )}
        </section>
        <section
          className="case-section case-limits"
          aria-labelledby="limits-title"
        >
          <div>
            <p className="eyebrow text-xs">SCOPE & TRADEOFFS</p>
            <h2 id="limits-title">What this evidence proves</h2>
            <p className="text-fg-muted mt-4">
              And where the verification stops.
            </p>
          </div>
          <ul>
            {study.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="case-section" aria-labelledby="source-title">
          <div className="case-section-heading">
            <h2 id="source-title">Follow the source</h2>
            <a
              className="case-source"
              href={study.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open repository ↗
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <p className="text-sm text-fg-muted mb-5">
            Links point to the source revision used for this evidence. The
            verification report records capture provenance, executed checks,
            and remaining gaps.
          </p>
          <div className="case-reference-list">
            {study.references.map((item) => (
              <a
                href={`${study.repository}/blob/${study.revision}/${item.path}`}
                key={item.path}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{item.label}</span>
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </section>
        <footer className="case-footer">
          <Link href="/#projects">← Back to projects</Link>
          <Link href={`/projects/${other.slug}`}>Explore {other.name} →</Link>
        </footer>
      </main>
    </div>
  );
}
