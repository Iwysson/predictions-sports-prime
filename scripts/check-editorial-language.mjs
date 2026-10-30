import { readFileSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { classifyPspEditorialLifecycle } from "../src/lib/editorial-standard.ts";
import { findPortuguesePatterns, sourceLabelsForCheck } from "./lib/editorial-language.mjs";

const activeEditorial = editorialPredictions.filter((prediction) =>
  prediction.published === true && classifyPspEditorialLifecycle(prediction) !== "historical-frozen"
);
const records = [
  ...activeEditorial.map((prediction) => ({
    label: `${prediction.league}/${prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`}`,
    teamNames: [prediction.homeTeam, prediction.awayTeam],
    text: [prediction.seoTitle, prediction.title, prediction.teaser, prediction.trend, prediction.picks.main, ...prediction.analysis, ...sourceLabelsForCheck(prediction.sources)].filter(Boolean).join("\n"),
  })),
];

const failures = records.flatMap(({ label, teamNames, text }) =>
  findPortuguesePatterns({ teamNames, text }).map((pattern) => `${label}: ${pattern}`),
);

console.log(`English editorial language check: ${records.length} active records, ${failures.length} Portuguese matches`);
for (const failure of failures) console.error(`ERROR: ${failure}`);
if (failures.length) process.exitCode = 1;
