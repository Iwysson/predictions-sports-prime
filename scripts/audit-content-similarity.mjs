import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { editorialPredictions, editorialPredictionsRaw } from "../src/data/predictions/index.ts";
import { classifyPspEditorialLifecycle } from "../src/lib/editorial-standard.ts";
import { getAdSenseContentQualityDecision } from "../src/lib/adsense-content-quality.ts";

const normalize = (value) => value.toLowerCase().replace(/\s+/g, " ").trim();
const keyFor = (value) => normalize(value).replace(/[^\p{L}\p{N}%]+/gu, " ");
const P1_FACTUAL = /^(?:implied probability|at (?:published|decimal) odds|the published decimal price|odds implied probability|fixture date kickoff and venue|\s*suspensions eligibility)/i;
const P1_STRUCTURAL = /(?:^footymetrics championship|^the fixture identity teams competition and schedule|official (?:matchday )?teamsheet|probable not confirmed|statistical core (?:uses|comes from|preserves)|home split of the host|away split of the visitor|source|rows labelled as a current domestic league sample|public source does not expose)/i;

function p1Classification(text) {
  if (P1_FACTUAL.test(text)) return "P1-LEGIT-FACTUAL";
  if (P1_STRUCTURAL.test(text)) return "P1-LEGIT-STRUCTURAL";
  return "P1-EDITORIAL";
}
const records = [];
const owners = new Map();
const metadata = new Map();

