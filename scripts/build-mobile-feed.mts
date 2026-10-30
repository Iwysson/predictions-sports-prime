// Writes public, non-secret mobile feed indexes consumed by functions/api/mobile/*.
// Runs in prebuild, alongside match-content:build. Output lives under functions/_data
// so it ships only with the Pages Functions, never with client bundles (though every
// field here is already public on the website itself - no protected text is included).
//
// Football's Today/Tomorrow/Upcoming bucketing is computed HERE, at build time, by calling
// the website's own shared logic (src/lib/match-feed.ts) - not reimplemented. Freshness comes
// from the same rebuild/redeploy cadence the website itself relies on (the fixtures-sync
// GitHub Action pushes every ~5 minutes when fixture data changes, triggering a redeploy).
import { writeFileSync, mkdirSync } from "node:fs";
import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { buildMobileFootballIndex } from "../src/lib/mobile-feed-build.ts";
import { buildMobileResultsIndex } from "../src/lib/mobile-feed-build-results.ts";
import footballResults from "../src/data/football-results.snapshot.json" with { type: "json" };
import type { FootballResultsDataset } from "../src/lib/football-results.ts";

mkdirSync("functions/_data/mobile", { recursive: true });

const resolvedMatches = await hydratePredictions(matches.map(toMatchPreview));
const footballIndex = buildMobileFootballIndex(resolvedMatches);
writeFileSync("functions/_data/mobile/football.json", JSON.stringify(footballIndex, null, 2) + "\n");

const resultsIndex = buildMobileResultsIndex(footballResults as FootballResultsDataset);
writeFileSync("functions/_data/mobile/results.json", JSON.stringify(resultsIndex, null, 2) + "\n");

console.log(
  `mobile feed index: football today=${footballIndex.free.today.length + footballIndex.vip.today.length} ` +
    `tomorrow=${footballIndex.free.tomorrow.length + footballIndex.vip.tomorrow.length} ` +
    `upcoming=${footballIndex.free.upcoming.length + footballIndex.vip.upcoming.length} | ` +
    `results=${resultsIndex.records.length}`,
);
