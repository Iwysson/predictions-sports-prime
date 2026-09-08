import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { leagues } from "../src/data/leagues.ts";
import { matches } from "../src/data/matches.ts";
import { leagueCanonicalPath, leagueIntro, leagueSeoCapabilities, leagueSeoDescription, leagueSeoTitle } from "../src/lib/league-seo.ts";

const titles = new Set();
const descriptions = new Set();
for (const league of leagues) {
  const published = matches.filter((match) => match.league === league.slug && match.status === "published");
  const capabilities = leagueSeoCapabilities(league, published);
  const title = leagueSeoTitle(league, capabilities);
  const description = leagueSeoDescription(league, capabilities);
  assert.equal(leagueCanonicalPath(league), `/league/${league.slug}/`);
  assert.ok(title.startsWith(`${league.name} Predictions`), `${league.slug}: league intent does not own title`);
  assert.ok(title.length <= 70, `${league.slug}: title exceeds 70 characters`);
  assert.ok(description.includes(league.name) && /\d/.test(description), `${league.slug}: description lacks real competition identity or inventory`);
  assert.ok(description.length <= 160, `${league.slug}: description exceeds 160 characters`);
  assert.ok(leagueIntro(league, published.length).length >= 120, `${league.slug}: intro is thin`);
  assert.ok(!titles.has(title), `${league.slug}: duplicate league title`);
  assert.ok(!descriptions.has(description), `${league.slug}: duplicate league description`);
  titles.add(title); descriptions.add(description);
}
const page = readFileSync(join(process.cwd(), "src", "app", "(en)", "league", "[slug]", "page.tsx"), "utf8");
for (const token of ["leagueSeoTitle", "leagueSeoDescription", "leagueCollectionJsonLd", "buildCompetitionRoundSurface", "LeaguePublishedAnalysis"]) assert.ok(page.includes(token), `shared league engine missing ${token}`);
const wave4 = ["football-predictions", "soccer-predictions", "betting-tips", "picks", "today-predictions"];
assert.ok(leagues.every((league) => !wave4.includes(league.slug)), "generic intent and league ownership overlap");
console.log(`League prediction hubs: ${leagues.length}`);
console.log("League prediction engine source audit: PASS");
