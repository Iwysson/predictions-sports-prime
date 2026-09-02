import assert from "node:assert/strict";
import { matches } from "../src/data/matches.ts";
import { localTodayISO } from "../src/lib/match-feed.ts";
import {
  buildMatchSearchIntentCopy,
  getMatchIntentRegistry,
  isRestrictedSearchIntentFixture,
} from "../src/lib/match-search-intent.ts";
import { containsContextOnlyMetadataIntent } from "../src/lib/prediction-first-search-intent.ts";

const today = localTodayISO();
const tomorrowDate = new Date(`${today}T12:00:00Z`);
tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
const tomorrow = tomorrowDate.toISOString().slice(0, 10);
const dates = new Set([today, tomorrow]);
const locales = ["en", "pt-BR", "es", "it", "fr", "de"];
const scoped = matches.filter(isRestrictedSearchIntentFixture);
const errors = [];
const pages = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

check(new Set(scoped.map((match) => match.slug)).size === scoped.length, "Scoped fixture slugs are not unique");

for (const match of scoped) {
  check(match.status === "published", `${match.slug}: fixture is not published`);
  check(dates.has(match.date), `${match.slug}: date is outside the live today/tomorrow scope (${match.date})`);

  const registry = getMatchIntentRegistry(match);
  const structuredInjuries = Boolean(match.matchSeo?.availability?.entries.some((entry) =>
    entry.status === "injured" || entry.status === "doubtful" || entry.status === "unavailable"
  ));
  const structuredSuspensions = Boolean(match.matchSeo?.availability?.entries.some((entry) => entry.status === "suspended"));

  check(registry.hasPrediction, `${match.slug}: prediction is missing`);
  check(registry.hasOdds, `${match.slug}: published odds are missing`);
  check(registry.hasAnalysis, `${match.slug}: analysis is missing`);
  check(registry.hasCompetition, `${match.slug}: competition is missing`);
  check(registry.hasRound, `${match.slug}: round is missing`);
  check(registry.hasKickOff, `${match.slug}: kick-off is missing`);
  check(registry.hasLineups === Boolean(match.matchSeo?.lineups), `${match.slug}: lineups intent is not structure-backed`);
  check(registry.hasTeamNews === Boolean(match.matchSeo?.teamNews), `${match.slug}: team-news intent is not structure-backed`);
  check(registry.hasInjuries === structuredInjuries, `${match.slug}: injuries intent is not structure-backed`);
  check(registry.hasSuspensions === structuredSuspensions, `${match.slug}: suspensions intent is not structure-backed`);

  const publishedOdds = match.predictions.find((item) => item.label === "Published Odds" || item.label === "Odds")?.value?.trim() ?? "";

  for (const locale of locales) {
    const copy = buildMatchSearchIntentCopy(match, locale, today);
    const id = `${locale}/match/${match.slug}`;
    pages.push({ id, ...copy });

    check(copy.title.length >= 30 && copy.title.length <= 70, `${id}: title length ${copy.title.length}`);
    check(copy.description.length >= 70 && copy.description.length <= 160, `${id}: description length ${copy.description.length}`);
    check(copy.h1.length >= 20 && copy.h1.length <= 100, `${id}: H1 length ${copy.h1.length}`);
    check(/\s(?:vs|x|gegen)\s/i.test(copy.title), `${id}: localized team separator missing from title`);
    check(!/[ÃÂ][\u0080-\u00bf]/u.test(`${copy.title} ${copy.description} ${copy.h1}`), `${id}: mojibake detected`);
    check(!containsContextOnlyMetadataIntent(`${copy.title} ${copy.description}`), `${id}: context-only intent leaked into metadata`);
    check(!copy.secondaryQueries.some((query) => containsContextOnlyMetadataIntent(query)), `${id}: context-only intent leaked into secondary query expansion`);

    const expectedTemporal = match.date === today ? "today" : "tomorrow";
    check(copy.temporalState === expectedTemporal, `${id}: wrong temporal state ${copy.temporalState}`);

    if (locale === "en") {
      check(expectedTemporal === "today" ? /\bfor today\b/i.test(copy.description) : /\bfor tomorrow\b/i.test(copy.description), `${id}: temporal phrase missing or stale`);
      check(!(expectedTemporal === "today" && /\bfor tomorrow\b/i.test(copy.description)), `${id}: tomorrow leaked into today's description`);
      check(!(expectedTemporal === "tomorrow" && /\bfor today\b/i.test(copy.description)), `${id}: today leaked into tomorrow's description`);
      if (publishedOdds) {
        const oddsMention = copy.description.match(/\bodds(?: of)?\s+([0-9]+(?:\.[0-9]+)?)/i)?.[1]?.trim();
        if (oddsMention) check(oddsMention === publishedOdds, `${id}: description odds '${oddsMention}' != published odds '${publishedOdds}'`);
      }
    }
  }
}

check(pages.length === scoped.length * locales.length, `Expected ${scoped.length * locales.length} localized pages, found ${pages.length}`);
check(new Set(pages.map((page) => page.id)).size === pages.length, "Localized page identifiers are not unique");

for (const match of matches.filter((item) => !dates.has(item.date) || item.status !== "published")) {
  check(!isRestrictedSearchIntentFixture(match), `${match.slug}: fixture leaked into restricted scope`);
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error(`Restricted Search Intent audit: FAIL (${errors.length} errors)`);
  process.exitCode = 1;
} else {
  assert.equal(pages.length, scoped.length * locales.length);
  console.log("Restricted Search Intent audit: PASS");
  console.log(`Dates: ${today} + ${tomorrow}`);
  console.log(`Fixtures: ${scoped.length} (${scoped.filter((match) => match.date === today).length} today, ${scoped.filter((match) => match.date === tomorrow).length} tomorrow)`);
  console.log(`Locales: ${locales.length} (${locales.join(", ")})`);
  console.log(`Pages audited: ${pages.length}`);
  console.log("Supporting modules: retained on-page but excluded from Search Intent metadata PASS");
  console.log("Temporal metadata: live today/tomorrow only PASS");
  console.log("Description odds: derived from published odds PASS");
}
