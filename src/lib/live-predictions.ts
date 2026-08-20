import type { MatchPreview } from "@/types";
import { findFixtureByTeams, loadLeagueSeason } from "@/lib/openfootball";
import { resolvePredictionResult } from "@/lib/prediction-results";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";

/**
 * Applies the latest fixture status and score to an editorial prediction.
 * This is shared by the static build and the browser refresh so a result does
 * not depend on a new deployment after the final whistle.
 */
export async function hydratePrediction(match: MatchPreview): Promise<MatchPreview> {
  try {
    const rounds = await loadLeagueSeason(match.league);
    const fixture = findFixtureByTeams(rounds, match.homeTeam, match.awayTeam);

    if (!fixture) return resolvePredictionResult(match);

    // A delayed provider must never roll a confirmed final score back to
    // scheduled. This also keeps History stable during feed outages.
    if (
      isHistoryEligibleFixture({
        status: match.fixtureStatus,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
      }) && fixture.status !== "completed"
    ) {
      return resolvePredictionResult(match);
    }

    const isLiveData = fixture.dataSource === "espn";
    const hydrated: MatchPreview = {
      ...match,
      round: `Matchday ${fixture.round}`,
      date: isLiveData ? fixture.date : match.date || fixture.date,
      time: isLiveData && fixture.time !== "TBD"
        ? fixture.time
        : match.time !== "TBD"
          ? match.time
          : fixture.time,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      fixtureStatus: fixture.status,
      homeScore: fixture.homeScore,
      awayScore: fixture.awayScore,
    };

    return resolvePredictionResult(hydrated);
  } catch {
    return resolvePredictionResult(match);
  }
}

export function hydratePredictions(matches: MatchPreview[]) {
  return Promise.all(matches.map(hydratePrediction));
}
