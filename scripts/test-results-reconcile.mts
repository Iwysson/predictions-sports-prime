// Reconciliation rules, the pending ledger, the no-deploy results feed, and the integrity of the real history.
// Run: npm run test:results-reconcile
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { decideEvidence, espnRegulationScore, fotmobRegulationScore, matchFixture, mergeEvidence, sameClub, type ProviderObservation } from "../src/lib/result-reconciliation.ts";
import { buildPendingLedger, hasKickedOff, type PendingResultsDataset } from "../src/lib/pending-results.ts";
import { emptyResultsDataset, type FootballResultsDataset } from "../src/lib/football-results.ts";
import { settlementPreviews } from "../src/lib/settlement-source.ts";
import { mergeResultsFeed } from "../functions/_lib/results-feed.js";
import { createResultsHandler } from "../functions/api/results/index.js";
import type { MatchPreview } from "../src/types/index.ts";

const observation = (over: Partial<ProviderObservation> = {}): ProviderObservation => ({
  provider: "espn", eventId: "1", homeTeam: "Lille", awayTeam: "Lens", kickoffUtc: "2026-10-30T20:05:00Z", status: "completed", regulationScore: true, homeScore: 2, awayScore: 1, sourceUrl: "https://example.test", ...over,
});

// Identity
assert.ok(sameClub("Red Bull New York", "New York Red Bulls"));
assert.ok(sameClub("Heart of Midlothian", "Hearts"));
assert.ok(sameClub("Union St.-Gilloise", "Union SG"));
assert.ok(sameClub("Slavia Prague", "Slavia Praha"));
assert.ok(sameClub("Casa Pia AC", "Casa Pia"));
assert.ok(sameClub("SV Elversberg", "Elversberg"));
assert.ok(!sameClub("Manchester City U21", "Manchester City"), "a youth side is another team");
assert.ok(!sameClub("Red Bull New York II", "New York Red Bulls"), "a reserve side is another team");
assert.ok(!sameClub("Manchester City", "Manchester United"));

const fixture = { homeTeam: "Lille", awayTeam: "Lens" };
assert.equal(matchFixture(fixture, [observation()]).kind, "matched");
assert.equal(matchFixture(fixture, [observation({ homeTeam: "Lens", awayTeam: "Lille" })]).kind, "reversed", "a reverse fixture is never graded");
assert.equal(matchFixture(fixture, [observation({ homeTeam: "Nice", awayTeam: "Rennes" })]).kind, "none");
assert.equal(matchFixture(fixture, [observation(), observation({ eventId: "2" })]).kind, "ambiguous", "two events from one provider");
assert.equal(matchFixture(fixture, [observation(), observation({ provider: "fotmob" })]).kind, "matched");

// Evidence
assert.equal(decideEvidence([observation()], "t").kind, "final");
assert.equal(decideEvidence([observation(), observation({ provider: "fotmob" })], "t").kind, "final");
const conflict = decideEvidence([observation(), observation({ provider: "fotmob", homeScore: 3 })], "t");
assert.deepEqual(conflict, { kind: "pending", reason: "SCORE_CONFLICT" }, "disagreeing providers prove nothing");
assert.deepEqual(decideEvidence([observation({ regulationScore: false })], "t"), { kind: "pending", reason: "EXTRA_TIME_SCORE_UNVERIFIED" });
const regulationWins = decideEvidence([observation({ homeScore: 0, awayScore: 1 }), observation({ provider: "fotmob", homeScore: 1, awayScore: 2, regulationScore: false })], "t");
assert.ok(regulationWins.kind === "final" && regulationWins.evidence.homeScore === 0, "the 90-minute score beats a total after extra time");
assert.deepEqual(decideEvidence([observation({ status: "scheduled", homeScore: null, awayScore: null })], "t"), { kind: "pending", reason: "NOT_COMPLETED" });
assert.deepEqual(decideEvidence([observation({ status: "in-progress" })], "t"), { kind: "pending", reason: "NOT_COMPLETED" });
assert.deepEqual(decideEvidence([observation({ status: "postponed", homeScore: null, awayScore: null })], "t"), { kind: "pending", reason: "FIXTURE_POSTPONED" });
assert.deepEqual(decideEvidence([observation({ status: "abandoned" })], "t"), { kind: "pending", reason: "FIXTURE_SUSPENDED_OR_ABANDONED" });
assert.deepEqual(decideEvidence([observation({ status: "awarded" })], "t"), { kind: "pending", reason: "RESULT_AWARDED" });
assert.equal(decideEvidence([observation({ status: "canceled", homeScore: null, awayScore: null })], "t").kind, "void");
assert.deepEqual(decideEvidence([observation({ homeScore: null })], "t"), { kind: "pending", reason: "NOT_COMPLETED" }, "completed with no score is not a result");

