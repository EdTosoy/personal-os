import type { Metadata } from 'next';
import { CaseStudyPage } from '@/components/evidence/CaseStudyPage';
import { fatsStudy } from '@/data/case-studies';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata(
  'FATS — Job Search Companion | Edberto Tosoy',
  'Explore job capture, applications, interviews, resume safety boundaries and offers, with supporting PDF engineering and known limitations.',
  '/projects/fats-pdf-tools',
);
export default function FatsCaseStudy() {
  return <CaseStudyPage study={fatsStudy} />;
}
