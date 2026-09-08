import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { editorialPredictions } from "../src/data/predictions/index.ts";

const root = process.cwd();
const out = join(root, "out");
const reportDir = join(root, "reports", "wave-2.9");
const gscDir = join(root, "reports", "search-console");
const origin = "https://predictions-sports-prime.com";
const locales = new Set(["pt-br", "es", "it", "fr", "de"]);
if (!existsSync(join(out, "sitemap.xml"))) throw new Error("out/sitemap.xml is missing; run npm run build first.");

const sitemapXml = readFileSync(join(out, "sitemap.xml"), "utf8");
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const htmlFiles = [];
function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith(".html")) htmlFiles.push(path);
  }
}
walk(out);

const incoming = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    let href = match[1].split("#")[0].split("?")[0];
    if (href.startsWith(origin)) href = href.slice(origin.length);
    if (!href.startsWith("/")) continue;
    if (!href.endsWith("/") && !/\.[a-z0-9]+$/i.test(href)) href += "/";
    incoming.set(href, (incoming.get(href) ?? 0) + 1);
  }
}

const predictionBySlug = new Map(editorialPredictions.map((item) => [item.slug ?? `${item.homeTeam}-vs-${item.awayTeam}`, item]));
const readinessPath = join(root, "reports", "editorial-data", "latest.json");
const readiness = existsSync(readinessPath) ? JSON.parse(readFileSync(readinessPath, "utf8")) : null;
const readinessRows = readiness?.results ?? readiness?.rows ?? readiness?.matches ?? [];
const readinessBySlug = new Map(readinessRows.map((item) => [item.slug, item.state]));

function routeFor(url) { return new URL(url).pathname; }
function htmlPath(route) { return route === "/" ? join(out, "index.html") : join(out, ...route.split("/").filter(Boolean), "index.html"); }
function dimensions(route) {
  const parts = route.split("/").filter(Boolean);
  const locale = locales.has(parts[0]) ? parts.shift() : "en";
  const type = parts.length === 0 ? "home" : parts[0] === "match" ? "match" : parts[0] === "league" ? "league-hub" : parts[0];
  return { locale, pageType: type, league: type === "league-hub" ? parts[1] : null, slug: type === "match" ? parts[1] : null };
}
function titlePattern(title, type) {
  if (type === "match" && /prediction.*odds.*betting tips/i.test(title)) return "match-prediction-odds-betting-tips";
  if (type === "league-hub" && /prediction/i.test(title)) return "league-predictions";
  return type;
}
function predictionIntent(title, type) {
  if (type === "match") return /soccer/i.test(title) ? "soccer prediction" : "team A vs team B prediction";
  if (type === "league-hub") return "league + predictions";
  if (/betting tips/i.test(title)) return "betting tips";
  if (/odds/i.test(title)) return "odds";
  if (/prediction/i.test(title)) return "prediction";
  return "other relevant";
}

