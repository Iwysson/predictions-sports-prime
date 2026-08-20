import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createBaselineManifest } from "./editorial-baseline-lib.mjs";

const root = process.cwd();
const baselinePath = join(root, "editorial-baseline.json");
const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
const current = createBaselineManifest(root);
const allowAnalysisChanges = process.argv.includes("--allow-analysis-changes");
const allowUpdatedAtChanges = process.argv.includes("--allow-updated-at-changes");
const errors = [];
const notices = [];

if (baseline.schemaVersion !== current.schemaVersion) errors.push("baseline schema version differs");
if (baseline.hashAlgorithm !== current.hashAlgorithm) errors.push("analysis hash method differs");
if (baseline.publishedCount !== current.publishedCount) errors.push(`published count: ${baseline.publishedCount} -> ${current.publishedCount}`);
if (baseline.draftCount !== current.draftCount) errors.push(`draft count: ${baseline.draftCount} -> ${current.draftCount}`);

const baselineBySlug = new Map(baseline.entries.map((entry) => [entry.slug, entry]));
const currentBySlug = new Map(current.entries.map((entry) => [entry.slug, entry]));
for (const slug of baselineBySlug.keys()) {
  if (!currentBySlug.has(slug)) errors.push(`${slug}: removed or slug changed`);
}
for (const slug of currentBySlug.keys()) {
  if (!baselineBySlug.has(slug)) errors.push(`${slug}: added or slug changed`);
}

const protectedFields = [
  "league",
  "published",
  "mainPick",
  "odds",
  "publishedAt",
  "resultStatus",
  "resultSource",
  "finalScore",
];

for (const [slug, expected] of baselineBySlug) {
  const actual = currentBySlug.get(slug);
  if (!actual) continue;
  for (const field of protectedFields) {
    if (JSON.stringify(expected[field]) !== JSON.stringify(actual[field])) {
      errors.push(`${slug}: ${field} changed (${JSON.stringify(expected[field])} -> ${JSON.stringify(actual[field])})`);
    }
  }
  if (expected.updatedAt !== actual.updatedAt) {
    const message = `${slug}: updatedAt changed (${JSON.stringify(expected.updatedAt)} -> ${JSON.stringify(actual.updatedAt)})`;
    (allowUpdatedAtChanges ? notices : errors).push(message);
  }
  if (expected.analysisHash !== actual.analysisHash) {
    const message = `${slug}: analysisHash changed (${expected.analysisHash} -> ${actual.analysisHash})`;
    (allowAnalysisChanges ? notices : errors).push(message);
  }
}

for (const notice of notices) console.warn(`NOTICE: ${notice}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error(`Editorial baseline audit: FAIL (${errors.length} divergence(s)).`);
  process.exitCode = 1;
} else {
  console.log(`Editorial baseline audit: PASS (${current.entries.length}/${baseline.entries.length} entries; all protected fields preserved).`);
  console.log(`Analysis hashes preserved: ${current.entries.filter((entry) => baselineBySlug.get(entry.slug)?.analysisHash === entry.analysisHash).length}/${current.entries.length}.`);
}
