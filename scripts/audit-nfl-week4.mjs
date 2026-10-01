import { nflWeek4Games } from "../src/data/predictions/nfl/week-04/index.ts";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const expected = [
  ["steelers-at-browns", "Cleveland Browns +3.5", 1.72],
  ["colts-at-commanders", "Indianapolis Colts -2.5", 1.62],
  ["jets-at-bears", "Over 42.5", 1.82],
  ["rams-at-eagles", "Los Angeles Rams to Win", 1.60],
  ["cardinals-at-giants", "New York Giants +3.5", 1.65],
  ["titans-at-ravens", "Derrick Henry anytime touchdown", 1.53],
  ["cowboys-at-texans", "Under 47.5", 1.88],
  ["patriots-at-bills", "New England Patriots +7.5", 1.72],
  ["jaguars-at-bengals", "Under 51.5", 1.80],
  ["packers-at-buccaneers", "Tampa Bay Buccaneers +3.5", 1.88],
  ["dolphins-at-vikings", "Over 38.5", 1.82],
  ["chargers-at-seahawks", "Over 41.5", 1.72],
  ["chiefs-at-raiders", "Under 47.5", 1.85],
  ["broncos-at-49ers", "San Francisco 49ers to Win", 1.67],
  ["lions-at-panthers", "Detroit Lions to Win", 1.53],
];

const errors = [];
const expectedById = new Map(expected.map(([id, selection, odds]) => [id, { selection, odds }]));
if (nflWeek4Games.length !== 15) errors.push(`Expected 15 games, found ${nflWeek4Games.length}`);

for (const game of nflWeek4Games) {
  const wanted = expectedById.get(game.id);
  const pick = game.predictions[0];
  if (!wanted) errors.push(`${game.id}: unexpected game`);
  if (game.predictions.length !== 1 || pick?.selection !== wanted?.selection || pick?.odds !== wanted?.odds) errors.push(`${game.id}: immutable prediction/odds mismatch`);
  if (!game.homeTeamId || !game.awayTeamId || game.homeTeamId === game.awayTeamId) errors.push(`${game.id}: invalid home/away identity`);
  if (!game.slug || !game.matchSeo?.indexable) errors.push(`${game.id}: missing indexable slug/SEO`);
  if (game.editorialStandard !== "psp-v1" || !game.published || game.status !== "published") errors.push(`${game.id}: publication contract incomplete`);
  if (game.publicationStatus !== "DATA_PUBLISHABLE_WITH_GAPS") errors.push(`${game.id}: invalid publication status`);
  if (game.oddsProvenance?.source !== "author-supplied" || game.oddsProvenance.bookmaker !== null || !game.oddsProvenance.immutable) errors.push(`${game.id}: odds provenance invalid`);
  if (!game.stadium || !game.city || !game.date || !game.kickoff || !game.timezone) errors.push(`${game.id}: incomplete fixture metadata`);
  if (!game.records?.away || !game.records?.home) errors.push(`${game.id}: records missing`);
  if ((game.analysis?.length ?? 0) !== 3 || game.analysis.some((paragraph) => paragraph.trim().split(/\s+/).length < 65)) errors.push(`${game.id}: analysis is empty, shallow or fragmented`);
  if ((game.sources?.length ?? 0) < 4 || game.sources?.some((source) => !source.url || !source.scope || !source.confidence)) errors.push(`${game.id}: source provenance incomplete`);
  if (!game.projectedLineups?.away?.offense?.length || !game.projectedLineups?.home?.offense?.length) errors.push(`${game.id}: projected personnel missing`);
  if (!game.injuries?.length) errors.push(`${game.id}: injury review missing`);
  if (!game.analysis.some((paragraph) => /\*\*[^*]*\d/.test(paragraph))) errors.push(`${game.id}: numeric bold evidence missing`);
  const boldNumeric = game.analysis.join(" ").match(/\*\*[^*]*\d[^*]*\*\*/g) ?? [];
  if (boldNumeric.length < 2) errors.push(`${game.id}: fewer than two numeric bold evidence fragments`);
}
const normalize = (text) => text.toLowerCase().replace(/\*\*/g, "").replace(/[^a-z0-9%+.-]+/g, " ").trim();
const shingles = (text) => {
  const words = normalize(text).split(/\s+/);
  return new Set(words.slice(0, -4).map((_, index) => words.slice(index, index + 5).join(" ")));
};
const similarity = (a, b) => {
  const left = shingles(a); const right = shingles(b);
  const shared = [...left].filter((value) => right.has(value)).length;
  return shared / Math.max(1, Math.min(left.size, right.size));
};

