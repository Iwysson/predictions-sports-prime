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
const paths = new Set(pages.map((page) => page.path));
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
    if (!paths.has(normalized)) errors.push(`${page.path}: broken internal link ${href}`);
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
console.log(`Indexable HTML routes: ${pages.length}`);
console.log(`Noindex/error HTML routes: ${noindexPages.length}`);
console.log(`Sitemap URLs: ${sitemapUrls.length}`);
console.log(`JSON-LD blocks parsed: ${jsonLdCount}`);
console.log(`Broken internal links: ${errors.filter((error) => error.includes("broken internal link")).length}`);
console.log(`Sitemap discrepancies: ${errors.filter((error) => /SITEMAP_|INDEXABLE_/.test(error)).length}`);
warnings.forEach((warning) => console.warn(`WARNING: ${warning}`));
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); console.error(`Technical SEO audit: FAIL (${errors.length})`); process.exitCode = 1; }
else console.log("Technical SEO audit: PASS");
