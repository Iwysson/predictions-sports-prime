import fs from "node:fs";
import path from "node:path";
import { nflWeek1Games } from "../src/data/nfl/week-1.ts";
import { buildNFLSearchIntent } from "../src/lib/nfl-search-intent.ts";
import { getNFLCopy } from "../src/lib/nfl-i18n.ts";
import { seoLocaleSlugs } from "../src/lib/seo-locales.ts";

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(path.resolve(file), "utf8");

assert(nflWeek1Games.length === 16, "Week 1 must contain 16 games");
assert(new Set(nflWeek1Games.map((game) => game.id)).size === 16, "Game IDs must be unique");
assert(new Set(nflWeek1Games.map((game) => game.sourceFile)).size === 16, "All 16 ZIP sources must be represented");
for (const game of nflWeek1Games) {
  assert(game.published && game.predictions.length > 0, `${game.id}: published prediction missing`);
  assert(game.analysis.length >= 4, `${game.id}: analysis appears incomplete`);
  assert(game.predictions.every((pick) => pick.odds > 1 && Number.isFinite(pick.americanOdds)), `${game.id}: invalid odds`);
  assert(game.awayLogo && game.homeLogo, `${game.id}: team logo missing`);
  assert(!game.analysis.join(" ").includes("**NFL **") && !game.analysis.join(" ").includes("b**road**er") && !game.analysis.join(" ").includes("Ma**home**s"), `${game.id}: broken Markdown remains`);
  for (const locale of ["en", ...seoLocaleSlugs]) assert(buildNFLSearchIntent(game, locale).primaryQuery.length > 10, `${game.id}/${locale}: search intent missing`);
}
for (const locale of ["en", ...seoLocaleSlugs]) {
  const copy = getNFLCopy(locale);
  assert(copy.title.includes("NFL") && copy.description.includes("NFL") && copy.h1.includes("NFL"), `${locale}: localized NFL metadata/copy missing`);
}
const sitemap = read("src/app/sitemap.ts");
assert(sitemap.includes('"/nfl/"'), "Sitemap does not include /nfl/");
assert(!sitemap.includes("/nfl/#"), "Sitemap must not include NFL hashes");
const accordion = read("src/components/NFLWeekAccordion.tsx");
for (const token of ["aria-expanded", "aria-controls", "window.location.hash", "<h3", "<h4"]) assert(accordion.includes(token), `Accordion missing ${token}`);
for (const logo of ["nfl-logo.png", ...new Set(nflWeek1Games.flatMap((game) => [game.awayLogo.split("/").at(-1), game.homeLogo.split("/").at(-1)]))]) assert(fs.existsSync(path.resolve("public/nfl", logo === "nfl-logo.png" ? logo : `team-logos/${logo}`)), `Asset missing: ${logo}`);

if (failures.length) { console.error(`NFL SEO audit FAIL (${failures.length})`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(`NFL SEO audit PASS: ${nflWeek1Games.length} games, ${nflWeek1Games.reduce((total, game) => total + game.predictions.length, 0)} picks, ${seoLocaleSlugs.length + 1} locales, 33 local logos.`);
