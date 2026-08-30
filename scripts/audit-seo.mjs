import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const outDir = join(root, "out");
const siteUrl = "https://predictions-sports-prime.com";
const authorName = "Iwysson Nascimento";
const authorRoute = "/author/iwysson-nascimento/";
const authorUrl = `${siteUrl}${authorRoute}`;
const contactEmail = "iwysson.wesklley1995@gmail.com";
const methodologyRoute = "/methodology/";
const editorialPolicyRoute = "/editorial-policy/";
const resultsRoute = "/results/";
const errors = [];
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;

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

function timestampIsValid(value) {
  return ISO_TIMESTAMP_PATTERN.test(value) && !Number.isNaN(new Date(value).valueOf());
}

const predictionFiles = walk(join(root, "src", "data", "predictions"))
  .filter((file) => file.endsWith(".ts") && !file.endsWith(`${sep}index.ts`));
const editorialPredictions = predictionFiles.map((file) => {
  const source = readFileSync(file, "utf8");
  const publishedAt = source.match(/^\s*publishedAt:\s*["']([^"']+)["']/m)?.[1];
  const updatedAt = source.match(/^\s*updatedAt:\s*["']([^"']+)["']/m)?.[1];
  const published = /published:\s*true/.test(source);

  return {
    file: relative(root, file).split(sep).join("/"),
    published,
    publishedAt,
    updatedAt,
  };
});

for (const prediction of editorialPredictions) {
  for (const [field, value] of [["publishedAt", prediction.publishedAt], ["updatedAt", prediction.updatedAt]]) {
    if (value !== undefined && !timestampIsValid(value)) {
      errors.push(`${prediction.file}: ${field} is not a valid ISO-8601 timestamp`);
    }
  }
  if (prediction.publishedAt && prediction.updatedAt && Date.parse(prediction.updatedAt) < Date.parse(prediction.publishedAt)) {
    errors.push(`${prediction.file}: updatedAt is earlier than publishedAt`);
  }
}

function visibleText(html) {
  return html
    .replace(/<!--.*?-->/gs, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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
const indexableLeagueRoutes = leagueRoutes.filter(
  (route) => !/<meta name="robots" content="[^"]*noindex/i.test(pages.get(route) ?? "")
);
const noindexLeagueRoutes = leagueRoutes.filter((route) => !indexableLeagueRoutes.includes(route));
const inbound = new Map(matchRoutes.map((route) => [route, 0]));
const inboundSources = new Map(matchRoutes.map((route) => [route, new Set()]));
const brokenLinks = new Set();
let relatedLinks = 0;
let relatedSelfLinks = 0;
let relatedDraftLeakage = 0;
const titles = new Map();
const descriptions = new Map();
const editorialBodies = new Map();
const canonicalUrls = new Map();
const indexingRows = [];

for (const [route, html] of pages) {
  const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => match[1]);

  for (const href of hrefs) {
    const target = normalizeRoute(href);
    if (!target) continue;

    if (!pages.has(target)) brokenLinks.add(`${route} -> ${target}`);
    if (inbound.has(target) && target !== route) {
      inbound.set(target, inbound.get(target) + 1);
      inboundSources.get(target).add(route);
    }
  }
}

