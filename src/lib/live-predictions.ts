import type { MatchPreview } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import { findFixtureForPrediction, loadLeagueSeason, teamNamesMatch } from "@/lib/openfootball";
import { resolvePredictionResult } from "@/lib/prediction-results";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";
import marketResults from "@/data/market-results.snapshot.json";
import footballResults from "@/data/football-results.snapshot.json";
import { overlayStoredResult, type FootballResultsDataset } from "@/lib/football-results";
import historicalResults from "@/data/historical-results.supplement.json";
import resultEvidence from "@/data/football-result-evidence.snapshot.json";
import type { ResultEvidenceDataset } from "@/lib/result-reconciliation";

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

const reconciledEvidence = (resultEvidence as ResultEvidenceDataset).records;

function kickoffDateKey(kickoffUtc: string, league: string) {
  const instant = new Date(kickoffUtc);
  if (Number.isNaN(instant.getTime())) return null;
  const timeZone = leaguesBySlug[league as keyof typeof leaguesBySlug]?.timezone ?? "UTC";
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
}

function withHistoricalSupplement(match: MatchPreview): MatchPreview {
  const key = `${match.league}:${match.slug}`;
  // Provider evidence captured by results:reconcile. It fills a result the fixture feed does not hold,
  // and never overrides a final score the feed already has or the hand-audited supplement below.
  const evidence = reconciledEvidence[key];
  if (evidence && !historicalSupplement.records[key] && !isHistoryEligibleFixture({ status: match.fixtureStatus, homeScore: match.homeScore, awayScore: match.awayScore })) {
    match = {
      ...match,
      fixtureStatus: evidence.status,
      // The provider event is what was actually played: a stale fixture link can hold an older date.
      kickoffUtc: evidence.kickoffUtc,
      date: kickoffDateKey(evidence.kickoffUtc, match.league) ?? match.date,
      ...(evidence.homeScore !== undefined ? { homeScore: evidence.homeScore } : {}),
      ...(evidence.awayScore !== undefined ? { awayScore: evidence.awayScore } : {}),
    };
  }
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
 * The editorial names are the published display names. Provider spellings ("Tromso",
 * "Hamarkameratene", "Amed SFK") must not replace them; only a fixture that is clearly the
 * reverse of the published pairing (a documented home/away relocation) swaps the sides.
 */
export function displayTeams(
  match: { homeTeam: string; awayTeam: string },
  fixture: { homeTeam: string; awayTeam: string }
) {
  const reversed = teamNamesMatch(fixture.homeTeam, match.awayTeam) && teamNamesMatch(fixture.awayTeam, match.homeTeam);
  return reversed
    ? { homeTeam: fixture.homeTeam, awayTeam: fixture.awayTeam }
    : { homeTeam: match.homeTeam, awayTeam: match.awayTeam };
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
      ...displayTeams(match, fixture),
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
