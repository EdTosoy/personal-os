"use client";
import Link from "next/link";
export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="panel max-w-lg p-8">
        <h1 className="text-3xl font-semibold">Something went wrong.</h1>
        <p className="mt-4 leading-7 text-fg-muted">Please try again, or return to the portfolio.</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <button onClick={reset} className="btn-primary min-h-11 rounded-full px-6">Try again</button>
          <Link href="/" className="btn-outline inline-flex min-h-11 items-center rounded-full px-6">Back to portfolio</Link>
        </div>
      </div>
    </main>
  );
}
