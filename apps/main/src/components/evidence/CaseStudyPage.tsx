import Link from 'next/link';
import type { CaseStudy } from '@/data/case-studies';
import { projects } from '@/data/projects';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination';
import { GuidedWalkthrough } from './GuidedWalkthrough';
import { EvidenceScreenshot } from './EvidenceScreenshot';
import { ThemeToggle } from '@/components/ui/ToggleTheme';

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const navigation = projects.flatMap((project) =>
    project.featured && project.caseStudy
      ? [{ title: project.title, href: project.caseStudy.href }]
      : [],
  );
  const current = navigation.findIndex(
    (project) => project.href === `/projects/${study.slug}`,
  );
  const other = navigation[(current + 1) % navigation.length];
  const projectPage = Math.floor(Math.max(0, current) / DEFAULT_PAGE_SIZE) + 1;
  const back =
    projectPage > 1 ? `/?projectsPage=${projectPage}#projects` : '/#projects';
  const source = (path: string) =>
    study.sourceBase
      ? `${study.sourceBase}${path}.txt`
      : `${study.repository}/blob/${study.revision}/${path}`;
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
            <Link href={back} className="text-sm text-fg-muted">
              All projects
            </Link>
            <ThemeToggle className="case-theme" />
          </div>
        </div>
      </header>
      <main id="case-content" className="case-container" tabIndex={-1}>
        <div className="case-intro">
          <div className="case-title-row">
            <h1>{study.name}</h1>
          </div>
          <p className="case-headline">{study.headline}</p>
          <p className="case-overview">{study.overview}</p>
          <p className="case-category">
            {study.category} / independent engineering project
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {study.stack.map((item) => (
              <span className="chip px-3 py-1" key={item}>
                {item}
              </span>
            ))}
          </div>
          <nav className="case-jump-links" aria-label="Case study sections">
            <a href="#product-title">Product & audience</a>
            <a href="#contributions-title">What I built</a>
            <a href="#inspection-title">Walkthrough</a>
            <a href="#decisions-title">Decisions</a>
            <a href="#verification-title">Evidence</a>
            <a href="#limits-title">Limitations</a>
            <a href="#source-title">Source</a>
          </nav>
        </div>
        <section className="case-product-brief" aria-labelledby="product-title">
          <div>
            <h2 id="product-title">Who it is for</h2>
            <p>{study.audience}</p>
          </div>
          <div>
            <h2 id="problem-title">The problem it solves</h2>
            <p>{study.problem}</p>
          </div>
        </section>
        <section className="case-section" aria-labelledby="contributions-title">
          <h2 id="contributions-title">What I personally built</h2>
          {study.contributionSummary && (
            <p className="case-contribution-summary">
              {study.contributionSummary}
            </p>
          )}
          <div className="case-three-grid">
            {study.contributions.map((item) => (
              <article className="case-editorial-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="case-section" aria-labelledby="inspection-title">
          <div className="case-section-heading">
            <h2 id="inspection-title">How the product works</h2>
            <span className="text-sm text-fg-muted">
              {study.steps.length} inspectable steps
            </span>
          </div>
          <p className="case-scope">{study.scope}</p>
          <GuidedWalkthrough
            steps={study.steps}
            label={`${study.name} evidence walkthrough`}
          />
          <p className="case-viewer-note">
            Authentic application captures. These controls explore screenshot
            evidence; they do not operate the app. Use Zoom to evidence, dim the
            surroundings, or open the full-resolution image. The text transcript
            below works without JavaScript.
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
                    Inspect corresponding screenshot
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </section>
        <section className="case-section" aria-labelledby="decisions-title">
          <h2 id="decisions-title">Difficult engineering decisions</h2>
          <div className="case-three-grid">
            {study.decisions?.map((item) => (
              <article className="case-editorial-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <h3 className="case-architecture-heading" id="architecture-title">
            Architecture behind the interface
          </h3>
          <div className="case-architecture">
            {study.architecture.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <div>
                  <p>{item.body}</p>
                  <a
                    href={source(item.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="case-source"
                  >
                    {item.path}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          {study.secondaryEvidence && (
            <details className="case-transcript case-secondary-evidence">
              <summary>{study.secondaryEvidence.title}</summary>
              <p className="case-scope">{study.secondaryEvidence.scope}</p>
              <GuidedWalkthrough
                steps={study.secondaryEvidence.steps}
                label={`${study.name} PDF engineering walkthrough`}
              />
              <ol>
                {study.secondaryEvidence.steps.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <p>{step.annotation}</p>
                    <a href={step.image.src}>Inspect screenshot</a>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </section>
        <section className="case-section" aria-labelledby="verification-title">
          <div className="case-section-heading">
            <h2 id="verification-title">Evidence, with boundaries</h2>
            <a className="case-source" href="/evidence/phase5-verification.md">
              Read Phase 5 verification report
            </a>
          </div>
          <p className="case-evidence-provenance">
            Upstream results below are attributed to their recorded checks. This
            portfolio change does not rerun every application suite.
          </p>
          <div className="case-three-grid">
            {study.verification.map((item) => (
              <article className="case-verification" key={item.label}>
                <h3>{item.label}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          {study.slug === 'fats-pdf-tools' && (
            <details className="case-transcript mt-6">
              <summary>Inspect PDF outputs and the existing editor</summary>
              <p className="text-sm text-fg-muted mt-2 leading-7">
                Synthetic browser downloads from the earlier PDF verification.
                The completed copy precedes reordering; extraction and splits
                use the reordered document.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                {[
                  ['original', 'Original, 3 pages'],
                  ['completed', 'Signed copy, 3 pages'],
                  ['extracted', 'Extracted copy, 2 pages'],
                  ['split-1', 'Split 1, 1 page'],
                  ['split-2', 'Split 2, 2 pages'],
                ].map(([file, label]) => (
                  <a
                    className="case-source"
                    key={file}
                    href={`/evidence/fats/synthetic-${file}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
              <div className="case-comparison">
                <EvidenceScreenshot
                  image={{
                    src: '/evidence/fats/production-editor.png',
                    width: 1440,
                    height: 1000,
                    status: 'Existing editor',
                    alt: 'Existing FATS PDF editor with a synthetic document.',
                    caption:
                      'Existing local PDF editor; separate from the development-only v2 candidate.',
                  }}
                />
                <EvidenceScreenshot
                  image={{
                    src: '/evidence/fats/split.png',
                    width: 1440,
                    height: 1000,
                    status: 'Development candidate',
                    alt: 'PDF v2 split dialog for a synthetic three-page document.',
                    caption:
                      'Development-only v2 output reopened with 1 and 2 pages.',
                  }}
                />
              </div>
            </details>
          )}
          {study.slug === 'pixshare' && (
            <details className="case-transcript mt-6">
              <summary>API contract evidence</summary>
              <p>
                Earlier API capture, retained as secondary evidence. Frontend
                and authenticated lifecycle checks come from the later release
                report.
              </p>
              <EvidenceScreenshot
                image={{
                  src: '/evidence/pixshare/api-overview.png',
                  width: 1440,
                  height: 1000,
                  status: 'Earlier API verification',
                  alt: 'Actual PixShare FastAPI OpenAPI documentation.',
                  caption:
                    'Earlier local API capture; not the featured product image.',
                }}
              />
            </details>
          )}
        </section>
        <section
          className="case-section case-limits"
          aria-labelledby="limits-title"
        >
          <div>
            <h2 id="limits-title">What remains unverified</h2>
            <p className="text-fg-muted mt-4">
              Working implementation and release readiness have different
              evidence requirements.
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
              Open repository
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <p className="text-sm text-fg-muted mb-5">
            {study.sourceNote ||
              'Source links are pinned to the inspected revision. The Phase 5 report distinguishes retained captures, current source, prior test results and checks executed for this portfolio change.'}
          </p>
          <div className="case-reference-list">
            {study.references.map((item) => (
              <a
                href={source(item.path)}
                key={item.path}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{item.label}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </section>
        <footer className="case-footer">
          <Link href={back}>Back to projects</Link>
          <Link href={other.href}>Explore {other.title}</Link>
        </footer>
      </main>
    </div>
  );
}
