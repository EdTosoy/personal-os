import type { Metadata } from 'next';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import Projects from '@/components/Projects';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata(
  'Edberto Tosoy | Full-Stack Software Engineer — React, TypeScript & Backend Systems',
  'Full-stack software engineer in Metro Manila with production React and TypeScript banking experience and independent backend, financial systems, and AWS projects.',
  '/',
);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ projectsPage?: string | string[] }>;
}) {
  const { projectsPage } = await searchParams;
  const requestedPage =
    typeof projectsPage === 'string' ? projectsPage : undefined;
  return (
    <div className="bg-ink min-h-screen">
      <Header />
      <MainContent projects={<Projects requestedPage={requestedPage} />} />
    </div>
  );
}
