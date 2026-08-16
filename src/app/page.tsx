import { AdSlot } from "@/components/AdSlot";
import { LeagueCard } from "@/components/LeagueCard";
import { HomePredictionFeed } from "@/components/HomePredictionFeed";
import { SectionTitle } from "@/components/SectionTitle";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";

export default function Home() {
  return (
    <>
      <div className="container top-ad-space">
        <AdSlot />
      </div>

      <HomePredictionFeed matches={matches} />

      <div className="container inline-ad-space">
        <AdSlot />
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
            {leagues.map((league) => (
              <LeagueCard key={league.slug} {...league} />
            ))}
          </div>
        </div>
      </section>

      <div className="container bottom-ad-space">
        <AdSlot />
      </div>
    </>
  );
}
