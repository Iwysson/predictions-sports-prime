import fs from "node:fs";
import path from "node:path";
import { matches } from "../src/data/matches.ts";
import { hasCompleteLocalizedEditorial } from "../src/data/localized-editorial.ts";

const outputRoot = path.resolve("out");
const locales = ["pt-br", "es", "it", "fr", "de"];
const slugs = [...new Set(matches.map((match) => match.slug))];
const errors = [];
let missingParams = 0;
let serverErrors = 0;

function routeFile(locale, slug) {
  return path.join(outputRoot, locale, "match", slug, "index.html");
}

for (const slug of slugs) {
  const englishFile = path.join(outputRoot, "match", slug, "index.html");
  if (!fs.existsSync(englishFile)) {
    errors.push(`English match route missing: /match/${slug}/`);
  }

  for (const locale of locales) {
    const file = routeFile(locale, slug);
    if (!fs.existsSync(file)) {
      missingParams += 1;
      errors.push(`Missing static param: ${locale}+${slug}`);
      continue;
    }

    const html = fs.readFileSync(file, "utf8");
    if (html.includes('id="__next_error__"') || /Internal Server Error/i.test(html)) {
      serverErrors += 1;
      errors.push(`Localized match error output: /${locale}/match/${slug}/`);
    }
    if (!hasCompleteLocalizedEditorial(slug, locale) && !/<meta name="robots" content="[^"]*noindex/i.test(html)) {
      errors.push(`Incomplete localized fallback is indexable: /${locale}/match/${slug}/`);
    }
  }
}

const sampleSlug = "aek-athens-vs-lask";
for (const locale of locales) {
  const file = routeFile(locale, sampleSlug);
  if (!fs.existsSync(file)) errors.push(`Required sample route missing: /${locale}/match/${sampleSlug}/`);
}

console.log(`English match routes checked: ${slugs.length}`);
console.log(`Localized match routes checked: ${slugs.length * locales.length}`);
console.log(`Missing locale+slug params: ${missingParams}`);
console.log(`Localized match 500 errors: ${serverErrors}`);

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log("Localized match static params audit: PASS");
