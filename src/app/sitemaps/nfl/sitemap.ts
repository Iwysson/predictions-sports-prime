import type { MetadataRoute } from "next";
import { nflGames } from "@/data/predictions/nfl";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/nfl/") },
    ...nflGames.filter((game) => game.published && game.matchSeo?.indexable && game.slug).map((game) => ({
      url: absoluteUrl(`/nfl/${game.slug}/`),
      ...(game.updatedAt ? { lastModified: new Date(game.updatedAt) } : {}),
    })),
  ];
}
