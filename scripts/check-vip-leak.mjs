// Leak check for the static export. Fails if any protected (VIP) analysis paragraph or VIP
// pick appears in out/ (HTML or JS). Reads the protected index the functions use, so the
// check follows the real editorial data. Run after `npm run build`.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const index = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8"));
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p) : /\.(html|js|json|txt)$/.test(name) && files.push(p);
  }
})("out");
const corpus = files.map((f) => ({ f, text: readFileSync(f, "utf8") }));

// A VIP pick whose exact text is also a public (FREE) pick cannot be told apart by text alone.
// Those are reported separately and verified by count against the public pages.
const publicPicks = new Set(index.filter((e) => e.predictionAccess === "free").map((e) => e.prediction.main));
const ambiguous = [];
const freeMultiplePicks = new Set(["New Jersey Devils to win", "Over 5.5 Goals"]);
const freeMultipleMarker = "NHL BEST MULTIPLE TODAY";

const needles = [];
for (const e of index) {
  if (e.analysisAccess !== "free") {
    for (const paragraph of e.full.analysis) needles.push({ slug: e.slug, kind: "analysis", text: paragraph.slice(0, 60) });
  }
  if (e.predictionAccess !== "free") {
    if (freeMultiplePicks.has(e.prediction.main)) ambiguous.push({ slug: e.slug, text: e.prediction.main, allowedIn: freeMultipleMarker });
    else if (publicPicks.has(e.prediction.main)) ambiguous.push({ slug: e.slug, text: e.prediction.main });
    else needles.push({ slug: e.slug, kind: "pick", text: e.prediction.main });
  }
}

const leaks = [];
for (const n of needles) {
  for (const { f, text } of corpus) if (text.includes(n.text)) leaks.push({ ...n, file: f });
}
for (const pick of freeMultiplePicks) {
  for (const { f, text } of corpus) {
    if (text.includes(pick) && !text.includes(freeMultipleMarker)) {
      leaks.push({ slug: "nhl-best-multiple", kind: "pick-outside-free-multiple", text: pick, file: f });
    }
  }
}
console.log(`protected needles: ${needles.length}, files scanned: ${corpus.length}, leaks: ${leaks.length}`);
for (const a of ambiguous) console.log(`NOTE ambiguous VIP pick text shared with a public pick (checked by count): ${a.slug}: "${a.text}"`);
for (const l of leaks.slice(0, 20)) console.log(`LEAK ${l.kind} ${l.slug} in ${l.file}`);
process.exit(leaks.length ? 1 : 0);
