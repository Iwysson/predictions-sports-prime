// Leak check for the static export. Fails if a protected (VIP or BEST BET) analysis paragraph, pick
// or odds appears in out/ outside the context where the product allows it. Reads the protected index
// the functions use, so it follows the real editorial data. Run after `npm run build`.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { protectedPickLeaks } from "./lib/leak-context.mjs";

const index = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8"));
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p) : /\.(html|js|json|txt)$/.test(name) && files.push(p);
  }
})("out");
const corpus = files.map((f) => ({ f, text: readFileSync(f, "utf8") }));

const publicPicks = new Set(index.filter((e) => e.predictionAccess === "free").map((e) => e.prediction.main));
const leaks = [];
const notes = [];

for (const e of index) {
  // Protected analysis paragraphs must never appear in the static output.
  if (e.analysisAccess !== "free") {
    for (const paragraph of e.full.analysis) {
      for (const { f, text } of corpus) {
        if (text.includes(paragraph.slice(0, 60))) leaks.push({ kind: "analysis", slug: e.slug, file: f });
      }
    }
  }
  if (e.predictionAccess === "free" || e.prediction.odds === null) continue;

  const label = `${e.slug}: "${e.prediction.main}"`;
  // Same text as a public pick (for example "Over 5.5 goals"): a text rule would also flag the public
  // card, so it is reported as a note and verified by the public pages' own tests instead.
  if (publicPicks.has(e.prediction.main)) {
    notes.push(label);
    continue;
  }
  const oddsText = e.prediction.odds.toFixed(2);
  const exact = publicPicks.size > 0 && [...publicPicks].some((p) => p.includes(e.prediction.main));
  for (const { f, text } of corpus) {
    for (const leak of protectedPickLeaks(text, { pick: e.prediction.main, oddsText, exact }, label)) {
      leaks.push({ ...leak, file: f });
    }
  }
}

console.log(`protected entries: ${index.length}, files scanned: ${corpus.length}, leaks: ${leaks.length}`);
for (const n of notes) console.log(`NOTE protected pick text also used by a public pick (context-checked): ${n}`);
for (const l of leaks.slice(0, 20)) console.log(`LEAK ${l.kind} ${l.label ?? l.slug} in ${l.file}`);
process.exit(leaks.length ? 1 : 0);
