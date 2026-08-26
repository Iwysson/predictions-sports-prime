import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const locales = [
  { slug: "pt-br", lang: "pt-BR" },
  { slug: "es", lang: "es" },
  { slug: "fr", lang: "fr" },
  { slug: "de", lang: "de" },
];
const paths = ["/", "/league/premier-league/", "/match/aston-villa-vs-arsenal/"];
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

for (const { slug, lang } of locales) {
  for (const suffix of paths) {
    const route = `/${slug}${suffix}`;
    const file = htmlFile(route);
    if (!fs.existsSync(file)) {
      errors.push(`${route}: missing static HTML`);
      continue;
    }
    const html = fs.readFileSync(file, "utf8");
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
    for (const required of ["en", "pt-BR", "es", "fr", "de", "x-default"]) {
      if (!hrefLangs.some((entry) => entry.lang === required)) errors.push(`${route}: missing hreflang ${required}`);
    }
    if (/\/match\//.test(route)) {
      const paragraphs = (html.match(/<div class="compact-analysis-copy">[\s\S]*?<\/div>/)?.[0].match(/<p>/g) ?? []).length;
      if (paragraphs < 3) errors.push(`${route}: localized editorial content is incomplete`);
    }
    checked.push(route);
  }
}

for (const suffix of paths) {
  const route = suffix;
  const html = fs.readFileSync(htmlFile(route), "utf8");
  const hrefLangs = alternates(html);
  for (const required of ["en", "pt-BR", "es", "fr", "de", "x-default"]) {
    if (!hrefLangs.some((entry) => entry.lang === required)) errors.push(`${route}: English page missing reciprocal hreflang ${required}`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const route of checked) {
  if (!sitemap.includes(`<loc>https://predictions-sports-prime.com${route}</loc>`)) errors.push(`${route}: missing from sitemap`);
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
console.log(`Locales: ${locales.map((item) => item.lang).join(", ")}`);
console.log(`English reciprocal clusters checked: ${paths.length}`);
console.log(`Legacy domain occurrences: ${errors.filter((item) => item.includes("legacy domain")).length}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exitCode = 1;
} else {
  console.log("PASS");
}
