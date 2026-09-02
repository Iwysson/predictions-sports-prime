import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const host = "https://predictions-sports-prime.com";
const errors = [], warnings = [];
function walk(dir) { return readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; }); }
const htmlFiles = walk(out).filter((file) => file.endsWith("index.html"));
const allPages = htmlFiles.map((file) => {
  const html = readFileSync(file, "utf8");
  const rel = relative(out, file).split(sep).join("/").replace(/index\.html$/, "");
  const path = `/${rel}`.replace(/\/+/g, "/");
  return { file, html, path };
});
const noindexPages = allPages.filter((page) => /<meta name="robots" content="[^"]*noindex/i.test(page.html) || page.path === "/404/" || page.path === "/_not-found/");
const pages = allPages.filter((page) => !noindexPages.includes(page));
const navigablePaths = new Set(
  allPages
    .filter((page) => page.path !== "/404/" && page.path !== "/_not-found/")
    .map((page) => page.path)
);
const canonicals = new Map(), titles = new Map(), descriptions = new Map();
let jsonLdCount = 0;
for (const page of pages) {
  const title = page.html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
  const description = page.html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  const canonical = page.html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const h1 = [...page.html.matchAll(/<h1(?:\s[^>]*)?>/g)].length;
  if (!title) errors.push(`${page.path}: missing title`); else titles.set(title, [...(titles.get(title) ?? []), page.path]);
  if (!description) errors.push(`${page.path}: missing description`); else descriptions.set(description, [...(descriptions.get(description) ?? []), page.path]);
  if (!canonical || !canonical.startsWith(`${host}/`)) errors.push(`${page.path}: invalid canonical (${canonical ?? "missing"})`);
  else { if (canonicals.has(canonical)) errors.push(`${page.path}: duplicate canonical with ${canonicals.get(canonical)}`); canonicals.set(canonical, page.path); }
  if (h1 !== 1) errors.push(`${page.path}: expected one H1, found ${h1}`);
  for (const match of page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); jsonLdCount += 1; } catch { errors.push(`${page.path}: invalid JSON-LD`); }
  }
  for (const match of page.html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = match[1].split(/[?#]/)[0];
    if (!href || href.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(href)) continue;
    const normalized = href === "/" ? "/" : `${href.replace(/\/$/, "")}/`;
    if (!navigablePaths.has(normalized)) errors.push(`${page.path}: broken internal link ${href}`);
  }
}
for (const [title, owners] of titles) if (owners.length > 1) errors.push(`duplicate title: ${title}`);
const robots = readFileSync(join(out, "robots.txt"), "utf8");
if (!/User-Agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots) || !robots.includes(`${host}/sitemap.xml`)) errors.push("robots.txt is incomplete or uses the wrong host");
const sitemap = readFileSync(join(out, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("sitemap contains duplicate URLs");
for (const url of sitemapUrls) if (!url.startsWith(`${host}/`)) errors.push(`sitemap host mismatch: ${url}`);
const indexableCanonicals = new Set(canonicals.keys());
for (const url of indexableCanonicals) if (!sitemapUrls.includes(url)) errors.push(`INDEXABLE_NOT_IN_SITEMAP: ${url}`);
for (const url of sitemapUrls) if (!indexableCanonicals.has(url)) errors.push(`SITEMAP_NOT_INDEXABLE: ${url}`);
if (statSync(join(out, "sitemap-test.xml"), { throwIfNoEntry: false })) warnings.push("temporary sitemap-test.xml is present in static output");
const home = pages.find((page) => page.path === "/");
const homeMarkup = home?.html.replace(/<script[\s\S]*?<\/script>/gi, "") ?? "";
if (!homeMarkup.includes("Top Prediction Leagues")) errors.push("Home upper league taxonomy is missing Top Prediction Leagues");
if (!homeMarkup.includes("Prediction Categories")) errors.push("Home lower competition taxonomy is missing Prediction Categories");
if ((homeMarkup.match(/Top Prediction Leagues/g) ?? []).length !== 1) errors.push("Home repeats Top Prediction Leagues outside the upper sidebar");
if ((homeMarkup.match(/Prediction Categories/g) ?? []).length !== 1) errors.push("Home must render Prediction Categories exactly once");
const leagueSeoPilots = ["premier-league", "la-liga", "bundesliga", "serie-a", "liga-portugal", "ligue-1", "eredivisie", "brasileirao-serie-a", "copa-do-brasil", "efl-cup", "championship", "super-lig", "scottish-premiership", "eliteserien"];
const leagueMetrics = [];
for (const slug of leagueSeoPilots) {
  const path = `/league/${slug}/`;
  const page = pages.find((candidate) => candidate.path === path);
  if (!page) {
    errors.push(`${path}: League SEO pilot page missing`);
    continue;
  }
  const markup = page.html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const matchLinks = [...markup.matchAll(/href="(\/match\/[^"?#]+\/?)"/g)].map((match) => match[1]);
  const uniqueMatchLinks = new Set(matchLinks);
  const hasResults = /Recent [^<]+ Results/.test(markup);
  const sections = ["Overview", "Predictions", ...(hasResults ? ["Results"] : [])];
  if (!markup.includes("league-editorial-hub")) errors.push(`${path}: editorial hub missing`);
  if (!markup.includes("Overview")) errors.push(`${path}: factual overview missing`);
  if (!markup.includes("Latest") || !markup.includes("Predictions")) errors.push(`${path}: latest predictions section missing`);
  if (uniqueMatchLinks.size < 1) errors.push(`${path}: insufficient Match Page discovery (${uniqueMatchLinks.size})`);
  if (!/<title>[^<]*Predictions/.test(page.html)) errors.push(`${path}: metadata does not reflect hub capabilities`);
  if (!page.html.includes('"@type":"CollectionPage"')) errors.push(`${path}: CollectionPage schema missing`);
  if (/<section[^>]*>\s*<\/section>/i.test(markup)) errors.push(`${path}: empty section rendered`);
  leagueMetrics.push({ slug, matchLinks: matchLinks.length, uniqueMatchLinks: uniqueMatchLinks.size, sections: sections.length });
}
console.log(`Indexable HTML routes: ${pages.length}`);
console.log(`Noindex/error HTML routes: ${noindexPages.length}`);
console.log(`Sitemap URLs: ${sitemapUrls.length}`);
console.log(`JSON-LD blocks parsed: ${jsonLdCount}`);
console.log(`Broken internal links: ${errors.filter((error) => error.includes("broken internal link")).length}`);
console.log(`Sitemap discrepancies: ${errors.filter((error) => /SITEMAP_|INDEXABLE_/.test(error)).length}`);
for (const metric of leagueMetrics) {
  console.log(`League SEO ${metric.slug}: ${metric.matchLinks} Match links / ${metric.uniqueMatchLinks} unique / ${metric.sections} core sections`);
}
warnings.forEach((warning) => console.warn(`WARNING: ${warning}`));
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); console.error(`Technical SEO audit: FAIL (${errors.length})`); process.exitCode = 1; }
else console.log("Technical SEO audit: PASS");
