import { matches } from "../src/data/matches.ts";
import { leagues } from "../src/data/leagues.ts";
import { classifyMatchSeo } from "../src/lib/match-freshness.ts";
import { leagueSeoCapabilities } from "../src/lib/league-seo.ts";

const counts = { A: 0, B: 0, C: 0 };
const failures = [];
for (const match of matches.filter((item) => item.status === "published")) {
  counts[classifyMatchSeo(match.matchSeo)] += 1;
  for (const [name, module] of Object.entries(match.matchSeo ?? {})) if (!module?.sources?.length) failures.push(`${match.slug}: ${name} lacks sources`);
}

let enabledLeagues = 0;
for (const league of leagues) {
  const leagueMatches = matches.filter((match) => match.status === "published" && match.league === league.slug);
  if (leagueSeoCapabilities(league, leagueMatches).hasAnalysis) enabledLeagues += 1;
}

console.log(`Match SEO capabilities: A=${counts.A} B=${counts.B} C=${counts.C}`);
console.log(`League SEO capabilities: ${enabledLeagues}/${leagues.length}`);
if (failures.length) {
  failures.forEach((failure) => console.error(`ERROR: ${failure}`));
  process.exitCode = 1;
} else console.log("SEO 2.0 capability audit: PASS");
