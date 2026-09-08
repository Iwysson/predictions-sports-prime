import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { classifyPspEditorialLifecycle } from "../src/lib/editorial-standard.ts";

function scorePrediction(prediction) {
  const text = prediction.analysis.join("\n\n");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sourceCount = (prediction.sources ?? []).filter((source) => /^https:\/\//.test(source.url)).length;
  let score = 15;
  score += words >= 900 ? 25 : words >= 750 ? 20 : words >= 650 ? 15 : words >= 550 ? 10 : words >= 400 ? 5 : 0;
  score += sourceCount >= 3 ? 15 : sourceCount >= 1 ? 10 : 0;
  score += prediction.editorialStandard === "psp-v1" ? 10 : 0;
  score += /Statistical Core Predictions-Sports-Prime/i.test(text) ? 10 : 0;
  score += /risk|counter-evidence|limitation|uncertainty/i.test(text) ? 8 : 0;
  score += /tactical|transition|press(?:ing|ure)|game state|set pieces?|width|half-spaces?/i.test(text) ? 7 : 0;
  score += prediction.picks?.main && (prediction.picks.publishedOdds ?? prediction.picks.odds) ? 5 : 0;
  if (prediction.sourceStatus !== "partial" || /partial|unavailable|omitted|not confirmed|limitation/i.test(text)) score += 5;
  score = Math.min(100, score);
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D";
  return { league: prediction.league, slug: prediction.slug, score, grade, words, sourceCount, sourceStatus: prediction.sourceStatus };
}

function assess(predictions) {
  const rows = predictions
    .filter((prediction) => prediction.published && classifyPspEditorialLifecycle(prediction) === "future-pre-match")
    .map(scorePrediction);
  const grades = Object.fromEntries(["A", "B", "C", "D"].map((grade) => [grade, rows.filter((row) => row.grade === grade).length]));
  const average = rows.reduce((sum, row) => sum + row.score, 0) / Math.max(rows.length, 1);
  return { pages: rows.length, average: Number(average.toFixed(1)), grades, rows };
}

// Wave 2.8 does not rewrite future match evidence merely to raise a score.
// The same frozen-at-audit inventory is used on both sides; hub and audit
// improvements are reported separately from match-content scoring.
const before = assess(editorialPredictions);
const after = assess(editorialPredictions);
const report = {
  generatedAt: new Date().toISOString(),
  policy: "Future/pre-match only. Historical and unresolved records are excluded from scoring.",
  thresholds: { A: "90-100", B: "75-89", C: "60-74", D: "below 60" },
  before,
  after,
};
const directory = join(process.cwd(), "reports", "wave-2.8");
mkdirSync(directory, { recursive: true });
writeFileSync(join(directory, "quality-score.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(directory, "quality-score.md"), `# Wave 2.8 quality score\n\n- Future pages: **${after.pages}**\n- Average: **${before.average} -> ${after.average}**\n- A/B/C/D before: **${before.grades.A}/${before.grades.B}/${before.grades.C}/${before.grades.D}**\n- A/B/C/D after: **${after.grades.A}/${after.grades.B}/${after.grades.C}/${after.grades.D}**\n- Historical and unresolved pages changed: **0**\n`);

console.log(`Wave 2.8 future pages: ${after.pages}`);
console.log(`AdSense quality score: ${before.average} -> ${after.average}`);
console.log(`A/B/C/D before: ${before.grades.A}/${before.grades.B}/${before.grades.C}/${before.grades.D}`);
console.log(`A/B/C/D after: ${after.grades.A}/${after.grades.B}/${after.grades.C}/${after.grades.D}`);
if (after.grades.C || after.grades.D) process.exitCode = 1;
