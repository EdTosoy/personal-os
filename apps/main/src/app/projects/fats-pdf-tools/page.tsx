import type { Metadata } from 'next';
import { CaseStudyPage } from '@/components/evidence/CaseStudyPage';
import { fatsStudy } from '@/data/case-studies';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata(
  'FATS — Friendly Applicant Tracking System | Edberto Tosoy',
  'Explore personal job tracking, Sidekick capture, resumes, interviews, Career Vault and Offer Desk, with account safety, supporting PDF tools and paused AI matching.',
  '/projects/fats-pdf-tools',
);
export default function FatsCaseStudy() {
  return <CaseStudyPage study={fatsStudy} />;
}
