import type { Metadata } from "next";
import { siteOrigin } from "@/data/site";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(siteOrigin),
    alternates: { canonical: new URL(path, siteOrigin).href },
    openGraph: {
      type: "website",
      siteName: "Edberto Tosoy",
      title,
      description,
      url: new URL(path, siteOrigin).href,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Edberto Tosoy — Full-Stack Software Engineer" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true },
  };
}
