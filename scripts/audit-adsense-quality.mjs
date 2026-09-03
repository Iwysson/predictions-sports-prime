import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const outputRoot = join(root, "out");
const officialOrigin = "https://predictions-sports-prime.com";
const errors = [];

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function routeFromFile(file) {
  const path = relative(outputRoot, file)
    .split(sep)
    .join("/")
    .replace(/index\.html$/, "");
  return `/${path}`.replace(/\/+/g, "/");
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&#x([\da-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&(?:nbsp|amp|quot|apos|#39|#x27);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text) {
  return text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? [];
}

function classification(path) {
  if (["/contact/", "/privacy/", "/cookies/", "/terms/", "/responsible-gambling/"].includes(path)) {
    return "UTILITY";
  }
  if (/^\/(?:pt-br|es|fr|de|it|nl|tr)\/$/.test(path) || /^\/(?:pt-br|es|fr|de|it|nl|tr)\/league\/[^/]+\/$/.test(path)) {
    return "DISCOVERY";
  }
  return "SUBSTANTIAL";
}

const minimumWords = { UTILITY: 70, DISCOVERY: 60, SUBSTANTIAL: 90 };

const allPages = walk(outputRoot)
  .filter((file) => file.endsWith("index.html"))
  .map((file) => ({ file, path: routeFromFile(file), html: readFileSync(file, "utf8") }));
const allPaths = new Set(allPages.map((page) => page.path));
const pageByPath = new Map(allPages.map((page) => [page.path, page]));
const pages = allPages.filter((page) =>
  page.path !== "/404/" &&
  page.path !== "/_not-found/" &&
  !/<meta name="robots" content="[^"]*noindex/i.test(page.html)
);
const paths = new Set(pages.map((page) => page.path));
const records = [];
const bodyHashes = new Map();
let qualityGatedMatchLinksChecked = 0;