for (const route of matchRoutes) {
  const html = pages.get(route);
  const canonical = `${siteUrl}${route}`;
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] ?? "";
  const canonicalUrl = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? "";
  const analysisBlock = html.match(/<div class="compact-analysis-copy">([\s\S]*?)<\/div>/i)?.[1] ?? "";
  const analysisText = visibleText(analysisBlock);
  const leagueHref = html.match(/<a[^>]+href="(\/league\/[^"#?]+\/?)"/i)?.[1];
  const relatedBlock = html.match(/<section[^>]+class="related-predictions"[\s\S]*?<\/section>/i)?.[0] ?? "";
  const links = count(relatedBlock, /<a\b[^>]*href="\/match\//gi);
  const relatedHrefs = [...relatedBlock.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/gi)];
  relatedLinks += links;

  for (const relatedLink of relatedHrefs) {
    const relatedRoute = normalizeRoute(relatedLink[1]);
    if (relatedRoute === route) relatedSelfLinks += 1;
    if (relatedRoute?.startsWith("/match/") && !matchRoutes.includes(relatedRoute)) {
      relatedDraftLeakage += 1;
    }
    if (
      relatedRoute?.startsWith("/match/") &&
      !/aria-label="[^"]+(?:prediction|match analysis)"/i.test(relatedLink[0])
    ) {
      errors.push(`${route}: related link lacks meaningful accessible anchor text`);
    }
  }

  titles.set(title, [...(titles.get(title) ?? []), route]);
  descriptions.set(description, [...(descriptions.get(description) ?? []), route]);
  canonicalUrls.set(canonicalUrl, [...(canonicalUrls.get(canonicalUrl) ?? []), route]);

  const bodyKey = analysisText.toLowerCase();
  if (analysisText.length < 300) errors.push(`${route}: published analysis is too short`);
  if (/\b(?:lorem ipsum|todo|add analysis|placeholder text|coming soon)\b/i.test(analysisText)) {
    errors.push(`${route}: published analysis contains placeholder text`);
  }
  if (bodyKey) editorialBodies.set(bodyKey, [...(editorialBodies.get(bodyKey) ?? []), route]);

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
  if (!visibleText(html).includes(`Analysis by ${authorName}`)) errors.push(`${route}: missing visible author byline`);
  const bylineAnchor = html.match(new RegExp(`<a\\b[^>]*>${authorName}<\\/a>`, "i"))?.[0] ?? "";
  if (!bylineAnchor.includes(`href="${authorRoute}"`) || !bylineAnchor.includes('rel="author"')) {
    errors.push(`${route}: byline does not link to the author profile`);
  }
  const articleAuthor = html.match(/"author":\{"@type":"Person","name":"([^"]+)","url":"([^"]+)"/);
  if (!articleAuthor) errors.push(`${route}: Article author Person is missing`);
  else {
    if (articleAuthor[1] !== authorName) errors.push(`${route}: Article author name is incorrect`);
    if (articleAuthor[2] !== authorUrl) errors.push(`${route}: Article author URL is incorrect`);
  }
  if (html.includes(contactEmail)) errors.push(`${route}: public contact email must not appear on match pages`);
  if (!html.includes(`href="${methodologyRoute}"`)) errors.push(`${route}: missing methodology link`);
  if (!html.includes(`href="${resultsRoute}"`)) errors.push(`${route}: missing prediction-history link`);
  if (html.includes("match-search-intent")) {
    errors.push(`${route}: search-first MatchSearchIntent content remains`);
  }

}

if (relatedSelfLinks > 0) {
  errors.push(`related prediction self-links: ${relatedSelfLinks}`);
}
if (relatedDraftLeakage > 0) {
  errors.push(`draft or unpublished related links: ${relatedDraftLeakage}`);
}

for (const [title, routes] of titles) {
  if (!title) continue;
  if (routes.length > 1) errors.push(`duplicate title: ${title} (${routes.join(", ")})`);
}

for (const [description, routes] of descriptions) {
  if (!description) continue;
  if (routes.length > 1) errors.push(`duplicate description (${routes.join(", ")})`);
}

for (const [canonical, routes] of canonicalUrls) {
  if (!canonical) continue;
  if (routes.length > 1) errors.push(`duplicate canonical: ${canonical} (${routes.join(", ")})`);
}

for (const [, routes] of editorialBodies) {
  if (routes.length > 1) errors.push(`duplicate editorial body (${routes.join(", ")})`);
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
  [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>[^<]+<\/lastmod>\s*<\/url>/g)]
    .map((match) => normalizeRoute(match[1]))
    .filter(Boolean)
);
const sitemapEntries = new Map(
  [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>\s*)?<\/url>/g)]
    .map((match) => [normalizeRoute(match[1]), match[2]])
    .filter(([route]) => route)
);

