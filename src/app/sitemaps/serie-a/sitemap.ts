import type { MetadataRoute } from "next";
import { buildLeagueSitemap } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildLeagueSitemap("serie-a");
}
