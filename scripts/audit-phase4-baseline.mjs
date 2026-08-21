import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createBaselineManifest } from "./editorial-baseline-lib.mjs";

const root = process.cwd();
const expected = JSON.parse(readFileSync(join(root, "editorial-baseline-phase4.json"), "utf8"));
const current = createBaselineManifest(root);
const currentBySlug = new Map(current.entries.map((entry) => [entry.slug, entry]));
const immutableFields = ["league", "published", "mainPick", "odds", "publishedAt", "updatedAt", "analysisHash"];
const settlementFields = ["resultStatus", "resultSource", "finalScore"];
const allowedResultStatuses = new Set(["green", "red", "push", "half-green", "half-red", "void"]);
const allowedResultSources = new Set(["automatic", "manual"]);
const errors = [];
const postBaselineSettlements = [];
for (const entry of expected.entries) {
  const actual = currentBySlug.get(entry.slug);
  if (!actual) { errors.push(`${entry.slug}: missing`); continue; }
  for (const field of immutableFields) if (JSON.stringify(entry[field]) !== JSON.stringify(actual[field])) errors.push(`${entry.slug}: ${field} changed`);

  const baselineHasSettlement = settlementFields.some((field) => entry[field] !== null);
  if (baselineHasSettlement) {
    for (const field of settlementFields) if (JSON.stringify(entry[field]) !== JSON.stringify(actual[field])) errors.push(`${entry.slug}: ${field} changed`);
    continue;
  }

  const currentHasSettlement = settlementFields.some((field) => actual[field] !== null);
  if (!currentHasSettlement) continue;

  const score = actual.finalScore;
  const validScore = score && Number.isInteger(score.home) && score.home >= 0 && Number.isInteger(score.away) && score.away >= 0;
  if (!allowedResultStatuses.has(actual.resultStatus) || !allowedResultSources.has(actual.resultSource) || !validScore) {
    errors.push(`${entry.slug}: incomplete or invalid post-Phase-4 settlement`);
    continue;
  }
  postBaselineSettlements.push(entry.slug);
}
if (current.entries.length !== expected.entries.length) errors.push(`published count changed: ${expected.entries.length} -> ${current.entries.length}`);
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); console.error("Phase 4 baseline audit: FAIL"); process.exitCode = 1; }
else {
  for (const slug of postBaselineSettlements) console.log(`EXPECTED POST-BASELINE SETTLEMENT CHANGE: ${slug}`);
  console.log(`Phase 4 baseline audit: PASS (${current.entries.length}/${expected.entries.length}; immutable editorial fields preserved; ${postBaselineSettlements.length} valid post-baseline settlement(s)).`);
}
