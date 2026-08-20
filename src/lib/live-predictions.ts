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
    const providerCanOverrideKickoff = isLiveData &&
      (fixture.status === "in-progress" || fixture.status === "completed" || !match.date);
    const hydrated: MatchPreview = {
      ...match,
      round: `Matchday ${fixture.round}`,
      date: providerCanOverrideKickoff ? fixture.date : match.date || fixture.date,
      time: providerCanOverrideKickoff && fixture.time !== "TBD"
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

export async function hydratePredictions(
  matches: MatchPreview[],
  options: { forceRefresh?: boolean } = {}
) {
  if (options.forceRefresh) {
    const leagues = [...new Set(matches.map((match) => match.league))];
    await Promise.allSettled(
      leagues.map((league) => loadLeagueSeason(league, { forceRefresh: true }))
    );
  }

  return Promise.all(matches.map(hydratePrediction));
}