assert.ok(espnRegulationScore("STATUS_FULL_TIME"));
assert.ok(!espnRegulationScore("STATUS_FINAL_PEN"));
assert.ok(!espnRegulationScore("STATUS_FINAL_AET"));
assert.ok(fotmobRegulationScore("FT"));
assert.ok(!fotmobRegulationScore("Pen"));
assert.ok(!fotmobRegulationScore("AET"));

// A stored final observation is immutable.
const stored = { status: "completed", homeScore: 2, awayScore: 1, provider: "espn", providerEventId: "1", sourceUrl: "x", kickoffUtc: "k", capturedAt: "first" } as const;
assert.equal(mergeEvidence(stored, { ...stored, homeScore: 9, capturedAt: "later" }), stored);

// Pending ledger: a VIP pick stays hidden until the match is final, and nothing before kickoff is listed.
const now = new Date("2026-10-30T21:00:00Z");
const preview = (over: Partial<MatchPreview>) => ({ league: "ligue-1", slug: "x", homeTeam: "A", awayTeam: "B", date: "2026-10-30", status: "published", predictionAccess: "free", mainPrediction: "Over 2.5 Goals", odds: 1.8, ...over }) as MatchPreview;
const ledger = buildPendingLedger([
  preview({ slug: "started-free", kickoffUtc: "2026-10-30T20:00:00Z", fixtureStatus: "in-progress" }),
  preview({ slug: "started-vip", kickoffUtc: "2026-10-30T20:00:00Z", fixtureStatus: "in-progress", predictionAccess: "vip", mainPrediction: "SECRET PICK", odds: 2.1 }),
  preview({ slug: "later-today", kickoffUtc: "2026-10-30T23:00:00Z", predictionAccess: "vip", mainPrediction: "SECRET LATER" }),
  preview({ slug: "tomorrow", date: "2026-10-31", mainPrediction: "SECRET TOMORROW" }),
  preview({ slug: "final-vip", kickoffUtc: "2026-10-29T20:00:00Z", fixtureStatus: "completed", homeScore: 1, awayScore: 1, predictionAccess: "vip", mainPrediction: "Over 7.5 Total Corners" }),
], emptyResultsDataset(), {}, now);
assert.deepEqual(Object.keys(ledger).sort(), ["ligue-1:final-vip", "ligue-1:started-free", "ligue-1:started-vip"]);
assert.equal(ledger["ligue-1:started-free"].prediction, "Over 2.5 Goals");
assert.equal(ledger["ligue-1:started-vip"].prediction, null, "a VIP pick is hidden during the match");
assert.equal(ledger["ligue-1:started-vip"].odds, null);
assert.equal(ledger["ligue-1:final-vip"].prediction, null, "an unsettled VIP pick stays hidden even once the match is final");
assert.equal(ledger["ligue-1:final-vip"].reason, "MARKET_DATA_MISSING");
assert.ok(!JSON.stringify(ledger).includes("SECRET"));
assert.ok(!hasKickedOff({ kickoffUtc: "2026-10-30T23:00:00Z", date: "2026-10-30" }, now));
assert.ok(!hasKickedOff({ date: "2026-10-30" }, now), "with no kickoff, today is not assumed to have started");
assert.ok(hasKickedOff({ date: "2026-10-29" }, now));

