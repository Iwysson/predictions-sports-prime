import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const outDir = join(root, "out");
const siteUrl = "https://predictions-sports-prime.pages.dev";
const errors = [];

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function routeForFile(file) {
  const name = relative(outDir, file).split(sep).join("/");
  if (name === "index.html") return "/";
  return `/${name.replace(/index\.html$/, "").replace(/\.html$/, "/")}`;
}

function normalizeRoute(href) {
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return null;

  let url;
  try {
    url = new URL(href, siteUrl);
  } catch {
    return null;
  }

  if (url.origin !== siteUrl) return null;
  const pathname = decodeURI(url.pathname);
  if (/\.[a-z0-9]+$/i.test(pathname)) return null;
  return pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

if (!statSync(outDir).isDirectory()) {
  throw new Error("out/ was not found. Run npm run build before audit:seo.");
}

const htmlFiles = walk(outDir).filter((file) => file.endsWith(".html"));
const pages = new Map(
  htmlFiles.map((file) => [routeForFile(file), readFileSync(file, "utf8")])
);
const matchRoutes = [...pages.keys()].filter((route) => route.startsWith("/match/"));
const leagueRoutes = [...pages.keys()].filter((route) => route.startsWith("/league/"));
const inbound = new Map(matchRoutes.map((route) => [route, 0]));
const brokenLinks = new Set();
let relatedLinks = 0;
const titles = new Map();
const descriptions = new Map();
const indexingRows = [];

for (const [route, html] of pages) {
  const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => match[1]);

  for (const href of hrefs) {
    const target = normalizeRoute(href);
    if (!target) continue;

    if (!pages.has(target)) brokenLinks.add(`${route} -> ${target}`);
    if (inbound.has(target) && target !== route) {
      inbound.set(target, inbound.get(target) + 1);
    }
  }
}

for (const route of matchRoutes) {
  const html = pages.get(route);
  const canonical = `${siteUrl}${route}`;
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] ?? "";
  const leagueHref = html.match(/<a[^>]+href="(\/league\/[^"#?]+\/?)"/i)?.[1];
  const relatedBlock = html.match(/<section[^>]+class="related-predictions"[\s\S]*?<\/section>/i)?.[0] ?? "";
  const links = count(relatedBlock, /<a\b[^>]*href="\/match\//gi);
  relatedLinks += links;

  titles.set(title, [...(titles.get(title) ?? []), route]);
  descriptions.set(description, [...(descriptions.get(description) ?? []), route]);

  if (count(html, /<h1(?:\s|>)/gi) !== 1) errors.push(`${route}: expected one H1`);
  if (count(html, /<title>/gi) !== 1) errors.push(`${route}: expected one title`);
  if (!/<meta name="description" content="[^"]+"/i.test(html)) errors.push(`${route}: missing description`);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) errors.push(`${route}: invalid canonical`);
  if (!/content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html)) errors.push(`${route}: missing index, follow`);
  if (!leagueHref) errors.push(`${route}: missing league link`);
  if (links === 0 || links > 4) errors.push(`${route}: expected 1-4 related links, found ${links}`);
  if (!html.includes('class="match-seo-intro"')) errors.push(`${route}: missing static match introduction`);
  if (!html.includes('class="compact-analysis-copy"')) errors.push(`${route}: missing static analysis`);
  if (!html.includes('class="main-prediction-block"')) errors.push(`${route}: missing static final prediction`);
  if (!html.includes('"@type":"Article"')) errors.push(`${route}: missing Article schema`);
  if (!html.includes('"@type":"BreadcrumbList"')) errors.push(`${route}: missing BreadcrumbList schema`);

  if (leagueHref) {
    const leagueRoute = normalizeRoute(leagueHref);
    if (!pages.get(leagueRoute)?.includes(`href="${route}"`)) {
      errors.push(`${leagueRoute}: missing backlink to ${route}`);
    }
  }
}

for (const [title, routes] of titles) {
  if (!title) continue;
  if (routes.length > 1) errors.push(`duplicate title: ${title} (${routes.join(", ")})`);
}

for (const [description, routes] of descriptions) {
  if (!description) continue;
  if (routes.length > 1) errors.push(`duplicate description (${routes.join(", ")})`);
}

