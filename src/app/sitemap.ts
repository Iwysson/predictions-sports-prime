import type { MetadataRoute } from "next";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { absoluteUrl } from "@/lib/site-config";
import { matchCanonicalPath } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
    },
    ...[
      "/about/",
      "/contact/",
      "/methodology/",
      "/editorial-policy/",
      "/results/",
      "/privacy/",
      "/cookies/",
      "/terms/",
      "/responsible-gambling/",
      "/author/iwysson-nascimento/",
    ].map((path) => ({
      url: absoluteUrl(path),
    })),
  ];

  const leaguePages: MetadataRoute.Sitemap = leagues.map((league) => ({
    url: absoluteUrl(`/league/${league.slug}/`),
  }));

  const matchPages: MetadataRoute.Sitemap = matches
    .filter((match) => match.status === "published")
    .map((match) => ({
      url: absoluteUrl(matchCanonicalPath(match)),
      ...(match.updatedAt || match.publishedAt
        ? { lastModified: new Date(match.updatedAt ?? match.publishedAt!) }
        : {}),
    }));

  return [
    ...staticPages,
    ...leaguePages,
    ...matchPages,
  ];
}
