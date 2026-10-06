import type { MetadataRoute } from "next";
import { buildUpcomingMatchesSitemap } from "@/lib/sitemap-data";

export const dynamic = "force-static";

// Upcoming sitemap lists only fixtures whose kickoff is still ahead. Past NFL
// games were removed, so no NFL entries remain here.
export default function sitemap(): MetadataRoute.Sitemap {
  return buildUpcomingMatchesSitemap();
}
