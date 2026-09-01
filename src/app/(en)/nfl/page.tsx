import type { Metadata } from "next";
import { NFLPage } from "@/components/NFLPage";
import { getNFLCopy } from "@/lib/nfl-i18n";
import { localizedAlternates } from "@/lib/international-seo";
import { absoluteUrl } from "@/lib/site-config";

const copy = getNFLCopy("en");

export const metadata: Metadata = {
  title: { absolute: copy.title.length <= 70 ? copy.title : copy.title.split(" | ")[0] }, description: copy.description,
  alternates: localizedAlternates("en", "/nfl/"), robots: { index: true, follow: true },
  openGraph: { type: "website", title: copy.title, description: copy.description, url: absoluteUrl("/nfl/"), siteName: "Predictions Sports Prime", images: [{ url: absoluteUrl("/nfl/nfl-logo.png"), width: 500, height: 500, alt: "NFL" }] },
  twitter: { card: "summary", title: copy.title, description: copy.description, images: [absoluteUrl("/nfl/nfl-logo.png")] },
};

export default function NFL() { return <NFLPage locale="en" />; }
