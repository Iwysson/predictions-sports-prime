import { nflWeek3Games } from "../src/data/predictions/nfl/week-03/index.ts";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const expected = [
  ["falcons-at-packers", "Packers -3.5", 1.72],
  ["patriots-at-jaguars", "Patriots +3.5", 1.70],
  ["seahawks-at-commanders", "Seahawks -6.5", 1.75],
  ["texans-at-colts", "Under 42.5", 1.87],
  ["jets-at-lions", "Lions -6.5", 1.80],
  ["panthers-at-browns", "Under 42.5", 1.83],
  ["titans-at-giants", "Over 38.5", 1.85],
  ["chargers-at-bills", "Bills -6.5", 1.72],
  ["bengals-at-steelers", "Bengals -3.5", 1.85],
  ["chiefs-at-dolphins", "Chiefs -11.5", 1.87],
  ["cardinals-at-49ers", "49ers -8.5", 1.85],
  ["vikings-at-buccaneers", "Over 42.5", 1.83],
  ["ravens-vs-cowboys", "Cowboys +3.5", 1.80],
  ["raiders-at-saints", "Saints to Win", 1.57],
  ["rams-at-broncos", "Rams to Win", 1.72],
  ["eagles-at-bears", "Eagles -4.5", 1.83],
];

const errors = [];
const expectedById = new Map(expected.map(([id, selection, odds]) => [id, { selection, odds }]));
if (nflWeek3Games.length !== 16) errors.push(`Expected 16 games, found ${nflWeek3Games.length}`);

for (const game of nflWeek3Games) {
  const wanted = expectedById.get(game.id);
  const pick = game.predictions[0];
  if (!wanted) errors.push(`${game.id}: unexpected game`);
  if (game.predictions.length !== 1 || pick?.selection !== wanted?.selection || pick?.odds !== wanted?.odds) errors.push(`${game.id}: immutable prediction/odds mismatch`);
  if (!game.homeTeamId || !game.awayTeamId || game.homeTeamId === game.awayTeamId) errors.push(`${game.id}: invalid home/away identity`);
  if (!game.slug || !game.matchSeo?.indexable) errors.push(`${game.id}: missing indexable slug/SEO`);
  if (game.editorialStandard !== "psp-v1" || !game.published || game.status !== "published") errors.push(`${game.id}: publication contract incomplete`);
  if (game.oddsProvenance?.source !== "author-supplied" || game.oddsProvenance.bookmaker !== null || !game.oddsProvenance.immutable) errors.push(`${game.id}: odds provenance invalid`);
  if (!game.stadium || !game.city || !game.date || !game.kickoff || !game.timezone) errors.push(`${game.id}: incomplete fixture metadata`);
  if (!game.records?.away || !game.records?.home) errors.push(`${game.id}: records missing`);
  if ((game.analysis?.length ?? 0) < 3 || game.analysis.some((paragraph) => paragraph.trim().split(/\s+/).length < 45)) errors.push(`${game.id}: analysis is empty, shallow or fragmented`);
  if ((game.sources?.length ?? 0) < 3 || game.sources?.some((source) => !source.url || !source.scope || !source.confidence)) errors.push(`${game.id}: source provenance incomplete`);
  if (!game.projectedLineups?.away?.offense?.length || !game.projectedLineups?.home?.offense?.length) errors.push(`${game.id}: projected personnel missing`);
  if (!game.injuries?.length) errors.push(`${game.id}: injury review missing`);
  if (game.injuries?.some((item) => item.practiceStatus === "DNP" && item.status === "Out" && !["falcons-at-packers", "seahawks-at-commanders"].includes(game.id))) errors.push(`${game.id}: DNP promoted to OUT without final support`);
  if (!game.analysis.some((paragraph) => /\*\*[^*]*\d/.test(paragraph))) errors.push(`${game.id}: numeric bold evidence missing`);
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

const paragraphs = nflWeek3Games.flatMap((game) => game.analysis.map((text, index) => ({ id: game.id, index, text })));
const exact = [];
const high = [];
for (let i = 0; i < paragraphs.length; i += 1) {
  for (let j = i + 1; j < paragraphs.length; j += 1) {
    if (paragraphs[i].id === paragraphs[j].id) continue;
    if (normalize(paragraphs[i].text) === normalize(paragraphs[j].text)) exact.push([paragraphs[i], paragraphs[j]]);
    const score = similarity(paragraphs[i].text, paragraphs[j].text);
    if (score >= 0.8) high.push({ left: paragraphs[i], right: paragraphs[j], score });
  }
}
if (exact.length) errors.push(`${exact.length} exact cross-game paragraph duplicates`);
if (high.length) errors.push(`${high.length} cross-game paragraph pairs at >=80% similarity`);

const banned = [/the main risk is/i, /the principal risk is/i, /the matchup favors/i, /the selection is supported by/i, /the current form supports/i, /the final injury report/i, /this is a straight-result selection/i, /the line requires/i, /the market allows/i, /the biggest concern is/i, /the current report/i, /implied probability/i];
for (const phrase of banned) {
  const hits = paragraphs.filter(({ text }) => phrase.test(text));
  if (hits.length) errors.push(`Banned/repetitive phrase ${phrase}: ${hits.map((item) => item.id).join(", ")}`);
}

const outDir = join(process.cwd(), "out");
if (existsSync(outDir)) {
  const requiredOutput = [
    ["canonical", /rel="canonical"/],
    ["index/follow", /content="index, follow"/],
    ["Article schema", /"@type":"Article"/],
    ["SportsEvent schema", /"@type":"SportsEvent"/],
    ["final prediction", /Final prediction/],
    ["published odds", /Published odds/],
    ["sources", />Sources</],
    ["advertising", /adsterra|adsbygoogle/i],
  ];
  for (const game of nflWeek3Games) {
    const outputPath = join(outDir, "nfl", game.slug, "index.html");
    if (!existsSync(outputPath)) {
      errors.push(`${game.id}: generated HTML is missing`);
      continue;
    }
    const html = readFileSync(outputPath, "utf8");
    for (const [label, pattern] of requiredOutput) {
      if (!pattern.test(html)) errors.push(`${game.id}: generated HTML missing ${label}`);
    }
  }

  const nflSitemap = readFileSync(join(outDir, "sitemaps", "nfl", "sitemap.xml"), "utf8");
  const upcomingSitemap = readFileSync(join(outDir, "sitemaps", "upcoming-matches", "sitemap.xml"), "utf8");
  const sitemapIndex = readFileSync(join(outDir, "sitemap-index.xml"), "utf8");
  if ((nflSitemap.match(/<url>/g) ?? []).length !== 17) errors.push("NFL sitemap must contain the hub plus 16 game URLs");
  if ((upcomingSitemap.match(/\/nfl\//g) ?? []).length !== 16) errors.push("Upcoming sitemap must contain all 16 NFL game URLs");
  if (!sitemapIndex.includes("/sitemaps/nfl/sitemap.xml")) errors.push("NFL sitemap is missing from the sitemap index");
}

if (errors.length) {
  console.error(`NFL Week 3 audit: FAIL (${errors.length} issue(s))`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("NFL Week 3 individual audit: 16/16 PASS");
  console.log("Prediction integrity: 16/16 PASS");
  console.log(`Corpus uniqueness: PASS (${paragraphs.length} paragraphs, 0 exact duplicates, 0 pairs >=80%)`);
  console.log("Repetitive phrase and odds prose audit: PASS");
}
