import type { MetadataRoute } from "next";
import { buildUpcomingMatchesSitemap } from "@/lib/sitemap-data";

export const dynamic = "force-static";

// Upcoming sitemap lists only fixtures whose kickoff is still ahead.
export default function sitemap(): MetadataRoute.Sitemap {
  return buildUpcomingMatchesSitemap();
}
