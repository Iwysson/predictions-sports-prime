import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { matches } from "../src/data/matches.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { resolveCanonicalMatches } from "../src/lib/canonical-match.ts";
import { getAdSenseIndexableSlugs } from "../src/lib/adsense-content-quality.ts";
import { matchHeading, matchSeoDescription, matchSeoTitle } from "../src/lib/seo.ts";
import { buildMatchMetadataV2 } from "../src/lib/title-engine-v2.ts";
import { isMatchSearchIntentV2Eligible } from "../src/lib/search-intent-v2.ts";

const indexable = new Set(getAdSenseIndexableSlugs(editorialPredictions));
const canonical = (await resolveCanonicalMatches(matches)).filter((match) => indexable.has(match.slug));
const rows = canonical.map((match) => {
  const after = buildMatchMetadataV2(match);
  const eligible = isMatchSearchIntentV2Eligible(match);
  const titleBefore = matchSeoTitle(match);
  const descriptionBefore = matchSeoDescription(match);
  const h1Before = matchHeading(match);
  return {
    slug: match.slug,
    league: match.league,
    lifecycle: after.intent.temporalIntent,
    titleBefore,
    titleAfter: eligible ? after.title : titleBefore,
    descriptionBefore,
    descriptionAfter: eligible ? after.description : descriptionBefore,
    h1Before,
    h1After: eligible ? after.h1 : h1Before,
    primaryIntent: after.intent.primaryIntent,
    supportingIntents: after.intent.supportingIntents,
    metadataVariant: eligible ? after.intent.metadataVariant : "legacy",
    titleLength: (eligible ? after.title : titleBefore).length,
    reasons: eligible ? after.reasons : ["historical_freeze_preserved"],
  };
});

const normalizedTitles = rows.map((row) => row.titleAfter.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim());
const largestDuplicateGroup = Math.max(0, ...normalizedTitles.map((title) => normalizedTitles.filter((item) => item === title).length));
const errors = [];
if (rows.some((row) => !/\bprediction\b/i.test(row.titleAfter))) errors.push("prediction_missing_from_title");
if (rows.some((row) => /lineups?/i.test(row.titleAfter))) errors.push("lineup_primary_title");
if (rows.some((row) => !row.titleAfter || row.titleLength > 70)) errors.push("invalid_title_length");
if (rows.some((row) => !row.descriptionAfter || row.descriptionAfter.length > 160)) errors.push("invalid_description_length");
if (largestDuplicateGroup / Math.max(rows.length, 1) > 0.2) errors.push("unexpected_title_convergence");

const report = {
  generatedAt: new Date().toISOString(),
  flagsDuringDryRun: { predictionFirstV2: false, titleEngineV2: false },
  pages: rows.length,
  cohorts: {
    legacy: rows.filter((row) => row.metadataVariant === "legacy").length,
    predictionFirstV2: rows.filter((row) => row.metadataVariant === "prediction-first-v2").length,
  },
  guardrails: { status: errors.length ? "STOP" : "PASS", errors, largestDuplicateGroup },
  rows,
};
const directory = join(process.cwd(), "reports", "search-intent");
mkdirSync(directory, { recursive: true });
writeFileSync(join(directory, "wave-2-title-dry-run.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(directory, "wave-2-title-dry-run.md"), `# Wave 2 title dry-run\n\n- Pages: **${rows.length}**\n- Guardrails: **${report.guardrails.status}**\n- Largest exact-title group: **${largestDuplicateGroup}**\n\n| Slug | Before | After | Length | Lifecycle |\n|---|---|---|---:|---|\n${rows.map((row) => `| ${row.slug} | ${row.titleBefore.replace(/\|/g, "\\|")} | ${row.titleAfter.replace(/\|/g, "\\|")} | ${row.titleLength} | ${row.lifecycle} |`).join("\n")}\n`);

console.log(`Wave 2 title dry-run: ${rows.length} pages; guardrails ${report.guardrails.status}.`);
if (errors.length) process.exitCode = 1;
