import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import {
  getAdSenseContentQualityDecision,
  getLegacyAdSenseContentQualityDecision,
} from "../src/lib/adsense-content-quality.ts";
import { evaluatePredictionIndexQuality } from "../src/lib/index-quality.ts";
import { SEO_FEATURE_FLAGS } from "../src/config/seo-enterprise.ts";
import * as sitemapModule from "../src/app/sitemap.ts";

const sitemap = [sitemapModule?.default, sitemapModule?.default?.default, sitemapModule?.sitemap]
  .find((candidate) => typeof candidate === "function");
if (!sitemap) throw new Error("Could not resolve src/app/sitemap.ts callable export");

const rows = editorialPredictions.map((prediction) => {
  const current = getLegacyAdSenseContentQualityDecision(prediction);
  const proposed = evaluatePredictionIndexQuality(prediction, current);
  const runtime = getAdSenseContentQualityDecision(prediction);
  const slug = prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`;
  return {
    league: prediction.league,
    slug,
    publishedAt: prediction.publishedAt ?? null,
    lifecycle: proposed.lifecycle,
    currentClassification: current.classification,
    proposedClassification: proposed.classification,
    currentIndexable: current.indexable,
    proposedIndexable: proposed.indexable,
    historicalIndexability: proposed.historicalIndexability ?? null,
    localizationQuality: proposed.localizationQuality,
    change: current.indexable === proposed.indexable
      ? "UNCHANGED"
      : proposed.indexable ? "PROMOTED" : "DEMOTED",
    reasons: proposed.reasons,
    checks: proposed.checks,
    runtimeMatchesProposed:
      !SEO_FEATURE_FLAGS["quality-gate-v2"] ||
      (runtime.classification === proposed.classification && runtime.indexable === proposed.indexable),
  };
});

const published = rows.filter((row) => row.currentClassification !== "REMOVE");
const currentKeep = rows.filter((row) => row.currentClassification === "KEEP");
const demotedKeep = currentKeep.filter((row) => !row.proposedIndexable);
const promotedLegacy = rows.filter((row) => row.currentClassification === "LEGACY-NOINDEX" && row.proposedIndexable);
const beforeIndexable = rows.filter((row) => row.currentIndexable).length;
const afterIndexable = rows.filter((row) => row.proposedIndexable).length;
const runtimeSitemapUrls = (await sitemap()).length;
const guardrails = {
  keepDemotionRate: currentKeep.length ? demotedKeep.length / currentKeep.length : 0,
  keepDemotionLimit: 0.2,
  legacyPromotions: promotedLegacy.length,
  legacyPromotionLimit: 100,
  sitemapNetChange: runtimeSitemapUrls - 384,
  sitemapNetChangeLimit: 100,
  internationalExpansion: 0,
  triggered: [],
};
if (guardrails.keepDemotionRate > guardrails.keepDemotionLimit) guardrails.triggered.push("keep_demotion_over_20_percent");
if (guardrails.legacyPromotions > guardrails.legacyPromotionLimit) guardrails.triggered.push("legacy_promotion_burst");
if (Math.abs(guardrails.sitemapNetChange) > guardrails.sitemapNetChangeLimit) guardrails.triggered.push("abnormal_sitemap_jump");

const countBy = (items, key) => Object.fromEntries([...new Set(items.map((item) => item[key]))].sort().map((value) => [value, items.filter((item) => item[key] === value).length]));
const reasonCounts = new Map();
for (const row of rows) for (const reason of row.reasons) reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1);
const report = {
  generatedAt: new Date().toISOString(),
  featureFlags: SEO_FEATURE_FLAGS,
  before: {
    published: published.length,
    classifications: countBy(rows, "currentClassification"),
    indexable: beforeIndexable,
    noindex: rows.length - beforeIndexable,
    sitemapUrls: 384,
  },
  after: {
    classifications: countBy(rows, "proposedClassification"),
    indexable: afterIndexable,
    noindex: rows.length - afterIndexable,
    netIndexableChange: afterIndexable - beforeIndexable,
    sitemapUrls: runtimeSitemapUrls,
  },
  quality: {
    promoted: rows.filter((row) => row.change === "PROMOTED").length,
    demoted: rows.filter((row) => row.change === "DEMOTED").length,
    unchanged: rows.filter((row) => row.change === "UNCHANGED").length,
    historical: rows.filter((row) => row.proposedClassification === "HISTORICAL").length,
    historicalIndexable: rows.filter((row) => row.historicalIndexability === "HISTORICAL_INDEXABLE").length,
    historicalNoindex: rows.filter((row) => row.historicalIndexability === "HISTORICAL_NOINDEX").length,
    topReasons: [...reasonCounts].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([reason, count]) => ({ reason, count })),
    promotionsByLeague: countBy(rows.filter((row) => row.change === "PROMOTED"), "league"),
    demotionsByLeague: countBy(rows.filter((row) => row.change === "DEMOTED"), "league"),
  },
  guardrails,
  rows,
};

const directory = join(process.cwd(), "reports", "index-quality");
mkdirSync(directory, { recursive: true });
writeFileSync(join(directory, "wave-1-dry-run.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(directory, "wave-1-dry-run.md"), `# Wave 1 Quality Gate 2.0 dry-run\n\n- Before indexable: **${beforeIndexable}**\n- Proposed indexable: **${afterIndexable}**\n- Net change: **${afterIndexable - beforeIndexable}**\n- Promoted / demoted / unchanged: **${report.quality.promoted} / ${report.quality.demoted} / ${report.quality.unchanged}**\n- Guardrails: **${guardrails.triggered.length ? `STOP — ${guardrails.triggered.join(", ")}` : "PASS"}**\n\n## Proposed classifications\n\n${Object.entries(report.after.classifications).map(([name, count]) => `- ${name}: ${count}`).join("\n")}\n\n## Top reasons\n\n${report.quality.topReasons.map(({ reason, count }) => `- ${reason}: ${count}`).join("\n")}\n`);

const errors = [];
if (SEO_FEATURE_FLAGS["quality-gate-v2"] && rows.some((row) => !row.runtimeMatchesProposed)) errors.push("runtime_decision_drift");
if (rows.some((row) => row.currentClassification === "REMOVE" && row.proposedIndexable)) errors.push("remove_promoted");
if (rows.some((row) => row.proposedClassification === "UPGRADE" && row.proposedIndexable)) errors.push("upgrade_indexable");
if (guardrails.triggered.length) errors.push(...guardrails.triggered);

console.log(`Index Quality 2.0: ${beforeIndexable} -> ${afterIndexable} indexable; ${report.quality.promoted} promoted, ${report.quality.demoted} demoted, ${report.quality.unchanged} unchanged.`);
console.log(`Classifications: ${JSON.stringify(report.after.classifications)}`);
console.log(`Guardrails: ${guardrails.triggered.length ? guardrails.triggered.join(", ") : "PASS"}`);
if (errors.length) {
  console.error(`Index quality audit: FAIL (${errors.join(", ")})`);
  process.exitCode = 1;
} else console.log("Index quality audit: PASS");
