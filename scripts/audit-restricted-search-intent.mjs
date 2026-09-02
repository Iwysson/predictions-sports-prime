import assert from "node:assert/strict";
import { matches } from "../src/data/matches.ts";
import {
  buildMatchSearchIntentCopy,
  getMatchIntentRegistry,
  isRestrictedSearchIntentFixture,
} from "../src/lib/match-search-intent.ts";

const dates = new Set(["2026-09-02", "2026-09-03"]);
const locales = ["en", "pt-BR", "es", "it", "fr", "de"];
const scoped = matches.filter(isRestrictedSearchIntentFixture);
const errors = [];
const pages = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

check(scoped.length === 17, `Expected 17 scoped fixtures, found ${scoped.length}`);
check(new Set(scoped.map((match) => match.slug)).size === 17, "Scoped fixture slugs are not unique");
check(scoped.filter((match) => match.date === "2026-09-02").length === 13, "Expected 13 fixtures on 2026-09-02");
check(scoped.filter((match) => match.date === "2026-09-03").length === 4, "Expected 4 fixtures on 2026-09-03");

for (const match of scoped) {
  check(match.status === "published", `${match.slug}: fixture is not published`);
  check(dates.has(match.date), `${match.slug}: date is outside the restricted scope`);

  const registry = getMatchIntentRegistry(match);
  check(registry.hasPrediction, `${match.slug}: prediction is missing`);
  check(registry.hasOdds, `${match.slug}: published odds are missing`);
  check(registry.hasAnalysis, `${match.slug}: analysis is missing`);
  check(registry.hasCompetition, `${match.slug}: competition is missing`);
  check(registry.hasRound, `${match.slug}: round is missing`);
  check(registry.hasKickOff, `${match.slug}: kick-off is missing`);

  for (const locale of locales) {
    const copy = buildMatchSearchIntentCopy(match, locale, "2026-09-02");
    const id = `${locale}/match/${match.slug}`;
    pages.push({ id, ...copy });

    check(copy.title.length >= 30 && copy.title.length <= 70, `${id}: title length ${copy.title.length}`);
    check(copy.description.length >= 70 && copy.description.length <= 160, `${id}: description length ${copy.description.length}`);
    check(copy.h1.length >= 20 && copy.h1.length <= 100, `${id}: H1 length ${copy.h1.length}`);
    check(/\s(?:vs|x|gegen)\s/i.test(copy.title), `${id}: localized team separator missing from title`);
    check(!/[ÃÂ][\u0080-\u00bf]/u.test(`${copy.title} ${copy.description} ${copy.h1}`), `${id}: mojibake detected`);
    check(copy.temporalState === (match.date === "2026-09-02" ? "today" : "tomorrow"), `${id}: wrong temporal state ${copy.temporalState}`);
  }
}

check(pages.length === 102, `Expected 102 localized pages, found ${pages.length}`);
check(new Set(pages.map((page) => page.id)).size === 102, "Localized page identifiers are not unique");

for (const match of matches.filter((item) => !dates.has(item.date) || item.status !== "published")) {
  check(!isRestrictedSearchIntentFixture(match), `${match.slug}: fixture leaked into restricted scope`);
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error(`Restricted Search Intent audit: FAIL (${errors.length} errors)`);
  process.exitCode = 1;
} else {
  assert.equal(pages.length, 17 * 6);
  console.log("Restricted Search Intent audit: PASS");
  console.log("Fixtures: 17 (13 on 02/09, 4 on 03/09)");
  console.log("Locales: 6 (en, pt-BR, es, it, fr, de)");
  console.log("Pages audited: 102");
}
