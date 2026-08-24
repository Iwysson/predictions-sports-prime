import type { Metadata } from "next";
import { AdSlot } from "@/components/ads";
import { JsonLd } from "@/components/JsonLd";
import { LeagueCard } from "@/components/LeagueCard";
import { HomePredictionFeed } from "@/components/HomePredictionFeed";
import { SectionTitle } from "@/components/SectionTitle";
import { homeLeagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import Link from "next/link";
import { homePageJsonLd } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const homeTitle = "Predictions Sports Prime | Football Predictions & Betting Tips";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    title: homeTitle,
    description: siteConfig.description,
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
    description: siteConfig.description,
    images: [absoluteUrl("/og-default.png")],
  },
  robots: { index: true, follow: true },
};

export default async function Home() {
  const resolvedMatches = await hydratePredictions(matches.map(toMatchPreview));

  return (
    <>
      <JsonLd data={homePageJsonLd()} />
      <HomePredictionFeed
        matches={resolvedMatches}
        beforeHistory={
          <>
            <div className="container inline-ad-space">
              <AdSlot placement="home-middle" />
            </div>

            <section
              className="section section--compact section--muted"
              id="leagues"
            >
              <div className="container">
                <SectionTitle
                  icon="♜"
                  eyebrowKey="competitions"
                  titleKey="predictionCategories"
                />

                <div className="league-grid league-grid--compact">
                  {homeLeagues.map((league) => (
                    <LeagueCard key={league.slug} {...league} />
                  ))}
                </div>
              </div>
            </section>
          </>
        }
      />

      <div className="container bottom-ad-space">
        <AdSlot placement="home-bottom" />
      </div>

      <section className="section section--compact" aria-labelledby="trust-links-title">
        <div className="container">
          <h2 id="trust-links-title">How this publication works</h2>
          <p>
            Learn about <Link href="/author/iwysson-nascimento/">the author</Link>,
            our <Link href="/methodology/">analysis methodology</Link> and the
            complete <Link href="/results/">prediction results</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
