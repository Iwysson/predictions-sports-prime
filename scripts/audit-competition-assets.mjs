import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { leagues } from "../src/data/leagues.ts";

const root = process.cwd();
const graphical = leagues.filter((league) => league.asset.kind === "image");
const fallbacks = leagues.filter((league) => league.asset.kind === "text");
const assetSources = new Set();
const assetPaths = new Set();
const artworkIds = new Set();
const errors = [];
const pngSignature = "89504e470d0a1a0a";

for (const league of leagues) {
  if (!league.slug || !league.name || !league.short) {
    errors.push(`${league.slug || "unknown"}: incomplete competition registry entry`);
  }

  if (league.artworkId) {
    if (artworkIds.has(league.artworkId)) errors.push(`${league.slug}: duplicate artworkId ${league.artworkId}`);
    artworkIds.add(league.artworkId);
  }

  if (league.asset.kind === "text") {
    if (league.asset.label !== league.short) errors.push(`${league.slug}: fallback does not use canonical short label`);
    if (!league.asset.reason) errors.push(`${league.slug}: fallback reason is missing`);
    continue;
  }

  if (!league.artworkId) errors.push(`${league.slug}: graphical asset has no factual artworkId`);
  if (assetPaths.has(league.asset.src)) errors.push(`${league.slug}: duplicate local asset path`);
  if (assetSources.has(league.asset.sourceUrl)) errors.push(`${league.slug}: duplicate source asset reference`);
  assetPaths.add(league.asset.src);
  assetSources.add(league.asset.sourceUrl);

  const file = join(root, "public", league.asset.src.replace(/^\//, ""));
  if (!existsSync(file)) {
    errors.push(`${league.slug}: local asset is missing`);
    continue;
  }
  if (statSync(file).size < 1_000) errors.push(`${league.slug}: local asset is unexpectedly small`);
  if (readFileSync(file).subarray(0, 8).toString("hex") !== pngSignature) {
    errors.push(`${league.slug}: local asset is not a valid PNG`);
  }
}

const surfaces = [
  "src/components/HomePredictionFeed.tsx",
  "src/components/LeagueCard.tsx",
  "src/components/MatchCard.tsx",
  "src/app/league/[slug]/page.tsx",
  "src/app/match/[slug]/page.tsx",
];
for (const surface of surfaces) {
  const source = readFileSync(join(root, surface), "utf8");
  if (!source.includes("LeagueBadge")) errors.push(`${surface}: bypasses the centralized league badge`);
}

const badgeComponent = readFileSync(join(root, "src/components/LeagueBadge.tsx"), "utf8");
if (/useEffect|useState|fetchLeagueBadge|thesportsdb\.com/.test(badgeComponent)) {
  errors.push("LeagueBadge still performs a runtime asset replacement");
}

console.log("Competition Asset Health");
console.log(`Registered competitions: ${leagues.length}`);
console.log(`Valid graphical assets: ${graphical.length}`);
console.log(`Text fallbacks: ${fallbacks.length}`);
console.log(`Broken league images: ${errors.filter((error) => /missing|valid PNG|small/.test(error)).length}`);
console.log(`Duplicate references: ${errors.filter((error) => error.includes("duplicate")).length}`);
console.log(`Stale-first-render asset paths: ${errors.filter((error) => error.includes("runtime asset")).length}`);

for (const league of leagues) {
  console.log(`${league.name}: ${league.asset.kind === "image" ? "GRAPHICAL" : `TEXT FALLBACK (${league.asset.label}; ${league.asset.reason})`}`);
}

for (const error of errors) console.error(`ERROR: ${error}`);
assert.equal(errors.length, 0, "Competition asset audit failed");
console.log("Competition asset audit: PASS");
