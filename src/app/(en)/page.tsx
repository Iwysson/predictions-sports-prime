import type { Metadata } from "next";
import { AdSlot } from "@/components/ads";
import { JsonLd } from "@/components/JsonLd";
import { HomePredictionFeed } from "@/components/HomePredictionFeed";
import { PredictionLeagueCategories } from "@/components/PredictionLeagueCategories";
import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import Link from "next/link";
import { homePageJsonLd } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/international-seo";
import { indexableLocalizedHubLocaleSlugs } from "@/lib/seo-locales";

const homeTitle = "Football Predictions Today & Betting Tips | Predictions Sports Prime";
const homeDescription = "Football predictions, betting tips and match analysis for today's, tomorrow's and upcoming fixtures across the Premier League, La Liga, Serie A and more.";

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
      alt: `${siteConfig.name} football predictions and match analysis`,
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

  return (
    <>
      <JsonLd data={homePageJsonLd()} />
      <section className="page-hero home-seo-hero" aria-labelledby="home-title">
        <div className="container">
          <span className="eyebrow">Predictions Sports Prime</span>
          <h1 id="home-title">Football Predictions Today &amp; Betting Tips</h1>
          <p>
            Explore independently prepared football predictions, betting tips and
            concise match analysis for today, tomorrow and upcoming fixtures across
            major leagues and cup competitions.
          </p>
        </div>
      </section>
      <HomePredictionFeed
        matches={resolvedMatches}
        beforeHistory={
          <>
            <div className="container inline-ad-space">
              <AdSlot placement="home-middle" />
            </div>

            <PredictionLeagueCategories id="leagues" muted />
          </>
        }
      />

      <div className="container bottom-ad-space">
        <AdSlot placement="home-bottom" />
      </div>

      <section className="section section--compact" aria-labelledby="trust-links-title">
        <div className="container">
          <h2 id="trust-links-title">How Our Football Predictions Work</h2>
          <p>
            Each analysis weighs the relevant evidence available for that fixture,
            which may include recent form, home and away performance, goals, corners,
            shots, tactical context, scheduling, verified team news and market price.
            Read the full <Link href="/methodology/">analysis methodology</Link>.
          </p>
          <p>
            Predictions are editorial opinions published before settlement with
            their recorded odds. Wins and losses remain visible in our public
            <Link href="/results/"> Results archive</Link>, and every analysis identifies
            <Link href="/author/iwysson-nascimento/"> its author</Link>. Learn more
            <Link href="/about/"> about Predictions Sports Prime</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
