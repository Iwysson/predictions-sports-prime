import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { HomePredictionFeed } from "@/components/HomePredictionFeed";
import footballResults from "@/data/football-results.snapshot.json";
import { latestWinResults, sortedResults, toPublicResult, type FootballResultsDataset } from "@/lib/football-results";
import { PredictionLeagueCategories } from "@/components/PredictionLeagueCategories";
import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import { isDateReleased } from "@/lib/match-release";
import { homePageJsonLd } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/international-seo";
import { indexableLocalizedHubLocaleSlugs } from "@/lib/seo-locales";
import { selectTemporalClientMatches } from "@/lib/match-feed";
import { PrimeVipOfferCard } from "@/components/PrimeVipOfferCard";
import { SiteContactLine } from "@/components/SiteContactLine";
import { VipTitleCta } from "@/components/VipTitleCta";

const homeTitle = "Football Predictions Today & Betting Tips | Predictions Sports Prime";
const homeDescription = "Football predictions for today's fixtures across major leagues and cups, with published odds, identified sources and a transparent results record.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: localizedAlternates("en", "/", ["en", ...indexableLocalizedHubLocaleSlugs]),
  openGraph: {
    type: "website",
    title: homeTitle,
    description: homeDescription,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    images: [{
      url: absoluteUrl("/og-default.png"),
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} football predictions`,
    }],
  },
  twitter: {
    card: siteConfig.twitterCard,
    title: homeTitle,
    description: homeDescription,
    images: [absoluteUrl("/og-default.png")],
  },
  robots: { index: true, follow: true },
};

export default async function Home() {
  const resolvedMatches = await hydratePredictions(matches.map(toMatchPreview));
  const clientMatches = selectTemporalClientMatches(resolvedMatches, true).filter((match) => isDateReleased(match.date, undefined, match.releaseTimeZone));

  return (
    <>
      <JsonLd data={homePageJsonLd()} />
      <section className="page-hero home-seo-hero" aria-labelledby="home-title">
        <div className="container">
          <span className="eyebrow">Predictions Sports Prime</span>
          <VipTitleCta id="home-title">Football Predictions Today &amp; Betting Tips</VipTitleCta>
          <p>
            Explore independently prepared football predictions and betting tips
            for today's fixtures across major leagues and cup competitions.
          </p>
          <SiteContactLine />
        </div>
      </section>
      <PrimeVipOfferCard />

      {/* Section 1 — Today's Football Predictions: only fixtures released for today, FREE/VIP tiers preserved. */}
      {/* Section 2 — Results (unchanged): rendered inside HomePredictionFeed as its #history section. */}
      <HomePredictionFeed
        matches={clientMatches}
        results={latestWinResults(footballResults as FootballResultsDataset, 8).map(toPublicResult)}
        trackRecordResults={sortedResults(footballResults as FootballResultsDataset).map(toPublicResult)}
      />

      {/* Section 3 — Predictions by League: every football competition covered by the site. */}
      <PredictionLeagueCategories id="leagues" muted />
    </>
  );
}
