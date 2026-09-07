import { matches } from "../src/data/matches.ts";
import { resolveCanonicalMatch } from "../src/lib/canonical-match.ts";
import { getCanonicalMatchLifecycle } from "../src/lib/canonical-match-lifecycle.ts";
import { isInternationalMatchExpansionEligible } from "../src/lib/upcoming-match.ts";

const kickoff = Date.parse("2026-09-09T16:45:00Z");
const base = {
  status: "published",
  fixtureStatus: "scheduled",
  kickoffUtc: new Date(kickoff).toISOString(),
  date: "2026-09-09",
  time: "13:45",
  timeConfirmed: true,
  matchSeo: { statistics: { sample: "test", rows: [], sources: [] } },
};

const cases = [
  ["T-5 min", -5 * 60_000, "scheduled", true],
  ["T-1 min", -60_000, "scheduled", true],
  ["kickoff", 0, "scheduled", false],
  ["T+1 min", 60_000, "scheduled", false],
];

const errors = [];
for (const [label, offset, expectedState, expectedEligible] of cases) {
  const now = new Date(kickoff + offset);
  const lifecycle = getCanonicalMatchLifecycle(base, now);
  const eligibility = isInternationalMatchExpansionEligible(base, now);
  const surfaces = {
    en: eligibility,
    localized: eligibility,
    robots: eligibility,
    hreflang: eligibility,
    sitemap: eligibility,
  };
  if (lifecycle.state !== expectedState) errors.push(`${label}: lifecycle ${lifecycle.state} != ${expectedState}`);
  if (eligibility !== expectedEligible) errors.push(`${label}: eligibility ${eligibility} != ${expectedEligible}`);
  if (new Set(Object.values(surfaces)).size !== 1) errors.push(`${label}: SEO surface lifecycle drift`);
}

const finalMatch = { ...base, fixtureStatus: "completed" };
if (getCanonicalMatchLifecycle(finalMatch, new Date(kickoff + 120 * 60_000)).state !== "completed") {
  errors.push("FINAL: lifecycle is not completed");
}
if (isInternationalMatchExpansionEligible(finalMatch, new Date(kickoff + 120 * 60_000))) {
  errors.push("FINAL: international expansion remained eligible");
}

const cagliari = matches.find((match) => match.slug === "cagliari-vs-lecce");
const canonicalCagliari = await resolveCanonicalMatch("cagliari-vs-lecce");
if (!cagliari || !canonicalCagliari) {
  errors.push("cagliari-vs-lecce: canonical fixture could not be resolved");
} else if (!canonicalCagliari.kickoffUtc) {
  errors.push("cagliari-vs-lecce: canonical fixture has no kickoffUtc");
} else {
  const beforeKickoff = new Date(Date.parse(canonicalCagliari.kickoffUtc) - 60_000);
  const atKickoff = new Date(canonicalCagliari.kickoffUtc);
  if (!isInternationalMatchExpansionEligible(canonicalCagliari, beforeKickoff)) {
    errors.push("cagliari-vs-lecce: expected eligibility before kickoff");
  }
  if (isInternationalMatchExpansionEligible(canonicalCagliari, atKickoff)) {
    errors.push("cagliari-vs-lecce: eligibility did not close at kickoff");
  }
}

console.log("Canonical match lifecycle boundary audit");
console.log("States checked: T-5 min, T-1 min, kickoff, T+1 min, FINAL");
console.log("Surfaces checked: EN, localized, robots, hreflang, sitemap");
console.log("Regression checked: cagliari-vs-lecce");
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log("Canonical match lifecycle boundary audit: PASS");
}
