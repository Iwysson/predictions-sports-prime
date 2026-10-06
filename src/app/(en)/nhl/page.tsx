import type { Metadata } from "next";
import Link from "@/components/DocumentLink";
import { JsonLd } from "@/components/JsonLd";
import { NhlDaySlate } from "@/components/NhlToday";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { ResponsibleGamblingNotice } from "@/components/ResponsibleGamblingNotice";
import { SiteContactLine } from "@/components/SiteContactLine";
import { NHL_PAGE } from "@/lib/nhl";
import { getNhlTodayKey } from "@/lib/nhl-day";
import { absoluteUrl } from "@/lib/site-config";

// The NHL day is not frozen at build time. The static HTML shows the day that is current when it
// was built; the client then switches to the NHL day (America/New_York) on load and every minute.
// Metadata and JSON-LD below keep the build-time day until a rebuild.
export const metadata: Metadata = {
  title: { absolute: NHL_PAGE.title },
  description: NHL_PAGE.description,
  alternates: { canonical: absoluteUrl(NHL_PAGE.path) },
  robots: { index: true, follow: true },
  openGraph: { title: NHL_PAGE.title, description: NHL_PAGE.description, url: absoluteUrl(NHL_PAGE.path), type: "website" },
  twitter: { card: "summary", title: NHL_PAGE.title, description: NHL_PAGE.description },
};

export default function NhlPage() {
  const initialKey = getNhlTodayKey();

  // Public structured data only: the collection and its anchors. No pick, odds or analysis.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "NHL", item: absoluteUrl(NHL_PAGE.path) },
      ],
    },
  ];

  return (
    <article className="section">
      <JsonLd data={jsonLd} />
      <div className="container">
        <nav className="psp-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>NHL</span>
        </nav>

        <NhlDaySlate initialKey={initialKey} />

        <PrimeVipOfferCard />

        <div className="psp-notice">
          <SiteContactLine />
          <ResponsibleGamblingNotice />
        </div>
      </div>
    </article>
  );
}
