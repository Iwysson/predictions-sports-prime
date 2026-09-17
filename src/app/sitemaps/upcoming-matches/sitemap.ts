import type { MetadataRoute } from "next";
import { buildUpcomingMatchesSitemap } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildUpcomingMatchesSitemap();
}
