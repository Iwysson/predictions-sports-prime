import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { isIndexableLocalizedHubLocale, localePath, seoLocaleSlugs } from "@/lib/seo-locales";
import { intentHubSlugs } from "@/lib/intent-hubs";

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
      "/nfl/",
      "/editorial-policy/",
      "/results/",
      "/privacy/",
      "/cookies/",
      "/terms/",
      "/responsible-gambling/",
      "/author/iwysson-nascimento/",
      ...intentHubSlugs.map((slug) => `/${slug}/`),
    ].map((path) => ({
      url: absoluteUrl(path),
    })),
  ];

  const localizedHubPages: MetadataRoute.Sitemap = seoLocaleSlugs
    .filter(isIndexableLocalizedHubLocale)
    .map((locale) => ({
      url: absoluteUrl(localePath(locale)),
    }));

  return [...staticPages, ...localizedHubPages];
}
