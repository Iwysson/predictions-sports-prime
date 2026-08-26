import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { isCompletedFixture } from "../src/lib/fixture-status.ts";
import { localTodayISO, resolveHomeTemporalBucket } from "../src/lib/match-feed.ts";
import {
  buildMatchSearchIntentCopy,
  getMatchIntentCapabilities,
  localeSearchResearch,
  searchIntentLocales,
  shouldApplySearchIntentSEO,
} from "../src/lib/match-search-intent.ts";
import { matchCanonicalPath, matchSeoDescription, matchSeoTitle } from "../src/lib/seo.ts";

const publishedSource = matches.filter((match) => match.status === "published");
const hydratedMatches = await hydratePredictions(publishedSource.map(toMatchPreview));
const publishedMatches = publishedSource.map((match, index) => ({
  ...match,
  ...hydratedMatches[index],
}));
const analyzedMatches = publishedMatches.filter(shouldApplySearchIntentSEO);
const today = localTodayISO();
const errors = [];
const slugsByBucket = {
  today: new Set(),
  tomorrow: new Set(),
  upcoming: new Set(),
  historical: new Set(),
};

let searchIntentCoverage = 0;
let unresolvedTemporalState = 0;
let incorrectTomorrow = 0;
let incorrectToday = 0;
let marketIntentMismatches = 0;
let unsupportedFactualIntent = 0;

for (const match of analyzedMatches) {
  const bucket = resolveHomeTemporalBucket(match, today);
  const intent = buildMatchSearchIntentCopy(match, "en", today);
  const capabilities = getMatchIntentCapabilities(match);
  const description = matchSeoDescription(match).toLowerCase();

  if (bucket in slugsByBucket) slugsByBucket[bucket].add(match.slug);
  else unresolvedTemporalState += 1;

  if (
    intent.primaryQuery &&
    intent.predictionQueries.length > 0 &&
    intent.analysisQueries.length > 0 &&
    intent.title &&
    intent.description &&
    intent.h1
  ) {
    searchIntentCoverage += 1;
  } else {
    errors.push(`${match.slug}: incomplete Search Intent coverage`);
  }

  if (intent.temporalState !== (bucket === "none" ? null : bucket)) {
    errors.push(`${match.slug}: Search Intent temporal state differs from Home bucket`);
  }

  if (bucket === "tomorrow" && !/\btomorrow\b/.test(description)) incorrectTomorrow += 1;
  if (bucket !== "tomorrow" && /\btomorrow\b/.test(description)) incorrectTomorrow += 1;
  if (bucket === "today" && !/\btoday\b/.test(description)) incorrectToday += 1;
  if (bucket !== "today" && /\btoday\b/.test(description)) incorrectToday += 1;

  if (capabilities.hasPick !== (intent.marketQueries.length > 0)) marketIntentMismatches += 1;
  if (capabilities.hasPick !== intent.categories.includes("MARKET")) marketIntentMismatches += 1;
  if (capabilities.markets.length === 0 && intent.marketQueries.length > 1) marketIntentMismatches += 1;

  if (!capabilities.hasOdds && intent.oddsQueries.length > 0) unsupportedFactualIntent += 1;
  if (!capabilities.hasStatistics && intent.categories.includes("STATISTICS")) unsupportedFactualIntent += 1;
  if (!capabilities.hasForm && intent.categories.includes("FORM")) unsupportedFactualIntent += 1;
  if (!capabilities.hasH2h && intent.categories.includes("H2H")) unsupportedFactualIntent += 1;
  if (!capabilities.hasStandingsContext && intent.categories.includes("STANDINGS")) unsupportedFactualIntent += 1;
}

function overlap(left, right) {
  return [...left].filter((slug) => right.has(slug)).length;
}

const overlapTodayTomorrow = overlap(slugsByBucket.today, slugsByBucket.tomorrow);
const overlapTodayUpcoming = overlap(slugsByBucket.today, slugsByBucket.upcoming);
const overlapTomorrowUpcoming = overlap(slugsByBucket.tomorrow, slugsByBucket.upcoming);

