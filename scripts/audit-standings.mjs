import { leagues } from "../src/data/leagues.ts";
import { standingDataState, standingsByLeague, validateStandingRows } from "../src/data/standings.ts";

const states = {
  validated: 0,
  fallback: 0,
  "not-available": 0,
  "not-applicable": 0,
};
const errors = [];

for (const league of leagues) {
  const rows = standingsByLeague[league.slug] ?? [];
  const state = standingDataState(league, rows);
  states[state] += 1;
  const rowErrors = validateStandingRows(rows, rows.length > 0 ? { expectedClubs: league.expectedClubs } : {});
  rowErrors.forEach((error) => errors.push(`${league.name}: ${error}`));
  if (state === "not-applicable" && rows.length > 0) errors.push(`${league.name}: cup/non-table competition has standings rows`);
  if (state === "not-available" && !league.liveDataId) errors.push(`${league.name}: standings expected but no live source is configured`);
  const fields = [...new Set(rows.flatMap((row) => Object.entries(row).filter(([, value]) => value !== undefined).map(([field]) => field)))];
  const source = state === "fallback"
    ? "static safe fallback"
    : state === "not-applicable"
      ? "competition format"
      : `runtime ${league.liveDataId || "unconfigured"}`;
  console.log(`${league.name}: ${state.toUpperCase().replaceAll("-", " ")} | Source: ${source} | Rows: ${rows.length} | Fields: ${fields.join(", ") || "none"} | Last update: ${state === "validated" ? "runtime" : "not available"}`);
}

console.log("");
console.log(`Competitions audited: ${leagues.length}`);
console.log(`VALIDATED: ${states.validated}`);
console.log(`FALLBACK: ${states.fallback}`);
console.log(`NOT AVAILABLE: ${states["not-available"]}`);
console.log(`NOT APPLICABLE: ${states["not-applicable"]}`);
console.log(`Invalid standings: ${errors.length}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length > 0) process.exitCode = 1;
else console.log("Standings audit: PASS");
