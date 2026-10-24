import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/evidence/CaseStudyPage";
import { flowStudy } from "@/data/case-studies";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Flow — Financial Reconciliation | Edberto Tosoy",
  "Inspect real Flow application evidence: reconciliation outcomes, exact-money architecture, exception investigation and verification boundaries.",
  "/projects/flow-financial-reconciliation",
);
export default function FlowCaseStudy() {
  return <CaseStudyPage study={flowStudy} />;
}
