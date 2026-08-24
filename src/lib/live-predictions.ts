import type { MatchPreview } from "@/types";
import { findFixtureForPrediction, loadLeagueSeason } from "@/lib/openfootball";
import { resolvePredictionResult } from "@/lib/prediction-results";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";
import marketResults from "@/data/market-results.snapshot.json";

type MarketResultSnapshot = Record<string, NonNullable<MatchPreview["marketStats"]>>;
const marketStatsByMatch = marketResults as MarketResultSnapshot;

function withMarketStats(match: MatchPreview): MatchPreview {
  const marketStats = marketStatsByMatch[`${match.league}:${match.slug}`];
  return marketStats ? { ...match, marketStats } : match;
}

/**
 * Applies the latest fixture status and score to an editorial prediction.
 * This is shared by the static build and the browser refresh so a result does
 * not depend on a new deployment after the final whistle.
 */
export async function hydratePrediction(match: MatchPreview): Promise<MatchPreview> {
  match = withMarketStats(match);
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

    const hydrated: MatchPreview = {
      ...match,
      fixtureId: fixture.id,
      kickoffUtc: fixture.kickoffUtc,
      timeConfirmed: fixture.timeConfirmed,
      round: `Matchday ${fixture.round}`,
      date: fixture.date,
      time: fixture.time,
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
