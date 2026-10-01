import type { MetadataRoute } from "next";
import { buildUpcomingMatchesSitemap } from "@/lib/sitemap-data";
import { nflWeek4Games } from "@/data/predictions/nfl";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const nfl = nflWeek4Games
    .filter((game) => game.published && game.matchSeo?.indexable && game.slug && game.date >= "2026-10-01" && game.date <= "2026-10-04")
    .map((game) => ({ url: absoluteUrl(`/nfl/${game.slug}/`), ...(game.updatedAt ? { lastModified: new Date(game.updatedAt) } : {}) }));
  return [...buildUpcomingMatchesSitemap(), ...nfl];
}
