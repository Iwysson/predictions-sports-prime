import { editorialPredictions } from "../src/data/predictions/index.ts";
import { editorialToMatch, predictionSlug } from "../src/lib/editorial.ts";

const DATES = new Set(["2026-09-01", "2026-09-02"]);
const expectedCounts = new Map([
  ["2026-09-01", 9],
  ["2026-09-02", 12],
]);
const errors = [];

const scoped = editorialPredictions
  .filter((prediction) => DATES.has(prediction.matchInfo?.date))
  .map((prediction, index) => ({
    prediction,
    match: editorialToMatch(prediction, index),
  }))
  .sort((a, b) =>
    a.match.date.localeCompare(b.match.date) ||
    a.match.time.localeCompare(b.match.time) ||
    a.match.slug.localeCompare(b.match.slug)
  );

for (const [date, expected] of expectedCounts) {
  const actual = scoped.filter(({ match }) => match.date === date).length;
  if (actual !== expected) errors.push(`${date}: expected ${expected} games, found ${actual}`);
}

const zeroToken = /(^|[^\d])0(?:\.0+)?(?:%|\b)/;
const sampleToken = /(?:N\s*=\s*\d+|Matches(?:\s+\d{4}\/\d{2})?\s*\|\s*\d+)/i;

const rows = scoped.map(({ prediction, match }) => {
  const slug = predictionSlug(prediction.homeTeam, prediction.awayTeam);
  const lineups = match.matchSeo?.lineups;
  const statistics = match.matchSeo?.statistics;
  const homeCount = lineups?.home.players.length ?? 0;
  const awayCount = lineups?.away.players.length ?? 0;
  const lineupSources = lineups?.sources.length ?? 0;
  const statisticsSources = statistics?.sources.length ?? 0;
  const analysis = prediction.analysis.join("\n");
  const analysisRendered = analysis.trim().length >= 300;
  const predictionRendered = Boolean(prediction.picks.main.trim());
  const oddsRendered = (prediction.picks.publishedOdds ?? prediction.picks.odds) !== undefined;
  const hasSample = sampleToken.test(`${analysis}\n${statistics?.sample ?? ""}`) || /sample sizes and caveats are shown per row/i.test(statistics?.sample ?? "");
  const unverifiedZero = (statistics?.rows ?? []).some((row) =>
    (zeroToken.test(row.home) || zeroToken.test(row.away)) &&
    !row.zeroVerified &&
    !analysis.includes(`| ${row.label} | ${row.home} | ${row.away} |`)
  );

  if (homeCount !== 11) errors.push(`${slug}: home lineup is ${homeCount}/11`);
  if (awayCount !== 11) errors.push(`${slug}: away lineup is ${awayCount}/11`);
  if (lineups?.status !== "expected" && lineups?.status !== "confirmed") errors.push(`${slug}: invalid lineup status`);
  if (lineupSources === 0) errors.push(`${slug}: lineup has no source`);
  if (!statistics?.rows.length) errors.push(`${slug}: Statistical Core has no rows`);
  if (statisticsSources === 0) errors.push(`${slug}: Statistical Core has no source`);
  if (!hasSample) errors.push(`${slug}: Statistical Core does not expose a sample size/caveat`);
  if (unverifiedZero) errors.push(`${slug}: structured statistics contain an unverified zero`);
  if (!analysisRendered) errors.push(`${slug}: analysis is not renderable`);
  if (!predictionRendered) errors.push(`${slug}: prediction is missing`);

  return {
    game: `${match.homeTeam} vs ${match.awayTeam}`,
    date: match.date,
    status: match.status,
    lineupHome: `${homeCount}/11`,
    lineupAway: `${awayCount}/11`,
    lineupTypeHome: lineups?.status ?? "missing",
    lineupTypeAway: lineups?.status ?? "missing",
    teamNews: match.matchSeo?.teamNews?.entries.length ? "structured" : "editorial",
    injuries: match.matchSeo?.availability?.entries.some((entry) => entry.status === "injured") ? "structured" : "editorial",
    suspensions: match.matchSeo?.availability?.entries.some((entry) => entry.status === "suspended") ? "structured" : "editorial",
    statisticalCore: `${statistics?.rows.length ?? 0} rows`,
    matchesNHome: hasSample ? "visible" : "missing",
    matchesNAway: hasSample ? "visible" : "missing",
    analysisRendered,
    predictionRendered,
    oddsRendered,
    languageSafe: "covered-by-i18n-audit",
    sourcesUpdated: Math.max(lineupSources, statisticsSources),
    finalStatus: errors.some((error) => error.startsWith(`${slug}:`)) ? "FAIL" : "PASS",
  };
});

console.table(rows);
console.log(`TOTAL AUDITED: ${rows.length}`);
console.log(`TODAY: ${rows.filter((row) => row.date === "2026-09-01").length}`);
console.log(`TOMORROW: ${rows.filter((row) => row.date === "2026-09-02").length}`);

if (errors.length) {
  console.error("MATCHDAY 21 AUDIT: FAIL");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("MATCHDAY 21 AUDIT: PASS");
}
