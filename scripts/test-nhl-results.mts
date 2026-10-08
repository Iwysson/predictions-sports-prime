// NHL settlement/history tests: moneyline OT+SO inclusion, totals, fail-closed pending/unsupported
// states, the VIP pre-kickoff leak guard, and day-level 7-2 / 77.8% aggregation against the real
// NHL Web API final scores for 2026-10-06.
// Run: node --import tsx scripts/test-nhl-results.mts
import assert from "node:assert/strict";
import { settleNhlPrediction, buildNhlHistoryDay } from "../src/lib/nhl-results.ts";
import type { FinalScoreGame } from "../src/lib/nhl-live.ts";
import { createNhlHistoryHandler } from "../functions/api/nhl/history.js";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed += 1;
  console.log(`ok  ${name}`);
};

const finished = (homeScore: number, awayScore: number) => ({ homeScore, awayScore, state: "finished" as const });

check("moneyline WIN: regulation win for the picked home team", () => {
  assert.equal(settleNhlPrediction("Team A to Win", "Team A", "Team B", finished(3, 1)), "win");
});
check("moneyline WIN: OT win still counts as WIN (final score already reflects OT)", () => {
  // Regulation 3-3, Team A wins 4-3 in OT: the provider's final score is simply 4-3.
  assert.equal(settleNhlPrediction("Team A to Win", "Team A", "Team B", finished(4, 3)), "win");
});
check("moneyline WIN: shootout win still counts as WIN", () => {
  // Regulation and OT both 2-2, Team A wins the shootout: final score 3-2.
  assert.equal(settleNhlPrediction("Team A to Win", "Team A", "Team B", finished(3, 2)), "win");
});
check("moneyline LOSS: the picked team lost, regardless of regulation/OT/SO", () => {
  assert.equal(settleNhlPrediction("Team A to Win", "Team A", "Team B", finished(2, 5)), "loss");
});
check("moneyline on the away team is graded against the away score", () => {
  assert.equal(settleNhlPrediction("Team B to Win", "Team A", "Team B", finished(2, 5)), "win");
  assert.equal(settleNhlPrediction("Team B to Win", "Team A", "Team B", finished(5, 2)), "loss");
});
check("totals: Over X.5 Goals WIN/LOSS from the combined final score", () => {
  assert.equal(settleNhlPrediction("Over 5.5 Goals", "Team A", "Team B", finished(5, 3)), "win"); // 8 > 5.5
  assert.equal(settleNhlPrediction("Over 5.5 Goals", "Team A", "Team B", finished(3, 2)), "loss"); // 5 < 5.5
});
check("totals: Under X.5 Goals WIN/LOSS from the combined final score", () => {
  assert.equal(settleNhlPrediction("Under 6.5 goals", "Team A", "Team B", finished(4, 2)), "win"); // 6 < 6.5
  assert.equal(settleNhlPrediction("Under 6.5 goals", "Team A", "Team B", finished(5, 4)), "loss"); // 9 > 6.5
});
check("no final score yet: PENDING, never a guessed result (fail closed)", () => {
  assert.equal(settleNhlPrediction("Team A to Win", "Team A", "Team B", null), "pending");
  assert.equal(settleNhlPrediction("Team A to Win", "Team A", "Team B", { homeScore: 1, awayScore: 0, state: "live" }), "pending");
});
check("an unrecognized market is UNSUPPORTED, never guessed", () => {
  assert.equal(settleNhlPrediction("Team A -1.5 Puck Line", "Team A", "Team B", finished(4, 2)), "unsupported");
});

// Real final scores for 2026-10-06 (api-web.nhle.com/v1/score/2026-10-06), fetched and verified
// before publishing any record. Covers both the FREE matches and the VIP matches whose picks live
// only in the legacy src/data/nhl/matches.en.json source for this day.
const oct06Scores: FinalScoreGame[] = [
  { home: "TOR", away: "NSH", homeScore: 5, awayScore: 4, state: "finished" },
  { home: "MTL", away: "CAR", homeScore: 4, awayScore: 6, state: "finished" },
  { home: "DET", away: "OTT", homeScore: 5, awayScore: 3, state: "finished" },
  { home: "NJD", away: "UTA", homeScore: 3, awayScore: 5, state: "finished" },
  { home: "BUF", away: "MIN", homeScore: 3, awayScore: 2, state: "finished" },
  { home: "NYR", away: "NYI", homeScore: 5, awayScore: 2, state: "finished" },
  { home: "CHI", away: "STL", homeScore: 4, awayScore: 2, state: "finished" },
  { home: "SEA", away: "VGK", homeScore: 2, awayScore: 6, state: "finished" },
  { home: "LAK", away: "FLA", homeScore: 1, awayScore: 2, state: "finished" },
];

