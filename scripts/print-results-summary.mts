// results:update — final step: prints a TODAY / OVERALL settlement summary and
// the files the run actually changed. Every number here is read back from the
// settled dataset and the live-hydrated predictions; nothing is hardcoded.
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { settlementPreviews } from "../src/lib/settlement-source.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { evaluatePredictionSettlement } from "../src/lib/prediction-results.ts";
import { resultKey, summarizeResults, type FootballResultsDataset } from "../src/lib/football-results.ts";

const dataset: FootballResultsDataset = JSON.parse(await readFile(resolve("src/data/football-results.snapshot.json"), "utf8"));
const records = Object.values(dataset.records);

const todayIso = new Date().toISOString().slice(0, 10);
const published = settlementPreviews();
const hydrated = await hydratePredictions(published);
const todayMatches = hydrated.filter((match) => match.date === todayIso);

let todaySettled = 0;
let todayWins = 0;
let todayLosses = 0;
let todayOther = 0;
let todayPending = 0;
for (const match of todayMatches) {
  const key = resultKey(match);
  const record = dataset.records[key];
  if (record) {
    todaySettled += 1;
    if (record.result === "green") todayWins += 1;
    else if (record.result === "red") todayLosses += 1;
    else todayOther += 1;
    continue;
  }
  todayPending += 1;
}

const overall = summarizeResults(records);

console.log("");
console.log("TODAY");
console.log(`  predictions today: ${todayMatches.length}`);
console.log(`  settled: ${todaySettled}`);
console.log(`  wins: ${todayWins}`);
console.log(`  losses: ${todayLosses}`);
if (todayOther) console.log(`  push/half/void: ${todayOther}`);
console.log(`  pending: ${todayPending}`);

console.log("");
console.log("OVERALL");
console.log(`  settled: ${overall.settled}`);
console.log(`  wins: ${overall.wins}`);
console.log(`  losses: ${overall.losses}`);
console.log(`  win rate: ${overall.winRate === null ? "n/a" : (overall.winRate * 100).toFixed(1) + "%"}`);

let changedFiles: string[] = [];
try {
  const raw = execSync("git status --porcelain -- src/data/football-results.snapshot.json src/data/fixtures.snapshot.json src/data/market-results.snapshot.json", {
    encoding: "utf8",
  });
  changedFiles = raw.split("\n").map((line) => line.replace(/\r$/, "")).filter(Boolean).map((line) => line.slice(3));
} catch {
  // git unavailable in this environment; changed-file reporting is best-effort only.
}

console.log("");
console.log("CHANGED FILES");
if (changedFiles.length === 0) console.log("  (none)");
else for (const file of changedFiles) console.log(`  ${file}`);
