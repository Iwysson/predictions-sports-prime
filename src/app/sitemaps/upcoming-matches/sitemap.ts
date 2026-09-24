import type { MetadataRoute } from "next";
import { buildUpcomingMatchesSitemap } from "@/lib/sitemap-data";
import { nflWeek3Games } from "@/data/predictions/nfl/week-03";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const nfl = nflWeek3Games
    .filter((game) => game.published && game.matchSeo?.indexable && game.slug && game.date >= "2026-09-24" && game.date <= "2026-10-01")
    .map((game) => ({ url: absoluteUrl(`/nfl/${game.slug}/`), ...(game.updatedAt ? { lastModified: new Date(game.updatedAt) } : {}) }));
  return [...buildUpcomingMatchesSitemap(), ...nfl];
}
