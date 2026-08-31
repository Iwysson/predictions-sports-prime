import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const packageDir = process.argv[2];
if (!packageDir) throw new Error("Usage: node scripts/import-championship-package.mjs <extracted-package-directory>");

const files = [
  "01-lincoln-city-vs-blackburn-rovers.md",
  "02-portsmouth-vs-derby-county.md",
  "03-preston-north-end-vs-bristol-city.md",
  "04-sheffield-united-vs-bolton-wanderers.md",
  "05-swansea-city-vs-watford.md",
  "06-west-ham-united-vs-wolverhampton-wanderers.md",
  "07-birmingham-city-vs-southampton.md",
  "08-stoke-city-vs-norwich-city.md",
  "09-millwall-vs-wrexham.md",
  "10-queens-park-rangers-vs-cardiff-city.md",
  "11-west-bromwich-albion-vs-charlton-athletic.md",
  "12-burnley-vs-middlesbrough.md",
];

const previewUrls = {
  "lincoln-city-vs-blackburn-rovers": "https://www.sportsmole.co.uk/football/lincoln-city/preview/lincoln-vs-blackburn-prediction-team-news-lineups_604077.html",
  "portsmouth-vs-derby-county": "https://www.sportsmole.co.uk/football/portsmouth/preview/portsmouth-vs-derby-prediction-team-news-lineups_604062.html",
  "preston-north-end-vs-bristol-city": "https://www.sportsmole.co.uk/football/preston-north-end/preview/preston-vs-bristol-city-prediction-team-news-lineups_604115.html",
  "sheffield-united-vs-bolton-wanderers": "https://www.sportsmole.co.uk/football/bolton-wanderers/preview/sheff-utd-vs-bolton-prediction-team-news-lineups_604081.html",
  "west-ham-united-vs-wolverhampton-wanderers": "https://www.sportsmole.co.uk/football/wolves/preview/west-ham-vs-wolves-prediction-team-news-lineups_604121.html",
  "birmingham-city-vs-southampton": "https://www.sportsmole.co.uk/football/birmingham-city/preview/birmingham-vs-southampton-prediction-team-news-lineups_604052.html",
  "stoke-city-vs-norwich-city": "https://www.sportsmole.co.uk/football/stoke-city/preview/stoke-vs-norwich-prediction-team-news-lineups_604054.html",
  "swansea-city-vs-watford": "https://www.sportsmole.co.uk/football/swansea-city/preview/swansea-vs-watford-prediction-team-news-lineups_604053.html",
  "millwall-vs-wrexham": "https://www.sportsmole.co.uk/football/millwall/preview/millwall-vs-wrexham-prediction-team-news-lineups_604125.html",
  "queens-park-rangers-vs-cardiff-city": "https://www.sportsmole.co.uk/football/qpr/preview/qpr-vs-cardiff-prediction-team-news-lineups_604134.html",
  "west-bromwich-albion-vs-charlton-athletic": "https://www.sportsmole.co.uk/football/west-brom-albion/preview/west-brom-vs-charlton-prediction-team-news-lineups_604131.html",
  "burnley-vs-middlesbrough": "https://www.sportsmole.co.uk/football/middlesbrough/preview/burnley-vs-middlesbrough-prediction-team-news-lineups_604129.html",
};

const fixtureUrl = "https://fbref.com/en/comps/10/2026-2027/schedule/2026-2027-Championship-Scores-and-Fixtures";
const publishedAt = "2026-08-31T15:00:00Z";
const accessedAt = "2026-08-31T12:00:00+01:00";

function slug(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function identifier(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/^[0-9]/, (digit) => `match${digit}`);
}

function toTypeScriptObject(value) {
  return JSON.stringify(value, null, 2).replace(/^(\s*)"([A-Za-z_$][\w$]*)":/gm, "$1$2:");
}

function capture(body, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return body.match(new RegExp(`^${escaped}\\s*(.+)$`, "m"))?.[1]?.trim();
}

