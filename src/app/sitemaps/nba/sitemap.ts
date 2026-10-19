import type { MetadataRoute } from "next";
import { allNbaMatches } from "@/lib/nba-match";
import { isNbaMatchDayReleased } from "@/lib/nba-publication-policy";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

// NBA match pages, mirroring the per-league football sitemaps (src/lib/sitemap-data.ts): a future
// match not yet released publicly (functions/_middleware.js + functions/_data/match-release.json)
// must stay out of the sitemap, re-evaluated on every request so discovery resumes on its own once
// the midnight-America/Sao_Paulo release gate opens, no manual step needed.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-19T22:00:00-03:00");
  return allNbaMatches()
    .filter((match) => isNbaMatchDayReleased(match.matchInfo.date))
    .map((match) => ({ url: absoluteUrl(`/nba/${match.slug}/`), lastModified }));
}
