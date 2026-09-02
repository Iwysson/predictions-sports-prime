import { editorialPredictions } from "../src/data/predictions/index.ts";
import {
  PSP_EDITORIAL_STANDARD,
  classifyPspEditorialLifecycle,
  validatePspEditorialStandard,
} from "../src/lib/editorial-standard.ts";

const now = process.env.PSP_AUDIT_NOW ? new Date(process.env.PSP_AUDIT_NOW) : new Date();
if (Number.isNaN(now.valueOf())) throw new Error("PSP_AUDIT_NOW must be a valid ISO date-time when supplied.");

const published = editorialPredictions.filter((prediction) => prediction.published === true);
const historical = [];
const future = [];
const unresolved = [];

for (const prediction of published) {
  const lifecycle = classifyPspEditorialLifecycle(prediction, now);
  if (lifecycle === "historical-frozen") historical.push(prediction);
  else if (lifecycle === "future-pre-match") future.push(prediction);
  else unresolved.push(prediction);
}

const failures = [];
let compliant = 0;
let marked = 0;
for (const prediction of future) {
  const errors = [];
  if (prediction.editorialStandard === PSP_EDITORIAL_STANDARD) marked += 1;
  else errors.push(`future/pre-match prediction must set editorialStandard: "${PSP_EDITORIAL_STANDARD}"`);
  errors.push(...validatePspEditorialStandard(prediction));
  if (errors.length) failures.push({ prediction, errors });
  else compliant += 1;
}

console.log("PSP Editorial Standard audit — FUTURE ONLY");
console.log(`As of: ${now.toISOString()}`);
console.log(`Published predictions: ${published.length}`);
console.log(`Historical frozen: ${historical.length}`);
console.log(`Future/pre-match eligible: ${future.length}`);
console.log(`Unresolved/quarantined date-time: ${unresolved.length}`);
console.log(`Future marked ${PSP_EDITORIAL_STANDARD}: ${marked}`);
console.log(`Future fully compliant: ${compliant}`);
console.log(`Future needing migration/fix: ${failures.length}`);
console.log("Historical changes required: 0");

for (const { prediction, errors } of failures.slice(0, 80)) {
  const slug = prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`;
  console.log(`FAIL: ${prediction.league}/${slug}: ${errors.join("; ")}`);
}
if (failures.length > 80) console.log(`... ${failures.length - 80} additional FUTURE failures omitted from console output.`);

// Historical pages and unresolved lifecycle records are deliberately excluded from this gate.
// Only fixtures proven to be future/pre-match can make the strict migration audit fail.
if (failures.length) process.exitCode = 1;