// No-deploy feed: new upstream records appear, shipped records are immutable, junk is dropped.
const settled = (over = {}) => ({ key: "l:a", league: "l", slug: "a", homeTeam: "A", awayTeam: "B", date: "2026-10-30", predictionAccess: "free", prediction: "Over 2.5 Goals", odds: 1.8, finalScore: { home: 2, away: 1 }, result: "green", settledAt: "t", ...over });
const bundled = { results: { records: { "l:a": settled() } }, pending: { records: { "l:p": { key: "l:p", league: "l", slug: "p", homeTeam: "A", awayTeam: "B", date: "2026-10-30", reason: "NOT_COMPLETED" } } } };
const merged = mergeResultsFeed(bundled, {
  results: { records: {
    "l:a": settled({ result: "red" }),
    "l:p": settled({ key: "l:p", slug: "p" }),
    "l:bad": { key: "l:bad", league: "l", slug: "bad", result: "green" },
    "l:wrongkey": settled(),
    "l:noscore": settled({ key: "l:noscore", slug: "n", finalScore: null, result: "green" }),
    "l:void": settled({ key: "l:void", slug: "v", finalScore: null, result: "void" }),
  } },
  pending: { records: { "l:p": bundled.pending.records["l:p"], "l:q": { key: "l:q", league: "l", slug: "q", homeTeam: "A", awayTeam: "B", date: "2026-10-30", reason: "NOT_COMPLETED" } } },
});
assert.equal(merged.records["l:a"].result, "green", "a shipped settlement cannot be rewritten upstream");
assert.ok(merged.records["l:p"], "a new upstream settlement appears without a deploy");
assert.ok(merged.records["l:void"]);
assert.ok(!merged.records["l:bad"] && !merged.records["l:wrongkey"] && !merged.records["l:noscore"], "malformed upstream records are dropped");
assert.ok(!merged.pending["l:p"], "a settled record leaves the pending list");
assert.ok(merged.pending["l:q"]);
assert.ok(!("settledBy" in merged.records["l:a"]));

const offline = await (await createResultsHandler(async () => { throw new Error("offline"); })()).json();
assert.ok(Object.keys(offline.records).length > 0, "an upstream outage falls back to the bundled history");
const errored = await (await createResultsHandler(async () => new Response("nope", { status: 500 }))()).json();
assert.equal(Object.keys(errored.records).length, Object.keys(offline.records).length);

// --- The real history -------------------------------------------------------------------------------
const results = JSON.parse(readFileSync("src/data/football-results.snapshot.json", "utf8")) as FootballResultsDataset;
const pending = JSON.parse(readFileSync("src/data/football-results-pending.snapshot.json", "utf8")) as PendingResultsDataset;
const previews = settlementPreviews();
const pastKickoff = previews.filter((match) => hasKickedOff(match, new Date()));

// Every published prediction past kickoff is accounted for: settled or pending with a reason. Never lost.
const lost = pastKickoff.filter((match) => {
  const key = `${match.league}:${match.slug}`;
  return !results.records[key] && !pending.records[key] && !(match.kickoffUtc && Date.parse(match.kickoffUtc) > Date.parse(new Date().toISOString().slice(0, 10)));
});
assert.deepEqual(lost.map((match) => match.slug), [], "a past match is neither settled nor pending");

// No record is both, none is duplicated, and football only.
for (const key of Object.keys(pending.records)) assert.ok(!results.records[key], `${key} is both settled and pending`);
const identities = Object.values(results.records).map((record) => `${record.league}|${record.homeTeam}|${record.awayTeam}|${record.date}`);
assert.equal(new Set(identities).size, identities.length, "duplicate fixture in Results");
const slugs = Object.values(results.records).map((record) => record.slug);
assert.equal(new Set(slugs).size, slugs.length, "duplicate slug in Results");
assert.ok(!Object.keys(results.records).some((key) => /^(nba|nhl|nfl):/.test(key)), "Results is football only");
assert.ok(!Object.values(results.records).some((record) => /\((?:Including )?OT\/SO\)/i.test(record.prediction)), "no hockey market in Results");

// Picks and odds in Results match the published predictions, and negative results were not removed.
for (const record of Object.values(results.records)) {
  const published = previews.find((match) => match.league === record.league && match.slug === record.slug);
  assert.ok(published, `${record.key} has no published prediction`);
  assert.equal(record.prediction, published.mainPrediction);
  assert.equal(record.odds, published.odds ?? null);
}
const baseline = JSON.parse(execSync("git show bf083fd:src/data/football-results.snapshot.json", { maxBuffer: 1e8 }).toString()) as FootballResultsDataset;
for (const [key, record] of Object.entries(baseline.records)) {
  assert.deepEqual(results.records[key], record, `${key}: a record settled before this change was altered or removed`);
}

console.log(`results reconcile tests passed (${Object.keys(results.records).length} settled, ${Object.keys(pending.records).length} pending, ${previews.length} published)`);
