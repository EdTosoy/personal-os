import type { Metadata } from 'next';
import { CaseStudyPage } from '@/components/evidence/CaseStudyPage';
import { hospitalStudy } from '@/data/case-studies';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata(
  'abox — Hospital Management Platform | Edberto Tosoy',
  'Inspect the current abox patient, appointment, queue and billing workflows, with genuine local database evidence and explicit deployment limits.',
  '/projects/pulse-hospital-devops-platform',
);
export default function HospitalCaseStudy() {
  return <CaseStudyPage study={hospitalStudy} />;
}
