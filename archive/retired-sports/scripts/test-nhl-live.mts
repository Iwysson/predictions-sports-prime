// NHL live-state tests with simulated provider payloads and provider failures.
// Run: node --import tsx scripts/test-nhl-live.mts
import assert from "node:assert/strict";
import {
  mapGameState,
  normalizeScore,
  findLiveGame,
  liveBadgeText,
  periodLabel,
  clockLabel,
} from "../src/lib/nhl-live.ts";
import { resolveNhlSlate } from "../src/data/nhl/slates.ts";
import { createNhlStatusHandler } from "../functions/api/nhl/status.js";

let passed = 0;
const check = (name: string, fn: () => void | Promise<void>) => {
  const run = async () => {
    await fn();
    passed += 1;
    console.log(`ok  ${name}`);
  };
  pending.push(run);
};
const pending: Array<() => Promise<void>> = [];

// A provider game object with only the fields the normalizer reads, plus the usual extras.
const game = (id: number, gameState: string, away: string, home: string, extra: Record<string, unknown> = {}) => ({
  id,
  gameState,
  awayTeam: { abbrev: away, score: 0 },
  homeTeam: { abbrev: home, score: 0 },
  ...extra,
});
const payload = (games: unknown[]) => ({ games, oddsPartners: [{ name: "not used" }] });

check("gameState FUT and PRE are scheduled, no LIVE", () => {
  assert.equal(mapGameState("FUT"), "scheduled");
  assert.equal(mapGameState("PRE"), "scheduled");
  assert.equal(liveBadgeText(normalizeScore(payload([game(1, "FUT", "WSH", "PIT")]))![0] as any), null);
  assert.equal(liveBadgeText(normalizeScore(payload([game(1, "PRE", "WSH", "PIT")]))![0] as any), null);
});
check("gameState LIVE and CRIT are live, LIVE badge present", () => {
  assert.equal(mapGameState("LIVE"), "live");
  assert.equal(mapGameState("CRIT"), "live");
  const live = normalizeScore(payload([game(2, "LIVE", "WSH", "PIT")]))![0];
  assert.equal(liveBadgeText(live), "LIVE");
});
check("gameState FINAL and OFF are finished, no LIVE", () => {
  assert.equal(mapGameState("FINAL"), "finished");
  assert.equal(mapGameState("OFF"), "finished");
  assert.equal(liveBadgeText(normalizeScore(payload([game(3, "FINAL", "WSH", "PIT")]))![0] as any), null);
  assert.equal(liveBadgeText(normalizeScore(payload([game(3, "OFF", "WSH", "PIT")]))![0] as any), null);
});
check("unknown or differently-cased gameState fails closed: no LIVE", () => {
  for (const raw of ["live", "XYZ", "", null, 7, "constructor"]) {
    assert.equal(mapGameState(raw), "unknown", String(raw));
    const g = normalizeScore(payload([game(4, raw as string, "WSH", "PIT")]))![0];
    assert.equal(liveBadgeText(g), null, String(raw));
  }
});

check("period and clock show only when the provider sends them", () => {
  assert.equal(periodLabel({ number: 2, periodType: "REG" }), "2nd");
  assert.equal(periodLabel({ number: 4, periodType: "OT" }), "OT");
  assert.equal(periodLabel({ number: 5, periodType: "SO" }), "SO");
  assert.equal(periodLabel(undefined), null);
  assert.equal(clockLabel({ timeRemaining: "08:42", inIntermission: false }), "08:42");
  assert.equal(clockLabel({ timeRemaining: "08:42", inIntermission: true }), null);
  assert.equal(clockLabel({ timeRemaining: "bogus" }), null);
  const g = normalizeScore(
    payload([game(5, "LIVE", "WSH", "PIT", { periodDescriptor: { number: 2, periodType: "REG" }, clock: { timeRemaining: "08:42" } })]),
  )![0];
  assert.equal(liveBadgeText(g), "LIVE · 2nd · 08:42");
  const noClock = normalizeScore(payload([game(6, "LIVE", "WSH", "PIT", { periodDescriptor: { number: 3, periodType: "REG" } })]))![0];
  assert.equal(liveBadgeText(noClock), "LIVE · 3rd");
});

