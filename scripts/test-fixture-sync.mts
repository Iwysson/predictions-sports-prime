// Regression tests for fixture sync link coverage. No network: fetch is stubbed.
import assert from "node:assert/strict";
import { hydrateLiveResults } from "../src/lib/openfootball.ts";
import {
  buildEditorialFallbackFixture,
  fixtureIdentityMatchesPrediction,
  findPredictionFixture,
  normalizeFixtureRounds,
} from "../src/lib/fixture-sync-integrity.ts";

const prediction = {
  league: "brasileirao-serie-a",
  slug: "remo-vs-gremio",
  homeTeam: "Remo",
  awayTeam: "Grêmio",
  date: "2026-10-07",
  time: "19:30",
  round: "Round 29",
  timeConfirmed: true,
};
const game = (extra: Record<string, unknown> = {}) => ({
  round: 29, date: "2026-10-07", time: "19:30", homeTeam: "Remo", awayTeam: "Grêmio",
  homeScore: null, awayScore: null, status: "scheduled", id: "401", kickoffUtc: "2026-10-07T22:30:00.000Z", ...extra,
}) as any;

// 1. Newly published prediction missing from a stale snapshot -> editorial link.
{
  const stale = [{ round: 25, games: [game({ round: 25, homeTeam: "Fluminense", awayTeam: "Remo", date: "2026-08-22", id: "1" })] }];
  const fixture = buildEditorialFallbackFixture(prediction, [stale, []]);
  assert.ok(fixture, "fallback must link a published prediction absent from the stale snapshot");
  assert.equal(fixture.id, "editorial:brasileirao-serie-a:remo-vs-gremio:2026-10-07");
  assert.equal(fixture.round, 29);
  assert.equal(fixture.kickoffUtc, "2026-10-07T22:30:00.000Z");
  assert.equal(fixture.status, "scheduled");
  assert.ok(fixtureIdentityMatchesPrediction(prediction, fixture));
}

// 2. Official fixture always wins (alias / accent mismatch must not duplicate it).
{
  const official = [{ round: 29, games: [game({ awayTeam: "Gremio" })] }];
  assert.equal(buildEditorialFallbackFixture(prediction, [official]), null);
  assert.equal(buildEditorialFallbackFixture(prediction, [[], official]), null);
  assert.equal(findPredictionFixture(official, prediction)?.id, "401");
}

// 3. Never invent a fixture without verified date/time/round.
assert.equal(buildEditorialFallbackFixture({ ...prediction, time: "TBD" }, [[]]), null);
assert.equal(buildEditorialFallbackFixture({ ...prediction, date: "" }, [[]]), null);
assert.equal(buildEditorialFallbackFixture({ ...prediction, round: undefined }, [[]]), null);

// 4. Home/away is never swapped: a reverse-leg fixture is not an official match.
{
  const reverse = [{ round: 10, games: [game({ round: 10, homeTeam: "Grêmio", awayTeam: "Remo", id: "9", date: "2026-06-01" })] }];
  assert.ok(buildEditorialFallbackFixture(prediction, [reverse]), "reverse leg must not suppress the link");
  assert.equal(findPredictionFixture(reverse, prediction), undefined);
  assert.equal(fixtureIdentityMatchesPrediction(prediction, reverse[0].games[0]), false);
}

// 5. Duplicate identical fixtures collapse; conflicting duplicates are rejected.
{
  assert.equal(normalizeFixtureRounds([{ round: 29, games: [game(), game()] }])[0].games.length, 1);
  assert.throws(() => normalizeFixtureRounds([{ round: 29, games: [game(), game({ date: "2026-10-08" })] }]), /Conflicting/);
}

// 6. Incomplete round: unresolved round is rejected rather than guessed.
assert.throws(() => normalizeFixtureRounds([{ round: 0, games: [game({ round: 0 })] }]), /Invalid supplied round/);

// 7. Provider 400 is reported with endpoint context (no secrets) and is thrown so the
//    caller preserves the previous valid snapshot; range queries are never sent.
{
  const calls: string[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string) => {
    calls.push(String(url));
    return new Response("{}", { status: 400 });
  }) as typeof fetch;
  try {
    await assert.rejects(
      hydrateLiveResults("brasileirao-serie-a", [{ round: 29, games: [game({ id: undefined })] }]),
      /live results returned 400 \(bra\.1, dates=2026\)/
    );
    await assert.rejects(
      hydrateLiveResults("premier-league", [{ round: 1, games: [game({ id: undefined })] }]),
      /returned 400 \(eng\.1, dates=2026,2027\)/
    );
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.ok(calls.length >= 3 && calls.every((url) => /dates=\d{4}&limit=1000$/.test(url)), `ESPN range queries return HTTP 400; got ${calls.join(" ")}`);
}

console.log("Fixture sync tests: PASS");
