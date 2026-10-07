// Deterministic checks for the NHL day rule (America/New_York) and slate switching.
// Run: node --import tsx scripts/test-nhl-day.mts
import assert from "node:assert/strict";
import { getNhlTodayKey } from "../src/lib/nhl-day.ts";
import { resolveNhlSlate } from "../src/data/nhl/slates.ts";

// Eastern wall-clock instants converted to UTC instants (EDT is UTC-4 in October 2026).
const et = (iso: string) => new Date(`${iso}-04:00`);

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed += 1;
  console.log(`ok  ${name}`);
};

check("23:59:59 ET on Oct 6 is still the Oct 6 NHL day", () => {
  assert.equal(getNhlTodayKey(et("2026-10-06T23:59:59")), "2026-10-06");
});
check("00:00:00 ET on Oct 7 starts the Oct 7 NHL day", () => {
  assert.equal(getNhlTodayKey(et("2026-10-07T00:00:00")), "2026-10-07");
});
check("00:00:01 ET on Oct 7 remains the Oct 7 NHL day", () => {
  assert.equal(getNhlTodayKey(et("2026-10-07T00:00:01")), "2026-10-07");
});
check("the same instant gives the same day for every visitor zone", () => {
  // 00:00 ET equals 04:00 UTC equals 01:00 in Sao Paulo (UTC-3) and 05:00 in London (BST, UTC+1).
  const instant = new Date("2026-10-07T04:00:00Z");
  assert.equal(getNhlTodayKey(instant), "2026-10-07");
  assert.equal(getNhlTodayKey(new Date("2026-10-07T03:59:59Z")), "2026-10-06");
});
check("DST is handled by the IANA zone (standard time in January)", () => {
  // 23:30 ET on Jan 15 is 04:30 UTC on Jan 16: still Jan 15 in New York.
  assert.equal(getNhlTodayKey(new Date("2027-01-16T04:30:00Z")), "2027-01-15");
});

check("resolveNhlSlate: before Oct 6 there is no slate", () => {
  assert.equal(resolveNhlSlate("2026-10-05"), null);
});
check("resolveNhlSlate: Oct 6 slate until 00:00 ET on Oct 7", () => {
  assert.equal(resolveNhlSlate(getNhlTodayKey(et("2026-10-06T23:59:59")))?.dayKey, "2026-10-06");
});
check("resolveNhlSlate: Oct 7 slate from 00:00 ET", () => {
  const slate = resolveNhlSlate(getNhlTodayKey(et("2026-10-07T00:00:00")));
  assert.equal(slate?.dayKey, "2026-10-07");
  assert.equal(slate?.multiples[0]?.title, "NHL + FOOTBALL BEST MULTIPLE TODAY");
  assert.deepEqual(
    slate?.matches.map((m) => [m.access, m.homeTeam]),
    [
      ["free", "Pittsburgh Penguins"],
      ["best", "Colorado Avalanche"],
      ["vip", "Edmonton Oilers"],
    ],
  );
});

check("resolveNhlSlate: Oct 7 slate still active at 23:59:59 ET on Oct 7", () => {
  assert.equal(resolveNhlSlate(getNhlTodayKey(et("2026-10-07T23:59:59")))?.dayKey, "2026-10-07");
});
check("resolveNhlSlate: Oct 8 slate from 00:00 ET", () => {
  const slate = resolveNhlSlate(getNhlTodayKey(et("2026-10-08T00:00:00")));
  assert.equal(slate?.dayKey, "2026-10-08");
  assert.equal(slate?.matches.length, 10);
  assert.deepEqual(
    slate?.multiples.map((m) => m.title),
    ["NHL BEST MULTIPLE TODAY", "NHL + FOOTBALL BEST MULTIPLE TODAY", "NFL + FOOTBALL BEST MULTIPLE TODAY"],
  );
});
check("Oct 8 public slate exposes no BEST/VIP pick or odds", () => {
  const slate = resolveNhlSlate("2026-10-08");
  for (const m of slate!.matches.filter((x) => x.access !== "free")) {
    assert.equal(m.pick, undefined, `${m.slug} must not carry a pick`);
    assert.equal(m.odds, undefined, `${m.slug} must not carry odds`);
    assert.equal(m.analysis, undefined, `${m.slug} must not carry analysis`);
  }
});

check("Oct 7 public slate exposes no VIP pick or odds", () => {
  const slate = resolveNhlSlate("2026-10-07");
  for (const m of slate!.matches.filter((x) => x.access !== "free")) {
    assert.equal(m.pick, undefined, `${m.slug} must not carry a pick`);
    assert.equal(m.odds, undefined, `${m.slug} must not carry odds`);
    assert.equal(m.analysis, undefined, `${m.slug} must not carry analysis`);
  }
});

check("Oct 7 multiple: legs and combined odds", () => {
  const multiple = resolveNhlSlate("2026-10-07")!.multiples[0]!;
  assert.deepEqual(
    multiple.legs.map((l) => [l.pick, l.odds]),
    [
      ["Colorado Avalanche to Win", 1.65],
      ["Cruzeiro X1 + Over 1.5 Goals", 1.67],
    ],
  );
  assert.equal(multiple.combinedOdds, 2.76);
  assert.equal(Math.round(1.65 * 1.67 * 100) / 100, 2.76);
});

check("Oct 8 NHL Multiple: legs and combined odds", () => {
  const multiple = resolveNhlSlate("2026-10-08")!.multiples[0]!;
  assert.deepEqual(
    multiple.legs.map((l) => [l.pick, l.odds]),
    [
      ["Montreal Canadiens to Win (Including OT/SO)", 1.67],
      ["New York Islanders to Win (Including OT/SO)", 1.61],
    ],
  );
  assert.equal(multiple.combinedOdds, 2.69);
  assert.equal(Math.round(1.67 * 1.61 * 100) / 100, 2.69);
});


console.log(`\n${passed} checks passed`);
