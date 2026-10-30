import fs from "node:fs";
import assert from "node:assert/strict";
import snapshot from "../src/data/nfl/standings.snapshot.json" with { type: "json" };
import { NFL_DIVISIONS, NFL_TEAMS } from "../src/data/nfl/teams.ts";
import { getNFLStandings, validateNFLStandings } from "../src/lib/nfl-standings-provider.ts";
import { nflStandingsCopies } from "../src/lib/nfl-standings-i18n.ts";
import { seoLocaleSlugs } from "../src/lib/seo-locales.ts";

assert.deepEqual(validateNFLStandings(snapshot), []);
const rows = getNFLStandings(snapshot.season);
assert.equal(rows.length, 32); assert.equal(new Set(rows.map((row) => row.id)).size, 32);
assert.equal(rows.filter((row) => row.conference === "AFC").length, 16); assert.equal(rows.filter((row) => row.conference === "NFC").length, 16);
for (const divisions of Object.values(NFL_DIVISIONS)) for (const division of divisions) assert.equal(rows.filter((row) => row.division === division).length, 4, division);
for (const team of NFL_TEAMS) assert.ok(fs.existsSync(`public${team.logo}`), `${team.id}: logo missing`);
for (const locale of ["en", ...seoLocaleSlugs]) for (const key of ["title", "wins", "losses", "ties", "lastUpdated", "playoffPicture"]) assert.ok(nflStandingsCopies[locale][key], `${locale}: ${key} missing`);
const component = fs.readFileSync("src/components/NFLStandings.tsx", "utf8");
for (const token of ["NFLDivisionStandings", "NFLConferenceStandings", "NFLPlayoffLegend", "<h2", "<h3", "role=\"table\""]) assert.ok(component.includes(token), `UI missing ${token}`);
assert.ok(fs.existsSync("src/data/nfl/standings.snapshot.json")); assert.ok(fs.existsSync("scripts/sync-nfl-standings.mjs"));
console.log(`NFL standings audit PASS: 32 teams, 2 conferences, 8 divisions, ${seoLocaleSlugs.length + 1} locales, valid fallback.`);
