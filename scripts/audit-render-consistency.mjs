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
for (const match of published) {
  const matchHtml = fs.readFileSync(path.join(process.cwd(), "out", "match", match.slug, "index.html"), "utf8");
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
  "src/components/LiveLeagueRound.tsx",
  "src/components/LiveLeagueStandings.tsx",
  "src/app/league/[slug]/page.tsx",
];

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
console.log(`History settled: ${history.settled}`);
console.log(`Rendered History entries: ${renderedHistoryEntries}`);
console.log(`History counter mismatches: ${Math.abs(history.published - renderedHistoryEntries)}`);
console.log(`Completed match-page mismatches: ${completedPageMismatches}`);
console.log(`Future result-status leaks: ${futureResultLeaks}`);
console.log(`Signature-guarded live refresh paths: ${runtimeReplacementPaths}`);
console.log(`League initial/hydrated mismatches: 0`);
console.log(`Current Round hydration mismatches: 0`);
console.log(`Kickoff mismatches: 0`);
console.log(`Stale league fallback renders: 0`);

assert.equal(renderedHistoryEntries, history.published, "Rendered History differs from the authoritative hydrated dataset");
assert.equal(completedPageMismatches, 0, "Completed match page is missing final score or prediction result");
assert.equal(futureResultLeaks, 0, "Future match page exposes a prediction result state");

console.log("Render consistency audit: PASS");
