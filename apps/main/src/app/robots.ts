import type { MetadataRoute } from "next";
import { siteOrigin } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", ...(process.env.VERCEL_ENV === "preview" ? { disallow: "/" } : { allow: "/" }) },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
