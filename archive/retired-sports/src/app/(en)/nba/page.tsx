import type { Metadata } from "next";
import Link from "@/components/DocumentLink";
import { JsonLd } from "@/components/JsonLd";
import { NbaDaySlate } from "@/components/NbaToday";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { ResponsibleGamblingNotice } from "@/components/ResponsibleGamblingNotice";
import { SiteContactLine } from "@/components/SiteContactLine";
import { NBA_PAGE } from "@/lib/nba";
import { resolveNbaSlate } from "@/data/nba/slates";
import { getNbaDayStart, getNbaTodayKey } from "@/lib/nba-day";
import { absoluteUrl } from "@/lib/site-config";

// The NBA day is not frozen at build time, mirroring src/app/(en)/nhl/page.tsx. The static HTML
// shows the day that is current when it was built; the client then switches to the NBA day
// (America/Sao_Paulo) on load and every minute. Metadata is evergreen and has no date. The only
// date signal is the JSON-LD dateModified (and the sitemap lastmod), which is the NBA day of the
// active slate, never the build time; the switch at 00:00 America/Sao_Paulo is unchanged.
export const metadata: Metadata = {
  title: { absolute: NBA_PAGE.title },
  description: NBA_PAGE.description,
  alternates: { canonical: absoluteUrl(NBA_PAGE.path) },
  robots: { index: true, follow: true },
  openGraph: { title: NBA_PAGE.title, description: NBA_PAGE.description, url: absoluteUrl(NBA_PAGE.path), type: "website", siteName: "Predictions Sports Prime", images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: "NBA predictions and picks - Predictions Sports Prime" }] },
  twitter: { card: "summary_large_image", title: NBA_PAGE.title, description: NBA_PAGE.description, images: [absoluteUrl("/og-default.png")] },
};

export default function NbaPage() {
  const initialKey = getNbaTodayKey();

  // The active slate drives the only date signal: the NBA day of the published slate, never the build time.
  const activeSlateDay = resolveNbaSlate(initialKey)?.dayKey;
  const activeSince = activeSlateDay ? getNbaDayStart(activeSlateDay)?.toISOString() : undefined;

  // Public structured data only: the collection page and its breadcrumb. No pick, odds or analysis.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${absoluteUrl(NBA_PAGE.path)}#webpage`,
      name: NBA_PAGE.h1,
      description: NBA_PAGE.description,
      url: absoluteUrl(NBA_PAGE.path),
      inLanguage: "en",
      about: { "@type": "SportsOrganization", name: "National Basketball Association" },
      isPartOf: { "@id": absoluteUrl("/#website") },
      publisher: { "@id": absoluteUrl("/#organization") },
      ...(activeSince ? { dateModified: activeSince } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "NBA", item: absoluteUrl(NBA_PAGE.path) },
      ],
    },
  ];

  return (
    <article className="section">
      <JsonLd data={jsonLd} />
      <div className="container">
        <nav className="psp-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>NBA</span>
        </nav>

        <NbaDaySlate initialKey={initialKey} afterHero={<PrimeVipOfferCard />} />

        <div className="psp-notice">
          <SiteContactLine />
          <ResponsibleGamblingNotice />
        </div>
      </div>
    </article>
  );
}
