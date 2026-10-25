import type { Metadata } from 'next';
import { CaseStudyPage } from '@/components/evidence/CaseStudyPage';
import { marcusStudy } from '@/data/case-studies';
import { pageMetadata } from '@/lib/metadata';
export const metadata: Metadata = pageMetadata(
  'Marcus Chess — Learning Platform | Edberto Tosoy',
  'Guided chess lessons, adaptive practice, Stockfish games and coached review, with technical evidence and unvalidated educational effectiveness clearly separated.',
  '/projects/marcus-chess',
);
export default function MarcusCaseStudy() {
  return <CaseStudyPage study={marcusStudy} />;
}
