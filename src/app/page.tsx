import { AdSlot } from "@/components/ads";
import { LeagueCard } from "@/components/LeagueCard";
import { HomePredictionFeed } from "@/components/HomePredictionFeed";
import { SectionTitle } from "@/components/SectionTitle";
import { featuredLeagues, otherLeaguesCard } from "@/data/leagues";
import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";

export default function Home() {
  return (
    <>
      <HomePredictionFeed matches={matches.map(toMatchPreview)} />

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
            {[...featuredLeagues, otherLeaguesCard].map((league) => (
              <LeagueCard key={league.slug} {...league} />
            ))}
          </div>
        </div>
      </section>

      <div className="container bottom-ad-space">
        <AdSlot placement="home-bottom" />
      </div>
    </>
  );
}