const authorHtml = pages.get(authorRoute);
if (!authorHtml) errors.push(`${authorRoute}: generated author page is missing`);
else {
  if (!authorHtml.includes(`<link rel="canonical" href="${authorUrl}"`)) errors.push(`${authorRoute}: invalid canonical`);
  if (!/content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(authorHtml)) errors.push(`${authorRoute}: missing index, follow`);
  if (!visibleText(authorHtml).includes(authorName)) errors.push(`${authorRoute}: visible author identity is missing`);
  if (!authorHtml.includes('"@type":"ProfilePage"') || !authorHtml.includes('"mainEntity":{"@type":"Person"')) {
    errors.push(`${authorRoute}: ProfilePage/Person structured data is missing`);
  }
  if (!authorHtml.includes(`"name":"${authorName}"`) || !authorHtml.includes(`"url":"${authorUrl}"`)) {
    errors.push(`${authorRoute}: ProfilePage/Person identity is incorrect`);
  }
  for (const route of [methodologyRoute, editorialPolicyRoute, "/contact/"]) {
    if (!authorHtml.includes(`href="${route}"`)) errors.push(`${authorRoute}: missing editorial trust link to ${route}`);
  }
}

for (const route of [methodologyRoute, editorialPolicyRoute]) {
  const html = pages.get(route);
  if (!html) { errors.push(`${route}: generated page is missing`); continue; }
  if (!html.includes(`<link rel="canonical" href="${siteUrl}${route}"`)) errors.push(`${route}: invalid canonical`);
  if (!/content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html)) errors.push(`${route}: missing index, follow`);
  if (count(html, /<h1(?:\s|>)/gi) !== 1) errors.push(`${route}: expected one H1`);
}

const resultsHtml = pages.get(resultsRoute);
if (!resultsHtml) errors.push(`${resultsRoute}: generated page is missing`);
else {
  if (!resultsHtml.includes(`<link rel="canonical" href="${siteUrl}${resultsRoute}"`)) errors.push(`${resultsRoute}: invalid canonical`);
  if (!/content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(resultsHtml)) errors.push(`${resultsRoute}: missing index, follow`);
  if (!resultsHtml.includes('data-default-filter="all"')) errors.push(`${resultsRoute}: ALL is not the default history view`);
  const historyEntries = count(resultsHtml, /data-result-slug=/g);
  if (historyEntries === 0) errors.push(`${resultsRoute}: completed prediction History is empty`);
  if (historyEntries > matchRoutes.length) errors.push(`${resultsRoute}: contains more History entries than published matches`);
}

for (const route of ["/", authorRoute, "/about/", methodologyRoute]) {
  if (!pages.get(route)?.includes(`href="${resultsRoute}"`)) errors.push(`${route}: missing link to complete results`);
}

const contactHtml = pages.get("/contact/");
if (!contactHtml?.includes(contactEmail)) errors.push("/contact/: public contact email is missing");
if (!contactHtml?.includes(`href="mailto:${contactEmail}"`)) errors.push("/contact/: usable mailto link is missing");
if (!sitemapRoutes.has(authorRoute)) errors.push(`${authorRoute}: missing from sitemap`);
if (!sitemapRoutes.has(methodologyRoute)) errors.push(`${methodologyRoute}: missing from sitemap`);
if (!sitemapRoutes.has(editorialPolicyRoute)) errors.push(`${editorialPolicyRoute}: missing from sitemap`);
if (!sitemapRoutes.has(resultsRoute)) errors.push(`${resultsRoute}: missing from sitemap`);

for (const [route, lastmod] of sitemapEntries) {
  if (lastmod !== undefined && !timestampIsValid(lastmod)) {
    errors.push(`${route}: sitemap lastmod is not a valid ISO-8601 timestamp`);
  }
}

const publishedEditorial = editorialPredictions.filter((prediction) => prediction.published);
if (matchRoutes.length !== publishedEditorial.length) {
  errors.push(`generated match count (${matchRoutes.length}) does not equal published editorial count (${publishedEditorial.length}); possible draft leakage`);
}

const sourceDatePairs = publishedEditorial
  .map((prediction) => `${prediction.publishedAt ?? ""}|${prediction.updatedAt ?? ""}`)
  .sort();
const renderedDatePairs = [];

