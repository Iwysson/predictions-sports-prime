import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const host = "https://predictions-sports-prime.com";
const errors = [];
const warnings = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

function routeForFile(file) {
  const name = relative(out, file).split(sep).join("/");
  if (name === "index.html") return "/";
  return `/${name.replace(/index\.html$/, "").replace(/\.html$/, "/")}`;
}

function extractScripts(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => match[1]);
}

function isHttpUrl(value) {
  return typeof value === "string" && /^http:\/\//i.test(value);
}

function isPagesDevUrl(value) {
  return typeof value === "string" && /pages\.dev/i.test(value);
}

function collectUrls(value, bag = []) {
  if (!value || typeof value !== "object") return bag;
  for (const nested of Object.values(value)) {
    if (typeof nested === "string") bag.push(nested);
    else if (Array.isArray(nested)) nested.forEach((item) => collectUrls(item, bag));
    else if (nested && typeof nested === "object") collectUrls(nested, bag);
  }
  return bag;
}

function walkNodes(value, bag = []) {
  if (!value || typeof value !== "object") return bag;
  if (value["@type"]) bag.push(value);
  for (const nested of Object.values(value)) {
    if (Array.isArray(nested)) nested.forEach((item) => walkNodes(item, bag));
    else if (nested && typeof nested === "object") walkNodes(nested, bag);
  }
  return bag;
}

function hasType(node, type) {
  return node?.["@type"] === type;
}

function isSchemaNamespaceUrl(value) {
  return typeof value === "string" && /^https:\/\/schema\.org\/?/i.test(value);
}

function hasTypeRecursive(value, type) {
  return walkNodes(value).some((node) => hasType(node, type));
}

const htmlFiles = walk(out).filter((file) => file.endsWith(".html"));
const pages = htmlFiles.map((file) => {
  const html = readFileSync(file, "utf8");
  const route = routeForFile(file);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? "";
  const indexable = /content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html);
  const jsonLd = extractScripts(html).flatMap((text) => {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      errors.push(`${route}: invalid JSON-LD`);
      return [];
    }
  });

  return { route, canonical, indexable, jsonLd };
}).filter((page) => page.indexable && page.canonical.startsWith(`${host}/`));

const counts = {
  WebSite: { valid: 0, invalid: 0 },
  Organization: { valid: 0, invalid: 0 },
  ProfilePage: { valid: 0, invalid: 0 },
  Person: { valid: 0, invalid: 0 },
  Article: { valid: 0, invalid: 0 },
  BreadcrumbList: { valid: 0, invalid: 0 },
  SportsEvent: { valid: 0, invalid: 0, skipped: 0, factualLocation: 0 },
};

let totalMatchPages = 0;
let articlesWithoutSportsEvent = 0;
let brokenSportsEventReferences = 0;
let invalidLocations = 0;
let emptyAddresses = 0;

for (const page of pages) {
  const canonical = page.canonical;
  const allNodes = page.jsonLd.flatMap((node) => walkNodes(node));
  const isMatchPage = page.route.startsWith("/match/");
  if (isMatchPage) totalMatchPages += 1;
  const topLevelTypes = new Set(page.jsonLd.map((node) => node?.["@type"]).filter(Boolean));
  if (topLevelTypes.has("WebSite")) counts.WebSite.valid += 1;
  if (topLevelTypes.has("Organization")) counts.Organization.valid += 1;
  if (topLevelTypes.has("ProfilePage")) counts.ProfilePage.valid += 1;
  if (hasTypeRecursive(page.jsonLd, "Person")) counts.Person.valid += 1;
  if (topLevelTypes.has("Article")) counts.Article.valid += 1;
  if (topLevelTypes.has("BreadcrumbList")) counts.BreadcrumbList.valid += 1;

  for (const node of page.jsonLd) {
    for (const url of collectUrls(node)) {
      if (isHttpUrl(url)) errors.push(`${page.route}: HTTP schema URL found (${url})`);
      if (isPagesDevUrl(url)) errors.push(`${page.route}: pages.dev schema URL found (${url})`);
      if (typeof url === "string" && url.startsWith("https://") && !url.startsWith(host) && !isSchemaNamespaceUrl(url)) {
        warnings.push(`${page.route}: external structured URL (${url})`);
      }
    }

    if (hasType(node, "Article")) {
      const articleOk =
        typeof node.headline === "string" &&
        typeof node.description === "string" &&
        typeof node.url === "string" &&
        typeof node.mainEntityOfPage === "object" &&
        typeof node.author === "object";
      if (articleOk) counts.Article.valid += 0;
      else {
        counts.Article.invalid += 1;
        errors.push(`${page.route}: invalid Article schema`);
      }
      if (node.url !== canonical) errors.push(`${page.route}: Article url mismatch`);
      if (node.mainEntityOfPage?.["@id"] !== canonical) errors.push(`${page.route}: Article mainEntityOfPage mismatch`);
      if (node.dateModified && !/^\d{4}-\d{2}-\d{2}T/.test(node.dateModified)) errors.push(`${page.route}: invalid Article dateModified`);
      if (node.datePublished && !/^\d{4}-\d{2}-\d{2}T/.test(node.datePublished)) errors.push(`${page.route}: invalid Article datePublished`);
    }

    if (hasType(node, "ProfilePage")) {
      if (!node.mainEntity || !hasType(node.mainEntity, "Person")) {
        counts.ProfilePage.invalid += 1;
        errors.push(`${page.route}: invalid ProfilePage schema`);
      }
    }

  }

  const sportsEventNodes = allNodes.filter((node) => hasType(node, "SportsEvent"));
  if (isMatchPage && sportsEventNodes.length === 0) articlesWithoutSportsEvent += 1;
  for (const node of allNodes) {
    if (node?.["@id"]?.endsWith("#sports-event") && !hasType(node, "SportsEvent")) {
      brokenSportsEventReferences += 1;
      errors.push(`${page.route}: broken #sports-event reference`);
    }
  }
  for (const node of sportsEventNodes) {
      const location = node.location;
      const address = location?.address;
      const hasLocation = location !== undefined;
      const validLocation = Boolean(
        location &&
        typeof location === "object" &&
        hasType(location, "Place") &&
        typeof location.name === "string" &&
        location.name.trim() &&
        address &&
        typeof address === "object" &&
        hasType(address, "PostalAddress") &&
        typeof address.addressLocality === "string" &&
        address.addressLocality.trim() &&
        typeof address.addressCountry === "string" &&
        address.addressCountry.trim()
      );
      if (!validLocation) invalidLocations += 1;
      if (address && typeof address === "object" && Object.keys(address).filter((key) => key !== "@type").length === 0) emptyAddresses += 1;
      const validStartDate = typeof node.startDate === "string" && !Number.isNaN(new Date(node.startDate).valueOf());
      const validStatus = typeof node.eventStatus === "string" && /^https:\/\/schema\.org\/Event/.test(node.eventStatus);
      const validTeams = hasType(node.homeTeam, "SportsTeam") && hasType(node.awayTeam, "SportsTeam");
      if (validLocation && hasLocation) counts.SportsEvent.factualLocation += 1;
      if (!hasLocation) counts.SportsEvent.skipped += 1;
      if (validLocation && validStartDate && validStatus && validTeams) {
        counts.SportsEvent.valid += 1;
      } else {
        counts.SportsEvent.invalid += 1;
        errors.push(`${page.route}: invalid SportsEvent schema`);
      }
      if (node.url && node.url !== canonical) errors.push(`${page.route}: SportsEvent url mismatch`);
  }
}

