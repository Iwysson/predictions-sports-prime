import type { MatchPreview } from "@/types";
import { findFixtureForPrediction, loadLeagueSeason } from "@/lib/openfootball";
import { resolvePredictionResult } from "@/lib/prediction-results";
import { isHistoryEligibleFixture, selectFixtureKickoff } from "@/lib/fixture-status";

/**
 * Applies the latest fixture status and score to an editorial prediction.
 * This is shared by the static build and the browser refresh so a result does
 * not depend on a new deployment after the final whistle.
 */
export async function hydratePrediction(match: MatchPreview): Promise<MatchPreview> {
  try {
    const rounds = await loadLeagueSeason(match.league);
    const fixture = findFixtureForPrediction(rounds, match);

    if (!fixture) return resolvePredictionResult(match);

    // A delayed provider must never roll a confirmed final score back to
    // scheduled. This also keeps History stable during feed outages.
    const storedResultIsComplete = isHistoryEligibleFixture({
      status: match.fixtureStatus,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    });
    const providerResultIsComplete = isHistoryEligibleFixture({
      status: fixture.status,
      homeScore: fixture.homeScore,
      awayScore: fixture.awayScore,
    });

    if (storedResultIsComplete && !providerResultIsComplete) {
      return resolvePredictionResult(match);
    }

    const hasVerifiedEditorialDate = Boolean(match.date);
    const hasVerifiedEditorialTime = Boolean(match.time && match.time !== "TBD");
    const kickoff = selectFixtureKickoff({
      fallbackDate: match.date,
      fallbackTime: match.time,
      providerDate: fixture.date,
      providerTime: fixture.time,
      providerIsAuthoritative: !hasVerifiedEditorialDate && !hasVerifiedEditorialTime,
    });
    const hydrated: MatchPreview = {
      ...match,
      fixtureId: fixture.id,
      kickoffUtc: hasVerifiedEditorialDate || hasVerifiedEditorialTime
        ? undefined
        : fixture.kickoffUtc,
      timeConfirmed: hasVerifiedEditorialTime ? true : fixture.timeConfirmed,
      round: `Matchday ${fixture.round}`,
      date: hasVerifiedEditorialDate ? match.date : kickoff.date,
      time: hasVerifiedEditorialTime ? match.time : fixture.time,
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
