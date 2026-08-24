import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const host = "https://predictions-sports-prime.com";

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

function extract(html, regex) {
  return html.match(regex)?.[1]?.trim() ?? "";
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value) {
  return normalize(value).split(" ").filter(Boolean);
}

function similarity(left, right) {
  if (!left || !right) return 0;
  const a = new Set(words(left));
  const b = new Set(words(right));
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / new Set([...a, ...b]).size;
}

const pages = walk(out)
  .filter((file) => file.endsWith(".html"))
  .map((file) => {
    const html = readFileSync(file, "utf8");
    return {
      route: routeForFile(file),
      title: extract(html, /<title>([^<]+)<\/title>/i),
      description: extract(html, /<meta name="description" content="([^"]*)"/i),
      canonical: extract(html, /<link rel="canonical" href="([^"]+)"/i),
      indexable: /content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html),
    };
  })
  .filter((page) => page.indexable && page.canonical.startsWith(`${host}/`));

const byTitle = new Map();
const byDescription = new Map();
const missingTitles = [];
const missingDescriptions = [];

for (const page of pages) {
  if (!page.title) missingTitles.push(page.route);
  else byTitle.set(page.title, [...(byTitle.get(page.title) ?? []), page.route]);

  if (!page.description) missingDescriptions.push(page.route);
  else byDescription.set(page.description, [...(byDescription.get(page.description) ?? []), page.route]);
}

const exactDuplicateTitles = [...byTitle.entries()].filter(([, routes]) => routes.length > 1);
const exactDuplicateDescriptions = [...byDescription.entries()].filter(([, routes]) => routes.length > 1);

const nearDuplicateTitles = [];
const nearDuplicateDescriptions = [];
const templateSimilarTitles = [];
const templateSimilarDescriptions = [];

for (let i = 0; i < pages.length; i += 1) {
  for (let j = i + 1; j < pages.length; j += 1) {
    const left = pages[i];
    const right = pages[j];
    const titleScore = similarity(left.title, right.title);
    const descriptionScore = similarity(left.description, right.description);

    if (titleScore >= 0.9 && left.title !== right.title) {
      nearDuplicateTitles.push({ urls: [left.route, right.route], score: titleScore });
    } else if (titleScore >= 0.75 && left.title !== right.title) {
      templateSimilarTitles.push({ urls: [left.route, right.route], score: titleScore });
    }

    if (descriptionScore >= 0.9 && left.description !== right.description) {
      nearDuplicateDescriptions.push({ urls: [left.route, right.route], score: descriptionScore });
    } else if (descriptionScore >= 0.75 && left.description !== right.description) {
      templateSimilarDescriptions.push({ urls: [left.route, right.route], score: descriptionScore });
    }
  }
}

console.log(`Indexable pages: ${pages.length}`);
console.log(`Missing titles: ${missingTitles.length}`);
console.log(`Missing descriptions: ${missingDescriptions.length}`);
console.log(`Exact duplicate titles: ${exactDuplicateTitles.length}`);
console.log(`Exact duplicate descriptions: ${exactDuplicateDescriptions.length}`);
console.log(`Near duplicate titles: ${nearDuplicateTitles.length}`);
console.log(`Near duplicate descriptions: ${nearDuplicateDescriptions.length}`);
console.log(`Template similarity titles: ${templateSimilarTitles.length}`);
console.log(`Template similarity descriptions: ${templateSimilarDescriptions.length}`);
console.log(`Acceptable structural similarity titles: ${Math.max(0, pages.length - missingTitles.length - exactDuplicateTitles.length - nearDuplicateTitles.length - templateSimilarTitles.length)}`);
console.log(`Acceptable structural similarity descriptions: ${Math.max(0, pages.length - missingDescriptions.length - exactDuplicateDescriptions.length - nearDuplicateDescriptions.length - templateSimilarDescriptions.length)}`);

if (missingTitles.length) console.log(`Missing title URLs: ${missingTitles.join(", ")}`);
if (missingDescriptions.length) console.log(`Missing description URLs: ${missingDescriptions.join(", ")}`);

for (const [, routes] of exactDuplicateTitles) console.log(`Exact duplicate title URLs: ${routes.join(", ")}`);
for (const [, routes] of exactDuplicateDescriptions) console.log(`Exact duplicate description URLs: ${routes.join(", ")}`);
for (const item of nearDuplicateTitles) console.log(`Near duplicate title URLs (${item.score.toFixed(2)}): ${item.urls.join(", ")}`);
for (const item of nearDuplicateDescriptions) console.log(`Near duplicate description URLs (${item.score.toFixed(2)}): ${item.urls.join(", ")}`);
for (const item of templateSimilarTitles) console.log(`Template similarity title URLs (${item.score.toFixed(2)}): ${item.urls.join(", ")}`);
for (const item of templateSimilarDescriptions) console.log(`Template similarity description URLs (${item.score.toFixed(2)}): ${item.urls.join(", ")}`);
