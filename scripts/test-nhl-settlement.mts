// NHL automatic settlement across every published day (Oct 6-17): generic registry, market parser, real final scores for
// Oct 13-15, the Oct 16 pending state, the Oct 17 release gate, push / void handling and the history endpoint.
// Run: npx tsx scripts/test-nhl-settlement.mts   (npm run test:nhl-settlement)
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { SLATES } from "../src/data/nhl/slates.ts";
import { deferredMatchesFor } from "../src/data/nhl/deferred-slates.ts";
import { PROTECTED_NHL_PICKS_BY_DAY } from "../src/data/nhl/protected-registry.ts";
import { buildNhlHistoryDay, getNhlFullPredictionsForDay, settleNhlPrediction } from "../src/lib/nhl-results.ts";
import { NHL_ABBREV, normalizeFinalScores, type FinalScoreGame } from "../src/lib/nhl-live.ts";
import { createNhlHistoryHandler } from "../functions/api/nhl/history.js";

let passed = 0;
const check = (name: string, fn: () => void | Promise<void>) =>
  Promise.resolve(fn()).then(() => {
    passed += 1;
    console.log(`ok  ${name}`);
  });

const fin = (homeScore: number, awayScore: number) => ({ homeScore, awayScore, state: "finished" as const });
const A = "Team A";
const B = "Team B";

// ---- 1. Market parser ----------------------------------------------------------------------------------------
await check("moneyline wordings: to win / win / ML / (including OT/SO) / (including overtime and shootout)", () => {
  for (const pick of ["Team A to Win", "Team A to win", "Team A win", "Team A ML", "Team A to Win (Including OT/SO)", "Team A to Win (Including OT & Shootout)", "Team A to win (including overtime and shootout)"]) {
    assert.equal(settleNhlPrediction(pick, A, B, fin(4, 3)), "win", pick);
    assert.equal(settleNhlPrediction(pick, A, B, fin(2, 3)), "loss", pick);
  }
  assert.equal(settleNhlPrediction("Team B ML", A, B, fin(2, 3)), "win");
});
await check("moneyline marked Regulation Only is never guessed", () => {
  assert.equal(settleNhlPrediction("Team A to win in regulation", A, B, fin(4, 3)), "unsupported");
  assert.equal(settleNhlPrediction("Team A (Regulation Only)", A, B, fin(4, 3)), "unsupported");
});
await check("a team that is not in the fixture is unsupported (never graded against the wrong side)", () => {
  assert.equal(settleNhlPrediction("Team C to win", A, B, fin(4, 3)), "unsupported");
});
await check("totals: Over 5.0 pushes at exactly 5 goals, wins at 6, loses at 4 (PUSH is never a LOSS)", () => {
  assert.equal(settleNhlPrediction("Over 5.0 total goals", A, B, fin(3, 2)), "push");
  assert.equal(settleNhlPrediction("Over 5.0 total goals", A, B, fin(4, 2)), "win");
  assert.equal(settleNhlPrediction("Over 5.0 total goals", A, B, fin(2, 2)), "loss");
  assert.equal(settleNhlPrediction("Under 5 goals", A, B, fin(3, 2)), "push");
});
await check("totals: Over 5.5 and Under 6.5 (total goals wording) from the combined final score", () => {
  assert.equal(settleNhlPrediction("Over 5.5 total goals", A, B, fin(3, 3)), "win");
  assert.equal(settleNhlPrediction("Over 5.5 total goals", A, B, fin(3, 2)), "loss");
  assert.equal(settleNhlPrediction("Under 6.5 total goals", A, B, fin(3, 3)), "win");
  assert.equal(settleNhlPrediction("Under 6.5 total goals", A, B, fin(4, 3)), "loss");
});
await check("spread / puck line: -1.5 and +1.5 win/loss, whole-number lines push", () => {
  assert.equal(settleNhlPrediction("Team A -1.5", A, B, fin(4, 2)), "win");
  assert.equal(settleNhlPrediction("Team A -1.5 Puck Line", A, B, fin(3, 2)), "loss");
  assert.equal(settleNhlPrediction("Team B +1.5", A, B, fin(3, 2)), "win");
  assert.equal(settleNhlPrediction("Team B +1.5", A, B, fin(4, 2)), "loss");
  assert.equal(settleNhlPrediction("Team A -1", A, B, fin(3, 2)), "push");
});
await check("no final score / live / provider-unknown: PENDING, never a guessed result", () => {
  assert.equal(settleNhlPrediction("Team A to win", A, B, null), "pending");
  assert.equal(settleNhlPrediction("Over 5.5 total goals", A, B, { homeScore: 4, awayScore: 3, state: "live" }), "pending");
  assert.equal(settleNhlPrediction("Over 5.5 total goals", A, B, { homeScore: 4, awayScore: 3, state: "scheduled" }), "pending");
});
await check("an unrecognised market stays UNSUPPORTED", () => {
  assert.equal(settleNhlPrediction("Team A or Draw", A, B, fin(4, 2)), "unsupported");
  assert.equal(settleNhlPrediction("Team A to score first", A, B, fin(4, 2)), "unsupported");
});

