import { matches } from "../src/data/matches.ts";
import { localTodayISO } from "../src/lib/match-feed.ts";
import {
  buildMatchSearchIntentCopy,
  shouldApplySearchIntentSEO,
} from "../src/lib/match-search-intent.ts";
import {
  containsContextOnlyMetadataIntent,
  predictionFirstSearchIntentPolicy,
} from "../src/lib/prediction-first-search-intent.ts";
import { isFutureFixture } from "../src/lib/fixture-state.ts";

const today = localTodayISO();
const locales = ["en", "pt-BR", "es", "it", "fr", "de"];
const errors = [];

const primaryPatterns = {
  en: /\bprediction\b/i,
  "pt-BR": /\bpalpite\b/i,
  es: /\bpronóstico\b/i,
  it: /\bpronostico\b/i,
  fr: /\bpronostic\b/i,
  de: /\bprognose\b/i,
};

const nichePatterns = {
  en: /\b(?:betting tips?|betting analysis|odds|match analysis)\b/i,
  "pt-BR": /\b(?:dicas? de apostas?|odds|análise)\b/i,
  es: /\b(?:apuestas?|cuotas|análisis)\b/i,
  it: /\b(?:scommesse|quote|analisi)\b/i,
  fr: /\b(?:conseils? paris|cotes|analyse)\b/i,
  de: /\b(?:wett-?tipps?|quoten|analyse)\b/i,
};

function check(condition, message) {
  if (!condition) errors.push(message);
}

const future = matches.filter((match) =>
  match.status === "published" &&
  isFutureFixture({
    fixtureStatus: match.fixtureStatus,
    kickoffUtc: match.kickoffUtc,
    date: match.date,
    time: match.time,
    timeConfirmed: match.timeConfirmed,
  }) &&
  shouldApplySearchIntentSEO(match)
);

for (const match of future) {
  for (const locale of locales) {
    const copy = buildMatchSearchIntentCopy(match, locale, today);
    const id = `${locale}:${match.slug}`;
    const metadata = `${copy.title} ${copy.description}`;

    check(primaryPatterns[locale].test(copy.title), `${id}: primary prediction term missing from title`);
    check(primaryPatterns[locale].test(copy.h1), `${id}: primary prediction term missing from H1`);
    check(primaryPatterns[locale].test(copy.description), `${id}: primary prediction term missing from description`);
    check(nichePatterns[locale].test(copy.description), `${id}: betting/analysis/odds niche signal missing from description`);
    check(!containsContextOnlyMetadataIntent(metadata), `${id}: context-only intent leaked into title/description`);
    check(copy.title.length <= 70, `${id}: title length ${copy.title.length}`);
    check(copy.description.length <= 160, `${id}: description length ${copy.description.length}`);

    // Supporting modules may exist on page, but they must not be generated as
    // secondary acquisition queries.
    for (const query of copy.secondaryQueries) {
      check(!containsContextOnlyMetadataIntent(query), `${id}: context-only secondary query '${query}'`);
    }
  }
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error(`Prediction-First Search Intent audit: FAIL (${errors.length} errors)`);
  process.exitCode = 1;
} else {
  console.log("Prediction-First Search Intent audit: PASS");
  console.log(`Future analyzed predictions: ${future.length}`);
  console.log(`Locales: ${locales.length} (${locales.join(", ")})`);
  console.log(`Pages audited: ${future.length * locales.length}`);
  console.log(`Primary acquisition: ${predictionFirstSearchIntentPolicy.primary.join(", ")}`);
  console.log(`Context-only modules excluded from metadata/query expansion: ${predictionFirstSearchIntentPolicy.contextOnly.join(", ")}`);
}
