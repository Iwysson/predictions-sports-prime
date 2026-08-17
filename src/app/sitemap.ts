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
      changeFrequency: "daily",
      priority: 1,
    },
    ...[
      "/about/",
      "/contact/",
      "/privacy/",
      "/cookies/",
      "/terms/",
      "/responsible-gambling/",
    ].map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const leaguePages: MetadataRoute.Sitemap = leagues.map((league) => ({
    url: absoluteUrl(`/league/${league.slug}/`),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const matchPages: MetadataRoute.Sitemap = matches
    .filter((match) => match.status === "published")
    .map((match) => ({
      url: absoluteUrl(matchCanonicalPath(match)),
      ...(match.updatedAt || match.publishedAt
        ? { lastModified: new Date(match.updatedAt ?? match.publishedAt!) }
        : {}),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...leaguePages,
    ...matchPages,
  ];
}
