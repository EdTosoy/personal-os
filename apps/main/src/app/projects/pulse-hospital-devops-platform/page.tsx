import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/evidence/CaseStudyPage";
import { hospitalStudy } from "@/data/case-studies";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Hospital Management Platform — Pulse Medical | Edberto Tosoy",
  "Inspect real patient workflow, queue, consultation and billing evidence from an isolated synthetic hospital demo, with architecture and verification boundaries.",
  "/projects/pulse-hospital-devops-platform",
);
export default function HospitalCaseStudy() {
  return <CaseStudyPage study={hospitalStudy} />;
}