for (const route of matchRoutes) {
  const html = pages.get(route);
  const schemaPublished = html.match(/"datePublished":"([^"]+)"/)?.[1];
  const schemaModified = html.match(/"dateModified":"([^"]+)"/)?.[1];
  const expectedLastmod = schemaModified ?? schemaPublished;
  const sitemapLastmod = sitemapEntries.get(route);
  renderedDatePairs.push(`${schemaPublished ?? ""}|${schemaModified ?? ""}`);

  if (!sitemapEntries.has(route)) errors.push(`${route}: published prediction missing from sitemap`);
  if (expectedLastmod) {
    if (!sitemapLastmod || Date.parse(sitemapLastmod) !== Date.parse(expectedLastmod)) {
      errors.push(`${route}: sitemap lastmod does not match Article dateModified ?? datePublished`);
    }
  } else if (sitemapLastmod) {
    errors.push(`${route}: sitemap contains a timestamp with no Article editorial date`);
  }
  if (schemaPublished && !html.includes("Published:")) errors.push(`${route}: trustworthy publication date is not visible`);
  if (schemaModified && !html.includes("Updated:")) errors.push(`${route}: trustworthy update date is not visible`);
}

renderedDatePairs.sort();
if (JSON.stringify(renderedDatePairs) !== JSON.stringify(sourceDatePairs)) {
  errors.push("Article datePublished/dateModified values do not agree with published editorial data");
}

for (const route of sitemapEntries.keys()) {
  if (route.startsWith("/match/") && !matchRoutes.includes(route)) {
    errors.push(`${route}: sitemap match URL has no published page (possible draft leakage)`);
  }
}

for (const [route, lastmod] of sitemapEntries) {
  if (lastmod && !route.startsWith("/match/")) {
    errors.push(`${route}: non-editorial sitemap URL has an unexplained lastmod`);
  }
}
for (const route of [...matchRoutes, ...indexableLeagueRoutes]) {
  if (!sitemapRoutes.has(route)) errors.push(`${route}: missing from sitemap`);
}
for (const route of noindexLeagueRoutes) {
  if (sitemapRoutes.has(route)) errors.push(`${route}: noindex league leaked into sitemap`);
}

const robots = readFileSync(join(outDir, "robots.txt"), "utf8");
if (!robots.includes("Allow: /") || !robots.includes(`${siteUrl}/sitemap.xml`)) {
  errors.push("robots.txt: allow or sitemap directive missing");
}
if (/^Host:/im.test(robots)) {
  errors.push("robots.txt: unsupported Host directive found");
}

const orphans = [...inbound].filter(([, links]) => links === 0).map(([route]) => route);
const weakDiscovery = [...inboundSources]
  .filter(([route, sources]) => {
    if (sources.size >= 2) return false;
    const html = pages.get(route) ?? "";
    const sportsEvent = html.match(/\{"@type":"SportsEvent"[\s\S]*?\}/)?.[0] ?? "";
    const startDate = sportsEvent.match(/"startDate":"([^"]+)"/)?.[1];
    return Boolean(startDate && Date.parse(startDate) > Date.now());
  })
  .map(([route]) => route);
if (orphans.length > 0) errors.push(`orphan match pages: ${orphans.join(", ")}`);
if (weakDiscovery.length > 0) {
  errors.push(`future match pages with fewer than two discovery paths: ${weakDiscovery.join(", ")}`);
}
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
console.log(`Indexable league hubs: ${indexableLeagueRoutes.length}`);
console.log(`Average related links: ${(relatedLinks / matchRoutes.length).toFixed(2)}`);
console.log(`Orphan published pages: ${orphans.length}`);
console.log(`Broken internal links: ${brokenLinks.size}`);
console.log(`Future match pages with weak discovery: ${weakDiscovery.length}`);
console.log(`Related self-links: ${relatedSelfLinks}`);
console.log(`Draft leakage in related links: ${relatedDraftLeakage}`);
console.log(`Unique match titles: ${titles.size}`);
console.log(`Unique match descriptions: ${descriptions.size}`);
console.log(`Unique editorial bodies: ${editorialBodies.size}`);
console.log(`SEO indexing queue: ${indexingRows.length}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log("SEO audit: PASS");
}
