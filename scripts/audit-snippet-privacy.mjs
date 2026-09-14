import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
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
let checkedRoutes = 0;

function visibleText(html) {
  const withoutExecutablePayloads = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  const tokens = withoutExecutablePayloads.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? [];
  const stack = [];
  const text = [];
  const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

  for (const token of tokens) {
    if (token.startsWith("<!--")) continue;
    if (!token.startsWith("<")) {
      if (!stack.some((entry) => entry.suppressed)) text.push(token);
      continue;
    }
    const closing = token.match(/^<\/\s*([a-z0-9:-]+)/i);
    if (closing) {
      const tag = closing[1].toLowerCase();
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        const entry = stack.pop();
        if (entry?.tag === tag) break;
      }
      continue;
    }
    const opening = token.match(/^<\s*([a-z0-9:-]+)/i);
    if (!opening) continue;
    const tag = opening[1].toLowerCase();
    const suppressed = stack.some((entry) => entry.suppressed) || /\sdata-nosnippet(?:\s|=|>)/i.test(token);
    if (!voidElements.has(tag) && !/\/\s*>$/.test(token)) stack.push({ tag, suppressed });
  }

  return text.join(" ").replace(/\s+/g, " ").trim();
}

const generatedHtml = readdirSync(join(root, ".next", "server", "app"), { recursive: true })
  .filter((entry) => typeof entry === "string" && entry.endsWith(".html"))
  .map((entry) => entry.replaceAll("\\", "/"));

for (const match of future) {
  const pick = match.predictions.find((item) => item.label === "Main Prediction")?.value;
  const odds = match.predictions.find((item) => item.label === "Published Odds" || item.label === "Odds")?.value;
  const routeFiles = generatedHtml.filter((entry) => entry.endsWith(`match/${match.slug}.html`));
  assert(routeFiles.length >= 1, `${match.slug}: no generated match HTML found`);

  for (const routeFile of routeFiles) {
    const path = join(root, ".next", "server", "app", routeFile);
    const html = readFileSync(path, "utf8");
    const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? html;
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
    const descriptions = [...head.matchAll(/<meta[^>]+(?:name="description"|property="og:description"|name="twitter:description")[^>]+>/gi)].map((entry) => entry[0]);
    const indexableText = visibleText(body);

    assert(descriptions.length >= 2, `${routeFile}: description/OG metadata missing`);
    if (pick) {
      assert(descriptions.every((tag) => !tag.toLowerCase().includes(pick.toLowerCase())), `${routeFile}: exact pick leaked in metadata`);
      assert(!indexableText.toLowerCase().includes(pick.toLowerCase()), `${routeFile}: exact pick leaked into visible/indexable text before reveal`);
    }
    if (odds) {
      assert(descriptions.every((tag) => !tag.includes(`odds of ${odds}`) && !tag.includes(`Odds: ${odds}`)), `${routeFile}: exact odds leaked in metadata`);
      const labelledOdds = new RegExp(`(?:published\\s+)?odds(?:\\s+of|\\s*:)?\\s*${odds.replace(".", "\\.")}`, "i");
      assert(!labelledOdds.test(indexableText), `${routeFile}: labelled odds leaked into visible/indexable text before reveal`);
    }
    assert(body.includes('data-prediction-reveal="locked"'), `${routeFile}: click-to-reveal gate missing from initial HTML`);
    assert(!body.includes('data-prediction-reveal="revealed"'), `${routeFile}: prediction rendered in the initial HTML`);
    checkedRoutes += 1;
  }

  const englishPath = join(root, ".next", "server", "app", "match", `${match.slug}.html`);
  const englishHead = readFileSync(englishPath, "utf8").match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  assert(englishHead.includes(`<link rel="canonical" href="https://predictions-sports-prime.com/match/${match.slug}/"`), `${match.slug}: canonical missing`);
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
console.log(`Snippet privacy audit: PASS (${checked} future fixtures; ${checkedRoutes} generated locale routes; dynamic representatives: ${representatives.join(", ")}).`);
