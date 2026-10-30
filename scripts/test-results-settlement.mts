// Settlement of every market the site publishes, simple and combined, including each spelling found in the
// published history. Run: npm run test:results-settlement
import assert from "node:assert/strict";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { evaluatePredictionSettlement, parsePredictionMarket } from "../src/lib/prediction-results.ts";
import { settleFromMatch, summarizeResults, sortedResults, buildResultsDataset, emptyResultsDataset } from "../src/lib/football-results.ts";
import type { MatchPreview } from "../src/types/index.ts";

const match = (mainPrediction: string, home: number, away: number, extra: Partial<MatchPreview> = {}) =>
  ({ league: "ligue-1", slug: "test", homeTeam: "Lille", awayTeam: "Paris Saint-Germain", date: "2026-10-30", status: "published", predictionAccess: "free", fixtureStatus: "completed", homeScore: home, awayScore: away, mainPrediction, odds: 1.7, ...extra }) as MatchPreview;
const grade = (pick: string, home: number, away: number, extra?: Partial<MatchPreview>) => evaluatePredictionSettlement(match(pick, home, away, extra)).status;
const corners = (home: number, away: number) => ({ marketStats: { homeCorners: home, awayCorners: away } as NonNullable<MatchPreview["marketStats"]> });

// Moneyline, in every published spelling
for (const pick of ["Lille to Win", "Lille Win", "Lille to win (90 minutes)", "Lille to win (90-minute moneyline)"]) {
  assert.equal(grade(pick, 2, 1), "green", pick);
  assert.equal(grade(pick, 1, 1), "red", pick);
  assert.equal(grade(pick, 0, 1), "red", pick);
}
assert.equal(grade("Paris Saint-Germain to Win", 0, 2), "green");
assert.equal(grade("PSG to Win", 2, 0), "red");

// Double chance
for (const pick of ["Lille or Draw (1X)", "Lille or Draw", "Lille double chance (1X)", "Lille 1X", "Lille X1", "1X", "1X (Lille or Draw)", "Lille or Draw (Double Chance)"]) {
  assert.equal(grade(pick, 1, 1), "green", pick);
  assert.equal(grade(pick, 2, 0), "green", pick);
  assert.equal(grade(pick, 0, 1), "red", pick);
}
for (const pick of ["Paris Saint-Germain or Draw (X2)", "X2", "Paris Saint-Germain X2"]) {
  assert.equal(grade(pick, 1, 1), "green", pick);
  assert.equal(grade(pick, 1, 2), "green", pick);
  assert.equal(grade(pick, 2, 1), "red", pick);
}

// Handicaps: half lines in every spelling
for (const pick of ["Lille -1.5", "Lille -1.5 Handicap", "Lille -1.5 Goals (handicap)", "Lille -1.5 Goal Handicap", "Lille -1.5 Goals Handicap", "Lille -1.5 Asian handicap", "Lille -1.5 Asian/European Goal Handicap", "Lille -1.5 (win by 2+ goals)", "Lille -1.5 Asian handicap (win by 2+ goals)", "Lille handicap -1.5"]) {
  assert.equal(grade(pick, 2, 0), "green", pick);
  assert.equal(grade(pick, 2, 1), "red", pick);
}
assert.equal(grade("Paris Saint-Germain +1.5 Goals (handicap)", 2, 1), "green");
assert.equal(grade("Paris Saint-Germain +1.5 Goals (handicap)", 3, 1), "red");
// Asian whole and quarter lines
assert.equal(grade("Lille -1 Asian Handicap", 2, 1), "push");
assert.equal(grade("Lille -1 Asian Handicap", 3, 1), "green");
assert.equal(grade("Lille -0.75 Asian Handicap", 2, 1), "half-green");
assert.equal(grade("Lille -1.25 Asian Handicap", 2, 1), "half-red");
// European whole line: landing on it loses, no refund
assert.equal(grade("Lille -1 European Handicap", 2, 1), "red");
assert.equal(grade("Lille -1 European Handicap", 3, 1), "green");
// An unstated type is only ambiguous when the margin lands exactly on the line
const ambiguous = evaluatePredictionSettlement(match("Lille handicap -2", 3, 1));
assert.equal(ambiguous.status, "pending");
assert.equal(ambiguous.pendingReason, "HANDICAP_TYPE_AMBIGUOUS");
assert.equal(grade("Lille handicap -2", 4, 1), "green");
assert.equal(grade("Lille handicap -2", 2, 1), "red");

// Totals
for (const pick of ["Over 2.5", "Over 2.5 Goals", "Over 2.5 goals", "Over 2.5 Total Goals", "Over 2.5 total goals"]) {
  assert.equal(grade(pick, 2, 1), "green", pick);
  assert.equal(grade(pick, 1, 1), "red", pick);
}
assert.equal(grade("Under 4.5 Total Goals", 2, 2), "green");
assert.equal(grade("Under 4.5 Total Goals", 3, 2), "red");
assert.equal(grade("Over 2 Goals", 1, 1), "push");

