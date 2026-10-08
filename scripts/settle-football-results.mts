// results:settle — settle final football predictions into the central results dataset.
import { readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { settlementPreviews } from "../src/lib/settlement-source.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { buildResultsDataset, emptyResultsDataset, summarizeResults, type FootballResultsDataset } from "../src/lib/football-results.ts";

const path = resolve("src/data/football-results.snapshot.json");
let previous: FootballResultsDataset = emptyResultsDataset();
try {
  previous = JSON.parse(await readFile(path, "utf8"));
} catch {
  console.log("results:settle — no previous dataset; creating it.");
}

const hydrated = await hydratePredictions(settlementPreviews());
const next = buildResultsDataset(hydrated, previous);
const serialized = `${JSON.stringify(next, null, 2)}\n`;
const unchanged = serialized === `${JSON.stringify(previous, null, 2)}\n`;
if (!unchanged) {
  await writeFile(`${path}.next`, serialized, "utf8");
  await rename(`${path}.next`, path);
}
const added = Object.keys(next.records).filter((key) => !previous.records[key]);
const summary = summarizeResults(Object.values(next.records));
console.log(`results:settle — ${unchanged ? "unchanged" : "updated"}; ${Object.keys(next.records).length} settled (${added.length} new).`);
for (const key of added) {
  const record = next.records[key];
  console.log(`  + ${key}: ${record.finalScore.home}-${record.finalScore.away} ${record.result}`);
}
console.log(`  wins ${summary.wins}, losses ${summary.losses}, pushes ${summary.pushes}, win rate ${summary.winRate === null ? "n/a" : (summary.winRate * 100).toFixed(1) + "%"}`);
