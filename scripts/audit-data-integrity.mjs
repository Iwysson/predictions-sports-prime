import fs from "node:fs";
import path from "node:path";
import snapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };
import { leagues } from "../src/data/leagues.ts";
import { normalizeTeamKey } from "../src/lib/openfootball.ts";
import { validateLeagueRounds } from "../src/lib/data-validation.ts";

const errors = [];
const competitions = {};
const validStatuses = new Set(["scheduled", "rescheduled", "postponed", "cancelled", "in-progress", "completed"]);

for (const league of leagues) {
  if (!league.sources.fixtures && !league.liveDataId) continue;
  const rounds = snapshot.leagues[league.slug] ?? [];
  if (league.manualOnly && rounds.length === 0) {
    competitions[league.slug] = { expectedClubs: league.expectedClubs, detectedCanonicalClubs: 0, rounds: 0, fixtures: 0, identities: [], sourceMode: "manual-editorial" };
    continue;
  }
  const identities = new Map();
  const fixtureIds = new Set();
  const fixtureKeys = new Set();

  for (const round of rounds) {
    for (const game of round.games) {
      for (const name of [game.homeTeam, game.awayTeam]) {
        const key = normalizeTeamKey(name);
        const item = identities.get(name) ?? { rawName: name, normalizedKey: key, appearances: 0, rounds: new Set(), sources: new Set() };
        item.appearances += 1;
        item.rounds.add(round.round);
        item.sources.add(game.dataSource ?? "unknown");
        identities.set(name, item);
      }
      if (!game.id || fixtureIds.has(game.id)) errors.push(`${league.slug}: duplicate/missing fixture id ${game.id ?? "missing"}`);
      if (game.id) fixtureIds.add(game.id);
      const fixtureKey = `${round.round}:${normalizeTeamKey(game.homeTeam)}:${normalizeTeamKey(game.awayTeam)}`;
      if (fixtureKeys.has(fixtureKey)) errors.push(`${league.slug}: duplicate fixture ${fixtureKey}`);
      fixtureKeys.add(fixtureKey);
      if (!game.kickoffUtc || !Number.isFinite(Date.parse(game.kickoffUtc))) errors.push(`${league.slug}: invalid kickoff ${game.id ?? fixtureKey}`);
      if (!validStatuses.has(game.status ?? "scheduled")) errors.push(`${league.slug}: invalid status ${game.status}`);
      if (game.status === "completed" && (!Number.isInteger(game.homeScore) || !Number.isInteger(game.awayScore))) {
        errors.push(`${league.slug}: completed fixture without final score ${game.id ?? fixtureKey}`);
      }
    }
  }

  const validation = validateLeagueRounds(rounds, {
    slug: league.slug,
    source: league.sources.fixtures,
    expectedClubs: league.expectedClubs,
    expectedGamesPerRound: league.expectedGamesPerRound,
    label: league.name,
  });
  errors.push(...validation.errors.map((error) => `${league.slug}: ${error}`));
  const byCanonical = new Map();
  for (const item of identities.values()) byCanonical.set(item.normalizedKey, [...(byCanonical.get(item.normalizedKey) ?? []), item.rawName]);
  competitions[league.slug] = {
    expectedClubs: league.expectedClubs,
    detectedCanonicalClubs: byCanonical.size,
    rounds: rounds.length,
    fixtures: fixtureIds.size,
    identities: [...identities.values()].map((item) => ({
      rawName: item.rawName,
      normalizedKey: item.normalizedKey,
      canonicalClubMapping: item.normalizedKey,
      appearances: item.appearances,
      rounds: [...item.rounds].sort((a, b) => a - b),
      sources: [...item.sources].sort(),
      possibleAliases: (byCanonical.get(item.normalizedKey) ?? []).filter((name) => name !== item.rawName).sort(),
    })).sort((a, b) => a.normalizedKey.localeCompare(b.normalizedKey) || a.rawName.localeCompare(b.rawName)),
  };
}

const report = { schemaVersion: 1, snapshotGeneratedAt: snapshot.generatedAt, competitions, errors: [...new Set(errors)].sort() };
const reportDirectory = path.join(process.cwd(), "reports", "seo-baseline");
fs.mkdirSync(reportDirectory, { recursive: true });
fs.writeFileSync(path.join(reportDirectory, "data-integrity.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Data integrity: ${Object.keys(competitions).length} competitions; ${report.errors.length} errors.`);
if (report.errors.length) {
  report.errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("Data integrity audit: PASS");
