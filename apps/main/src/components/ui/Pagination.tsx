import Link from 'next/link';

/** Real links work with keyboard, browser history, and scripting disabled. */
export function Pagination({
  page,
  pageCount,
  href,
  label,
}: {
  page: number;
  pageCount: number;
  href: (page: number) => string;
  label: string;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="project-pagination" aria-label={label}>
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev">
          Previous
        </Link>
      ) : (
        <span aria-disabled="true">Previous</span>
      )}
      <ol>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map(
          (number) => (
            <li key={number}>
              <Link
                href={href(number)}
                aria-label={`Page ${number}`}
                aria-current={page === number ? 'page' : undefined}
              >
                {number}
              </Link>
            </li>
          ),
        )}
      </ol>
      {page < pageCount ? (
        <Link href={href(page + 1)} rel="next">
          Next
        </Link>
      ) : (
        <span aria-disabled="true">Next</span>
      )}
    </nav>
  );
}
