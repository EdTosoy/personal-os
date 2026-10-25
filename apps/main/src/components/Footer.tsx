import Link from 'next/link';
import { profile } from '@/data/profile';

export default function Footer() {
  const year = new Date().getFullYear();
  const linkClassName =
    'inline-flex min-h-11 items-center rounded-sm transition hover:text-amber focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber';

  return (
    <footer className="border-t border-line">
      <div className="grid-container py-8">
        <div className="col-start-2 col-end-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-fg-dim">
            © {year} {profile.name}
          </p>

          <nav
            aria-label="Social links"
            className="flex flex-wrap gap-x-6 text-sm text-fg-muted"
          >
            <Link
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              GitHub
            </Link>
            <Link
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              LinkedIn
            </Link>
            <Link href={`mailto:${profile.email}`} className={linkClassName}>
              Email
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