// ---- 2. Void (cancelled) vs postponed ---------------------------------------------------------------------------
await check("a cancelled game (CNCL) settles VOID; a postponed game (PPD) stays pending", () => {
  const payload = {
    games: [
      { id: 1, gameState: "FUT", gameScheduleState: "CNCL", homeTeam: { abbrev: "TOR" }, awayTeam: { abbrev: "BUF" } },
      { id: 2, gameState: "FUT", gameScheduleState: "PPD", homeTeam: { abbrev: "MTL" }, awayTeam: { abbrev: "NSH" } },
    ],
  };
  const games = normalizeFinalScores(payload) ?? [];
  const cancelled = games.find((g) => g.home === "TOR");
  assert.ok(cancelled?.voided);
  assert.equal(settleNhlPrediction("Team A to win", A, B, cancelled ?? null), "void");
  assert.equal(settleNhlPrediction("Over 5.5 total goals", A, B, cancelled ?? null), "void");
  assert.equal(games.find((g) => g.home === "MTL"), undefined, "a postponed game has no score and is not void");
  assert.equal(settleNhlPrediction("Team A to win", A, B, null), "pending");
});

// ---- 3. Generic registry: no published NHL day can be left out of settlement ----------------------------------
const protectedFiles = readdirSync("src/data/nhl").filter((f) => /^protected-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
await check("every protected-<day>.json file is registered for settlement (Oct 7-17)", () => {
  const fileDays = protectedFiles.map((f) => f.slice("protected-".length, -".json".length));
  assert.deepEqual(Object.keys(PROTECTED_NHL_PICKS_BY_DAY).sort(), fileDays);
  for (const day of ["2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17"]) assert.ok(PROTECTED_NHL_PICKS_BY_DAY[day]?.length, day);
  for (const f of protectedFiles) {
    const file = JSON.parse(readFileSync(`src/data/nhl/${f}`, "utf8"));
    assert.deepEqual(PROTECTED_NHL_PICKS_BY_DAY[file.activeFromKey].map((e) => e.slug), file.entries.map((e: { slug: string }) => e.slug));
  }
});
await check("every protected pick belongs to a published game of its day and is a settleable market", () => {
  for (const [day, picks] of Object.entries(PROTECTED_NHL_PICKS_BY_DAY)) {
    const slate = SLATES.find((s) => s.dayKey === day);
    assert.ok(slate, `slate for ${day}`);
    const listing = slate.deferred ? deferredMatchesFor(day) : slate.matches;
    for (const entry of picks) {
      const game = listing.find((m) => m.slug === entry.slug);
      assert.ok(game, `${day} ${entry.slug} has no published game`);
      assert.notEqual(settleNhlPrediction(entry.pick, game.homeTeam, game.awayTeam, fin(4, 3)), "unsupported", `${day} ${entry.slug}: "${entry.pick}"`);
    }
  }
});

// ---- 4. Real final scores, Oct 13-15 ------------------------------------------------------------------------------
const fixture = JSON.parse(readFileSync("scripts/fixtures/nhl-finals-2026-10-13-15.json", "utf8")) as { days: Record<string, [string, string, number, number, string][]> };
const finals = (day: string): FinalScoreGame[] =>
  fixture.days[day].map(([home, away, homeScore, awayScore]) => ({ home, away, homeScore, awayScore, state: "finished" as const }));
const OCT16 = new Date("2026-10-16T12:00:00Z");

// Independent re-grading with different code: total from the pick text, or the picked team's score vs the other.
function independent(pick: string, home: string, away: string, hs: number, as: number) {
  const total = pick.match(/^(Over|Under)\s+([\d.]+)/i);
  if (total) {
    const sum = hs + as;
    const line = Number(total[2]);
    return sum === line ? "push" : (total[1].toLowerCase() === "over") === sum > line ? "win" : "loss";
  }
  const team = pick.replace(/\s+(to\s+)?win\b.*$/i, "").trim();
  const mine = team === home ? hs : as;
  const other = team === home ? as : hs;
  assert.ok(team === home || team === away, `${pick}: team not in fixture`);
  return mine > other ? "win" : "loss";
}

for (const [day, published, wins, losses] of [["2026-10-13", 16, 8, 8], ["2026-10-14", 2, 1, 1], ["2026-10-15", 11, 8, 3]] as const) {
  await check(`${day}: all ${published} published games settle against the official finals (${wins}-${losses}), nothing pending or unsupported`, () => {
    const result = buildNhlHistoryDay(day, finals(day), OCT16);
    assert.equal(result.rows.length, published);
    assert.equal(result.wins, wins);
    assert.equal(result.losses, losses);
    assert.ok(result.rows.every((r) => r.result === "win" || r.result === "loss"), "only WIN/LOSS expected on these days");
    for (const row of result.rows) {
      const score = finals(day).find((g) => g.home === NHL_ABBREV[row.homeTeam] && g.away === NHL_ABBREV[row.awayTeam])!;
      assert.equal(row.result, independent(row.pick, row.homeTeam, row.awayTeam, score.homeScore, score.awayScore), `${row.slug}: ${row.pick}`);
      assert.deepEqual(row.finalScore, { home: score.homeScore, away: score.awayScore });
    }
  });
}
await check("with no provider data every Oct 13-15 game is PENDING (the free ones stay visible, VIP rows stay hidden)", () => {
  const day = buildNhlHistoryDay("2026-10-13", [], OCT16);
  assert.ok(day.rows.length > 0 && day.rows.every((r) => r.result === "pending" && r.access === "free"));
});

// ---- 5. Oct 16: games not final yet ---------------------------------------------------------------------------------
await check("2026-10-16: a game that is not FINAL is pending, and its VIP/BEST BET pick is not revealed", () => {
  const live: FinalScoreGame[] = [{ home: "COL", away: "PIT", homeScore: 2, awayScore: 1, state: "live" }];
  const day = buildNhlHistoryDay("2026-10-16", live, new Date("2026-10-17T03:00:00Z"));
  assert.ok(!day.rows.some((r) => r.slug === "colorado-avalanche-vs-pittsburgh-penguins"), "BEST BET hidden until FINAL");
  const done: FinalScoreGame[] = [{ home: "COL", away: "PIT", homeScore: 4, awayScore: 2, state: "finished" }, { home: "ANA", away: "BOS", homeScore: 1, awayScore: 3, state: "finished" }];
  const settled = buildNhlHistoryDay("2026-10-16", done, new Date("2026-10-17T06:00:00Z"));
  assert.deepEqual(settled.rows.map((r) => [r.slug, r.result]).sort(), [["anaheim-ducks-vs-boston-bruins", "loss"], ["colorado-avalanche-vs-pittsburgh-penguins", "win"]]);
});

// ---- 6. Oct 17: the release gate is not weakened by settlement ------------------------------------------------------
const GATE = new Date("2026-10-17T04:00:00Z");
const listing17 = deferredMatchesFor("2026-10-17");
const synthetic17: FinalScoreGame[] = listing17.map((m, i) => ({
  home: NHL_ABBREV[m.homeTeam],
  away: NHL_ABBREV[m.awayTeam],
  // SYNTHETIC scores, used only to exercise the logic; the real Oct 17 games have not been played.
  homeScore: 3,
  awayScore: i % 2 === 0 ? 2 : 4,
  state: "finished" as const,
}));
await check("2026-10-17: before 00:00:00 America/New_York settlement returns nothing, even with finals supplied", () => {
  const before = new Date("2026-10-17T03:59:59Z");
  assert.deepEqual(getNhlFullPredictionsForDay("2026-10-17", before), []);
  assert.deepEqual(buildNhlHistoryDay("2026-10-17", synthetic17, before).rows, []);
});
await check("2026-10-17: at the gate all 14 games are settleable; unfinished premium picks are not revealed, FREE ones are", () => {
  assert.equal(getNhlFullPredictionsForDay("2026-10-17", GATE).length, 14);
  const day = buildNhlHistoryDay("2026-10-17", [], GATE);
  assert.deepEqual(day.rows.map((r) => r.slug).sort(), ["columbus-blue-jackets-vs-new-york-rangers", "montreal-canadiens-vs-buffalo-sabres-2026-10-17"]);
  assert.ok(day.rows.every((r) => r.access === "free" && r.result === "pending"));
});
await check("2026-10-17: with every game FINAL all 14 picks settle (Over 5.0 pushes at exactly 5 goals), none unsupported", () => {
  const day = buildNhlHistoryDay("2026-10-17", synthetic17, GATE);
  assert.equal(day.rows.length, 14);
  assert.ok(day.rows.every((r) => r.result !== "unsupported" && r.result !== "pending"));
  const flyers = listing17.findIndex((m) => m.slug === "philadelphia-flyers-vs-ottawa-senators");
  const exactFive = synthetic17.map((g, i) => (i === flyers ? { ...g, homeScore: 3, awayScore: 2 } : g));
  const row = buildNhlHistoryDay("2026-10-17", exactFive, GATE).rows.find((r) => r.slug === "philadelphia-flyers-vs-ottawa-senators");
  assert.equal(row?.result, "push");
});

// ---- 7. History endpoint ------------------------------------------------------------------------------------------------
await check("/api/nhl/history settles Oct 13-15 from the provider and never exposes Oct 17 before its gate", async () => {
  const provider = async (url: string) => {
    const day = String(url).split("/").pop() as string;
    const games = (fixture.days[day] ?? []).map(([home, away, hs, as, state], id) => ({ id: id + 1, gameState: state, homeTeam: { abbrev: home, score: hs }, awayTeam: { abbrev: away, score: as } }));
    return new Response(JSON.stringify({ games }), { status: 200 });
  };
  const before = await (await createNhlHistoryHandler(provider as typeof fetch, () => new Date("2026-10-16T12:00:00Z"))()).json();
  assert.ok(!before.days.some((d: { dayKey: string }) => d.dayKey === "2026-10-17"));
  for (const day of ["2026-10-13", "2026-10-14", "2026-10-15"]) assert.ok(before.days.some((d: { dayKey: string }) => d.dayKey === day), day);
  assert.ok(!JSON.stringify(before).includes("utah-mammoth-vs-edmonton-oilers"));
  const after = await (await createNhlHistoryHandler(provider as typeof fetch, () => new Date("2026-10-17T04:00:01Z"))()).json();
  const oct17 = after.days.find((d: { dayKey: string }) => d.dayKey === "2026-10-17");
  assert.ok(oct17, "Oct 17 appears once released");
  assert.ok(!JSON.stringify(oct17).includes("utah-mammoth-vs-edmonton-oilers"), "BEST BET pick stays hidden until its game is FINAL");
});

console.log(`\n${passed} NHL settlement checks passed`);
