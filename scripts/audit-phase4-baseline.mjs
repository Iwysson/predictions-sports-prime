import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createBaselineManifest } from "./editorial-baseline-lib.mjs";

const root = process.cwd();
const expected = JSON.parse(readFileSync(join(root, "editorial-baseline-phase4.json"), "utf8"));
const current = createBaselineManifest(root);
const currentBySlug = new Map(current.entries.map((entry) => [entry.slug, entry]));
const fields = ["league", "published", "mainPick", "odds", "publishedAt", "updatedAt", "resultStatus", "resultSource", "finalScore", "analysisHash"];
const errors = [];
for (const entry of expected.entries) {
  const actual = currentBySlug.get(entry.slug);
  if (!actual) { errors.push(`${entry.slug}: missing`); continue; }
  for (const field of fields) if (JSON.stringify(entry[field]) !== JSON.stringify(actual[field])) errors.push(`${entry.slug}: ${field} changed`);
}
if (current.entries.length !== expected.entries.length) errors.push(`published count changed: ${expected.entries.length} -> ${current.entries.length}`);
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); console.error("Phase 4 baseline audit: FAIL"); process.exitCode = 1; }
else console.log(`Phase 4 baseline audit: PASS (${current.entries.length}/${expected.entries.length}; analysis hashes and protected fields preserved).`);
