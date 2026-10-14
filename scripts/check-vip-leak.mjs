// Leak check for the static export. Fails if a protected (VIP or BEST BET) analysis paragraph, pick
// or odds appears in out/ outside the context where the product allows it. Reads the protected index
// the functions use, so it follows the real editorial data. Run after `npm run build`.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { maskSettledResultRecords, protectedPickLeaks } from "./lib/leak-context.mjs";

const index = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8"));
// Settled, officially FINAL results are the only records whose original pick/odds may be public.
const settledResults = JSON.parse(readFileSync("src/data/football-results.snapshot.json", "utf8")).records;
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p) : /\.(html|js|json|txt)$/.test(name) && files.push(p);
  }
})("out");
const corpus = files.map((f) => ({ f, text: readFileSync(f, "utf8") }));
// Analysis paragraphs are checked on the raw text; pick/odds rules run on text without settled result records.
const pickCorpus = corpus.map(({ f, text }) => ({ f, text: maskSettledResultRecords(text, settledResults) }));

const publicPicks = new Set(index.filter((e) => e.predictionAccess === "free").map((e) => e.prediction.main.toLowerCase()));
// NHL public-slate modules are deliberately client-safe and contain picks only for FREE entries.
// Include those public picks so a generic market shared with a protected game is not misreported.
for (const name of readdirSync("src/data/nhl").filter((name) => /^public-slate-.*\.ts$|^slate-2026-10-(?:14|15)\.ts$/.test(name))) {
  const source = readFileSync(join("src/data/nhl", name), "utf8");
  for (const match of source.matchAll(/"pick"\s*:\s*"([^"]+)"/g)) publicPicks.add(match[1].toLowerCase());
}
const leaks = [];
const notes = [];

const publicSections = JSON.parse(readFileSync("src/lib/public-context-sections.json", "utf8")).allowedHeadingPrefixes;
// Paragraphs (80+ characters, not table rows) that belong to a section outside the public-context allowlist.
function protectedParagraphs(markdown) {
  const out = [];
  let allowed = false;
  let buffer = [];
  const flush = () => {
    if (!allowed) {
      for (const block of buffer.join("\n").split(/\n\s*\n/)) {
        const paragraph = block.trim();
        if (paragraph.length >= 80 && !paragraph.startsWith("|") && !paragraph.startsWith("<!--")) out.push(paragraph);
      }
    }
    buffer = [];
  };
  for (const line of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const heading = line.match(/^#{1,6}\s+(.+?)\s*$/);
    if (heading) {
      flush();
      allowed = publicSections.some((prefix) => heading[1].replace(/\*\*/g, "").trim().toLowerCase().startsWith(prefix));
      continue;
    }
    buffer.push(line);
  }
  flush();
  return out;
}

// Paragraphs that a FREE analysis publishes anyway (shared editorial wording): identical text on a protected page
// cannot be told apart from the public copy, so it is not reported as a leak of the protected page.
const freeParagraphKeys = new Set(
  index
    .filter((entry) => entry.analysisAccess === "free")
    .flatMap((entry) => entry.full.analysis.join("\n\n").split("\n").filter((line) => !/^#{1,6}\s/.test(line)).join("\n").split(/\n\s*\n/).map((block) => block.trim().slice(0, 200))),
);

for (const e of index) {
  // Protected analysis paragraphs must never appear in the static output.
  if (e.analysisAccess !== "free") {
    for (const paragraph of e.full.analysis) {
      for (const { f, text } of corpus) {
        if (text.includes(paragraph.slice(0, 60))) leaks.push({ kind: "analysis", slug: e.slug, file: f });
      }
    }
  }
  // The analysis of a markdown page is one array element, so the check above only covers its opening line.
  // Check every paragraph (first 200 characters, so the public trend/teaser lines cut from an analysis do not match) of the sections NOT on the public-context allowlist
  // (src/lib/public-context-sections.json), so premium prose cannot reach the static output piecemeal.
  if (e.analysisAccess !== "free") {
    for (const paragraph of protectedParagraphs(e.full.analysis.join("\n\n"))) {
      if (freeParagraphKeys.has(paragraph.slice(0, 200))) continue;
      for (const { f, text } of corpus) {
        if (text.includes(paragraph.slice(0, 200).replace(/'/g, "&#x27;")) || text.includes(paragraph.slice(0, 200))) {
          leaks.push({ kind: "analysis-paragraph", slug: e.slug, file: f });
        }
      }
    }
  }
  if (e.predictionAccess === "free" || e.prediction.odds === null) continue;

  const label = `${e.slug}: "${e.prediction.main}"`;
  // Same text as a public pick (for example "Over 5.5 goals"): a text rule would also flag the public
  // card, so it is reported as a note and verified by the public pages' own tests instead.
  if (publicPicks.has(e.prediction.main.toLowerCase())) {
    notes.push(label);
    continue;
  }
  const oddsText = e.prediction.odds.toFixed(2);
  for (const { f, text } of pickCorpus) {
    for (const leak of protectedPickLeaks(text, { pick: e.prediction.main, oddsText }, label)) {
      leaks.push({ ...leak, file: f });
    }
  }
}

console.log(`protected entries: ${index.length}, files scanned: ${corpus.length}, leaks: ${leaks.length}`);
for (const n of notes) console.log(`NOTE protected pick text also used by a public pick (context-checked): ${n}`);
for (const l of leaks.slice(0, 20)) console.log(`LEAK ${l.kind} ${l.label ?? l.slug} in ${l.file}`);
process.exit(leaks.length ? 1 : 0);