for (const route of leagueRoutes) {
  const html = pages.get(route);
  const canonical = `${siteUrl}${route}`;
  if (count(html, /<h1(?:\s|>)/gi) !== 1) errors.push(`${route}: expected one H1`);
  if (count(html, /<title>/gi) !== 1) errors.push(`${route}: expected one title`);
  if (!/<meta name="description" content="[^"]+"/i.test(html)) errors.push(`${route}: missing description`);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) errors.push(`${route}: invalid canonical`);
  if (!html.includes('class="league-seo-intro"')) errors.push(`${route}: missing static league introduction`);
  if (!html.includes(`"@type":"CollectionPage"`)) errors.push(`${route}: missing CollectionPage schema`);
  if (!html.includes(`"@type":"BreadcrumbList"`)) errors.push(`${route}: missing BreadcrumbList schema`);
}

const sitemap = readFileSync(join(outDir, "sitemap.xml"), "utf8");
const sitemapRoutes = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => normalizeRoute(match[1]))
    .filter(Boolean)
);
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1]
);
if (new Set(sitemapLocations).size !== sitemapLocations.length) {
  errors.push("sitemap.xml: duplicate URLs found");
}
if (sitemapLocations.some((location) => !location.startsWith(`${siteUrl}/`))) {
  errors.push("sitemap.xml: malformed or noncanonical absolute URL found");
}
const sitemapLastModifiedRoutes = new Set(
  [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>[^<]+<\/lastmod><\/url>/g)]
    .map((match) => normalizeRoute(match[1]))
    .filter(Boolean)
);
for (const route of [...matchRoutes, ...leagueRoutes]) {
  if (!sitemapRoutes.has(route)) errors.push(`${route}: missing from sitemap`);
}

const robots = readFileSync(join(outDir, "robots.txt"), "utf8");
if (!robots.includes("Allow: /") || !robots.includes(`${siteUrl}/sitemap.xml`)) {
  errors.push("robots.txt: allow or sitemap directive missing");
}

const orphans = [...inbound].filter(([, links]) => links === 0).map(([route]) => route);
if (orphans.length > 0) errors.push(`orphan match pages: ${orphans.join(", ")}`);
if (brokenLinks.size > 0) errors.push(`broken internal links: ${[...brokenLinks].join(", ")}`);

for (const route of matchRoutes.sort()) {
  const html = pages.get(route);
  const leagueHref = html.match(/href="(\/league\/([^/]+)\/)"/i);
  const publishedAt = html.match(/"datePublished":"([^"]+)"/)?.[1] ?? "—";
  const updatedAt = html.match(/"dateModified":"([^"]+)"/)?.[1] ?? "—";
  const sitemapStatus = sitemapRoutes.has(route) ? "Yes" : "No";
  const internalStatus = (inbound.get(route) ?? 0) > 0 ? "Linked" : "Orphan";
  const indexable = /content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html)
    ? "Index/follow"
    : "Review";

  if (sitemapLastModifiedRoutes.has(route) && publishedAt === "—" && updatedAt === "—") {
    errors.push(`${route}: sitemap lastModified has no reliable editorial date`);
  }

  indexingRows.push(
    `| ${siteUrl}${route} | ${leagueHref?.[2] ?? "Unknown"} | Published | ${publishedAt} | ${updatedAt} | ${sitemapStatus} | ${internalStatus} | ${indexable} |`
  );
}

const indexingReport = [
  "# SEO Indexing Queue",
  "",
  "Internal report generated by `npm run audit:seo`. It is not a public route and does not submit URLs to search engines.",
  "",
  "| URL | League | Status | PublishedAt | UpdatedAt | Sitemap | Internal links | Indexability |",
  "|---|---|---|---|---|---|---|---|",
  ...indexingRows,
  "",
].join("\n");

writeFileSync(join(root, "SEO-INDEXING-QUEUE.md"), indexingReport, "utf8");

console.log(`Static HTML pages: ${pages.size}`);
console.log(`Published match pages: ${matchRoutes.length}`);
console.log(`League hubs: ${leagueRoutes.length}`);
console.log(`Average related links: ${(relatedLinks / matchRoutes.length).toFixed(2)}`);
console.log(`Orphan published pages: ${orphans.length}`);
console.log(`Broken internal links: ${brokenLinks.size}`);
console.log(`Unique match titles: ${titles.size}`);
console.log(`Unique match descriptions: ${descriptions.size}`);
console.log(`SEO indexing queue: ${indexingRows.length}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log("SEO audit: PASS");
}
