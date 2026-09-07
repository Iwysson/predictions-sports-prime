import fs from "node:fs";
import path from "node:path";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { matches } from "../src/data/matches.ts";
import { leagues } from "../src/data/leagues.ts";
import fixtureSnapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };
import {
  getAdSenseContentQualityDecision,
  isAdSenseLeagueIndexable,
} from "../src/lib/adsense-content-quality.ts";
import { validateLeagueRounds } from "../src/lib/data-validation.ts";
import { isLeagueIndexable } from "../src/lib/league-seo.ts";
import { localizedEditorialBySlug, hasCompleteLocalizedEditorial } from "../src/data/localized-editorial.ts";
import { fullyLocalizedMatchLocales } from "../src/components/LocalizedMatchDetails.tsx";
import { isInternationalMatchExpansionEligible } from "../src/lib/upcoming-match.ts";
import { seoLocaleSlugs } from "../src/lib/seo-locales.ts";
import {
  SEO_BASELINE_DATE,
  SEO_FEATURE_FLAGS,
  SEO_RELEASE_ID,
} from "../src/config/seo-enterprise.ts";

const baselineDirectory = path.join(process.cwd(), "reports", "seo-baseline");
const latestBaselinePath = path.join(baselineDirectory, "latest.json");
const beforeBaselinePath = path.join(baselineDirectory, "before-wave-0.5.json");
if (process.argv.includes("--preserve-before") && fs.existsSync(latestBaselinePath) && !fs.existsSync(beforeBaselinePath)) {
  fs.copyFileSync(latestBaselinePath, beforeBaselinePath);
  console.log(`Preserved ${path.relative(process.cwd(), beforeBaselinePath)}.`);
}

function slugOf(prediction) {
  return prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`
    .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function localeOf(url) {
  const pathname = new URL(url).pathname;
  return seoLocaleSlugs.find((locale) => pathname === `/${locale}/` || pathname.startsWith(`/${locale}/`)) ?? "en";
}

function routeKey(url) {
  const pathname = new URL(url).pathname;
  return pathname.replace(new RegExp(`^/(?:${seoLocaleSlugs.join("|")})(?=/)`), "") || "/";
}

function exactDuplicateWarnings(predictions) {
  const owners = new Map();
  for (const prediction of predictions) {
    for (const paragraph of prediction.analysis ?? []) {
      const normalized = paragraph.toLowerCase().replace(/\s+/g, " ").trim();
      if (normalized.length < 80) continue;
      owners.set(normalized, [...(owners.get(normalized) ?? []), slugOf(prediction)]);
    }
  }
  return [...owners.values()].filter((slugs) => new Set(slugs).size > 1).length;
}

const published = editorialPredictions.filter((prediction) => prediction.published === true);
const decisions = editorialPredictions.map((prediction) => ({
  slug: slugOf(prediction),
  league: prediction.league,
  published: prediction.published === true,
  ...getAdSenseContentQualityDecision(prediction),
}));

const classification = Object.fromEntries(
  ["INDEX_PRIME", "INDEX_STANDARD", "UPGRADE", "HISTORICAL", "KEEP", "LEGACY-NOINDEX", "REMOVE"].map((name) => [
    name,
    decisions.filter((decision) => decision.classification === name).length,
  ])
);

const localizedRoutes = [];
const publishedMatchSlugs = new Set(matches.filter((match) => match.status === "published").map((match) => match.slug));
for (const locale of seoLocaleSlugs) {
  const slugs = new Set([
    ...Object.keys(localizedEditorialBySlug).filter((slug) =>
      publishedMatchSlugs.has(slug) && hasCompleteLocalizedEditorial(slug, locale)
    ),
    ...(fullyLocalizedMatchLocales.includes(locale)
      ? matches
          .filter((match) => isInternationalMatchExpansionEligible(match, `${SEO_BASELINE_DATE}T12:00:00Z`))
          .map((match) => match.slug)
      : []),
  ]);
  for (const slug of slugs) localizedRoutes.push({ locale, slug });
}

const indexablePredictionSlugs = new Set(
  decisions.filter((decision) => decision.published && decision.indexable).map((decision) => decision.slug)
);
const englishLeagueSlugs = leagues
  .filter((league) =>
    isLeagueIndexable(matches.filter((match) => match.league === league.slug && match.status === "published").length) &&
    isAdSenseLeagueIndexable(league.slug, matches, editorialPredictions)
  )
  .map((league) => league.slug);
const localizedHubLocales = ["pt-br", "es", "fr", "de", "it"];
const staticPaths = [
  "/", "/about/", "/contact/", "/methodology/", "/nfl/", "/editorial-policy/",
  "/results/", "/privacy/", "/cookies/", "/terms/", "/responsible-gambling/",
  "/author/iwysson-nascimento/",
];
const sitemapPaths = [
  ...staticPaths,
  ...englishLeagueSlugs.map((slug) => `/league/${slug}/`),
  ...matches.filter((match) => match.status === "published" && indexablePredictionSlugs.has(match.slug))
    .map((match) => `/match/${match.slug}/`),
  ...localizedHubLocales.flatMap((locale) => [
    `/${locale}/`,
    ...leagues
      .filter((league) => isAdSenseLeagueIndexable(league.slug, matches, editorialPredictions))
      .map((league) => `/${locale}/league/${league.slug}/`),
  ]),
  ...seoLocaleSlugs.map((locale) => `/${locale}/nfl/`),
  ...localizedRoutes
    .filter((route) => indexablePredictionSlugs.has(route.slug))
    .map((route) => `/${route.locale}/match/${route.slug}/`),
];
const sitemapUrls = [...new Set(sitemapPaths)].sort().map((item) => `https://predictions-sports-prime.com${item}`);

const fixtureErrors = [];
for (const league of leagues) {
  if (!league.sources.fixtures && !league.liveDataId) continue;
  const rounds = fixtureSnapshot.leagues[league.slug];
  if (!rounds?.length) {
    fixtureErrors.push(`${league.slug}: missing snapshot`);
    continue;
  }
  const validation = validateLeagueRounds(rounds, {
    slug: league.slug,
    source: league.sources.fixtures,
    expectedClubs: league.expectedClubs,
    expectedGamesPerRound: league.expectedGamesPerRound,
    label: league.name,
  });
  fixtureErrors.push(...validation.errors.map((error) => `${league.slug}: ${error}`));
}

const sourceFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(item);
    else if (entry.name.endsWith(".ts") && entry.name !== "index.ts") sourceFiles.push(item);
  }
}
walk(path.join(process.cwd(), "src", "data", "predictions"));
const sourceText = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const internalNotePattern = /\b(?:TODO|FIXME|internal note|editorial note|do not publish|placeholder)\b/gi;
const internalNoteWarnings = [...sourceText.matchAll(internalNotePattern)].length;
const metadataWarnings = published.filter((prediction) =>
  /\b(?:TODO|FIXME|TBD|placeholder|internal)\b/i.test(`${prediction.seoTitle ?? ""} ${prediction.title ?? ""}`)
).length;