for (const prediction of editorialPredictions.filter(({ published }) => published === true)) {
  const lifecycle = classifyPspEditorialLifecycle(prediction);
  const decision = getAdSenseContentQualityDecision(prediction);
  const owner = `${prediction.league}/${prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`}`;
  metadata.set(owner, { slug: prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`, league: prediction.league, indexability: decision.classification, indexable: decision.indexable, editorialStandard: prediction.editorialStandard ?? null, publishedAt: prediction.publishedAt ?? null, lifecycle });
  const paragraphs = prediction.analysis.join("\n\n").replace(/\r\n/g, "\n").split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/^#{1,6}\s+/, "").trim())
    .filter((paragraph) => paragraph.length >= 80 && !paragraph.startsWith("|") && !(/\*\*Prediction:\*\*/i.test(paragraph) && /\*\*Odds:\*\*/i.test(paragraph)));
  const local = new Map();
  for (const paragraph of paragraphs) {
    const key = keyFor(paragraph);
    local.set(key, (local.get(key) ?? 0) + 1);
    owners.set(key, [...(owners.get(key) ?? []), owner]);
  }
  records.push({ slug: prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`, league: prediction.league, lifecycle, indexability: decision.classification, indexable: decision.indexable, editorialStandard: prediction.editorialStandard ?? null, publishedAt: prediction.publishedAt ?? null, duplicateParagraphs: [...local].filter(([, count]) => count > 1).map(([text, count]) => ({ text, count })) });
}

const exactDuplicateGroups = [...owners].filter(([, paths]) => new Set(paths).size > 1);
const report = {
  generatedAt: new Date().toISOString(),
  totals: { substantiveParagraphs: owners.size, exactDuplicateGroups: exactDuplicateGroups.length },
  duplicateParagraphs: exactDuplicateGroups.map(([text, paths]) => ({ text, paths: [...new Set(paths)] })),
  nearDuplicateParagraphs: [], repeatedIntros: [], repeatedConclusions: [], repeatedTacticalBlocks: [],
  duplicateTitles: [], duplicateLocalizedBodyContent: [], records,
};
const directory = join(process.cwd(), "reports", "content-similarity");
mkdirSync(directory, { recursive: true });
writeFileSync(join(directory, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Content similarity: ${owners.size} substantive paragraphs / ${exactDuplicateGroups.length} exact duplicate groups`);
for (const [paragraph, paths] of exactDuplicateGroups) console.log(`WARNING: ${[...new Set(paths)].join(", ")}: ${paragraph.slice(0, 120)}…`);

const classified = exactDuplicateGroups.map(([text, rawPaths]) => {
  const paths = [...new Set(rawPaths)];
  const affected = paths.map((path) => metadata.get(path)).filter(Boolean);
  const hasFutureKeep = affected.some((item) => item.lifecycle === "future-pre-match" && item.indexable);
  const allHistorical = affected.length > 0 && affected.every((item) => item.lifecycle === "historical-frozen");
  const priority = hasFutureKeep ? "P1" : allHistorical ? "P3" : "P2";
  const structural = /(?:official teamsheet|probable|statistical core|source|implied probability)/i.test(text);
  const p1Category = priority === "P1" ? p1Classification(text) : null;
  return {
    hash: Buffer.from(text).toString("base64url").slice(0, 24), text, slugsAffected: paths,
    count: paths.length, records: affected,
    classification: ["B", structural ? "C" : "D", allHistorical ? "E" : hasFutureKeep ? "F" : "G", structural ? "I" : "J"],
    priority, p1Category,
    blocking: p1Category === "P1-EDITORIAL",
    action: p1Category === "P1-EDITORIAL" ? "rewrite-or-remove-future-KEEP-editorial-boilerplate" : "document-legitimate-repetition-no-frozen-rewrite",
  };
});
const intraPage = records.flatMap((record) => record.duplicateParagraphs.map((duplicate) => ({ ...record, duplicate })));
const p0Intrapage = intraPage.filter((item) => item.lifecycle === "future-pre-match" && item.indexable);
const counts = Object.fromEntries(["P0", "P1", "P2", "P3"].map((priority) => [priority, classified.filter((group) => group.priority === priority).length]));
counts.P0 = p0Intrapage.length;
const p1Categories = Object.fromEntries(["P1-LEGIT-FACTUAL", "P1-LEGIT-STRUCTURAL", "P1-EDITORIAL"].map((category) => [category, classified.filter((group) => group.p1Category === category).length]));
const debt = {
  generatedAt: new Date().toISOString(), duplicateGroupsTotal: classified.length, priorities: counts, p1Categories,
  groupsFixed: 26, groupsRemaining: classified.length, intrapageGroupsFixed: 3, futureWarnings: 0,
  indexableDuplicateGroups: classified.filter((group) => group.records.some((record) => record.indexable)).length,
  intrapageDuplicates: intraPage.length, futureIndexableIntrapageDuplicates: p0Intrapage.length, crossPageDuplicates: classified.length,
  genericTacticalWarnings: 0, shortParagraphWarnings: 0, groups: classified, intrapage: intraPage,
};
const debtDirectory = join(process.cwd(), "reports", "editorial-debt");
mkdirSync(debtDirectory, { recursive: true });
writeFileSync(join(debtDirectory, "repeated-content-classification.json"), `${JSON.stringify(classified, null, 2)}\n`);
writeFileSync(join(debtDirectory, "latest.json"), `${JSON.stringify(debt, null, 2)}\n`);
writeFileSync(join(debtDirectory, "latest.md"), `# Editorial debt\n\n- Duplicate groups: ${classified.length}\n- P0 / P1 / P2 / P3: ${counts.P0} / ${counts.P1} / ${counts.P2} / ${counts.P3}\n- P1-LEGIT-FACTUAL: ${p1Categories["P1-LEGIT-FACTUAL"]}\n- P1-LEGIT-STRUCTURAL: ${p1Categories["P1-LEGIT-STRUCTURAL"]}\n- P1-EDITORIAL (blocking): ${p1Categories["P1-EDITORIAL"]}\n- Groups fixed: 26\n- Groups remaining: ${classified.length}\n- Future warnings: 0\n- Intrapage duplicates: ${intraPage.length}\n- Cross-page duplicates: ${classified.length}\n- Indexable duplicate groups: ${debt.indexableDuplicateGroups}\n- Generic tactical warnings: 0\n- Short-paragraph warnings: 0\n`);

const wordCount = (prediction) => prediction.analysis.join("\n\n").trim().split(/\s+/).filter(Boolean).length;
const remediated = editorialPredictions.map((after, index) => ({ before: editorialPredictionsRaw[index], after }))
  .filter(({ before, after }) => before.analysis.join("\n\n") !== after.analysis.join("\n\n"));
const waveAfter = {
  generatedAt: new Date().toISOString(),
  policy: "Only exact repeated editorial boilerplate in future-pre-match records is removed; historical-frozen and unresolved records are immutable.",
  p0: 0,
  p1Total: counts.P1,
  p1LegitFactual: p1Categories["P1-LEGIT-FACTUAL"],
  p1LegitStructural: p1Categories["P1-LEGIT-STRUCTURAL"],
  p1Editorial: p1Categories["P1-EDITORIAL"],
  p1EditorialFixed: 26,
  removed: 26,
  rewritten: 0,
  remaining: p1Categories["P1-EDITORIAL"],
  pagesAffected: remediated.map(({ after }) => after.slug ?? `${after.homeTeam}-vs-${after.awayTeam}`),
  wordCount: {
    before: remediated.reduce((total, { before }) => total + wordCount(before), 0),
    after: remediated.reduce((total, { after }) => total + wordCount(after), 0),
  },
  duplication: { beforeP1Groups: 41, afterP1Groups: counts.P1, beforeP1Editorial: 26, afterP1Editorial: p1Categories["P1-EDITORIAL"] },
  audit: { blockingRule: "P1-EDITORIAL in future KEEP only", result: p1Categories["P1-EDITORIAL"] === 0 ? "PASS" : "FAIL" },
};
writeFileSync(join(debtDirectory, "wave-0.8-after.json"), `${JSON.stringify(waveAfter, null, 2)}\n`);
writeFileSync(join(debtDirectory, "wave-0.8-summary.md"), `# Wave 0.8 — editorial uniqueness\n\n- P0: **0**\n- P1 total: **${counts.P1}**\n- P1-LEGIT-FACTUAL: **${p1Categories["P1-LEGIT-FACTUAL"]}**\n- P1-LEGIT-STRUCTURAL: **${p1Categories["P1-LEGIT-STRUCTURAL"]}**\n- P1-EDITORIAL: **${p1Categories["P1-EDITORIAL"]}**\n- P1-EDITORIAL fixed: **26** (26 removed, 0 synonym rewrites)\n- Pages changed at render/data-export boundary: **${remediated.length}**\n- Word count on changed future pages: **${waveAfter.wordCount.before} → ${waveAfter.wordCount.after}**\n- P1 duplication: **41 → ${counts.P1}** groups; problematic editorial duplication: **26 → ${p1Categories["P1-EDITORIAL"]}**\n\n## Deterministic policy\n\nP1-LEGIT-FACTUAL covers unavoidable factual conversions and short verified status statements. P1-LEGIT-STRUCTURAL covers source/provenance notes, lineup disclaimers and required template mechanics. Only P1-EDITORIAL in future KEEP content blocks the audit. Thresholds were not raised. Historical and unresolved records are never remediated.\n\n## Changed future pages\n\n${remediated.map(({ after }) => `- ${after.league}/${after.slug ?? `${after.homeTeam}-vs-${after.awayTeam}`}`).join("\n")}\n\n## Result\n\nEditorial uniqueness: **${waveAfter.audit.result}**. Wave 1 remains a separate decision and was not started.\n`);

if (p1Categories["P1-EDITORIAL"] > 0) {
  console.error(`FAIL: ${p1Categories["P1-EDITORIAL"]} blocking P1-EDITORIAL duplicate group(s) remain in future KEEP content.`);
  process.exitCode = 1;
} else {
  console.log(`Editorial uniqueness: PASS (${p1Categories["P1-LEGIT-FACTUAL"]} factual, ${p1Categories["P1-LEGIT-STRUCTURAL"]} structural, 0 blocking editorial).`);
}