check("match by official abbreviations; reversed order and unknown team never match", () => {
  const games = normalizeScore(payload([game(7, "LIVE", "WSH", "PIT")]))!;
  assert.ok(findLiveGame(games, "Pittsburgh Penguins", "Washington Capitals"));
  assert.equal(findLiveGame(games, "Washington Capitals", "Pittsburgh Penguins"), null);
  assert.equal(findLiveGame(games, "Pittsburgh Penguins", "Unknown Team"), null);
});

check("malformed game rows are skipped; a wrong payload shape is rejected", () => {
  assert.equal(normalizeScore({ nope: true }), null);
  assert.equal(normalizeScore(null), null);
  const games = normalizeScore(payload([null, { id: "x" }, game(8, "LIVE", "WSH", "PIT")]))!;
  assert.equal(games.length, 1);
});

check("Oct 7 access is unchanged by live state (tiers come from the slate)", () => {
  const slate = resolveNhlSlate("2026-10-07")!;
  assert.deepEqual(slate.matches.map((m) => m.access), ["free", "best", "vip"]);
  // Live state is a separate input; the slate objects are never touched by it.
  const live = normalizeScore(payload([game(9, "LIVE", "WSH", "PIT")]))![0];
  assert.equal(liveBadgeText(live), "LIVE");
  assert.deepEqual(slate.matches.map((m) => m.access), ["free", "best", "vip"]);
});

// Provider failure: the handler must answer with unavailable and no games, never LIVE.
const fixedNow = () => new Date("2026-10-07T04:00:05Z");
const handlerWith = (fetchImpl: any) => createNhlStatusHandler(fetchImpl, fixedNow)();

check("provider timeout yields unavailable, no LIVE", async () => {
  const res = await handlerWith(async () => {
    throw new DOMException("The operation was aborted", "TimeoutError");
  });
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.state, "unavailable");
  assert.deepEqual(body.games, []);
  assert.equal(body.date, "2026-10-07");
});
check("provider HTTP 500 yields unavailable, no LIVE", async () => {
  const body = await (await handlerWith(async () => new Response("boom", { status: 500 }))).json();
  assert.equal(body.state, "unavailable");
  assert.deepEqual(body.games, []);
});
check("provider invalid JSON yields unavailable, no LIVE", async () => {
  const body = await (await handlerWith(async () => new Response("<html>", { status: 200 }))).json();
  assert.equal(body.state, "unavailable");
  assert.deepEqual(body.games, []);
});
check("provider payload of the wrong shape yields unavailable, no LIVE", async () => {
  const body = await (await handlerWith(async () => Response.json({ games: "nope" }))).json();
  assert.equal(body.state, "unavailable");
  assert.deepEqual(body.games, []);
});
check("valid provider payload returns only normalized public status fields", async () => {
  const res = await handlerWith(
    async () =>
      Response.json(
        payload([
          game(10, "LIVE", "WSH", "PIT", {
            periodDescriptor: { number: 2, periodType: "REG" },
            clock: { timeRemaining: "08:42", inIntermission: false },
            ticketPrice: 99,
          }),
        ]),
      ),
  );
  const body = await res.json();
  assert.equal(body.state, "ok");
  assert.equal(body.date, "2026-10-07");
  assert.deepEqual(Object.keys(body.games[0]).sort(), ["away", "clock", "gameId", "home", "period", "state"]);
  assert.equal(res.headers.get("Cache-Control"), "public, max-age=0, s-maxage=15");
});
check("cache: 45s when nothing is live, 15s while a game is live", async () => {
  const idle = await handlerWith(async () => Response.json(payload([game(11, "FUT", "WSH", "PIT")])));
  assert.equal(idle.headers.get("Cache-Control"), "public, max-age=0, s-maxage=45");
});

const run = async () => {
  for (const t of pending) await t();
  console.log(`\n${passed} live checks passed`);
};
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
