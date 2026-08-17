import { readFileSync, readdirSync, statSync } from "node:fs";
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
  const leagueHref = html.match(/<a[^>]+href="(\/league\/[^"#?]+\/?)"/i)?.[1];
  const relatedBlock = html.match(/<section[^>]+class="related-predictions"[\s\S]*?<\/section>/i)?.[0] ?? "";
  const links = count(relatedBlock, /<a\b[^>]*href="\/match\//gi);
  relatedLinks += links;

  if (count(html, /<h1(?:\s|>)/gi) !== 1) errors.push(`${route}: expected one H1`);
  if (count(html, /<title>/gi) !== 1) errors.push(`${route}: expected one title`);
  if (!/<meta name="description" content="[^"]+"/i.test(html)) errors.push(`${route}: missing description`);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`)) errors.push(`${route}: invalid canonical`);
  if (!/content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html)) errors.push(`${route}: missing index, follow`);
  if (!leagueHref) errors.push(`${route}: missing league link`);
  if (links === 0 || links > 4) errors.push(`${route}: expected 1-4 related links, found ${links}`);

  if (leagueHref) {
    const leagueRoute = normalizeRoute(leagueHref);
    if (!pages.get(leagueRoute)?.includes(`href="${route}"`)) {
      errors.push(`${leagueRoute}: missing backlink to ${route}`);
    }
  }
}

for (const route of leagueRoutes) {
  const html = pages.get(route);
  if (count(html, /<h1(?:\s|>)/gi) !== 1) errors.push(`${route}: expected one H1`);
  if (!html.includes(`"@type":"CollectionPage"`)) errors.push(`${route}: missing CollectionPage schema`);
  if (!html.includes(`"@type":"BreadcrumbList"`)) errors.push(`${route}: missing BreadcrumbList schema`);
}

const sitemap = readFileSync(join(outDir, "sitemap.xml"), "utf8");
const sitemapRoutes = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
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

console.log(`Static HTML pages: ${pages.size}`);
console.log(`Published match pages: ${matchRoutes.length}`);
console.log(`League hubs: ${leagueRoutes.length}`);
console.log(`Average related links: ${(relatedLinks / matchRoutes.length).toFixed(2)}`);
console.log(`Orphan published pages: ${orphans.length}`);
console.log(`Broken internal links: ${brokenLinks.size}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log("SEO audit: PASS");
}
