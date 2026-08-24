import assert from "node:assert/strict";
import { matches } from "../src/data/matches.ts";
import { buildPredictionHistoryState } from "../src/lib/results.ts";
import { isCompletedFixture, isNonPlayableFixture } from "../src/lib/fixture-status.ts";

const published = matches.filter((match) => match.status === "published");
const history = buildPredictionHistoryState(published).entries;
const historySlugs = new Set(history.map((match) => match.slug));
let completedMissingHistory = 0;
let completedStillActive = 0;
let futureInHistory = 0;
let postponedInHistory = 0;
let duplicateHistory = 0;

const seen = new Set();
for (const match of history) {
  const key = `${match.league}:${match.slug}`;
  if (seen.has(key)) duplicateHistory += 1;
  seen.add(key);
}

for (const match of published) {
  const completed = isCompletedFixture(match.fixtureStatus);
  const nonPlayable = isNonPlayableFixture(match.fixtureStatus);
  const inHistory = historySlugs.has(match.slug);

  if (completed && !inHistory) completedMissingHistory += 1;
  if (completed && !nonPlayable && !inHistory) completedStillActive += 1;
  if (!completed && inHistory) futureInHistory += 1;
  if (match.fixtureStatus === "postponed" && inHistory) postponedInHistory += 1;
}

console.log("Prediction History Health");
console.log(`Published completed predictions: ${published.filter((match) => isCompletedFixture(match.fixtureStatus)).length}`);
console.log(`Correctly in History: ${history.length}`);
console.log(`Completed still active: ${completedStillActive}`);
console.log(`Future in History: ${futureInHistory}`);
console.log(`Duplicate history entries: ${duplicateHistory}`);
console.log(`Completed missing History: ${completedMissingHistory}`);
console.log(`Postponed in History: ${postponedInHistory}`);

assert.equal(completedMissingHistory, 0, "Completed match missing history");
assert.equal(completedStillActive, 0, "Completed match still active");
assert.equal(futureInHistory, 0, "Future match in history");
assert.equal(postponedInHistory, 0, "Postponed match in history");
assert.equal(duplicateHistory, 0, "Duplicate history entries detected");

console.log("Prediction history audit: PASS");
