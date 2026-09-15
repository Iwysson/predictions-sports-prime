import { editorialPredictions } from "../src/data/predictions/index.ts";
import { classifyPspEditorialLifecycle } from "../src/lib/editorial-standard.ts";

const future = editorialPredictions.filter(
  (prediction) => prediction.published === true && classifyPspEditorialLifecycle(prediction) === "future-pre-match"
);
const failures = [];
const paragraphs = [];

const structural = /^(?:#{1,6}\s|\|.*\||[-*]\s+(?:\*\*)?(?:competition|date|kick-off|round|venue|location|prediction|odds|sources)|(?:prediction|odds|sources|match information|expected lineups|responsible gambling)\s*:)/i;
const routineEditorial = /(?:raw implied probability|calculated as \*\*?1\s*\/|market-price context only|team-news status remains provisional|no suspension or eligibility issue is stated unless)/i;
const internal = [
  /\b(?:TODO|FIXME|DEBUG|INTERNAL)\b/i,
  /\b(?:internal note|developer note|editorial note interna|system message|audit status|review required|needs review|AI draft|draft generated|manual approval required|pending research|needs verification|insert data|replace this|as an AI)\b/i,
  /\b(?:stack trace|npm run|node scripts\/|src\/|scripts\/)\b/i,
  /(?:^|\s)[A-Z]:\\[^\s]+/,
  /\b(?:placeholder text|lorem ipsum)\b/i,
];
const factual = /(?:\b\d+(?:[.,]\d+)?%?\b|\b(?:W-D-L|wins?|draws?|losses?|goals?|shots?|corners?|possession|lineups?|injur(?:y|ies)|suspensions?|round|competition|home split|away split|form|H2H|results?)\b)/i;

function normalize(value) {
  return value.toLowerCase().replace(/[*_`#>|]/g, " ").replace(/[^\p{L}\p{N}%]+/gu, " ").replace(/\s+/g, " ").trim();
}

function substantive(text) {
  const value = text.trim();
  return value.length >= 120 && !structural.test(value) && !routineEditorial.test(value);
}

function similarity(left, right) {
  const words = (value) => normalize(value).split(" ").filter(Boolean);
  const shingles = (value) => {
    const tokens = words(value);
    return new Set(tokens.slice(0, -4).map((_, index) => tokens.slice(index, index + 5).join(" ")));
  };
  const a = shingles(left);
  const b = shingles(right);
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const item of a) if (b.has(item)) overlap += 1;
  return overlap / (a.size + b.size - overlap);
}

for (const prediction of future) {
  const slug = prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`;
  const text = Array.isArray(prediction.analysis) ? prediction.analysis.join("\n\n") : String(prediction.analysis ?? "");
  for (const pattern of internal) {
    const match = text.match(pattern);
    if (match) failures.push({ slug, reason: "internal information", excerpt: match[0] });
  }
  if (!factual.test(text)) failures.push({ slug, reason: "analysis without concrete data", excerpt: text.slice(0, 180) });
  const local = new Set();
  for (const paragraph of text.split(/\n\s*\n/).filter(substantive)) {
    const key = normalize(paragraph);
    if (local.has(key)) failures.push({ slug, reason: "repeated substantive paragraph", excerpt: paragraph.slice(0, 180) });
    local.add(key);
    paragraphs.push({ slug, text: paragraph, key });
  }
}

const candidateBuckets = new Map();
for (const paragraph of paragraphs) {
  const bucket = paragraph.key.slice(0, 64);
  const candidates = candidateBuckets.get(bucket) ?? [];
  candidates.push(paragraph);
  candidateBuckets.set(bucket, candidates);
}
for (const candidates of candidateBuckets.values()) {
 for (let left = 0; left < candidates.length; left += 1) {
  for (let right = left + 1; right < candidates.length; right += 1) {
    const a = candidates[left];
    const b = candidates[right];
    if (a.slug === b.slug) continue;
    const exact = a.key === b.key;
    const score = exact ? 1 : similarity(a.text, b.text);
    if (score >= 0.92) failures.push({ slug: `${a.slug} <> ${b.slug}`, reason: exact ? "duplicated substantive paragraph" : `exceptionally high substantive similarity (${score.toFixed(2)})`, excerpt: a.text.slice(0, 180) });
  }
 }
}

const unique = [...new Map(failures.map((failure) => [`${failure.slug}|${failure.reason}|${failure.excerpt}`, failure])).values()];
console.log(`Publication content: ${future.length} future published predictions checked`);
for (const failure of unique) console.error(`FAIL ${failure.slug}: ${failure.reason}\n  ${failure.excerpt.replace(/\s+/g, " ")}`);
if (unique.length) {
  console.error(`Publication content: FAIL (${unique.length})`);
  process.exitCode = 1;
} else {
  console.log("Publication content: PASS");
}
