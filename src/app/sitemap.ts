import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { isIndexableLocalizedHubLocale, localePath, seoLocaleSlugs } from "@/lib/seo-locales";
import { intentHubSlugs } from "@/lib/intent-hubs";
import { hubLastModified } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = hubLastModified();
  const withLastModified = (path: string) => ({
    url: absoluteUrl(path),
    ...(lastModified[path] ? { lastModified: lastModified[path] } : {}),
  });
  const staticPages: MetadataRoute.Sitemap = [
    withLastModified("/"),
    ...[
      "/about/",
      "/contact/",
      "/methodology/",
      "/nfl/",
      "/editorial-policy/",
      "/results/",
      "/nhl/",
      "/nba/",
      "/privacy/",
      "/cookies/",
      "/terms/",
      "/responsible-gambling/",
      "/international-audience-regulatory-notice/",
      "/author/iwysson-nascimento/",
      ...intentHubSlugs.map((slug) => `/${slug}/`),
    ].map(withLastModified),
  ];

  const localizedHubPages: MetadataRoute.Sitemap = seoLocaleSlugs
    .filter(isIndexableLocalizedHubLocale)
    .map((locale) => ({
      url: absoluteUrl(localePath(locale)),
      ...(lastModified["/"] ? { lastModified: lastModified["/"] } : {}),
    }));

  return [...staticPages, ...localizedHubPages];
}
