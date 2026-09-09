import type { MatchPreview } from "@/types";
import { findFixtureForPrediction, loadLeagueSeason } from "@/lib/openfootball";
import { resolvePredictionResult } from "@/lib/prediction-results";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";
import marketResults from "@/data/market-results.snapshot.json";
import historicalResults from "@/data/historical-results.supplement.json";

type MarketResultSnapshot = Record<string, NonNullable<MatchPreview["marketStats"]>>;
const marketStatsByMatch = marketResults as MarketResultSnapshot;

type HistoricalSupplement = {
  records: Record<string, {
    facts: {
      status?: "completed";
      homeScore?: number;
      awayScore?: number;
      homeCorners?: number;
      awayCorners?: number;
    };
    provenance: { sourceUrl: string };
  }>;
  unresolved: Record<string, {
    missingFact: string;
    reason: string;
    sourcesChecked: Array<{ name: string; url: string; checkedAt: string }>;
  }>;
};
const historicalSupplement = historicalResults as HistoricalSupplement;

function withMarketStats(match: MatchPreview): MatchPreview {
  const marketStats = marketStatsByMatch[`${match.league}:${match.slug}`];
  return marketStats ? { ...match, marketStats } : match;
}

function withHistoricalSupplement(match: MatchPreview): MatchPreview {
  const key = `${match.league}:${match.slug}`;
  const record = historicalSupplement.records[key];
  if (record) {
    const facts = record.facts;
    return {
      ...match,
      fixtureStatus: facts.status ?? match.fixtureStatus,
      homeScore: facts.homeScore ?? match.homeScore,
      awayScore: facts.awayScore ?? match.awayScore,
      marketStats: facts.homeCorners !== undefined && facts.awayCorners !== undefined
        ? {
            homeCorners: facts.homeCorners,
            awayCorners: facts.awayCorners,
            source: record.provenance.sourceUrl,
            capturedAt: historicalResults.retrievedAt,
          }
        : match.marketStats,
    };
  }
  const unresolved = historicalSupplement.unresolved[key];
  return unresolved
    ? { ...match, historicalResolution: { status: "true-unresolved", ...unresolved } }
    : match;
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

    if (!fixture) return resolvePredictionResult(withHistoricalSupplement(match));

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
      return resolvePredictionResult(withHistoricalSupplement(match));
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

    return resolvePredictionResult(withHistoricalSupplement(hydrated));
  } catch {
    return resolvePredictionResult(withHistoricalSupplement(match));
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
