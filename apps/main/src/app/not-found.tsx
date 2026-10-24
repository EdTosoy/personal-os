import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="panel max-w-lg p-8">
        <p className="eyebrow text-sm">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-4 leading-7 text-fg-muted">This page is unavailable. You can return to the portfolio to explore the projects and résumé.</p>
        <Link href="/" className="btn-outline mt-6 inline-flex min-h-11 items-center rounded-full px-6">Back to portfolio</Link>
      </div>
    </main>
  );
}
