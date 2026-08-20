import { AdSlot } from "@/components/ads";
import { LeagueCard } from "@/components/LeagueCard";
import { HomePredictionFeed } from "@/components/HomePredictionFeed";
import { SectionTitle } from "@/components/SectionTitle";
import { homeLeagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import Link from "next/link";

export default async function Home() {
  const resolvedMatches = await hydratePredictions(matches.map(toMatchPreview));

  return (
    <>
      <HomePredictionFeed matches={resolvedMatches} />

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
            titleKey="topLeagues"
          />

          <div className="league-grid league-grid--compact">
            {homeLeagues.map((league) => (
              <LeagueCard key={league.slug} {...league} />
            ))}
          </div>
        </div>
      </section>

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
