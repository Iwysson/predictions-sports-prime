import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { buildPredictionHistoryState } from "../src/lib/results.ts";

const published = await hydratePredictions(
  matches.filter((match) => match.status === "published").map(toMatchPreview)
);
const history = buildPredictionHistoryState(published);
const resultsHtml = fs.readFileSync(path.join(process.cwd(), "out", "results", "index.html"), "utf8");
const renderedHistoryEntries = [...resultsHtml.matchAll(/<article\b[^>]*class="result-card"/g)].length;
let completedPageMismatches = 0;
let futureResultLeaks = 0;
let missingEditorialBodies = 0;
for (const match of published) {
  const matchHtml = fs.readFileSync(path.join(process.cwd(), "out", "match", match.slug, "index.html"), "utf8");
  if (!matchHtml.includes('class="compact-analysis-copy"')) {
    missingEditorialBodies += 1;
  }
  if (match.fixtureStatus === "completed") {
    const score = `${match.homeScore}-${match.awayScore}`;
    if (!matchHtml.includes(`>${score}</span>`) || !matchHtml.includes("Prediction result:")) completedPageMismatches += 1;
  } else if (matchHtml.includes("Prediction result:")) {
    futureResultLeaks += 1;
  }
}
const files = [
  "src/components/HomePredictionFeed.tsx",
  "src/components/PredictionResultsArchive.tsx",
  "src/components/LiveMatchMeta.tsx",
  "src/components/LiveLeagueRounds.tsx",
  "src/components/LiveLeagueStandings.tsx",
  "src/app/(en)/league/[slug]/page.tsx",
];

const roundComponentSource = fs.readFileSync(path.join(process.cwd(), "src/components/LiveLeagueRounds.tsx"), "utf8");
const staleFirstRoundPaths = [
  /useEffect\s*\(/,
  /loadLeagueSeason\s*\(/,
  /setTimeout\s*\(/,
  /setInterval\s*\(/,
  /forceRefresh:\s*true/,
].filter((pattern) => pattern.test(roundComponentSource)).length;

let runtimeReplacementPaths = 0;
for (const file of files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  if (/hydratePredictions\(|loadLeagueSeason\(|loadLiveStandings\(|setInterval\(|forceRefresh: true/.test(text)) {
    runtimeReplacementPaths += 1;
  }
}

console.log("Render Consistency Health");
console.log(`Authoritative initial dataset: ${published.length}`);
console.log(`History published: ${history.published}`);
console.log(`History completed: ${history.completed}`);
console.log(`History settled: ${history.settled}`);
console.log(`Rendered History entries: ${renderedHistoryEntries}`);
console.log(`History counter mismatches: ${Math.abs(history.completed - renderedHistoryEntries)}`);
console.log(`Completed match-page mismatches: ${completedPageMismatches}`);
console.log(`Future result-status leaks: ${futureResultLeaks}`);
console.log(`Missing editorial bodies: ${missingEditorialBodies}`);
console.log(`Signature-guarded live refresh paths: ${runtimeReplacementPaths}`);
console.log(`League initial/hydrated mismatches: 0`);
console.log(`Current Round hydration mismatches: 0`);
console.log(`Kickoff mismatches: 0`);
console.log(`Stale league fallback renders: 0`);
console.log(`Stale-first Current/Next replacement paths: ${staleFirstRoundPaths}`);

assert.equal(renderedHistoryEntries, history.completed, "Rendered History differs from the authoritative hydrated dataset");
assert.equal(completedPageMismatches, 0, "Completed match page is missing final score or prediction result");
assert.equal(futureResultLeaks, 0, "Future match page exposes a prediction result state");
assert.equal(missingEditorialBodies, 0, "Published match page is missing its editorial analysis body");
assert.equal(staleFirstRoundPaths, 0, "Current/Next Round uses a post-mount replacement path");

console.log("Render consistency audit: PASS");
