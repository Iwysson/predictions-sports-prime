// Read-only classification of exported match pages (out/match/*) by objective low-value signals.
// Uses the existing exported HTML; never builds. Usage: node scripts/audit-historical-quality.mjs [--list]
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("out/match");
const residue = [
  ["conflict-detector", /Conflict Detector/i],
  ["counter-signals", /Risks and Counter-Signals|counter-signal/i],
  ["source-set", /\bsource set\b/i],
  ["process-language", /editorial validation|structured snapshot|the model sees|our model|as shown above|mechanically|published selection/i],
  ["placeholder", /lorem ipsum|placeholder text|\bTODO\b|add analysis/i],
];
const rows = [];
for (const slug of fs.readdirSync(dir)) {
  const f = path.join(dir, slug, "index.html");
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, "utf8");
  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
  const main = (html.match(/<main[\s\S]*<\/main>/) || [html])[0].replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ");
  const text = main.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").length;
  const paras = [...main.matchAll(/<p[ >][\s\S]*?<\/p>/g)].map((m) => m[0].replace(/<[^>]+>/g, " ").trim()).filter((p) => p.split(/\s+/).length >= 25).length;
  const flags = residue.filter(([, re]) => re.test(text)).map(([n]) => n);
  const hasCore = /Statistical Core/i.test(text);
  const final = /Final score|Full time|\bFT\b|Result:/i.test(text);
  rows.push({ slug, indexable: !/noindex/.test(robots), words, paras, flags, hasCore, final });
}
const idx = rows.filter((r) => r.indexable), non = rows.filter((r) => !r.indexable);
const thin = (r) => r.words < 450 || r.paras < 3;
const summary = (label, a) => console.log(`${label}: ${a.length} | thin(<450w or <3 long paras): ${a.filter(thin).length} | residue: ${a.filter((r) => r.flags.length).length} | median words ${a.map((r) => r.words).sort((x, y) => x - y)[a.length >> 1]}`);
console.log(`Match pages exported: ${rows.length}`);
summary("Indexable", idx);
summary("Noindex (existing gate)", non);
const weakIdx = idx.filter((r) => thin(r) || r.flags.length);
console.log(`Indexable pages with a strong low-value signal: ${weakIdx.length}`);
const byFlag = {};
for (const r of idx) for (const f of r.flags) byFlag[f] = (byFlag[f] || 0) + 1;
console.log("Indexable residue by flag:", JSON.stringify(byFlag));
if (process.argv.includes("--list")) weakIdx.forEach((r) => console.log(r.slug, r.words, r.paras, r.flags.join(",")));
// Depth tiers among indexable pages carrying process residue.
const resid = idx.filter((r) => r.flags.length);
const tier = (r) => (r.words < 700 ? "<700w" : r.words < 1000 ? "700-999w" : ">=1000w");
const t = {};
for (const r of resid) t[tier(r)] = (t[tier(r)] || 0) + 1;
console.log("Indexable-with-residue by depth:", JSON.stringify(t), "| without Statistical Core:", resid.filter((r) => !r.hasCore).length);
const risky = resid.filter((r) => r.words < 700 || !r.hasCore);
console.log(`Residue + shallow (<700w or no Core): ${risky.length}`);
if (process.argv.includes("--list-risky")) risky.forEach((r) => console.log(r.slug, r.words, r.flags.join(",")));
