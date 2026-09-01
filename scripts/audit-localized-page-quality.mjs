import fs from "node:fs";
import path from "node:path";
import { matches } from "../src/data/matches.ts";
import { isInternationalMatchExpansionEligible } from "../src/lib/upcoming-match.ts";

const root = path.resolve("out");
const active = { "pt-br": "pt-BR", es: "es", it: "it", fr: "fr", de: "de" };
const errors = [];
const counts = Object.fromEntries(Object.keys(active).map((locale) => [locale, 0]));
let thin = 0;
const futureSlugs = new Set(matches.filter((match) => isInternationalMatchExpansionEligible(match)).map((match) => match.slug));

function walk(directory) { return fs.readdirSync(directory).flatMap((name) => { const file = path.join(directory, name); return fs.statSync(file).isDirectory() ? walk(file) : [file]; }); }
function routeForFile(file) { const name = path.relative(root, file).split(path.sep).join("/"); return name === "index.html" ? "/" : `/${name.replace(/index\.html$/, "").replace(/\.html$/, "/")}`; }
function indexable(html) { return /content="index, follow"[^>]*name="robots"|name="robots"[^>]*content="index, follow"/i.test(html); }
function visible(html) { return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z0-9#]+;/gi, " ").replace(/\s+/g, " "); }

for (const file of walk(root).filter((item) => item.endsWith(".html"))) {
  const route = routeForFile(file); const locale = Object.keys(active).find((slug) => route.startsWith(`/${slug}/match/`));
  if (!locale) continue;
  const matchSlug = route.match(/\/match\/([^/]+)\//)?.[1];
  if (!matchSlug || !futureSlugs.has(matchSlug)) continue;
  const html = fs.readFileSync(file, "utf8"); if (!indexable(html)) continue; counts[locale] += 1;
  const checks = {
    identity: /compact-match-scoreboard/.test(html) && /<h1(?:\s|>)/.test(html),
    competition: /<dt>(?:Competição|Competición|Competizione|Compétition|Wettbewerb)<\/dt>/.test(html),
    dateTime: /<time|<dt>(?:Data|Fecha|Date|Datum)<\/dt>/.test(html) && /<dt>(?:Horário|Horario|Orario|Horaire|Anstoßzeit)<\/dt>/.test(html),
    prediction: /class="main-prediction-block"/.test(html),
    structured: /class="match-semantic-details"/.test(html),
    substantial: (html.match(/class="match-module"/g) ?? []).length >= 2,
    article: html.includes('"@type":"Article"'),
    breadcrumb: html.includes('"@type":"BreadcrumbList"'),
    canonical: new RegExp(`<link rel="canonical" href="https://predictions-sports-prime\\.com/${locale}/match/${matchSlug}/"`).test(html),
    hreflang: /hrefLang="(?:en|pt-BR|es|it|fr|de)"/.test(html),
    htmlLang: new RegExp(`<html[^>]+lang="${active[locale]}"`, "i").test(html),
    leagueLink: new RegExp(`href="/${locale}/league/[^\"]+/"`).test(html),
    sportsEventOrArticle: html.includes('"@type":"SportsEvent"') || html.includes('"@type":"Article"'),
  };
  const missing = Object.entries(checks).filter(([, pass]) => !pass).map(([name]) => name);
  if (missing.length) { thin += 1; errors.push(`${route}: insufficient localized value (${missing.join(", ")})`); }
  const leakageSurface = html
    .replace(/<div class="main-prediction-block">[\s\S]*?<\/div><p class="compact-responsible-note"/i, '<p class="compact-responsible-note"')
    .replace(/<p class="match-module-sources">[\s\S]*?<\/p>/gi, "");
  const text = visible(leakageSurface);
  if (locale !== "pt-br" && /\b(?:palpite|prováveis escalações|informações da partida|mandante|desfalques|escanteios)\b/i.test(text)) errors.push(`${route}: PT-BR UI/editorial leakage`);
  if (locale !== "es" && /\b(?:información del partido|alineaciones probables|bajas, lesiones|estadísticas de)\b/i.test(text)) errors.push(`${route}: Spanish UI leakage`);
  if (locale !== "it" && /\b(?:informazioni sulla partita|probabili formazioni|indisponibili, infortuni|statistiche di)\b/i.test(text)) errors.push(`${route}: Italian UI leakage`);
  if (locale !== "fr" && /\b(?:informations sur le match|compositions probables|absents, blessures|statistiques de)\b/i.test(text)) errors.push(`${route}: French UI leakage`);
  if (locale !== "de" && /\b(?:spielinformationen|voraussichtliche aufstellungen|ausfälle, verletzungen|statistiken für)\b/i.test(text)) errors.push(`${route}: German UI leakage`);
  if (locale !== "pt-br" && /\b(?:Match Information|Expected Lineups|Confirmed Lineups|Player Availability|Match Statistics|Sample:)\b/i.test(text)) errors.push(`${route}: English UI leakage`);
}

console.log("Localized Page Quality & Language Leakage Audit");
console.log(`Upcoming matches in scope: ${futureSlugs.size}`);
for (const [locale, count] of Object.entries(counts)) console.log(`${active[locale]} match pages: ${count}`);
console.log(`Potentially thin localized pages: ${thin}`);
console.log(`Language leakage errors: ${errors.filter((item) => item.includes("leakage")).length}`);
if (errors.length) { for (const error of errors) console.error(`ERROR: ${error}`); process.exitCode = 1; }
else console.log("Localized page quality: PASS");