if (counts.SportsEvent.skipped !== 0) errors.push("SPORTSEVENT_WITHOUT_LOCATION must equal 0");
if (brokenSportsEventReferences !== 0) errors.push("Broken #sports-event references must equal 0");

console.log("Structured Data Audit");
console.log(`Indexable pages: ${pages.length}`);
console.log("");
console.log(`WebSite: ${counts.WebSite.valid > 0 ? "PASS" : "FAIL"}`);
console.log(`Organization: ${counts.Organization.valid > 0 ? "PASS" : "FAIL"}`);
console.log(`ProfilePage: ${counts.ProfilePage.valid}/1 valid`);
console.log(`Person: ${counts.Person.valid}/${pages.filter((page) => hasTypeRecursive(page.jsonLd, "Person")).length} valid`);
console.log(`Article: ${counts.Article.valid}/${pages.filter((page) => page.jsonLd.some((node) => hasType(node, "Article"))).length} valid`);
console.log(`BreadcrumbList: ${counts.BreadcrumbList.valid}/${pages.filter((page) => page.jsonLd.some((node) => hasType(node, "BreadcrumbList"))).length} valid`);
console.log(`SportsEvent:`);
console.log(`TOTAL_MATCH_PAGES: ${totalMatchPages}`);
console.log(`SPORTSEVENT_EMITTED: ${counts.SportsEvent.valid + counts.SportsEvent.invalid}`);
console.log(`SPORTSEVENT_SKIPPED_NO_LOCATION: ${articlesWithoutSportsEvent}`);
console.log(`SPORTSEVENT_WITH_LOCATION: ${counts.SportsEvent.factualLocation}`);
console.log(`SPORTSEVENT_WITHOUT_LOCATION: ${counts.SportsEvent.skipped}`);
console.log(`SPORTSEVENT_INVALID_LOCATION: ${invalidLocations}`);
console.log(`SPORTSEVENT_EMPTY_ADDRESS: ${emptyAddresses}`);
console.log(`BROKEN_SPORTSEVENT_REFERENCES: ${brokenSportsEventReferences}`);

console.log("");
console.log(`Critical errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Info: ${pages.length}`);

const schemaUrls = pages.flatMap((page) => page.jsonLd.flatMap((node) => collectUrls(node)));
console.log(`HTTP schema URLs: ${schemaUrls.filter(isHttpUrl).length}`);
console.log(`pages.dev schema URLs: ${schemaUrls.filter(isPagesDevUrl).length}`);
console.log(`canonical/schema mismatches: ${errors.filter((error) => /mismatch/.test(error)).length}`);
console.log(`invalid structured dates: ${errors.filter((error) => /invalid .*date/i.test(error)).length}`);
console.log(`generic/fake venue values: ${errors.filter((error) => /fake|generic/i.test(error)).length}`);

for (const warning of warnings.slice(0, 20)) {
  console.warn(`WARNING: ${warning}`);
}

for (const error of errors) {
  console.error(`ERROR: ${error}`);
}

if (errors.length === 0) {
  console.log("PASS");
} else {
  process.exitCode = 1;
}