check("2026-10-06 day settles to the verified 7-2 record across all 9 published picks", () => {
  const day = buildNhlHistoryDay("2026-10-06", oct06Scores);
  assert.equal(day.rows.length, 9);
  assert.equal(day.wins, 7);
  assert.equal(day.losses, 2);
  const bySlug = new Map(day.rows.map((r) => [r.slug, r.result]));
  assert.equal(bySlug.get("buffalo-sabres-vs-minnesota-wild"), "loss"); // Over 5.5, total 5
  assert.equal(bySlug.get("new-jersey-devils-vs-utah-mammoth"), "loss"); // NJD to win, UTA won
  assert.equal(bySlug.get("detroit-red-wings-vs-ottawa-senators"), "win");
  assert.equal(bySlug.get("montreal-canadiens-vs-carolina-hurricanes"), "win");
  assert.equal(bySlug.get("toronto-maple-leafs-vs-nashville-predators"), "win");
  assert.equal(bySlug.get("new-york-rangers-vs-new-york-islanders"), "win");
  assert.equal(bySlug.get("chicago-blackhawks-vs-st-louis-blues"), "win");
  assert.equal(bySlug.get("seattle-kraken-vs-vegas-golden-knights"), "win");
  assert.equal(bySlug.get("los-angeles-kings-vs-florida-panthers"), "win");
  const winRate = (day.wins / (day.wins + day.losses)) * 100;
  assert.equal(winRate.toFixed(1), "77.8");
});

check("VIP/BEST picks for a day that has not finished yet never appear (no pre-kickoff leak)", () => {
  // 2026-10-07: only Pittsburgh is FREE; Colorado and Edmonton are BEST BET / PRIME VIP. With no
  // provider data (as if the slate's games have not started), only the free row may appear.
  const day = buildNhlHistoryDay("2026-10-07", []);
  assert.equal(day.rows.length, 1);
  assert.equal(day.rows[0].slug, "pittsburgh-penguins-vs-washington-capitals");
  assert.equal(day.rows[0].result, "pending");
});

check("VIP picks are revealed once their own game is actually FINAL/OFF", () => {
  const day = buildNhlHistoryDay("2026-10-07", [
    { home: "WPG", away: "COL", homeScore: 3, awayScore: 2, state: "finished" },
  ]);
  const colorado = day.rows.find((r) => r.slug === "colorado-avalanche-vs-winnipeg-jets");
  assert.ok(colorado, "Colorado row should be revealed once its game is finished");
  assert.equal(colorado!.result, "loss");
  // Edmonton's game has not finished, so it must still be absent.
  assert.equal(day.rows.find((r) => r.slug === "edmonton-oilers-vs-anaheim-ducks"), undefined);
});

check("2026-10-07 official finals settle Oilers and PIT/WSH as wins and Colorado as a loss", () => {
  const day = buildNhlHistoryDay("2026-10-07", [
    { home: "WSH", away: "PIT", homeScore: 5, awayScore: 3, state: "finished" },
    { home: "WPG", away: "COL", homeScore: 3, awayScore: 2, state: "finished" },
    { home: "ANA", away: "EDM", homeScore: 2, awayScore: 5, state: "finished" },
  ]);
  assert.equal(day.rows.length, 3);
  assert.equal(day.wins, 2);
  assert.equal(day.losses, 1);
  const bySlug = new Map(day.rows.map((row) => [row.slug, row.result]));
  assert.equal(bySlug.get("pittsburgh-penguins-vs-washington-capitals"), "win");
  assert.equal(bySlug.get("colorado-avalanche-vs-winnipeg-jets"), "loss");
  assert.equal(bySlug.get("edmonton-oilers-vs-anaheim-ducks"), "win");
  assert.equal(day.rows.filter((row) => row.result === "pending").length, 0);
});

const historyPayloads = new Map<string, FinalScoreGame[]>([
  ["2026-10-06", oct06Scores],
  [
    "2026-10-07",
    [
      { home: "WSH", away: "PIT", homeScore: 5, awayScore: 3, state: "finished" },
      { home: "WPG", away: "COL", homeScore: 3, awayScore: 2, state: "finished" },
      { home: "ANA", away: "EDM", homeScore: 2, awayScore: 5, state: "finished" },
    ],
  ],
  ["2026-10-08", []],
]);
const historyFetch = async (input: string | URL | Request) => {
  const dayKey = String(input).split("/").at(-1)!;
  const games = (historyPayloads.get(dayKey) ?? []).map((game, index) => ({
    id: index + 1,
    gameState: game.state === "finished" ? "OFF" : "FUT",
    homeTeam: { abbrev: game.home, score: game.homeScore },
    awayTeam: { abbrev: game.away, score: game.awayScore },
  }));
  return new Response(JSON.stringify({ games }), { status: 200 });
};
const historyResponse = await createNhlHistoryHandler(
  historyFetch as typeof fetch,
  () => new Date("2026-10-08T12:00:00Z"),
)();
const history = await historyResponse.json();
assert.equal(history.wins, 9);
assert.equal(history.losses, 3);
assert.equal(history.days.find((day: { dayKey: string }) => day.dayKey === "2026-10-07").rows.length, 3);
console.log("ok  history endpoint recalculates the complete current NHL record as 9-3 (75.0%)");
passed += 1;

console.log(`\n${passed} NHL settlement/history checks passed`);
