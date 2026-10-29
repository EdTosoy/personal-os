import type { Metadata } from 'next';
import { CaseStudyPage } from '@/components/evidence/CaseStudyPage';
import { flowStudy } from '@/data/case-studies';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata(
  'Vigil — Financial Reconciliation & Exception Management | Edberto Tosoy',
  'Inspect Vigil payment ingestion, Stripe sandbox evidence, deterministic reconciliation, exceptions, durable workers and AWS architecture, with verified scope and deployment status.',
  '/projects/flow-financial-reconciliation',
);
export default function FlowCaseStudy() {
  return <CaseStudyPage study={flowStudy} />;
}
