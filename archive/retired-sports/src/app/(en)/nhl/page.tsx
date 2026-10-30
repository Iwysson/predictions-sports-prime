import type { Metadata } from "next";
import Link from "@/components/DocumentLink";
import { JsonLd } from "@/components/JsonLd";
import { NhlDaySlate } from "@/components/NhlToday";
import { NhlResultsSection } from "@/components/NhlResultsSection";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { ResponsibleGamblingNotice } from "@/components/ResponsibleGamblingNotice";
import { SiteContactLine } from "@/components/SiteContactLine";
import { NHL_PAGE } from "@/lib/nhl";
import { resolveNhlSlate } from "@/data/nhl/slates";
import { getNhlDayStart, getNhlTodayKey } from "@/lib/nhl-day";
import { absoluteUrl } from "@/lib/site-config";

// The NHL day is not frozen at build time. The static HTML shows the day that is current when it
// was built; the client then switches to the NHL day (America/New_York) on load and every minute.
// Metadata is evergreen and has no date. The only date signal is the JSON-LD dateModified (and the sitemap lastmod), which
// is the NHL day of the active slate, never the build time; the switch at 00:00 America/New_York is unchanged.
export const metadata: Metadata = {
  title: { absolute: NHL_PAGE.title },
  description: NHL_PAGE.description,
  alternates: { canonical: absoluteUrl(NHL_PAGE.path) },
  robots: { index: true, follow: true },
  openGraph: { title: NHL_PAGE.title, description: NHL_PAGE.description, url: absoluteUrl(NHL_PAGE.path), type: "website", siteName: "Predictions Sports Prime", images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: "NHL predictions and picks - Predictions Sports Prime" }] },
  twitter: { card: "summary_large_image", title: NHL_PAGE.title, description: NHL_PAGE.description, images: [absoluteUrl("/og-default.png")] },
};

export default function NhlPage() {
  const initialKey = getNhlTodayKey();

  // The active slate drives the only date signal: the NHL day of the published slate, never the build time.
  const activeSlateDay = resolveNhlSlate(initialKey)?.dayKey;
  const activeSince = activeSlateDay ? getNhlDayStart(activeSlateDay)?.toISOString() : undefined;

  // Public structured data only: the collection page and its breadcrumb. No pick, odds or analysis.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(NHL_PAGE.path)}#webpage`,
      name: NHL_PAGE.h1,
      description: NHL_PAGE.description,
      url: absoluteUrl(NHL_PAGE.path),
      inLanguage: "en",
      about: { "@type": "SportsOrganization", name: "National Hockey League" },
      isPartOf: { "@id": absoluteUrl("/#website") },
      publisher: { "@id": absoluteUrl("/#organization") },
      ...(activeSince ? { dateModified: activeSince } : {}),
    },
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

        <NhlDaySlate initialKey={initialKey} afterHero={<PrimeVipOfferCard />} />

        <NhlResultsSection />

        <div className="psp-notice">
          <SiteContactLine />
          <ResponsibleGamblingNotice />
        </div>
      </div>
    </article>
  );
}
