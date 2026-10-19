import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleByline } from "@/components/ArticleByline";
import { JsonLd } from "@/components/JsonLd";
import Link from "@/components/DocumentLink";
import { editorialAuthorPersonJsonLd } from "@/lib/editorial-identity";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { ResponsibleGamblingNotice } from "@/components/ResponsibleGamblingNotice";
import { SiteContactLine } from "@/components/SiteContactLine";
import { TeamBadge } from "@/components/TeamBadge";
import { formatMatchDate } from "@/lib/match-access";
import { allNbaMatches, findNbaMatch, type NbaMatchData } from "@/lib/nba-match";
import { NBA_PAGE } from "@/lib/nba";
import { isNbaMatchDayReleased } from "@/lib/nba-publication-policy";
import { absoluteUrl } from "@/lib/site-config";
import { translate } from "@/i18n/dictionaries";

// Template for /nba/[slug]/, mirroring the shape of src/templates/match-routes/en/page.tsx for a
// single, hand-maintained sport instead of the football editorialPredictions pipeline (NBA uses its
// own stat shape - points, pace, offensive/defensive rating - not the football-specific psp-v1
// Statistical Core, so it is intentionally not routed through that pipeline). The publication gate
// (functions/_middleware.js + functions/_data/match-release.json, built by
// scripts/build-match-content.mts) is the same mechanism football match pages already use, reused
// here, not duplicated.
export const dynamicParams = false;

// Absolute instant of tip-off (independently verified against the NBA's published opening-night
// schedule), used only for the SportsEvent JSON-LD startDate; matchInfo.time above is the same
// instant shown in each arena's own local time.
const START_DATE_ISO: Record<string, string> = {
  "detroit-pistons-vs-boston-celtics": "2026-10-20T15:00:00-04:00",
  "new-york-knicks-vs-philadelphia-76ers": "2026-10-20T19:00:00-04:00",
  "san-antonio-spurs-vs-oklahoma-city-thunder": "2026-10-20T20:30:00-05:00",
};

const L = { prediction: translate("en", "mainPrediction"), odds: translate("en", "odds") };

export function generateStaticParams() {
  return allNbaMatches().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const match = findNbaMatch(slug);
  if (!match) return {};
  const title = `${match.homeTeam} vs ${match.awayTeam} Prediction, Odds and Betting Tips | NBA`;
  const description = `${match.homeTeam} vs ${match.awayTeam}: NBA prediction, published odds (${match.odds.toFixed(2)}) and full game analysis for ${formatMatchDate(match.matchInfo.date)}.`;
  const path = `/nba/${slug}/`;
  // Same rule as the sitemap (src/app/sitemaps/nba/sitemap.ts): a page built ahead of its own
  // midnight-America/Sao_Paulo release gate stays out of the index until that build-time check turns
  // true, so a future NBA page is never marked indexable while absent from the sitemap.
  const indexable = isNbaMatchDayReleased(match.matchInfo.date);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: indexable, follow: true },
    openGraph: { title, description, url: absoluteUrl(path), type: "article", siteName: "Predictions Sports Prime", images: [{ url: absoluteUrl("/og-default.png"), width: 1200, height: 630, alt: `${match.homeTeam} vs ${match.awayTeam} - NBA Prediction` }] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/og-default.png")] },
  };
}

function buildJsonLd(match: NbaMatchData) {
  const path = `/nba/${match.slug}/`;
  const url = absoluteUrl(path);
  const startDate = START_DATE_ISO[match.slug];
  const team = (name: string) => ({ "@type": "SportsTeam", name });

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: `${match.homeTeam} vs ${match.awayTeam} Prediction, Odds and Betting Tips`,
      description: match.teaser,
      url,
      inLanguage: "en",
      datePublished: "2026-10-19T22:00:00-03:00",
      dateModified: "2026-10-19T22:00:00-03:00",
      author: editorialAuthorPersonJsonLd(),
      publisher: { "@id": absoluteUrl("/#organization") },
      isPartOf: { "@id": absoluteUrl("/#website") },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isAccessibleForFree: match.analysisAccess === "free" && match.predictionAccess === "free",
      image: [absoluteUrl("/og-default.png")],
      about: { "@id": `${url}#event` },
    },
    {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "@id": `${url}#event`,
      name: `${match.homeTeam} vs ${match.awayTeam}`,
      url,
      sport: "Basketball",
      ...(startDate ? { startDate } : {}),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: match.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: match.matchInfo.venueAddress?.addressLocality,
          addressRegion: match.matchInfo.venueAddress?.addressRegion,
          addressCountry: match.matchInfo.venueAddress?.addressCountry ?? "USA",
        },
      },
      homeTeam: team(match.homeTeam),
      awayTeam: team(match.awayTeam),
      competitor: [team(match.homeTeam), team(match.awayTeam)],
      organizer: { "@type": "SportsOrganization", name: "National Basketball Association" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "NBA", item: absoluteUrl(NBA_PAGE.path) },
        { "@type": "ListItem", position: 3, name: `${match.homeTeam} vs ${match.awayTeam}`, item: url },
      ],
    },
  ];
}

