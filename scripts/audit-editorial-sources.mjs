import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
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
const missingSourceReport = [];
const sourceArrayPattern = /["']?sources["']?\s*:\s*\[\s*\{/s;

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
  const hasSources = sourceArrayPattern.test(source);
  if (hasSources) predictionsWithSources += 1;
  let sourceUrls = new Set();

  if (isLegacy) legacyPending += 1;
  else {
    if (predatesPolicy && isVerified) migratedLegacy += 1;
    if (predatesPolicy && isPartial) partialLegacy += 1;
    if (predatesPolicy && isIncomplete) incompleteLegacy += 1;
    currentPublished += 1;
    if (!publishedAt || Number.isNaN(Date.parse(publishedAt))) errors.push(`${label}: current publication needs valid publishedAt`);
    if (!predatesPolicy && !isVerified && !isPartial) errors.push(`${label}: current publication needs sourceStatus: "verified" or "partial"`);
    if (!hasSources) errors.push(`${label}: current publication needs source coverage`);
    if (!predatesPolicy && /odds:\s*\d/.test(source) && !/oddsProvenance:\s*\{/s.test(source)) errors.push(`${label}: current published odds need provenance`);
  }

  for (const line of source.split(/\r?\n/)) {
    // A source may legitimately support more than one independent semantic module.
    // Duplicate detection is scoped to each `sources` array, where repetition is noise.
    if (/\bsources:\s*\[/.test(line)) sourceUrls = new Set();
    for (const match of line.matchAll(/\burl:\s*["']([^"']*)["']/g)) {
      let url;
      try { url = new URL(match[1]); } catch { errors.push(`${label}: invalid source URL (${match[1]})`); continue; }
      if (url.protocol !== "https:") errors.push(`${label}: source URL must use HTTPS (${match[1]})`);
      if (["example.com", "example.org", "example.net"].includes(url.hostname.toLowerCase())) errors.push(`${label}: placeholder source URL (${match[1]})`);
      if (sourceUrls.has(match[1])) errors.push(`${label}: duplicate source URL within one source list (${match[1]})`);
      sourceUrls.add(match[1]);
    }
  }
}

for (const file of walk(predictionsRoot).filter((path) => path.endsWith(".ts") && !path.endsWith(`${sep}index.ts`))) {
  const source = readFileSync(file, "utf8");
  if (!/published:\s*true/.test(source) || sourceArrayPattern.test(source)) continue;
  const parts = relative(predictionsRoot, file).split(sep);
  const publishedAt = source.match(/^\s*publishedAt:\s*["']([^"']+)["']/m)?.[1];
  const historical = Boolean(publishedAt && Date.parse(publishedAt) <= cutoff);
  missingSourceReport.push({
    slug: source.match(/\bslug\s*:\s*["']([^"']+)["']/)?.[1] ?? file.split(sep).at(-1).replace(/\.ts$/, ""),
    league: parts[0], round: parts[1] ?? null, section: "prediction.sources",
    expectedSourceField: "sources[]", currentSourceField: "missing",
    lifecycle: historical ? "historical" : "new", indexability: historical ? "policy-dependent" : "blocking",
    editorialStandard: source.match(/editorialStandard\s*:\s*["']([^"']+)/)?.[1] ?? null,
    sourceStatus: source.match(/sourceStatus\s*:\s*["']([^"']+)/)?.[1] ?? null,
    classification: historical ? "B" : "A",
  });
}
const reportDirectory = join(root, "reports", "source-audit");
mkdirSync(reportDirectory, { recursive: true });
writeFileSync(join(reportDirectory, "missing-sources.json"), `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  rootCause: {
    classification: "D",
    detail: "The former failure compared rendered source sections with source-bearing prediction records; these are different populations because rendering can derive/shared module provenance.",
    correction: "Per-record provenance remains blocking for current content; rendered section count is diagnostic only.",
  },
  cases: missingSourceReport,
}, null, 2)}\n`);

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
  // A rendered page is not a source record: localized/derived match data and structured
  // modules can legitimately render the shared source section. Per-record provenance is
  // enforced above; comparing these unlike populations caused the former false failure.
  console.log(`Source-bearing records parsed: ${predictionsWithSources}`);
  console.log(`Rendered Sources & Data sections: ${renderedSourceSections}`);
}
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exitCode = 1;
} else console.log("Editorial source audit: PASS");