const paragraphs = nflWeek4Games.flatMap((game) => game.analysis.map((text, index) => ({ id: game.id, index, text })));
const high = [];
for (let i = 0; i < paragraphs.length; i += 1) {
  for (let j = i + 1; j < paragraphs.length; j += 1) {
    if (paragraphs[i].id === paragraphs[j].id) continue;
    const score = similarity(paragraphs[i].text, paragraphs[j].text);
    if (score >= 0.65) high.push({ left: paragraphs[i], right: paragraphs[j], score });
  }
}
if (high.length) errors.push(`${high.length} cross-game paragraph pairs at >=65% similarity`);

const banned = [/this matchup presents/i, /the key factor here is/i, /the market reflects/i, /this game offers/i, /the main concern is/i, /anything can happen/i, /football is unpredictable/i, /conflict detector/i, /counter-signal/i, /the model sees/i, /our model/i];
for (const phrase of banned) {
  const hits = paragraphs.filter(({ text }) => phrase.test(text));
  if (hits.length) errors.push(`Banned or generic phrase ${phrase}: ${hits.map((item) => item.id).join(", ")}`);
}
const slugs = nflWeek4Games.map((game) => game.slug);
if (new Set(slugs).size !== slugs.length) errors.push("Duplicate Week 4 slugs");

if (process.argv.includes("--built")) {
  const outDir = join(process.cwd(), "out");
  if (!existsSync(outDir)) errors.push("Built output directory is missing");
  const requiredOutput = [
    ["canonical", /rel="canonical"/], ["index/follow", /content="index, follow"/],
    ["Article schema", /"@type":"Article"/], ["SportsEvent schema", /"@type":"SportsEvent"/],
    ["final prediction", /Final prediction/], ["published odds", /Published odds/], ["sources", />Sources</],
  ];
  for (const game of nflWeek4Games) {
    const outputPath = join(outDir, "nfl", game.slug, "index.html");
    if (!existsSync(outputPath)) { errors.push(`${game.id}: generated HTML is missing`); continue; }
    const html = readFileSync(outputPath, "utf8");
    for (const [label, pattern] of requiredOutput) if (!pattern.test(html)) errors.push(`${game.id}: generated HTML missing ${label}`);
  }
  const nflSitemapPath = join(outDir, "sitemaps", "nfl", "sitemap.xml");
  const upcomingPath = join(outDir, "sitemaps", "upcoming-matches", "sitemap.xml");
  if (!existsSync(nflSitemapPath) || !existsSync(upcomingPath)) errors.push("Generated NFL or upcoming sitemap is missing");
  else {
    const nflSitemap = readFileSync(nflSitemapPath, "utf8");
    const upcomingSitemap = readFileSync(upcomingPath, "utf8");
    for (const game of nflWeek4Games) {
      if (!nflSitemap.includes(`/nfl/${game.slug}/`)) errors.push(`${game.id}: missing from NFL sitemap`);
      if (!upcomingSitemap.includes(`/nfl/${game.slug}/`)) errors.push(`${game.id}: missing from upcoming sitemap`);
    }
  }
}
if (errors.length) {
  console.error(`NFL Week 4 audit: FAIL (${errors.length} issue(s))`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("NFL Week 4 individual audit: 15/15 PASS");
  console.log("Prediction integrity: 15/15 PASS");
  console.log(`Corpus uniqueness: PASS (${paragraphs.length} paragraphs, 0 pairs >=65%)`);
  console.log("Repetitive and generic phrase audit: PASS");
  if (process.argv.includes("--built")) console.log("Generated pages, canonical, robots, schemas and sitemaps: 15/15 PASS");
}

