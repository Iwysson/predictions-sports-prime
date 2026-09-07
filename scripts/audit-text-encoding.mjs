import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { getAdSenseContentQualityDecision } from "../src/lib/adsense-content-quality.ts";

const root = process.cwd();
const encodingPattern = /(?:Ã[^\s]|Â[^\s]|â€|â€™|â€œ|â€|Ã¢|Ãƒ|Ã‚|Å[^\s]|Ä[^\s]|�)/g;
const notePattern = /\b(?:WAIT LIVE|LIVE ENTRY|TODO|FIXME|TBD|PLACEHOLDER|internal note|editorial note|do not publish)\b/gi;
const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".html", ".xml"]);
const excluded = new Set(["node_modules", ".next", ".git"]);

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (excluded.has(entry.name)) return [];
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(item) : extensions.has(path.extname(entry.name)) ? [item] : [];
  });
}

function category(file) {
  const normalized = file.split(path.sep).join("/");
  if (normalized.includes("/out/")) return "generated-output";
  if (normalized.includes("fixtures.snapshot")) return "fixtures";
  if (normalized.includes("localized-editorial") || normalized.includes("seo-locales") || normalized.includes("/components/Localized")) return "localization-dictionary";
  if (normalized.includes("/data/predictions/")) return "editorial";
  if (normalized.includes("/app/") || normalized.includes("/lib/seo")) return "metadata";
  return "source-data";
}

const occurrences = [];
for (const file of [...walk(path.join(root, "src")), ...walk(path.join(root, "out"))]) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    const matches = [...line.matchAll(encodingPattern)];
    if (!matches.length) return;
    occurrences.push({ file: relative, line: index + 1, category: category(file), count: matches.length, sample: line.trim().slice(0, 180) });
  });
}

const decisions = new Map(editorialPredictions.map((prediction) => [
  prediction.slug,
  getAdSenseContentQualityDecision(prediction),
]));
const internalNotes = [];
for (const file of walk(path.join(root, "src", "data", "predictions"))) {
  if (path.basename(file) === "index.ts") continue;
  const source = fs.readFileSync(file, "utf8");
  const slug = source.match(/\bslug:\s*["']([^"']+)/)?.[1] ?? path.basename(file, ".ts");
  const publishedAt = source.match(/\bpublishedAt:\s*["']([^"']+)/)?.[1];
  const historical = publishedAt ? Date.parse(publishedAt) < Date.now() : true;
  source.split(/\r?\n/).forEach((line, index) => {
    for (const match of line.matchAll(notePattern)) {
      const token = match[0];
      const disclosure = /no placeholder|nenhum zero (?:é|is) (?:um )?placeholder/i.test(line);
      const legitimateMarketInstruction = /WAIT LIVE|LIVE ENTRY/i.test(token);
      internalNotes.push({
        slug,
        file: path.relative(root, file).split(path.sep).join("/"),
        line: index + 1,
        field: /^\s*(?:seoTitle|title):/.test(line) ? "metadata" : line.includes("main:") || line.includes("market:") ? "pick" : "analysis",
        value: token,
        indexability: decisions.get(slug)?.indexable ? "indexable" : "noindex-or-unpublished",
        resolution: disclosure ? "editorial-disclosure-not-internal-note" : legitimateMarketInstruction && historical ? "historical-data-warning-preserved" : "review-required",
        sample: line.trim().slice(0, 220),
      });
    }
  });
}

const diff = spawnSync("git", ["diff", "--unified=0", "--", "src"], { cwd: root, encoding: "utf8" });
const newMojibake = (diff.stdout ?? "").split(/\r?\n/)
  .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
  .filter((line) => encodingPattern.test(line));
const unresolvedNotes = internalNotes.filter((item) => item.resolution === "review-required");
const countsByCategory = Object.fromEntries([...new Set(occurrences.map((item) => item.category))].sort().map((name) => [
  name,
  occurrences.filter((item) => item.category === name).reduce((sum, item) => sum + item.count, 0),
]));
const report = {
  schemaVersion: 1,
  policy: "Existing occurrences are catalogued. Added tracked source lines containing mojibake are blocking.",
  countsByCategory,
  occurrenceLines: occurrences.length,
  newMojibake,
  internalNotes,
  unresolvedInternalNotes: unresolvedNotes.length,
};
const reportDirectory = path.join(root, "reports", "seo-baseline");
fs.mkdirSync(reportDirectory, { recursive: true });
fs.writeFileSync(path.join(reportDirectory, "text-encoding.json"), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(reportDirectory, "internal-notes.json"), `${JSON.stringify({ schemaVersion: 1, cases: internalNotes }, null, 2)}\n`);
console.log(`Text encoding: ${occurrences.length} affected lines; ${newMojibake.length} new tracked lines.`);
console.log(`Internal-note candidates: ${internalNotes.length}; ${unresolvedNotes.length} unresolved.`);
if (newMojibake.length || unresolvedNotes.length) process.exit(1);
console.log("Text encoding audit: PASS");