const lifecycleBase = analyzedMatches[0];
if (!lifecycleBase) {
  errors.push("No analyzed match is available for lifecycle regression tests");
} else {
  const fixedToday = localTodayISO();
  const shiftDate = (days) => {
    const value = new Date(`${fixedToday}T12:00:00-03:00`);
    value.setUTCDate(value.getUTCDate() + days);
    return value.toISOString().slice(0, 10);
  };
  const cases = [
    { state: "upcoming", date: shiftDate(7), fixtureStatus: "scheduled" },
    { state: "upcoming", date: shiftDate(3), fixtureStatus: "scheduled" },
    { state: "tomorrow", date: shiftDate(1), fixtureStatus: "scheduled" },
    { state: "today", date: fixedToday, fixtureStatus: "scheduled" },
    { state: "historical", date: shiftDate(-1), fixtureStatus: "completed" },
  ];
  const generated = cases.map((entry) => {
    // Isolate the lifecycle date under test from any hydrated fixture timestamp
    // carried by the sampled production match.
    const match = {
      ...lifecycleBase,
      fixtureId: undefined,
      kickoffUtc: undefined,
      timeConfirmed: false,
      date: entry.date,
      fixtureStatus: entry.fixtureStatus,
      homeScore: entry.fixtureStatus === "completed" ? 1 : null,
      awayScore: entry.fixtureStatus === "completed" ? 0 : null,
    };
    return {
      ...entry,
      match,
      copy: buildMatchSearchIntentCopy(match, "en", fixedToday),
    };
  });

  for (const item of generated) {
    if (item.copy.temporalState !== item.state) {
      errors.push(`Lifecycle regression ${item.state}: generated ${item.copy.temporalState ?? "none"}`);
    }
  }

  const tomorrowDescription = generated.find((item) => item.state === "tomorrow").copy.description.toLowerCase();
  const todayDescription = generated.find((item) => item.state === "today").copy.description.toLowerCase();
  const upcomingDescriptions = generated.filter((item) => item.state === "upcoming").map((item) => item.copy.description.toLowerCase());
  const historicalDescription = generated.find((item) => item.state === "historical").copy.description.toLowerCase();
  if (!tomorrowDescription.includes("tomorrow")) errors.push("T-1 regression: tomorrow is missing");
  if (!todayDescription.includes("today")) errors.push("Match-day regression: today is missing");
  if (upcomingDescriptions.some((description) => description.includes("today") || description.includes("tomorrow"))) errors.push("T-7/T-3 regression: incorrect near-term wording");
  if (!historicalDescription.includes("completed match")) errors.push("Completed regression: historical wording is missing");

  const titles = new Set(generated.map((item) => matchSeoTitle(item.match)));
  const canonicals = new Set(generated.map((item) => matchCanonicalPath(item.match)));
  if (titles.size !== 1) errors.push("Lifecycle regression: stable title changed across temporal states");
  if (canonicals.size !== 1) errors.push("Lifecycle regression: canonical changed across temporal states");
}

for (const locale of searchIntentLocales) {
  const research = localeSearchResearch[locale];
  const required = [
    research.prediction,
    research.betting,
    research.analysis,
    research.temporal.today,
    research.temporal.tomorrow,
    ...Object.values(research.markets),
  ];
  if (required.some((term) => !term.trim())) errors.push(`${locale}: incomplete localized terminology`);
}

if (incorrectTomorrow > 0) errors.push(`Incorrect tomorrow metadata: ${incorrectTomorrow}`);
if (incorrectToday > 0) errors.push(`Incorrect today metadata: ${incorrectToday}`);
if (marketIntentMismatches > 0) errors.push(`Market-intent mismatches: ${marketIntentMismatches}`);
if (unsupportedFactualIntent > 0) errors.push(`Unsupported factual intent: ${unsupportedFactualIntent}`);
if (overlapTodayTomorrow + overlapTodayUpcoming + overlapTomorrowUpcoming > 0) {
  errors.push("Temporal bucket overlap detected");
}

const futurePublished = slugsByBucket.today.size + slugsByBucket.tomorrow.size + slugsByBucket.upcoming.size;

console.log("Search Intent SEO Coverage");
console.log(`Total matches: ${matches.length}`);
console.log(`Published matches: ${publishedMatches.length}`);
console.log(`Completed matches: ${publishedMatches.filter((match) => isCompletedFixture(match.fixtureStatus)).length}`);
console.log(`Published future matches: ${futurePublished}`);
console.log(`Search Intent coverage: ${searchIntentCoverage}/${analyzedMatches.length}`);
console.log(`Today intent: ${slugsByBucket.today.size}`);
console.log(`Tomorrow intent: ${slugsByBucket.tomorrow.size}`);
console.log(`Upcoming intent: ${slugsByBucket.upcoming.size}`);
console.log(`Historical intent: ${slugsByBucket.historical.size}`);
console.log(`Unresolved temporal state: ${unresolvedTemporalState}`);
console.log(`Temporal overlap Today/Tomorrow: ${overlapTodayTomorrow}`);
console.log(`Temporal overlap Today/Upcoming: ${overlapTodayUpcoming}`);
console.log(`Temporal overlap Tomorrow/Upcoming: ${overlapTomorrowUpcoming}`);
console.log(`Incorrect tomorrow metadata: ${incorrectTomorrow}`);
console.log(`Incorrect today metadata: ${incorrectToday}`);
console.log(`Market-intent mismatches: ${marketIntentMismatches}`);
console.log(`Unsupported factual intent: ${unsupportedFactualIntent}`);
console.log(`Localized temporal mappings: ${searchIntentLocales.length} locales`);

for (const locale of searchIntentLocales) {
  const research = localeSearchResearch[locale];
  console.log(`${locale}: ${research.status} / ${research.confidence}`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.log("FAIL");
  process.exitCode = 1;
} else {
  console.log("PASS");
}
