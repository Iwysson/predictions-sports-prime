import { matches } from "../src/data/matches.ts";
import { shouldApplySearchIntentSEO } from "../src/lib/match-search-intent.ts";
import { isCompletedFixture } from "../src/lib/fixture-status.ts";

const today = new Date();
const todayIso = today.toISOString().slice(0, 10);

function hasAnalysis(match) {
  return Array.isArray(match.analysis) && match.analysis.some((paragraph) => String(paragraph).trim().length > 0);
}

function isFutureMatch(match) {
  return Boolean(match.date) && match.date > todayIso;
}

const publishedMatches = matches.filter((match) => match.status === "published");
const completedMatches = publishedMatches.filter((match) => isCompletedFixture(match.fixtureStatus));
const futurePublishedMatches = publishedMatches.filter(isFutureMatch);
const futurePublishedMatchesWithAnalysis = futurePublishedMatches.filter(hasAnalysis);
const futurePublishedMatchesWithoutAnalysis = futurePublishedMatches.filter((match) => !hasAnalysis(match));
const coveredFutureMatches = futurePublishedMatchesWithAnalysis.filter(shouldApplySearchIntentSEO);
const uncoveredFutureMatches = futurePublishedMatchesWithAnalysis.filter((match) => !shouldApplySearchIntentSEO(match));

const byLeague = new Map();
for (const match of futurePublishedMatchesWithAnalysis) {
  const current = byLeague.get(match.league) ?? { total: 0, covered: 0 };
  current.total += 1;
  if (shouldApplySearchIntentSEO(match)) current.covered += 1;
  byLeague.set(match.league, current);
}

console.log("Search Intent SEO Coverage");
console.log(`Total matches: ${matches.length}`);
console.log(`Published matches: ${publishedMatches.length}`);
console.log(`Completed matches: ${completedMatches.length}`);
console.log(`Future published matches: ${futurePublishedMatches.length}`);
console.log(`Future published matches with analysis: ${futurePublishedMatchesWithAnalysis.length}`);
console.log(`Future published matches without analysis: ${futurePublishedMatchesWithoutAnalysis.length}`);
console.log(`Future analyzed pages with SEO engine: ${coveredFutureMatches.length}/${futurePublishedMatchesWithAnalysis.length}`);
console.log(`Coverage: ${futurePublishedMatchesWithAnalysis.length === 0 ? "100%" : `${Math.round((coveredFutureMatches.length / futurePublishedMatchesWithAnalysis.length) * 100)}%`}`);
console.log(`Missing future analyzed pages: ${uncoveredFutureMatches.length}`);

for (const [league, counts] of byLeague.entries()) {
  console.log(`${league}: ${counts.covered}/${counts.total}`);
}

if (uncoveredFutureMatches.length > 0) {
  console.error("PASS");
  process.exitCode = 1;
} else {
  console.log("PASS");
}