// Corners: never graded without the statistic
const noCorners = evaluatePredictionSettlement(match("Over 7.5 Total Corners", 2, 1));
assert.equal(noCorners.status, "awaiting-data");
assert.equal(noCorners.pendingReason, "MARKET_DATA_MISSING");
assert.equal(grade("Over 7.5 Total Corners", 0, 0, corners(5, 3)), "green");
assert.equal(grade("Over 7.5 Total Corners", 0, 0, corners(4, 3)), "red");
assert.equal(grade("Lille Over 4.5 Corners", 0, 0, corners(5, 0)), "green");

// Combinations: every leg counts
assert.equal(grade("Sporting CP to Win + Over 2.5 Goals", 0, 3, { homeTeam: "Casa Pia", awayTeam: "Sporting CP" }), "green");
assert.equal(grade("Sporting CP to Win + Over 2.5 Goals", 0, 2, { homeTeam: "Casa Pia", awayTeam: "Sporting CP" }), "red");
assert.equal(grade("Sporting CP to Win + Over 2.5 Goals", 2, 1, { homeTeam: "Casa Pia", awayTeam: "Sporting CP" }), "red");
assert.equal(grade("Lille or Draw (1X) + Over 1.5 Goals", 1, 1), "green");
assert.equal(grade("Lille or Draw (1X) + Over 1.5 Goals", 1, 0), "red");
assert.equal(grade("Lille or Draw (1X) + Over 1.5 Goals", 1, 2), "red");
assert.equal(grade("Lille or Draw (1X) + Under 4.5 Total Goals", 3, 2), "red");
assert.equal(grade("Over 1.5 Goals + Over 7.5 Total Corners", 1, 1, corners(5, 4)), "green");
assert.equal(grade("Over 1.5 Goals + Over 7.5 Total Corners", 2, 0, corners(4, 3)), "red");
assert.equal(grade("Over 1.5 Goals + Over 7.5 Total Corners", 1, 0, corners(5, 4)), "red");
// A failed goals leg decides the combination, but a missing statistic on a live leg never yields GREEN.
assert.equal(grade("Over 1.5 Goals + Over 7.5 Total Corners", 2, 0), "awaiting-data");
// Push combined with a winning leg: the pushed leg is refunded, the other still wins.
assert.equal(grade("Over 2 Goals + Lille to Win", 2, 0), "green");
assert.equal(grade("Over 2 Goals + Lille to Win", 1, 1), "red");
assert.equal(grade("Lille -1 Asian Handicap + Under 4.5 Goals", 2, 1), "green");

// Never settled by presumption
for (const fixtureStatus of ["scheduled", "in-progress", "postponed", "suspended", "abandoned", "rescheduled"] as const) {
  assert.equal(settleFromMatch(match("Lille to Win", 2, 0, { fixtureStatus }), "t"), null, fixtureStatus);
}
assert.equal(settleFromMatch(match("Lille to Win", null as unknown as number, 0), "t"), null);
assert.equal(evaluatePredictionSettlement(match("Some unknown market", 2, 0)).pendingReason, "UNSUPPORTED_MARKET");

// A cancelled fixture is VOID, with no invented score, and stays out of the win rate.
const voided = settleFromMatch(match("Lille to Win", null as unknown as number, null as unknown as number, { fixtureStatus: "canceled" }), "t");
assert.equal(voided?.result, "void");
assert.equal(voided?.finalScore, null);
assert.equal(summarizeResults([voided!]).winRate, null);

// Idempotent: a stored settlement survives a provider rollback and is never reassigned.
const once = buildResultsDataset([match("Lille to Win", 2, 0)], emptyResultsDataset(), "first");
const again = buildResultsDataset([match("Lille to Win", 0, 2)], once, "second");
assert.deepEqual(again, once);
assert.equal(Object.keys(again.records).length, 1);

// Chronological order does not depend on when a record was settled.
const dated = (key: string, date: string, settledAt: string) => ({ key, date, settledAt }) as never;
assert.deepEqual(
  sortedResults({ version: 1, records: { a: dated("a", "2026-10-01", "2026-10-30"), b: dated("b", "2026-10-20", "2026-10-21"), c: dated("c", "2026-10-20", "2026-10-30") } }).map((r) => r.key),
  ["b", "c", "a"]
);

// The whole published inventory has to be understood by the parser, so nothing stays open because of spelling.
const unparsed = editorialPredictions
  .filter((prediction) => prediction.published === true)
  .flatMap((prediction) => parsePredictionMarket(prediction.picks.main).unsupportedLegs.map((leg) => `${prediction.slug}: ${leg}`));
assert.deepEqual(unparsed, []);

console.log("results settlement tests passed");