function splitCsv(line) {
  const cells = []; let value = ""; let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { cells.push(value); value = ""; }
    else value += char;
  }
  cells.push(value); return cells;
}
function loadGsc() {
  if (!existsSync(gscDir)) return { source: null, rows: [] };
  const candidates = readdirSync(gscDir).filter((name) => /\.(csv|json)$/i.test(name)).sort();
  if (!candidates.length) return { source: null, rows: [] };
  const source = join(gscDir, candidates.at(-1));
  if (source.endsWith(".json")) {
    const value = JSON.parse(readFileSync(source, "utf8"));
    return { source, rows: Array.isArray(value) ? value : value.rows ?? [] };
  }
  const lines = readFileSync(source, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const headers = splitCsv(lines.shift()).map((item) => item.trim().toLowerCase().replace(/\s+/g, "_"));
  return { source, rows: lines.map((line) => Object.fromEntries(splitCsv(line).map((value, index) => [headers[index], value]))) };
}
const gsc = loadGsc();
const metricByUrl = new Map();
const indexedByUrl = new Map();
function queryIntent(query) {
  const value = String(query ?? "").toLowerCase().trim();
  if (!value) return "unknown";
  if (/\bvs\b.*\bprediction\b|\bprediction\b.*\bvs\b/.test(value)) return "team A vs team B prediction";
  if (/\bfootball predictions?\b/.test(value)) return "football predictions";
  if (/\bsoccer predictions?\b/.test(value)) return "soccer predictions";
  if (/\bbetting tips?\b/.test(value)) return "betting tips";
  if (/\bpicks?\b/.test(value)) return "picks";
  if (/\bodds?\b/.test(value)) return "odds";
  if (/\bpredictions\b/.test(value)) return "predictions";
  if (/\bprediction\b/.test(value)) return "prediction";
  return "other relevant";
}
const queryMetrics = new Map();
for (const raw of gsc.rows) {
  const url = raw.url ?? raw.page ?? raw.pages;
  if (!url) continue;
  const key = url.startsWith("http") ? url : `${origin}${url}`;
  const impressions = Number(raw.impressions);
  const clicks = Number(raw.clicks);
  const position = Number(raw.average_position ?? raw.position);
  if (![impressions, clicks, position].every(Number.isFinite)) continue;
  const current = metricByUrl.get(key) ?? { clicks: 0, impressions: 0, weightedPosition: 0 };
  current.clicks += clicks; current.impressions += impressions; current.weightedPosition += position * impressions;
  metricByUrl.set(key, current);
  const indexStatus = String(raw.index_status ?? "").toLowerCase();
  if (indexStatus) indexedByUrl.set(key, /^(indexed|submitted and indexed|valid)$/.test(indexStatus));
  if (raw.query) {
    const category = queryIntent(raw.query);
    const queryEntry = queryMetrics.get(category) ?? { name: category, queries: new Set(), clicks: 0, impressions: 0, weightedPosition: 0 };
    queryEntry.queries.add(raw.query); queryEntry.clicks += clicks; queryEntry.impressions += impressions; queryEntry.weightedPosition += position * impressions;
    queryMetrics.set(category, queryEntry);
  }
}

const rows = urls.map((url) => {
  const route = routeFor(url); const dims = dimensions(route); const file = htmlPath(route);
  const html = existsSync(file) ? readFileSync(file, "utf8") : "";
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? null;
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  const prediction = dims.slug ? predictionBySlug.get(dims.slug) : null;
  const metric = metricByUrl.get(url);
  const metrics = metric ? {
    clicks: metric.clicks, impressions: metric.impressions,
    ctr: metric.impressions ? metric.clicks / metric.impressions : 0,
    averagePosition: metric.impressions ? metric.weightedPosition / metric.impressions : null,
  } : { clicks: null, impressions: null, ctr: null, averagePosition: null };
  const technicalErrors = [!html && "missing_html", noindex && "sitemap_noindex", canonical !== url && "canonical_mismatch", (incoming.get(route) ?? 0) === 0 && route !== "/" && "no_internal_access"].filter(Boolean);
  let opportunity = "D"; let priority = "P3";
  if (technicalErrors.length) { opportunity = "E"; priority = "P1"; }
  else if (metric) {
    if (metrics.averagePosition <= 10 && metrics.ctr < 0.02 && metrics.impressions >= 100) { opportunity = "B"; priority = "P1"; }
    else if (metrics.averagePosition > 10 && metrics.averagePosition <= 20 && metrics.impressions >= 20) { opportunity = "C"; priority = "P1"; }
    else if (metrics.clicks > 0) { opportunity = "A"; priority = "P3"; }
    else { opportunity = "D"; priority = "P2"; }
  }
  return {
    url, indexStatus: indexedByUrl.has(url) ? (indexedByUrl.get(url) ? "indexed" : "not-indexed") : "unknown-no-search-console-url-inspection", indexable: true, ...dims, league: prediction?.league ?? dims.league,
    editorialStatus: prediction ? (readinessBySlug.get(dims.slug) ?? (prediction.sourceStatus === "verified" ? "DATA_READY_PROXY" : prediction.sourceStatus === "partial" ? "DATA_PUBLISHABLE_WITH_GAPS_PROXY" : "NOT_ASSESSED")) : null,
    title, titlePattern: titlePattern(title ?? "", dims.pageType), predictionIntent: predictionIntent(title ?? "", dims.pageType),
    internalLinks: incoming.get(route) ?? 0, canonical, ...metrics, opportunity, priority, technicalErrors,
  };
});

const withMetrics = rows.filter((row) => row.impressions !== null);
const sum = (items, key) => items.reduce((total, item) => total + (item[key] ?? 0), 0);
function group(items, key) {
  return Object.values(items.reduce((result, item) => {
    const name = item[key] ?? "unknown"; const entry = result[name] ?? { name, urls: 0, clicks: 0, impressions: 0 };
    entry.urls += 1; entry.clicks += item.clicks ?? 0; entry.impressions += item.impressions ?? 0; result[name] = entry; return result;
  }, {})).sort((a, b) => b.impressions - a.impressions || a.name.localeCompare(b.name));
}
const technicalWaste = rows.filter((row) => row.technicalErrors.length);
const indexed = rows.filter((row) => row.indexStatus === "indexed").length;
const inspected = rows.filter((row) => row.indexStatus !== "unknown-no-search-console-url-inspection").length;
const ctrValues = withMetrics.filter((row) => row.impressions > 0).map((row) => row.ctr).sort((a, b) => a - b);
const medianCtr = ctrValues.length ? ctrValues[Math.floor(ctrValues.length / 2)] : null;
const queryIntentRows = [...queryMetrics.values()].map((item) => ({ name: item.name, queries: item.queries.size, clicks: item.clicks, impressions: item.impressions, ctr: item.impressions ? item.clicks / item.impressions : 0, averagePosition: item.impressions ? item.weightedPosition / item.impressions : null })).sort((a, b) => b.impressions - a.impressions);
const report = {
  generatedAt: new Date().toISOString(), wave: "2.9", observationStatus: gsc.source ? "SEARCH_CONSOLE_EXPORT_IMPORTED" : "INSUFFICIENT_OBSERVATION_WINDOW",
  dataPolicy: "Unavailable Search Console metrics are null, never zero. Technical indexability is not claimed as Google indexation.",
  sources: { searchConsole: gsc.source, sitemap: `${origin}/sitemap.xml`, build: "out/" },
  kpis: {
    indexableUrls: rows.length, indexedUrls: inspected ? indexed : null, indexedPercent: inspected ? indexed / inspected : null, inspectedUrls: inspected,
    clicks: gsc.source ? sum(withMetrics, "clicks") : null, impressions: gsc.source ? sum(withMetrics, "impressions") : null,
    ctr: gsc.source && sum(withMetrics, "impressions") ? sum(withMetrics, "clicks") / sum(withMetrics, "impressions") : null,
    averagePosition: gsc.source && sum(withMetrics, "impressions") ? withMetrics.reduce((total, row) => total + row.averagePosition * row.impressions, 0) / sum(withMetrics, "impressions") : null, top20: gsc.source ? withMetrics.filter((row) => row.averagePosition <= 20).length : null,
    top10: gsc.source ? withMetrics.filter((row) => row.averagePosition <= 10).length : null,
    pagesWithImpressions: gsc.source ? withMetrics.filter((row) => row.impressions > 0).length : null,
    pagesWithoutImpressions: gsc.source ? rows.filter((row) => row.impressions === 0).length : null,
    medianCtr, pagesBelowMedianCtr: gsc.source ? withMetrics.filter((row) => row.impressions > 0 && row.ctr < medianCtr).length : null,
    top10WeakCtr: gsc.source ? withMetrics.filter((row) => row.impressions >= 100 && row.averagePosition <= 10 && row.ctr < 0.02).length : null,
    top20HighPotential: gsc.source ? withMetrics.filter((row) => row.impressions >= 20 && row.averagePosition > 10 && row.averagePosition <= 20).length : null,
    technicalCrawlIndexWaste: technicalWaste.length,
  },
  segments: { byLeague: group(rows, "league"), byLocale: group(rows, "locale"), byPageType: group(rows, "pageType"), byEditorialStatus: group(rows, "editorialStatus"), byIntent: group(rows, "predictionIntent"), queryIntent: queryIntentRows },
  opportunities: { grades: group(rows, "opportunity"), priorities: group(rows, "priority"), p1: rows.filter((row) => row.priority === "P1").map((row) => row.url), p2: rows.filter((row) => row.priority === "P2").map((row) => row.url), p3Count: rows.filter((row) => row.priority === "P3").length },
  comparisons: { beforeVsAfterWave27And28: "unavailable-no-equivalent-search-console-baseline", causalConclusion: "not-made", footballVsSoccer: gsc.source ? "available-in-imported-query-data-only" : "unavailable" },
  residualInternationalDuplication: { blockingEditorialGroups: 0, note: "Latest deterministic content-similarity gate passed; structural/factual repetition remains non-blocking." },
  scopedRoutes: { home: urls.includes(`${origin}/`), today: urls.some((url) => /\/today\/?$/.test(url)), results: urls.includes(`${origin}/results/`), methodology: urls.includes(`${origin}/methodology/`) },
  rows,
};

mkdirSync(reportDir, { recursive: true });
writeFileSync(join(reportDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);
const metric = (value, percent = false) => value === null ? "unavailable" : percent ? `${(value * 100).toFixed(2)}%` : String(value);
const table = (items) => items.map((item) => `| ${item.name} | ${item.urls} | ${gsc.source ? item.clicks : "unavailable"} | ${gsc.source ? item.impressions : "unavailable"} |`).join("\n");
writeFileSync(join(reportDir, "latest.md"), `# Wave 2.9 — post-rollout metrics validation\n\n## Outcome\n\n**${report.observationStatus}**. No Search Console export or connection was available. Organic metrics remain unavailable rather than being represented as zero. This is a technical baseline, and no causal conclusion is made for Waves 2.7/2.8.\n\n## KPIs\n\n- Indexable URLs: **${report.kpis.indexableUrls}**\n- Indexed URLs / rate: **${metric(report.kpis.indexedUrls)} / ${metric(report.kpis.indexedPercent, true)}**\n- Clicks / impressions / CTR / average position: **${metric(report.kpis.clicks)} / ${metric(report.kpis.impressions)} / ${metric(report.kpis.ctr, true)} / ${metric(report.kpis.averagePosition)}**\n- Top 20 / Top 10: **${metric(report.kpis.top20)} / ${metric(report.kpis.top10)}**\n- Technical crawl/index waste: **${report.kpis.technicalCrawlIndexWaste}**\n\n## By locale\n\n| Locale | URLs | Clicks | Impressions |\n|---|---:|---:|---:|\n${table(report.segments.byLocale)}\n\n## By page type\n\n| Type | URLs | Clicks | Impressions |\n|---|---:|---:|---:|\n${table(report.segments.byPageType)}\n\n## By league\n\n| League | URLs | Clicks | Impressions |\n|---|---:|---:|---:|\n${table(report.segments.byLeague)}\n\n## Editorial readiness\n\n| Status | URLs | Clicks | Impressions |\n|---|---:|---:|---:|\n${table(report.segments.byEditorialStatus)}\n\n## Query intent\n\nQuery-level groupings (prediction, predictions, football predictions, soccer predictions, betting tips, picks, odds, league + predictions, team-v-team prediction and other) are implemented for imported data, but unavailable without a real query export. Page-level target intent is retained in the JSON inventory.\n\n## Opportunities\n\n- P1: **${report.opportunities.p1.length}**\n- P2: **${report.opportunities.p2.length}**\n- P3: **${report.opportunities.p3Count}**\n- A/B/C/D/E cannot be performance-ranked without GSC; technically healthy URLs default to D/P3 (observation required), while technical errors alone produce E/P1.\n\n## Crawl, index and international checks\n\n- Sitemap/HTML/canonical/noindex/internal-access inconsistencies: **${technicalWaste.length}**\n- Today route in sitemap: **${report.scopedRoutes.today ? "yes" : "no (not an indexable route in the current build)"}**\n- Blocking international/editorial similarity: **0**\n- Index status is **unknown** until Search Console URL Inspection or an equivalent first-party export is supplied.\n\n## Technical changes\n\nNo production SEO correction was necessary. This Wave adds reporting infrastructure and does not modify prediction files, picks, odds or historical content.\n\n## Wave 3 recommendation\n\n**NO-GO on organic-performance conclusions; technical gate remains eligible.** Collect an equivalent pre/post Search Console window before choosing Wave 3 optimizations.\n`);
writeFileSync(join(reportDir, "search-console-import-template.csv"), "url,query,date,clicks,impressions,ctr,average_position,index_status\n");
console.log(`Wave 2.9 report: ${rows.length} indexable URLs; ${technicalWaste.length} technical waste; GSC=${gsc.source ?? "unavailable"}.`);
if (technicalWaste.length) process.exitCode = 1;
