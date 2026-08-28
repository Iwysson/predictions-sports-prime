import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const base = join(root, "src", "data", "predictions");
const files = [];
const walk = (directory) => readdirSync(directory).forEach((name) => {
  const path = join(directory, name);
  if (statSync(path).isDirectory()) walk(path);
  else if (path.endsWith(".ts") && !path.endsWith(`${sep}index.ts`)) files.push(path);
});
walk(base);

const errors = [];
const warnings = [];
let published = 0;
let oddsRecords = 0;
let latestRecords = 0;
for (const file of files) {
  const source = readFileSync(file, "utf8");
  if (!/\bpublished:\s*true/.test(source)) continue;
  published += 1;
  const label = relative(root, file).split(sep).join("/");
  if (!/\bmain:\s*["'][^"']+["']/.test(source)) errors.push(`${label}: prediction missing`);
  if (!/\bpublishedAt:\s*["'][^"']+["']/.test(source)) warnings.push(`${label}: publication date missing`);
  if (!/\bdate:\s*["']\d{4}-\d{2}-\d{2}["']/.test(source)) warnings.push(`${label}: kickoff date missing`);
  const hasPublishedOdds = /\b(?:publishedOdds|odds):\s*\d/.test(source);
  if (hasPublishedOdds) oddsRecords += 1;
  if (/\blatestObservedOdds:\s*\d/.test(source)) latestRecords += 1;
  if (/\bpreviousOdds:\s*\d/.test(source)) errors.push(`${label}: previousOdds is ambiguous; migrate to latestObservedOdds`);
  if (/\bpublishedOdds:\s*\d/.test(source) && /(?:^|\s)odds:\s*\d/m.test(source)) errors.push(`${label}: duplicate published odds fields`);
  if (/\blatestObservedOdds:\s*\d/.test(source) && !/\bpublishedOdds:\s*\d/.test(source)) errors.push(`${label}: latestObservedOdds requires explicit publishedOdds`);
  if (hasPublishedOdds && !/\boddsProvenance:\s*\{/.test(source)) warnings.push(`${label}: odds source/capture not recorded`);
}

const chelsea = readFileSync(join(base, "efl-cup", "round-02", "chelsea-vs-luton-town.ts"), "utf8");
if (!/publishedOdds:\s*1\.75/.test(chelsea) || !/latestObservedOdds:\s*1\.55/.test(chelsea)) {
  errors.push("chelsea-vs-luton-town: published 1.75 and latest observed 1.55 are not preserved separately");
}
console.log(`Prediction integrity: ${published} published / ${oddsRecords} with published odds / ${latestRecords} with later observations`);
warnings.forEach((warning) => console.log(`WARNING: ${warning}`));
errors.forEach((error) => console.error(`ERROR: ${error}`));
if (errors.length) process.exitCode = 1;

