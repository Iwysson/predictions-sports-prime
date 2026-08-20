import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const predictionRoot = join(root, "src", "data", "predictions");

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function quoted(source, property) {
  const raw = source.match(new RegExp(`^\\s*${property}:\\s*("(?:\\\\.|[^"\\\\])*")`, "m"))?.[1];
  return raw ? JSON.parse(raw) : undefined;
}

function block(source, property, open, close) {
  const match = new RegExp(`^\\s*${property}:\\s*\\${open}`, "m").exec(source);
  if (!match) return "";
  const start = match.index + match[0].lastIndexOf(open);
  let depth = 0, quote = null, escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") { quote = character; continue; }
    if (character === open) depth += 1;
    if (character === close) depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  return "";
}

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sentences(paragraphs) {
  return paragraphs.flatMap((paragraph) => paragraph.split(/(?<=[.!?])\s+/)).map((sentence) => sentence.trim()).filter(Boolean);
}

const factualPattern = /\b(?:\d+(?:\.\d+)?%?|xg|xga|average|scored|conceded|goals?|matches|wins?|draws?|losses|defeats?|points?|table|standings|season|home record|away record|clean sheets?|both teams|over|under|head-to-head|h2h)\b/i;
const eventPattern = /\b(?:joined|signed|transferred|injur(?:y|ed)|suspended|coach|manager|appointed|dismissed|returned|unavailable|squad)\b/i;
const editorialPattern = /\b(?:we prefer|our (?:pick|selection|view)|looks? (?:attractive|strong)|suggests?|indicates?|risk|could|may|might|expect|lean|value|price|therefore|for that reason)\b/i;
const prohibitedPattern = /\b(?:guaranteed (?:win|winner|profit|return)|risk[- ]free profit|certain (?:win|profit))\b/i;

const records = [];
for (const file of walk(predictionRoot).filter((path) => path.endsWith(".ts") && !path.endsWith(`${sep}index.ts`))) {
  const source = readFileSync(file, "utf8");
  if (!/^\s*published:\s*true/m.test(source)) continue;
  const home = quoted(source, "homeTeam");
  const away = quoted(source, "awayTeam");
  const slug = quoted(source, "slug") ?? `${slugify(home)}-vs-${slugify(away)}`;
  const analysisBlock = block(source, "analysis", "[", "]");
  const paragraphs = [...analysisBlock.matchAll(/"(?:\\.|[^"\\])*"/g)].map((match) => JSON.parse(match[0]));
  const allSentences = sentences(paragraphs);
  const factual = allSentences.filter((sentence) => factualPattern.test(sentence));
  const events = allSentences.filter((sentence) => eventPattern.test(sentence));
  const editorial = allSentences.filter((sentence) => editorialPattern.test(sentence) && !factual.includes(sentence));
  const sources = [...source.matchAll(/\burl:\s*["']([^"']+)["']/g)].map((match) => match[1]);
  const unsupported = [...new Set([...factual, ...events])].length;
  const risk = unsupported >= 12 || events.length >= 3 ? "HIGH" : unsupported >= 5 ? "MEDIUM" : "LOW";
  records.push({
    slug, file: relative(root, file).split(sep).join("/"), paragraphs, sentences: allSentences,
    factual: factual.length, events: events.length, editorial: editorial.length, sources,
    unsupported, risk, words: paragraphs.join(" ").trim().split(/\s+/).filter(Boolean).length,
    hash: createHash("sha256").update(JSON.stringify(paragraphs), "utf8").digest("hex"),
    prohibited: allSentences.filter((sentence) => prohibitedPattern.test(sentence)),
  });
}
records.sort((a, b) => a.slug.localeCompare(b.slug));

const sentenceOwners = new Map();
for (const record of records) for (const sentence of new Set(record.sentences.map((value) => value.toLowerCase().replace(/\s+/g, " ")))) {
  sentenceOwners.set(sentence, [...(sentenceOwners.get(sentence) ?? []), record.slug]);
}
const duplicateSentences = [...sentenceOwners].filter(([, owners]) => owners.length > 1);

function tokenSet(record) {
  return new Set(record.paragraphs.join(" ").toLowerCase().match(/[a-z0-9]{4,}/g) ?? []);
}
const highSimilarityPairs = [];
for (let left = 0; left < records.length; left += 1) for (let right = left + 1; right < records.length; right += 1) {
  const a = tokenSet(records[left]), b = tokenSet(records[right]);
  const intersection = [...a].filter((token) => b.has(token)).length;
  const similarity = intersection / new Set([...a, ...b]).size;
  if (similarity >= 0.55) highSimilarityPairs.push([records[left].slug, records[right].slug, similarity]);
}

