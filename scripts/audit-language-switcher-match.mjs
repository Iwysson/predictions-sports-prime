import { languageSwitcherPath } from "../src/lib/locale-route.ts";
import { seoLocaleSlugs } from "../src/lib/seo-locales.ts";

const slug = "aston-villa-vs-arsenal";
const requiredTargets = ["pt-br", "es", "it", "fr", "de"];
const errors = [];

for (const locale of requiredTargets) {
  const expected = `/${locale}/match/${slug}/`;
  for (const englishPath of [`/match/${slug}/`, `/en/match/${slug}/`]) {
    const actual = languageSwitcherPath(englishPath, locale);
    if (actual !== expected) errors.push(`en→${locale}: expected ${expected}, received ${actual}`);
  }
  if (!errors.some((error) => error.startsWith(`en→${locale}:`))) {
    console.log(`en→${locale === "pt-br" ? "pt-BR" : locale} same match: PASS`);
  }
}

const englishTarget = languageSwitcherPath(`/pt-br/match/${slug}/`, "en");
if (englishTarget !== `/match/${slug}/`) {
  errors.push(`pt-BR→en: expected /match/${slug}/, received ${englishTarget}`);
} else {
  console.log("pt-BR→en same match: PASS");
}

let homeFallbacks = 0;
for (const source of ["en", ...seoLocaleSlugs]) {
  const pathname = source === "en" ? `/match/${slug}/` : `/${source}/match/${slug}/`;
  for (const target of ["en", ...seoLocaleSlugs]) {
    const actual = languageSwitcherPath(pathname, target);
    const expected = target === "en" ? `/match/${slug}/` : `/${target}/match/${slug}/`;
    if (actual === "/" || actual === `/${target}/`) homeFallbacks += 1;
    if (actual !== expected) errors.push(`${source}→${target}: match identity was not preserved (${actual})`);
  }
}

console.log(`Fallback to locale home from match page: ${homeFallbacks}`);
if (homeFallbacks !== 0) errors.push(`Expected zero locale-home fallbacks, received ${homeFallbacks}`);

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log("Language switcher match audit: PASS");
