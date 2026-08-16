import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export function buildLegalMetadata(
  title: string,
  path: string,
  description: string
): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${title} | ${siteConfig.name}`,
      description,
      url: canonical,
      siteName: siteConfig.name,
    },
    robots: { index: true, follow: true },
  };
}
