import assert from "node:assert/strict";
import { leagues } from "../src/data/leagues.ts";
import { standingsByLeague } from "../src/data/standings.ts";

let leaguesAudited = 0;
let invalid = 0;

for (const league of leagues) {
  const rows = standingsByLeague[league.slug] ?? [];
  if (!rows.length) continue;
  leaguesAudited += 1;

  const positions = new Set();
  const teams = new Set();
  for (const row of rows) {
    assert.ok(row.team, `${league.name}: missing team`);
    assert.ok(Number.isInteger(row.position) && row.position > 0, `${league.name}: invalid position`);
    assert.ok(!positions.has(row.position), `${league.name}: duplicate position`);
    assert.ok(!teams.has(row.team.toLowerCase()), `${league.name}: duplicate team`);
    positions.add(row.position);
    teams.add(row.team.toLowerCase());
    if (row.played !== undefined) assert.ok(row.played >= 0, `${league.name}: invalid played`);
    if (row.points !== undefined) assert.ok(row.points >= 0, `${league.name}: invalid points`);
    if (row.wins !== undefined && row.draws !== undefined && row.losses !== undefined && row.played !== undefined) {
      assert.equal(row.wins + row.draws + row.losses, row.played, `${league.name}: W+D+L mismatch`);
    }
    if (row.goalsFor !== undefined && row.goalsAgainst !== undefined && row.goalDifference !== undefined) {
      assert.equal(row.goalsFor - row.goalsAgainst, row.goalDifference, `${league.name}: GD mismatch`);
    }
  }
}

console.log(`Leagues audited: ${leaguesAudited}`);
console.log(`Invalid standings: ${invalid}`);
console.log("Standings audit: PASS");
