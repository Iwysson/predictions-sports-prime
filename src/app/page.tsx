import { AdSlot } from "@/components/ads";
import { LeagueCard } from "@/components/LeagueCard";
import { HomePredictionFeed } from "@/components/HomePredictionFeed";
import { SectionTitle } from "@/components/SectionTitle";
import { featuredLeagues, otherLeaguesCard } from "@/data/leagues";
import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import {
  findFixtureByTeams,
  loadLeagueSeason,
} from "@/lib/openfootball";
import type { MatchPreview } from "@/types";

async function hydrateMatchAtBuild(match: MatchPreview): Promise<MatchPreview> {
  try {
    const rounds = await loadLeagueSeason(match.league);
    const fixture = findFixtureByTeams(
      rounds,
      match.homeTeam,
      match.awayTeam
    );

    if (!fixture) return match;

    return {
      ...match,
      round: `Matchday ${fixture.round}`,
      date: match.date || fixture.date,
      time: fixture.time,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
    };
  } catch {
    return match;
  }
}

export default async function Home() {
  const hydratedMatches = await Promise.all(
    matches.map(toMatchPreview).map(hydrateMatchAtBuild)
  );

  return (
    <>
      <HomePredictionFeed matches={hydratedMatches} />

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