export default async function NbaMatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const match = findNbaMatch(slug);
  if (!match) notFound();

  const analysisFree = match.analysisAccess === "free";
  const predictionFree = match.predictionAccess === "free";
  const others = allNbaMatches().filter((m) => m.slug !== slug);

  return (
    <article className="section match-page">
      <JsonLd data={buildJsonLd(match)} />
      <div className="container">
        <nav className="psp-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href={NBA_PAGE.path}>NBA</Link> /{" "}
          <span>{`${match.homeTeam} vs ${match.awayTeam}`}</span>
        </nav>

        <header className="psp-hero">
          <div className="psp-meta-row">
            <span className="psp-badge psp-badge--free">NBA</span>
            <span>
              {formatMatchDate(match.matchInfo.date)} · {match.matchInfo.time}
            </span>
            <span>{match.venue}</span>
          </div>
          <h1>{`${match.homeTeam} vs ${match.awayTeam} Prediction, Odds and Betting Tips`}</h1>
          <div className="psp-chips">
            <span className={`psp-badge ${analysisFree ? "psp-badge--free" : "psp-badge--vip"}`}>
              {analysisFree ? "FREE ANALYSIS" : "PRIME VIP ANALYSIS"}
            </span>
            <span className={`psp-badge ${predictionFree ? "psp-badge--free" : "psp-badge--vip"}`}>
              {predictionFree ? "FREE PREDICTION" : "PRIME VIP PREDICTION"}
            </span>
          </div>
          <ArticleByline />
          <p className="match-dates">Published: {formatMatchDate("2026-10-19")} · Updated: {formatMatchDate("2026-10-19")}</p>
          <p className="match-seo-intro">{match.teaser}</p>
          <SiteContactLine />
        </header>

        <div className="psp-match-body">
          <div className="psp-match-main">
            <div className="psp-teams">
              <span className="psp-team"><TeamBadge team={match.homeTeam} /> <strong>{match.homeTeam}</strong></span>
              <span className="psp-vs">vs</span>
              <span className="psp-team"><TeamBadge team={match.awayTeam} /> <strong>{match.awayTeam}</strong></span>
            </div>

            {analysisFree ? (
              <MatchFullContent
                analysis={match.analysis}
                analysisFormat={match.analysisFormat}
                sources={match.sources}
                comment={null}
                prediction={predictionFree ? { main: match.pick, odds: match.odds } : null}
                labels={{ prediction: L.prediction, odds: L.odds, analysis: "Game analysis", sources: translate("en", "matchSourcesHeading") }}
              />
            ) : (
              <div data-prediction-reveal="locked" data-protected-content="analysis" className="match-gate-slot">
                <MatchGate slug={match.slug} showAnalysis={analysisFree} showPrediction={predictionFree} variant="game" />
              </div>
            )}

            <PrimeVipOfferCard />
          </div>

          <aside className="psp-match-side">
            <div className="psp-related">
              {others.length ? (
                <section className="related-predictions">
                  <h2>More NBA predictions</h2>
                  <ul>
                    {others.map((m) => (
                      <li key={m.slug}>
                        <Link href={`/nba/${m.slug}/`} aria-label={`${m.homeTeam} vs ${m.awayTeam} Prediction`}>
                          {`${m.homeTeam} vs ${m.awayTeam} Prediction`}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              <nav className="related-predictions related-predictions--hubs" aria-label="Prediction hubs">
                <Link href={NBA_PAGE.path}>All NBA predictions</Link>
                <Link href="/">Home</Link>
              </nav>
            </div>
          </aside>
        </div>

        <div className="psp-notice">
          <ResponsibleGamblingNotice />
        </div>
      </div>
    </article>
  );
}
