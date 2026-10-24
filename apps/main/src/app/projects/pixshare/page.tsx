import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/evidence/CaseStudyPage";
import { pixshareStudy } from "@/data/case-studies";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "PixShare — Media API Engineering | Edberto Tosoy",
  "Inspect PixShare’s real FastAPI responses, filtering and stored-image output, with source-backed upload and ownership decisions and explicit frontend verification limits.",
  "/projects/pixshare",
);
export default function PixShareCaseStudy() {
  return <CaseStudyPage study={pixshareStudy} />;
}
