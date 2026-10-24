import type { MetadataRoute } from "next";
import { publicPagePaths, siteOrigin } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPagePaths.map((path) => ({ url: new URL(path, siteOrigin).href }));
}