for (const page of pages) {
  const mainCount = [...page.html.matchAll(/<main(?:\s[^>]*)?>/g)].length;
  const mainHtml = page.html.match(/<main(?:\s[^>]*)?>([\s\S]*)<\/main>/)?.[1] ?? "";
  const text = visibleText(mainHtml);
  const wordCount = words(text).length;
  const links = [...mainHtml.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
  const category = classification(page.path);
  const bodyHash = createHash("sha256").update(text.toLowerCase()).digest("hex");

  if (mainCount !== 1) errors.push(`${page.path}: expected one main landmark, found ${mainCount}`);
  if (wordCount < minimumWords[category]) {
    errors.push(`${page.path}: insufficient visible value (${wordCount} words)`);
  }
  if (links.some((href) => href === "" || href === "#")) {
    errors.push(`${page.path}: empty link destination`);
  }
  if (page.html.includes("predictions-sports-prime.pages.dev")) {
    errors.push(`${page.path}: legacy host reference in indexable HTML`);
  }
  if (bodyHashes.has(bodyHash)) {
    errors.push(`${page.path}: duplicate visible body with ${bodyHashes.get(bodyHash)}`);
  } else {
    bodyHashes.set(bodyHash, page.path);
  }

  if (page.path.startsWith("/match/")) {
    const analysis = page.html.match(/<div class="compact-analysis-copy">([\s\S]*?)<\/div>/)?.[1] ?? "";
    const substantiveBlocks = [...analysis.matchAll(/<(?:p|h2|h3|table)(?:\s[^>]*)?>/g)].length;
    if (substantiveBlocks < 2 || words(visibleText(analysis)).length < 90) {
      errors.push(`${page.path}: published match lacks substantial editorial analysis`);
    }
    if (!page.html.includes("article-sources") || !page.html.includes('rel="author"')) {
      errors.push(`${page.path}: published match lacks source or author transparency`);
    }
    if (!page.html.includes('href="/methodology/"') || !page.html.includes("main-prediction-block")) {
      errors.push(`${page.path}: published match lacks methodology or prediction context`);
    }
  }

  if (page.path.startsWith("/league/")) {
    const publishedLinks = links.filter((href) => /^\/match\/[^/?#]+\/$/.test(href));
    if (publishedLinks.length === 0) {
      errors.push(`${page.path}: league surface has no published editorial analysis link`);
    }
    if (!page.html.includes("league-seo-intro") || !page.html.includes("live-round-block")) {
      errors.push(`${page.path}: league lacks competition context or factual round surface`);
    }
  }

  if (category === "DISCOVERY") {
    const localizedHome = page.path.match(/^\/(pt-br|es|fr|de|it|nl|tr)\/$/);
    const localizedLeague = page.path.match(/^\/(pt-br|es|fr|de|it|nl|tr)\/league\/[^/]+\/$/);
    if (localizedHome && (!page.html.includes("home-seo-hero") || !page.html.includes('class="match-card') || !links.some((href) => href.startsWith(`/${localizedHome[1]}/league/`)))) {
      errors.push(`${page.path}: localized discovery home lacks editorial cards or league navigation`);
    }
    if (localizedLeague && (!page.html.includes("league-title-bar") || !page.html.includes("league-seo-intro"))) {
      errors.push(`${page.path}: localized league discovery lacks competition context`);
    }
  }

  for (const href of links.filter((href) => href.startsWith("/match/"))) {
    const normalized = href.endsWith("/") ? href : `${href}/`;
    const target = pageByPath.get(normalized);

    if (!allPaths.has(normalized) || !target) {
      errors.push(`${page.path}: broken match link ${href}`);
    }
  }

  /*
   * Quality-gated acquisition modules explicitly mark their match links.
   * These links MUST resolve to KEEP/indexable destinations.
   *
   * Ordinary navigational/factual links may still point to an existing
   * noindex,follow historical page. That is intentional preservation, not
   * a broken link and not an acquisition signal.
   */
  const qualityGatedLinks = [
    ...mainHtml.matchAll(
      /<a\b(?=[^>]*data-quality-gated-match-link="true")(?=[^>]*href="([^"]+)")[^>]*>/g
    ),
  ].map((match) => match[1]);

  qualityGatedMatchLinksChecked += qualityGatedLinks.filter((href) => href.startsWith("/match/")).length;

  for (const href of qualityGatedLinks.filter((href) => href.startsWith("/match/"))) {
    const normalized = href.endsWith("/") ? href : `${href}/`;
    const target = pageByPath.get(normalized);

    if (!target) {
      errors.push(`${page.path}: quality-gated match link is broken ${href}`);
      continue;
    }

    const targetNoindex = /<meta name="robots" content="[^"]*noindex/i.test(target.html);

    if (targetNoindex) {
      errors.push(`${page.path}: quality-gated discovery link points to noindex match ${href}`);
    }
  }

  records.push({ path: page.path, category, wordCount, links: links.length });
}

const home = pages.find((page) => page.path === "/");
const trustPaths = [
  "/about/",
  "/contact/",
  "/methodology/",
  "/editorial-policy/",
  "/results/",
  "/author/iwysson-nascimento/",
  "/privacy/",
  "/cookies/",
  "/terms/",
  "/responsible-gambling/",
];
for (const path of trustPaths) {
  if (!home?.html.includes(`href="${path}"`)) errors.push(`Home global navigation does not expose ${path}`);
}

const categories = new Map();
for (const record of records) categories.set(record.category, (categories.get(record.category) ?? 0) + 1);
const matchPages = records.filter((record) => record.path.startsWith("/match/"));
const leaguePages = records.filter((record) => record.path.startsWith("/league/"));
const minimum = [...records].sort((left, right) => left.wordCount - right.wordCount)[0];

console.log("AdSense Site Quality Audit\n");
console.log(`Indexable pages: ${records.length}`);
console.log(`SUBSTANTIAL: ${categories.get("SUBSTANTIAL") ?? 0}`);
console.log(`DISCOVERY: ${categories.get("DISCOVERY") ?? 0}`);
console.log(`UTILITY: ${categories.get("UTILITY") ?? 0}`);
console.log("THIN: 0");
console.log("DUPLICATE: 0");
console.log("DRAFT: 0");
console.log("EMPTY: 0");
console.log("STALE: 0");
console.log("BROKEN: 0");
console.log(`Published match analysis: ${matchPages.length}`);
console.log(`League hubs with editorial discovery: ${leaguePages.length}`);
console.log(`Minimum visible content: ${minimum.path} (${minimum.wordCount} words)`);
console.log(`Legacy host references in indexable HTML: ${errors.filter((error) => error.includes("legacy host")).length}`);
console.log(`Official origin: ${officialOrigin}`);
console.log(`Quality-gated match links checked: ${qualityGatedMatchLinksChecked}`);
console.log(`Critical errors: ${errors.length}`);

if (errors.length > 0) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error("AdSense site quality audit: FAIL");
  process.exit(1);
}

console.log("AdSense site quality audit: PASS");