const pagesByLocale = Object.fromEntries(
  ["en", ...seoLocaleSlugs].map((locale) => [locale, sitemapUrls.filter((url) => localeOf(url) === locale).length])
);
const pagesByLeague = Object.fromEntries(leagues.map((league) => [
  league.slug,
  matches.filter((match) => match.league === league.slug).length,
]));

const alternateGroups = new Map();
for (const url of sitemapUrls) {
  const key = routeKey(url);
  alternateGroups.set(key, (alternateGroups.get(key) ?? 0) + 1);
}
const hreflangEntries = [...alternateGroups.values()]
  .filter((count) => count > 1)
  .reduce((sum, count) => sum + count * (count + 1), 0);

const indexableSlugs = new Set(decisions.filter((decision) => decision.indexable).map((decision) => decision.slug));
const withoutRelevantInternalLinks = published.filter((prediction) =>
  indexableSlugs.has(slugOf(prediction)) &&
  !published.some((other) => other !== prediction && other.league === prediction.league && indexableSlugs.has(slugOf(other)))
).length;

const report = {
  schemaVersion: 1,
  releaseId: SEO_RELEASE_ID,
  baselineDate: SEO_BASELINE_DATE,
  featureFlags: SEO_FEATURE_FLAGS,
  totals: {
    predictions: editorialPredictions.length,
    publishedPredictions: published.length,
    indexablePredictions: decisions.filter((decision) => decision.published && decision.indexable).length,
    noindexPredictions: decisions.filter((decision) => decision.published && !decision.indexable).length,
    classifications: classification,
    localizedMatchUrls: localizedRoutes.length,
    indexableLocalizedMatchUrls: sitemapUrls.filter((url) => /\/(?:pt-br|es|fr|de|it|nl|tr)\/match\//.test(new URL(url).pathname)).length,
    indexableLeagueHubs: sitemapUrls.filter((url) => /\/league\/[^/]+\/$/.test(new URL(url).pathname)).length,
    sitemapUrls: sitemapUrls.length,
    canonicalVariations: new Set(sitemapUrls).size,
    hreflangEntries,
    duplicateEditorialWarnings: exactDuplicateWarnings(published),
    metadataWarnings,
    internalNoteWarnings,
    pagesWithoutRelevantInternalLinks: withoutRelevantInternalLinks,
    probableLineups: published.filter((prediction) => Boolean(prediction.matchSeo?.lineups)).length,
    statisticalCore: published.filter((prediction) => /Statistical Core Predictions-Sports-Prime/i.test(prediction.analysis.join("\n"))).length,
    conflictDetector: published.filter((prediction) => /(?:Conflict Detector|Risks and Counter-Signals)/i.test(prediction.analysis.join("\n"))).length,
    sourceStatusVerified: published.filter((prediction) => prediction.sourceStatus === "verified").length,
    editorialStandardPspV1: published.filter((prediction) => prediction.editorialStandard === "psp-v1").length,
  },
  fixtureValidation: {
    status: fixtureErrors.length === 0 ? "pass" : "fail",
    structuralOnly: true,
    snapshotGeneratedAt: fixtureSnapshot.generatedAt,
    errors: fixtureErrors.sort(),
  },
  pagesByLocale,
  pagesByLeague,
  definitions: {
    deterministic: "No wall-clock timestamp is emitted; baselineDate and releaseId come from versioned defaults or explicit environment values.",
    canonicalVariations: "Unique canonical URL candidates currently emitted by the sitemap.",
    hreflangEntries: "Expected language-link entries across sitemap route groups, including x-default; this is a structural count, not a crawl result.",
    pagesWithoutRelevantInternalLinks: "Indexable match pages without another indexable published match in the same league.",
    fixtureValidation: "Structural snapshot validation only; the time-sensitive freshness audit remains part of audit:enterprise-seo.",
  },
};

const outputDirectory = baselineDirectory;
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);

