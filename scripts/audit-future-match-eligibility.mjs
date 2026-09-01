import fs from "node:fs";
import path from "node:path";
import { matches } from "../src/data/matches.ts";
import { localizedEditorialBySlug, hasCompleteLocalizedEditorial } from "../src/data/localized-editorial.ts";
import { fullyLocalizedMatchLocales } from "../src/components/LocalizedMatchDetails.tsx";
import { seoLocaleSlugs } from "../src/lib/seo-locales.ts";
import { isInternationalMatchExpansionEligible, isUpcomingMatch } from "../src/lib/upcoming-match.ts";

const root = path.resolve("out");
const errors = [];
const eligible = matches.filter((match) => isInternationalMatchExpansionEligible(match));
const eligibleSlugs = new Set(eligible.map((match) => match.slug));
const publishedHistorical = matches.filter((match) => match.status === "published" && !isUpcomingMatch(match));
const legacyPairs = seoLocaleSlugs.flatMap((locale) =>
  Object.keys(localizedEditorialBySlug)
    .filter((slug) => hasCompleteLocalizedEditorial(slug, locale))
    .map((slug) => ({ locale, slug }))
);
const expansionPairs = fullyLocalizedMatchLocales.flatMap((locale) =>
  eligible.filter((match) => !hasCompleteLocalizedEditorial(match.slug, locale)).map((match) => ({ locale, slug: match.slug }))
);

const historicalIncorrect = publishedHistorical.filter((match) => eligibleSlugs.has(match.slug));
if (historicalIncorrect.length) errors.push(`Historical matches incorrectly eligible: ${historicalIncorrect.map((match) => match.slug).join(", ")}`);

function outputFile(locale, slug) {
  return path.join(root, locale, "match", slug, "index.html");
}

if (fs.existsSync(root)) {
  for (const { locale, slug } of legacyPairs) {
    if (!fs.existsSync(outputFile(locale, slug))) errors.push(`Legacy localized route missing: /${locale}/match/${slug}/`);
  }
  for (const { locale, slug } of expansionPairs) {
    if (!fs.existsSync(outputFile(locale, slug))) errors.push(`Future localized route missing: /${locale}/match/${slug}/`);
  }
  for (const match of publishedHistorical) {
    if (Object.keys(localizedEditorialBySlug).includes(match.slug)) continue;
    for (const locale of fullyLocalizedMatchLocales) {
      if (fs.existsSync(outputFile(locale, match.slug))) errors.push(`Historical match incorrectly expanded: /${locale}/match/${match.slug}/`);
    }
  }
}

const requiredSeptemberFixtures = [
  "lincoln-city-vs-blackburn-rovers", "portsmouth-vs-derby-county", "preston-north-end-vs-bristol-city",
  "sheffield-united-vs-bolton-wanderers", "swansea-city-vs-watford", "west-ham-united-vs-wolverhampton-wanderers",
  "birmingham-city-vs-southampton", "stoke-city-vs-norwich-city", "atletico-mineiro-vs-cruzeiro",
];
for (const slug of requiredSeptemberFixtures) {
  const match = matches.find((item) => item.date === "2026-09-01" && item.slug === slug);
  if (!match) errors.push(`Required 2026-09-01 fixture missing: ${slug}`);
  else if (!isInternationalMatchExpansionEligible(match)) errors.push(`Required fixture not eligible: ${match.slug}`);
}

console.log("Future Match Eligibility Audit");
console.log(`FUTURE MATCHES ELIGIBLE: ${eligible.length}`);
console.log(`NEW LOCALIZED FUTURE URLS: ${expansionPairs.length}`);
console.log(`LEGACY HISTORICAL LOCALIZED URLS PRESERVED: ${legacyPairs.length}`);
console.log(`HISTORICAL MATCHES INCORRECTLY EXPANDED: ${historicalIncorrect.length}`);
console.log(`REQUIRED 2026-09-01 FIXTURES: ${requiredSeptemberFixtures.length}`);
if (errors.length) { for (const error of errors) console.error(`ERROR: ${error}`); process.exitCode = 1; }
else console.log("Future eligibility: PASS");
