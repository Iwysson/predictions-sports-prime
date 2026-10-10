import type { FootballResultsDataset } from "@/lib/football-results";
import { sortedResults, toPublicResult } from "@/lib/football-results";

export type MobileResultRecord = {
  slug: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  prediction: string;
  odds: number | null;
  result: "green" | "red" | "push" | "half-green" | "half-red" | "void";
};

export type MobileResultsIndex = {
  generatedAt: string;
  records: MobileResultRecord[];
};

// Settled results are public on the website regardless of a prediction's original
// FREE/BEST BET/PRIME VIP tier (see src/lib/football-results.ts: "settled picks are
// public in Results"). The app's Results screen must stay just as public - it must
// never be gated behind PRIME VIP, which is a different feature
// (functions/api/history-predictions.js, a VIP-only editorial history dataset).
export function buildMobileResultsIndex(dataset: FootballResultsDataset): MobileResultsIndex {
  const records = sortedResults(dataset).map(toPublicResult).map((r) => ({
    slug: r.slug,
    league: r.league,
    homeTeam: r.homeTeam,
    awayTeam: r.awayTeam,
    date: r.date,
    prediction: r.prediction,
    odds: r.odds,
    result: r.result,
  }));
  return { generatedAt: new Date().toISOString(), records };
}
