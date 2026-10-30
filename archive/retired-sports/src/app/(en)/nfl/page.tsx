import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { NFLPage } from "@/components/NFLPage";
import { getNFLCopy } from "@/lib/nfl-i18n";
import { absoluteUrl } from "@/lib/site-config";

const copy = getNFLCopy("en");

export const metadata: Metadata = {
  title: { absolute: copy.title.length <= 70 ? copy.title : copy.title.split(" | ")[0] }, description: copy.description,
  alternates: { canonical: absoluteUrl("/nfl/") }, robots: { index: true, follow: true },
  openGraph: { type: "website", title: copy.title, description: copy.description, url: absoluteUrl("/nfl/"), siteName: "Predictions Sports Prime", images: [{ url: absoluteUrl("/nfl/nfl-logo.png"), width: 500, height: 500, alt: "NFL" }] },
  twitter: { card: "summary", title: copy.title, description: copy.description, images: [absoluteUrl("/nfl/nfl-logo.png")] },
};

// Public structured data for the single NFL hub: the collection page and its breadcrumb. It lists no
// individual game and carries no pick, odds or analysis.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/nfl/")}#webpage`,
    name: copy.weekHeading,
    description: copy.description,
    url: absoluteUrl("/nfl/"),
    inLanguage: "en",
    about: { "@type": "SportsOrganization", name: "National Football League" },
    isPartOf: { "@id": absoluteUrl("/#website") },
    publisher: { "@id": absoluteUrl("/#organization") },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "NFL", item: absoluteUrl("/nfl/") },
    ],
  },
];

export default function NFL() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <NFLPage locale="en" />
    </>
  );
}
