import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const locales = ["pt-br", "es", "it", "fr", "de", "nl", "tr"];
const strongResidues = [
  /\bMain Prediction\b/i, /\bPublished Odds?\b/i, /\bLatest Observed Odds?\b/i,
  /\bLeague Local Time\b/i, /\bKickoff Time Unavailable\b/i, /\bPrediction Result\b/i,
  /\bEditorial Comment\b/i, /\bYour Personal Comment\b/i, /\bWrite Your Comment\b/i,
  /\bAdd Note\b/i, /\bNo Personal Note\b/i, /\bSources (?:&|and) Data\b/i,
  /\bOur Methodology\b/i, /\bGame State\b/i, /\b(?:First|Second) Leg\b/i,
  /\b(?:Round|Week|Matchday)\s+\d+\b/i, /\bQuarter[ -]finals?\b/i,
  /\bSemi[ -]finals?\b/i, /\bAsian Handicap\b/i, /\bDraw No Bet\b/i,
  /\bDouble Chance\b/i, /\bBoth Teams to Score\b/i, /\bFirst to (?:Score|Concede)\b/i,
  /\bClean Sheets?\b/i, /\bFailed to Score\b/i, /\bShots on Target\b/i,
  /\bPrediction Available\b/i, /\bComing Soon\b/i, /\bView Prediction\b/i,
];
const tokenResidues = new Set([
  "analysis", "available", "away", "cancelled", "completed", "home", "kickoff",
  "lineups", "methodology", "postponed", "prediction", "published", "scheduled",
  "standings", "unavailable", "updated",
]);
const allowedTokens = { de: new Set(["live"]), nl: new Set(["live", "odds"]) };

function walk(directory) {
  if (!fs.existsSync(directory)) throw new Error(`Build output not found: ${directory}`);
  return fs.readdirSync(directory).flatMap((name) => {
    const item = path.join(directory, name);
    return fs.statSync(item).isDirectory() ? walk(item) : [item];
  });
}
function route(file) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  return `/${relative.replace(/index\.html$/, "").replace(/\.html$/, "/")}`;
}
function decode(text) {
  return text.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
}
function publicCopy(html) {
  const snippets = [];
  const markup = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ");
  const collect = (regex, source = markup, group = 1) => {
    for (const match of source.matchAll(regex)) snippets.push(match[group] ?? "");
  };
  collect(/<title[^>]*>([\s\S]*?)<\/title>/gi);
  collect(/<meta[^>]+(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]+content=["']([^"']*)["'][^>]*>/gi);
  collect(/<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]*>/gi);
  collect(/<(?:h[1-3]|button|a|label|small|p|li|th|td|span)\b[^>]*>([\s\S]*?)<\/(?:h[1-3]|button|a|label|small|p|li|th|td|span)>/gi);
  collect(/\b(?:aria-label|title|alt|placeholder)=["']([^"']+)["']/gi);
  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const strings = [];
      const visit = (value) => {
        if (typeof value === "string") {
          if (!/^https?:\/\//i.test(value)) strings.push(value);
        } else if (Array.isArray(value)) value.forEach(visit);
        else if (value && typeof value === "object") Object.values(value).forEach(visit);
      };
      visit(JSON.parse(match[1]));
      snippets.push(strings.join(" "));
    } catch {
      snippets.push(match[1]);
    }
  }
  return decode(snippets.join(" ").replace(/<[^>]+>/gi, " "))
    .replace(/\s+/g, " ").trim();
}
function findResidues(copy, locale) {
  const findings = [];
  for (const pattern of strongResidues) {
    const match = copy.match(pattern);
    if (match && !(locale === "nl" && /^Week\s+\d+$/i.test(match[0]))) findings.push(match[0]);
  }
  const allowed = allowedTokens[locale] ?? new Set();
  const counts = new Map();
  for (const token of copy.toLowerCase().match(/[a-z]+/g) ?? []) {
    if (tokenResidues.has(token) && !allowed.has(token)) counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  for (const [token, count] of counts) if (count >= 2) findings.push(`${token} (${count}x)`);
  return [...new Set(findings)];
}

const counts = Object.fromEntries(locales.map((locale) => [locale, { pages: 0, residues: [] }]));
for (const file of walk(root).filter((item) => item.endsWith(".html"))) {
  const pageRoute = route(file);
  const locale = locales.find((item) => pageRoute === `/${item}/` || pageRoute.startsWith(`/${item}/`));
  if (!locale) continue;
  const html = fs.readFileSync(file, "utf8");
  counts[locale].pages += 1;
  const findings = findResidues(publicCopy(html), locale);
  if (findings.length) counts[locale].residues.push({ route: pageRoute, findings });
}
console.log("Language contamination audit (visible copy, metadata, accessibility attributes and JSON-LD)");
for (const locale of locales) console.log(`${locale} pages: ${counts[locale].pages}; pages with English residue: ${counts[locale].residues.length}`);
const failures = Object.values(counts).flatMap((item) => item.residues);
for (const [locale, result] of Object.entries(counts)) {
  for (const failure of result.residues) console.error(`ERROR: ${locale}: ${failure.route}: ${failure.findings.join(", ")}`);
}
if (failures.length) process.exitCode = 1;
else console.log("Language contamination audit: PASS");