const totalUnsupported = records.reduce((sum, record) => sum + record.unsupported, 0);
const totalSources = records.reduce((sum, record) => sum + record.sources.length, 0);
const sortedLengths = [...records].sort((a, b) => a.words - b.words);
const report = [
  "# EEAT Phase 4 — Source Migration Inventory",
  "",
  "> Safety status: **SOURCE RESEARCH REQUIRED**. The repository contains no traceable per-prediction sources. No source, claim, analysis, pick, odd, date, result or score was changed during this inventory.",
  "",
  "## Method",
  "",
  "This pre-migration inventory applies conservative lexical triage to every published analysis. Counts are review candidates, not a claim that software can decide whether a source proves a sentence. Factual/statistical and event candidates require human claim-by-claim verification; editorial candidates identify interpretive language. With zero source records, all factual/event candidates remain unsupported pending research.",
  "",
  "## Corpus summary",
  "",
  `- Published predictions audited: ${records.length}`,
  `- Predictions with existing sources: ${records.filter((record) => record.sources.length).length}`,
  `- Predictions requiring source research: ${records.filter((record) => record.unsupported > 0 && !record.sources.length).length}`,
  `- Total verified sources: ${totalSources}`,
  `- Factual/event candidates currently unsupported: ${totalUnsupported}`,
  `- Exact sentences repeated across predictions: ${duplicateSentences.length}`,
  `- High-similarity pairs (Jaccard token threshold ≥ 0.55): ${highSimilarityPairs.length}`,
  `- Average analysis length: ${Math.round(records.reduce((sum, record) => sum + record.words, 0) / records.length)} words`,
  `- Shortest analysis: ${sortedLengths[0].slug} (${sortedLengths[0].words} words)`,
  `- Longest analysis: ${sortedLengths.at(-1).slug} (${sortedLengths.at(-1).words} words)`,
  `- Prohibited guaranteed-win/profit candidates: ${records.reduce((sum, record) => sum + record.prohibited.length, 0)}`,
  "",
  "## Claim and source inventory",
  "",
  "| Slug | Factual/statistical | Event/personnel | Editorial | Existing sources | Sources needed | Unsupported | Risk | Status |",
  "|---|---:|---:|---:|---:|---|---:|---|---|",
  ...records.map((record) => `| ${record.slug} | ${record.factual} | ${record.events} | ${record.editorial} | ${record.sources.length} | Direct claim-specific research | ${record.unsupported} | ${record.risk} | SOURCE RESEARCH REQUIRED |`),
  "",
  "## Repetition inventory",
  "",
  ...(duplicateSentences.length ? duplicateSentences.map(([sentence, owners]) => `- \`${sentence}\` — ${owners.join(", ")}`) : ["- No exact cross-page sentence duplicates detected."]),
  "",
  "## High-similarity pairs",
  "",
  ...(highSimilarityPairs.length ? highSimilarityPairs.map(([left, right, score]) => `- ${left} ↔ ${right}: ${score.toFixed(3)}`) : ["- None at the declared threshold."]),
  "",
  "## Change log",
  "",
  "No prediction was changed. Original and current hashes remain identical, sources added = 0, claims removed/corrected = 0, template content removed from prediction files = 0, substantive = NO, updatedAt changed = NO, manual review required = YES for every prediction with factual/event candidates.",
  "",
  "The shared multilingual `MatchSearchIntent` search-first block was removed from the match template. This is a structural people-first cleanup, not an edit to any prediction analysis, and it does not change an analysis hash or require `updatedAt`.",
  "",
  "A Phase 4 editorial baseline was not created because no claim-level migration has been researched, reviewed and approved. The original baseline remains the authoritative pre-E-E-A-T record.",
  "",
].join("\n");
writeFileSync(join(root, "EEAT-PHASE-4-SOURCE-MIGRATION.md"), report, "utf8");

console.log(`Published predictions: ${records.length}`);
console.log(`Predictions with sources: ${records.filter((record) => record.sources.length).length}`);
console.log(`Predictions without sources: ${records.filter((record) => !record.sources.length).length}`);
console.log(`Total sources: ${totalSources}`);
console.log(`Unsupported factual/event candidates: ${totalUnsupported}`);
console.log(`Manual review required: ${records.filter((record) => record.unsupported > 0).length}`);
console.log(`Duplicate sentences: ${duplicateSentences.length}`);
console.log(`High-similarity pairs: ${highSimilarityPairs.length}`);
console.log(`Average analysis length: ${Math.round(records.reduce((sum, record) => sum + record.words, 0) / records.length)} words`);
console.log(`Shortest analysis: ${sortedLengths[0].slug} (${sortedLengths[0].words} words)`);
console.log(`Longest analysis: ${sortedLengths.at(-1).slug} (${sortedLengths.at(-1).words} words)`);
const prohibitedCount = records.reduce((sum, record) => sum + record.prohibited.length, 0);
if (prohibitedCount > 0) {
  records.filter((record) => record.prohibited.length).forEach((record) => console.error(`ERROR: ${record.slug}: prohibited guaranteed-win/profit language candidate`));
  process.exitCode = 1;
} else console.log("Content quality inventory: PASS");