function parseDate(value) {
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

function parseTeamLine(body, team) {
  const escaped = team.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const value = body.match(new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*(.+)$`, "m"))?.[1];
  return value ? value.split(/;|,/).map((player) => player.trim()).filter(Boolean) : [];
}

const outputDir = join(process.cwd(), "src", "data", "predictions", "championship", "round-04");
mkdirSync(outputDir, { recursive: true });
const records = [];

for (const file of files) {
  const body = readFileSync(join(packageDir, file), "utf8").replace(/\r/g, "").trim();
  const title = body.match(/^# (.+?) Prediction,/m)?.[1];
  if (!title) throw new Error(`Could not parse teams in ${file}`);
  const [homeTeam, awayTeam] = title.split(" vs ");
  const matchSlug = basename(file).replace(/^\d+-/, "").replace(/\.md$/, "");
  const prediction = capture(body, "**Prediction:**");
  const odds = Number(capture(body, "**Odds:**"));
  const date = parseDate(capture(body, "Date:"));
  const time = capture(body, "Kick-off:").match(/^\d{2}:\d{2}/)[0];
  const venue = capture(body, "Venue:");
  const [city, country] = capture(body, "Location:").split(", ");
  const homePlayers = parseTeamLine(body, homeTeam);
  const awayPlayers = parseTeamLine(body, awayTeam);
  const sources = [
    { name: "FBref — 2026/27 Championship fixtures", url: fixtureUrl, description: "Round, date, kickoff and venue cross-check.", accessedAt },
    ...(previewUrls[matchSlug] ? [{ name: "Sports Mole — current match preview", url: previewUrls[matchSlug], description: "Current team news, probable lineups, availability and match context.", accessedAt }] : []),
    { name: "Football Web Pages — Championship match statistics", url: "https://www.footballwebpages.co.uk/championship", description: "Match-level results, xG, shots, shots on target, possession, corners and event timelines used by the supplied statistical audit.", accessedAt },
  ];
  const value = {
    league: "championship",
    homeTeam,
    awayTeam,
    slug: matchSlug,
    analysis: [body],
    analysisFormat: "markdown",
    seoTitle: `${homeTeam} vs ${awayTeam} Prediction, Odds & Betting Tips — Championship 2026/27`,
    comment: "Odds supplied in the audited editorial package and recorded before kickoff; bookmaker not identified.",
    picks: { main: prediction, publishedOdds: odds, oddsProvenance: { source: "Author-supplied editorial package", provenance: "author_attested", capturedAt: publishedAt, market: prediction } },
    sourceStatus: "verified",
    sources,
    publishedAt,
    updatedAt: publishedAt,
    freshness: { editorialUpdatedAt: publishedAt, teamNewsUpdatedAt: publishedAt, lineupUpdatedAt: publishedAt, statisticsUpdatedAt: publishedAt },
    published: true,
    matchInfo: { date, time, round: "Matchday 4", venue },
    matchSeo: {
      information: { city, country, timezone: "Europe/London", sources: [{ name: sources[0].name, url: sources[0].url, accessedAt, note: sources[0].description }], updatedAt: publishedAt },
      lineups: { status: "expected", home: { players: homePlayers }, away: { players: awayPlayers }, sources: [{ name: (sources[1] ?? sources[0]).name, url: (sources[1] ?? sources[0]).url, accessedAt, note: (sources[1] ?? sources[0]).description }], updatedAt: publishedAt },
    },
  };
  const exportName = identifier(matchSlug);
  writeFileSync(join(outputDir, `${matchSlug}.ts`), `import type { EditorialPrediction } from "@/types";\n\nexport const ${exportName}: EditorialPrediction = ${toTypeScriptObject(value)};\n`, "utf8");
  records.push({ exportName, matchSlug, homeTeam, awayTeam, date, time, venue });
}

writeFileSync(join(outputDir, "index.ts"), `${records.map(({ exportName, matchSlug }) => `import { ${exportName} } from "./${matchSlug}";`).join("\n")}\n\nexport const round04Predictions = [\n${records.map(({ exportName }) => `  ${exportName},`).join("\n")}\n];\n`, "utf8");
writeFileSync(join(outputDir, "..", "index.ts"), `import { round04Predictions } from "./round-04";\n\nexport const championshipPredictions = [...round04Predictions];\n`, "utf8");

const snapshotPath = join(process.cwd(), "src", "data", "fixtures.snapshot.json");
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
snapshot.leagues.championship = [{ round: 4, games: records.map((record) => ({
  round: 4, date: record.date, time: record.time, homeTeam: record.homeTeam, awayTeam: record.awayTeam,
  homeScore: null, awayScore: null, status: "scheduled", dataSource: "snapshot",
  id: `fbref:championship:${record.matchSlug}:${record.date}`, sourceAgreement: true, timeConfirmed: true,
  kickoffUtc: new Date(`${record.date}T${record.time}:00+01:00`).toISOString(), venue: record.venue,
})) }];
for (const record of records) snapshot.predictionIds[`championship:${record.matchSlug}`] = `fbref:championship:${record.matchSlug}:${record.date}`;
snapshot.leagueUpdatedAt.championship = publishedAt;
writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(`Imported ${records.length} Championship analyses.`);
