import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { matches } from "../src/data/matches.ts";
import { fixtureKickoffMillis, isFixtureHistoryEligible } from "../src/lib/fixture-state.ts";

const root = process.cwd();
const representativeMarkets = [
  { name: "standard handicap", matches: (pick) => /\s[+-]\d+(?:\.\d+)?$/i.test(pick) && !/asian handicap/i.test(pick) },
  { name: "Asian Handicap", matches: (pick) => /asian handicap/i.test(pick) },
  { name: "win", matches: (pick) => /\bto win\b/i.test(pick) },
  { name: "goals total", matches: (pick) => /^(?:over|under)\s+\d+(?:\.\d+)?\s+goals?$/i.test(pick) },
  { name: "combined market", matches: (pick) => /\+/.test(pick) },
];

const future = matches.filter((match) => {
  const kickoff = fixtureKickoffMillis(match);
  const explicitlyPreMatch = match.fixtureStatus === "scheduled" || match.fixtureStatus === "rescheduled";
  return !isFixtureHistoryEligible(match) && (explicitlyPreMatch || (kickoff !== null && kickoff > Date.now()));
});
let checked = 0;
for (const match of future) {
  const path = join(root, ".next", "server", "app", "match", `${match.slug}.html`);
  const html = readFileSync(path, "utf8");
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? html;
  const descriptions = [...head.matchAll(/<meta[^>]+(?:name="description"|property="og:description"|name="twitter:description")[^>]+>/gi)].map((entry) => entry[0]);
  const pick = match.predictions.find((item) => item.label === "Main Prediction")?.value;
  const odds = match.predictions.find((item) => item.label === "Published Odds" || item.label === "Odds")?.value;
  assert(descriptions.length >= 2, `${match.slug}: description/OG metadata missing`);
  if (pick) assert(descriptions.every((tag) => !tag.toLowerCase().includes(pick.toLowerCase())), `${match.slug}: exact pick leaked in metadata`);
  if (odds) assert(descriptions.every((tag) => !tag.includes(`odds of ${odds}`) && !tag.includes(`Odds: ${odds}`)), `${match.slug}: exact odds leaked in metadata`);
  assert(html.includes("data-nosnippet"), `${match.slug}: sensitive prediction blocks lack data-nosnippet`);
  assert(head.includes(`<link rel="canonical" href="https://predictions-sports-prime.com/match/${match.slug}/"`), `${match.slug}: canonical missing`);
  checked += 1;
}

const representatives = representativeMarkets.map(({ name, matches: matchesMarket }) => {
  const match = future.find((candidate) => {
    const pick = candidate.predictions.find((item) => item.label === "Main Prediction")?.value ?? "";
    return matchesMarket(pick);
  });
  assert(match, `${name}: no compatible future representative fixture found`);
  return match.slug;
});
console.log(`Snippet privacy audit: PASS (${checked} future match pages; dynamic representatives: ${representatives.join(", ")}).`);
