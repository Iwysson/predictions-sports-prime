import type { MetadataRoute } from "next";
import { nflWeek3Games } from "@/data/predictions/nfl/week-03";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/nfl/") },
    ...nflWeek3Games.filter((game) => game.published && game.matchSeo?.indexable && game.slug).map((game) => ({
      url: absoluteUrl(`/nfl/${game.slug}/`),
      ...(game.updatedAt ? { lastModified: new Date(game.updatedAt) } : {}),
    })),
  ];
}
