import type { Metadata } from "next";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Edberto Tosoy | Full-Stack Software Engineer — React, TypeScript & Backend Systems",
  "Full-stack software engineer in Metro Manila with production React and TypeScript banking experience and independent backend, financial systems, and AWS projects.",
  "/",
);

export default function Home() {
  return (
    <div className="bg-ink min-h-screen">
      <Header />
      <MainContent />
    </div>
  );
}
