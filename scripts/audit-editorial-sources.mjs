import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const predictionsRoot = join(root, "src", "data", "predictions");
const cutoff = Date.parse("2026-08-20T23:59:59-03:00");
const errors = [];
let legacyPending = 0;
let migratedLegacy = 0;
let partialLegacy = 0;
let incompleteLegacy = 0;
let currentPublished = 0;
let predictionsWithSources = 0;

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(predictionsRoot).filter((path) => path.endsWith(".ts") && !path.endsWith(`${sep}index.ts`))) {
  const source = readFileSync(file, "utf8");
  const label = relative(root, file).split(sep).join("/");
  if (!/published:\s*true/.test(source)) continue;
  const publishedAt = source.match(/^\s*publishedAt:\s*["']([^"']+)["']/m)?.[1];
  const predatesPolicy = publishedAt && Date.parse(publishedAt) <= cutoff;
  const isVerified = /sourceStatus:\s*["']verified["']/.test(source);
  const isPartial = /sourceStatus:\s*["']partial["']/.test(source);
  const isIncomplete = /sourceStatus:\s*["']incomplete["']/.test(source);
  const isLegacy = predatesPolicy && !isVerified && !isPartial && !isIncomplete;
  if (/sources:\s*\[\s*\{/s.test(source)) predictionsWithSources += 1;
  const sourceUrls = new Set();

  if (isLegacy) legacyPending += 1;
  else {
    if (predatesPolicy && isVerified) migratedLegacy += 1;
    if (predatesPolicy && isPartial) partialLegacy += 1;
    if (predatesPolicy && isIncomplete) incompleteLegacy += 1;
    currentPublished += 1;
    if (!publishedAt || Number.isNaN(Date.parse(publishedAt))) errors.push(`${label}: current publication needs valid publishedAt`);
    if (!predatesPolicy && !isVerified) errors.push(`${label}: current publication needs sourceStatus: "verified"`);
    if (!/sources:\s*\[\s*\{/s.test(source)) errors.push(`${label}: current publication needs source coverage`);
    if (!predatesPolicy && /odds:\s*\d/.test(source) && !/oddsProvenance:\s*\{/s.test(source)) errors.push(`${label}: current published odds need provenance`);
  }

  for (const match of source.matchAll(/\burl:\s*["']([^"']*)["']/g)) {
    let url;
    try { url = new URL(match[1]); } catch { errors.push(`${label}: invalid source URL (${match[1]})`); continue; }
    if (url.protocol !== "https:") errors.push(`${label}: source URL must use HTTPS (${match[1]})`);
    if (["example.com", "example.org", "example.net"].includes(url.hostname.toLowerCase())) errors.push(`${label}: placeholder source URL (${match[1]})`);
    if (sourceUrls.has(match[1])) errors.push(`${label}: duplicate source URL (${match[1]})`);
    sourceUrls.add(match[1]);
  }
}

console.log(`Legacy published analyses pending source migration: ${legacyPending}`);
console.log(`Legacy published analyses migrated with verified sources: ${migratedLegacy}`);
console.log(`Legacy published analyses migrated with partial sources: ${partialLegacy}`);
console.log(`Legacy published analyses with incomplete source research: ${incompleteLegacy}`);
console.log(`Post-policy published analyses with required source coverage: ${currentPublished}`);
const outMatchRoot = join(root, "out", "match");
if (statSync(outMatchRoot).isDirectory()) {
  const renderedSourceSections = walk(outMatchRoot)
    .filter((path) => path.endsWith("index.html"))
    .filter((path) => readFileSync(path, "utf8").includes('class="article-sources"')).length;
  if (renderedSourceSections !== predictionsWithSources) errors.push(`rendered source sections (${renderedSourceSections}) do not match predictions with sources (${predictionsWithSources})`);
  console.log(`Rendered Sources & Data sections: ${renderedSourceSections}`);
}
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exitCode = 1;
} else console.log("Editorial source audit: PASS");
