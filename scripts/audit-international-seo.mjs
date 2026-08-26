import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const locales = [
  { slug: "pt-br", lang: "pt-BR", hubsIndexable: true },
  { slug: "es", lang: "es", hubsIndexable: true },
  { slug: "fr", lang: "fr", hubsIndexable: true },
  { slug: "de", lang: "de", hubsIndexable: true },
  { slug: "it", lang: "it", hubsIndexable: false },
  { slug: "nl", lang: "nl", hubsIndexable: false },
  { slug: "tr", lang: "tr", hubsIndexable: false },
];
const paths = ["/", "/league/premier-league/", "/match/aston-villa-vs-arsenal/"];
const hubHreflangs = ["en", "pt-BR", "es", "fr", "de", "x-default"];
const matchHreflangs = ["en", "pt-BR", "es", "fr", "de", "it", "nl", "tr", "x-default"];
const errors = [];
const checked = [];

function htmlFile(urlPath) {
  return path.join(root, ...urlPath.split("/").filter(Boolean), "index.html");
}

function attr(html, pattern, label, route) {
  const value = html.match(pattern)?.[1];
  if (!value) errors.push(`${route}: missing ${label}`);
  return value;
}

function alternates(html) {
  return [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"\/>/g)]
    .map((match) => ({ lang: match[1], href: match[2] }));
}

for (const { slug, lang, hubsIndexable } of locales) {
  for (const suffix of paths) {
    const route = `/${slug}${suffix}`;
    const file = htmlFile(route);
    if (!fs.existsSync(file)) {
      errors.push(`${route}: missing static HTML`);
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
    const isHub = suffix === "/" || suffix === "/league/premier-league/";
    const shouldIndex = !isHub || hubsIndexable;
    const declaredLang = attr(html, /<html[^>]*lang="([^"]+)"/, "html lang", route);
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/, "canonical", route);
    attr(html, /<title>([^<]+)<\/title>/, "title", route);
    attr(html, /<meta name="description" content="([^"]+)"/, "description", route);
    const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
    if (declaredLang !== lang) errors.push(`${route}: lang ${declaredLang} != ${lang}`);
    const expectedCanonical = `https://predictions-sports-prime.com${route}`;
    if (canonical !== expectedCanonical) errors.push(`${route}: canonical mismatch`);
    if (h1Count !== 1) errors.push(`${route}: expected one H1, found ${h1Count}`);
    const hrefLangs = alternates(html);
    if (shouldIndex) {
      for (const required of isHub ? hubHreflangs : matchHreflangs) {
        if (!hrefLangs.some((entry) => entry.lang === required)) errors.push(`${route}: missing hreflang ${required}`);
      }
      checked.push(route);
    } else {
      if (!/<meta name="robots" content="[^"]*noindex/i.test(html)) errors.push(`${route}: rollout page must be noindex`);
      if (hrefLangs.length) errors.push(`${route}: rollout page must not emit hreflang alternates`);
    }
    if (/\/match\//.test(route)) {
      const paragraphs = (html.match(/<div class="compact-analysis-copy">[\s\S]*?<\/div>/)?.[0].match(/<p>/g) ?? []).length;
      if (paragraphs < 3) errors.push(`${route}: localized editorial content is incomplete`);
    }
  }
}

for (const suffix of paths) {
  const route = suffix;
  const html = fs.readFileSync(htmlFile(route), "utf8");
  const hrefLangs = alternates(html);
  const requiredHreflangs = suffix === "/match/aston-villa-vs-arsenal/" ? matchHreflangs : hubHreflangs;
  for (const required of requiredHreflangs) {
    if (!hrefLangs.some((entry) => entry.lang === required)) errors.push(`${route}: English page missing reciprocal hreflang ${required}`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const route of checked) {
  if (!sitemap.includes(`<loc>https://predictions-sports-prime.com${route}</loc>`)) errors.push(`${route}: missing from sitemap`);
}
for (const { slug, hubsIndexable } of locales) {
  if (hubsIndexable) continue;
  for (const suffix of ["/", "/league/premier-league/"]) {
    const route = `/${slug}${suffix}`;
    if (sitemap.includes(`<loc>https://predictions-sports-prime.com${route}</loc>`)) errors.push(`${route}: rollout page leaked into sitemap`);
  }
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(?:html|xml)$/.test(entry.name) && fs.readFileSync(file, "utf8").includes("predictions-sports-prime.pages.dev")) {
      errors.push(`${path.relative(root, file)}: legacy domain leakage`);
    }
  }
}
walk(root);

console.log("International SEO Audit");
console.log(`Localized indexable pages checked: ${checked.length}`);
console.log(`Localized rollout pages checked: ${locales.filter((item) => !item.hubsIndexable).length * 2}`);
console.log(`Locales: ${locales.map((item) => item.lang).join(", ")}`);
console.log(`English reciprocal clusters checked: ${paths.length}`);
console.log(`Legacy domain occurrences: ${errors.filter((item) => item.includes("legacy domain")).length}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log("PASS");
}
