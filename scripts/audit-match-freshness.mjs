import assert from "node:assert/strict";
import { matches } from "../src/data/matches.ts";
import { materialMatchUpdatedAt, resolveMatchFreshnessWindow } from "../src/lib/match-freshness.ts";

const kickoff = "2026-09-01T12:00:00Z";
for (const [hours, expected] of [[49, "outside-window"], [48, "T-48h"], [24, "T-24h"], [8, "T-8h"], [3, "T-3h"], [1, "T-1h"], [0.1, "kickoff"], [-1, "post-match"]]) {
  const now = new Date(Date.parse(kickoff) - Number(hours) * 3_600_000);
  assert.equal(resolveMatchFreshnessWindow(kickoff, now), expected);
}

let materialUpdates = 0;
for (const match of matches) {
  const modifiedAt = materialMatchUpdatedAt(match);
  if (modifiedAt) materialUpdates += 1;
  if (modifiedAt && match.publishedAt) assert.ok(Date.parse(modifiedAt) >= Date.parse(match.publishedAt), `${match.slug}: material update predates publication`);
  if (match.matchSeo?.lineups?.status === "confirmed") assert.ok(match.matchSeo.lineups.updatedAt || match.freshness?.lineupUpdatedAt, `${match.slug}: confirmed lineup requires a factual timestamp`);
}

console.log(`Match freshness audit: PASS (${materialUpdates} material updates; build time excluded)`);
