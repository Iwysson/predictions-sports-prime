import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const baseline = JSON.parse(readFileSync(join(root, "site-trust-baseline-phase5.json"), "utf8"));
const errors = [];
for (const entry of baseline.entries) {
  let current;
  try { current = createHash("sha256").update(readFileSync(join(root, entry.path))).digest("hex"); }
  catch { errors.push(`${entry.path}: missing`); continue; }
  if (current !== entry.sha256) errors.push(`${entry.path}: changed after Phase 5 checkpoint`);
}
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); console.error("Phase 5 trust baseline audit: FAIL"); process.exitCode = 1; }
else console.log(`Phase 5 trust baseline audit: PASS (${baseline.entries.length}/${baseline.entries.length}).`);
