import fs from "node:fs";
import path from "node:path";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { matches } from "../src/data/matches.ts";
import * as sitemapModule from "../src/app/sitemap.ts";
import { buildMatchMetadata } from "../src/lib/seo.ts";
import {
  getAdSenseContentQualityDecision,
  isAdSenseContentIndexable,
  auditedAdSenseContentDecisionCounts,
} from "../src/lib/adsense-content-quality.ts";

function slugOf(prediction) {
  return prediction.slug ??
    `${prediction.homeTeam}-vs-${prediction.awayTeam}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
}

/*
 * Next metadata-route modules can be wrapped differently when executed
 * directly through tsx/Node than when loaded by Next during the build.
 * Resolve the callable export without assuming one interop shape.
 */
function resolveSitemapFunction(moduleNamespace) {
  const candidates = [
    moduleNamespace?.default,
    moduleNamespace?.default?.default,
    moduleNamespace?.sitemap,
  ];

  return candidates.find((candidate) => typeof candidate === "function");
}

const sitemap = resolveSitemapFunction(sitemapModule);

if (!sitemap) {
  const exportShape = {
    namespaceKeys: Object.keys(sitemapModule ?? {}),
    defaultType: typeof sitemapModule?.default,
    nestedDefaultType: typeof sitemapModule?.default?.default,
  };

  throw new TypeError(
    `Could not resolve src/app/sitemap.ts callable export: ${JSON.stringify(exportShape)}`
  );
}

const published = editorialPredictions.filter((item) => item.published);
const decisions = published.map((prediction) => ({
  slug: slugOf(prediction),
  decision: getAdSenseContentQualityDecision(prediction),
}));

const automaticFallbackDecisions = decisions.filter(
  (item) => item.decision.source === "automatic-fallback"
);

const counts = decisions.reduce((acc, item) => {
  acc[item.decision.classification] =
    (acc[item.decision.classification] ?? 0) + 1;
  return acc;
}, {});

const errors = [];

for (const { slug, decision } of decisions) {
  if (decision.indexable !== (decision.classification === "KEEP")) {
    errors.push(`${slug}: only KEEP may be indexable`);
  }
}

for (const match of matches.filter((item) => item.status === "published")) {
  const expected = isAdSenseContentIndexable(match.slug, editorialPredictions);
  const metadata = buildMatchMetadata(match);
  const actual = metadata.robots?.index !== false;

  if (actual !== expected) {
    errors.push(
      `${match.slug}: metadata robots mismatch (expected index=${expected}, got ${actual})`
    );
  }
}

const generatedSitemap = sitemap();
const sitemapUrls = new Set(generatedSitemap.map((item) => item.url));

for (const match of matches.filter((item) => item.status === "published")) {
  const expected = isAdSenseContentIndexable(match.slug, editorialPredictions);
  const englishSuffix = `/match/${match.slug}/`;

  const matchingUrls = [...sitemapUrls].filter((url) =>
    url.endsWith(englishSuffix)
  );

  if (!expected && matchingUrls.length > 0) {
    errors.push(
      `${match.slug}: non-indexable content leaked into sitemap (${matchingUrls.join(", ")})`
    );
  }

  const englishUrlPresent = [...sitemapUrls].some(
    (url) =>
      url.endsWith(englishSuffix) &&
      !/\/(?:pt-br|es|fr|de|it|nl|tr)\/match\//.test(url)
  );

  if (expected && !englishUrlPresent) {
    errors.push(`${match.slug}: KEEP English URL missing from sitemap`);
  }
}

const expectedSnapshot = auditedAdSenseContentDecisionCounts();

if (
  expectedSnapshot.keep !== 110 ||
  expectedSnapshot.upgrade !== 29 ||
  expectedSnapshot.legacyNoindex !== 153 ||
  expectedSnapshot.remove !== 0
) {
  errors.push(
    `audited snapshot changed unexpectedly: ${JSON.stringify(expectedSnapshot)}`
  );
}

const reportDir = path.join(process.cwd(), "reports");
fs.mkdirSync(reportDir, { recursive: true });

const report = {
  generatedAt: new Date().toISOString(),
  publishedPredictions: published.length,
  counts,
  auditedSnapshot: expectedSnapshot,
  sitemapUrls: generatedSitemap.length,
  errors,
};

fs.writeFileSync(
  path.join(reportDir, "adsense-content-gate.json"),
  JSON.stringify(report, null, 2) + "\n"
);

console.log("AdSense Content Quality Gate");
console.log(`Published predictions: ${published.length}`);
console.log(`KEEP / indexable: ${counts.KEEP ?? 0}`);
console.log(`UPGRADE / noindex: ${counts.UPGRADE ?? 0}`);
console.log(`LEGACY-NOINDEX: ${counts["LEGACY-NOINDEX"] ?? 0}`);
console.log(`REMOVE: ${counts.REMOVE ?? 0}`);
console.log(`Sitemap URLs after gate: ${generatedSitemap.length}`);

if (automaticFallbackDecisions.length > 0) {
  console.log("\nAutomatic fallback decisions:");
  for (const item of automaticFallbackDecisions) {
    console.log(
      `- ${item.slug} -> ${item.decision.classification} [${item.decision.reasons.join(", ")}]`
    );
  }
  console.log(`Automatic fallback total: ${automaticFallbackDecisions.length}`);
} else {
  console.log("\nAutomatic fallback decisions: 0");
}

if (errors.length > 0) {
  console.error("\nFAIL");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("AdSense Content Quality Gate: PASS");