const rows = [
  ["Predictions", report.totals.predictions],
  ["Published predictions", report.totals.publishedPredictions],
  ["Indexable / noindex", `${report.totals.indexablePredictions} / ${report.totals.noindexPredictions}`],
  ["INDEX_PRIME / INDEX_STANDARD / UPGRADE / HISTORICAL / REMOVE", [classification.INDEX_PRIME, classification.INDEX_STANDARD, classification.UPGRADE, classification.HISTORICAL, classification.REMOVE].join(" / ")],
  ["Localized match URLs / indexable", `${report.totals.localizedMatchUrls} / ${report.totals.indexableLocalizedMatchUrls}`],
  ["Indexable league hubs", report.totals.indexableLeagueHubs],
  ["Sitemap URLs", report.totals.sitemapUrls],
  ["Canonical variations / hreflang entries", `${report.totals.canonicalVariations} / ${report.totals.hreflangEntries}`],
  ["Duplicate / metadata / internal-note warnings", `${report.totals.duplicateEditorialWarnings} / ${report.totals.metadataWarnings} / ${report.totals.internalNoteWarnings}`],
  ["Pages without relevant internal links", report.totals.pagesWithoutRelevantInternalLinks],
  ["Probable lineups", report.totals.probableLineups],
  ["Statistical Core / Conflict Detector", `${report.totals.statisticalCore} / ${report.totals.conflictDetector}`],
  ["sourceStatus verified / psp-v1", `${report.totals.sourceStatusVerified} / ${report.totals.editorialStandardPspV1}`],
  ["Fixture validation", report.fixtureValidation.status.toUpperCase()],
];
const markdown = `# Enterprise SEO baseline\n\nRelease: \`${report.releaseId}\`  \nBaseline date: \`${report.baselineDate}\`\n\n| Metric | Value |\n|---|---:|\n${rows.map(([name, value]) => `| ${name} | ${value} |`).join("\n")}\n\n## Pages by locale\n\n| Locale | Pages |\n|---|---:|\n${Object.entries(pagesByLocale).map(([name, value]) => `| ${name} | ${value} |`).join("\n")}\n\n## Pages by league\n\n| League | Predictions |\n|---|---:|\n${Object.entries(pagesByLeague).map(([name, value]) => `| ${name} | ${value} |`).join("\n")}\n\n## Fixture status\n\nStructural validation: **${report.fixtureValidation.status.toUpperCase()}**. Snapshot generated at \`${report.fixtureValidation.snapshotGeneratedAt}\`. Run \`npm run audit:fixtures\` for time-sensitive freshness validation.\n`;
fs.writeFileSync(path.join(outputDirectory, "latest.md"), markdown);
console.log(`Enterprise SEO baseline written to ${path.relative(process.cwd(), outputDirectory)} (${report.totals.sitemapUrls} sitemap URLs).`);
