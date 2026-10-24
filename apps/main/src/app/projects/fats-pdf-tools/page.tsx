import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/evidence/CaseStudyPage";
import { fatsStudy } from "@/data/case-studies";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "FATS PDF Tools — Document Engineering | Edberto Tosoy",
  "Inspect real PDF editing, signature placement, page organization and verified downloads, with development-only features clearly identified.",
  "/projects/fats-pdf-tools",
);
export default function FatsCaseStudy() {
  return <CaseStudyPage study={fatsStudy} />;
}
