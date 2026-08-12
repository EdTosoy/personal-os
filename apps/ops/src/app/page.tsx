import type { Metadata } from "next";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";

export const metadata: Metadata = {
  title:
    "Edberto Tosoy | Software Engineer — Cloud, DevOps & Platform Engineering",
  description:
    "Software Engineer based in Metro Manila, Philippines, with production banking experience, now building toward Cloud, DevOps, and Platform Engineering.",
};

export default function Home() {
  return (
    <div className="bg-ink min-h-screen">
      <Header />
      <MainContent />
    </div>
  );
}
