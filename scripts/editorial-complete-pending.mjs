import { mkdir, writeFile } from "node:fs/promises";
import pending from "../src/data/editorial-data/pending-matches.json" with { type: "json" };
import snapshot from "../src/data/fixtures.snapshot.json" with { type: "json" };
import manual from "../src/data/editorial-data/manual-verified.json" with { type: "json" };
import { evaluateEditorialDataReadiness } from "../src/lib/editorial-data/index.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { getAdSenseContentQualityDecision } from "../src/lib/adsense-content-quality.ts";

const networkEnabled = process.env.EDITORIAL_DATA_NETWORK === "1" || process.argv.includes("--network");
console.log(`Editorial data network: ${networkEnabled ? "ENABLED" : "DISABLED"}${networkEnabled ? "" : " (use --network or EDITORIAL_DATA_NETWORK=1 to enable external providers)"}`);
const results = await Promise.all(pending.map((match) => evaluateEditorialDataReadiness(match)));
const actualBySlug = new Map(editorialPredictions.map((item) => [item.slug, item]));
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
const configured = new Set(Object.keys(snapshot.leagues));
const snapshotGames = Object.values(snapshot.leagues).flatMap((rounds) => rounds).flatMap((round) => round.games);
const manualFor = (collection, predicate) => collection.some(predicate);

function classifyCell({ available, snapshotCandidate, manualCandidate, competitionConfigured }) {
  if (available) return "AVAILABLE";
  if (snapshotCandidate || manualCandidate) return "MISSING_FIELD";
  // A missing snapshot league does not mean the external-provider layer cannot support it.
  // Use UNSUPPORTED only when there is no configured competition and no manual/provider evidence at all.
  return competitionConfigured ? "MISSING_PROVIDER" : "UNSUPPORTED_COMPETITION";
}

const matrix = pending.map((match, index) => {
  const result = results[index];
  const candidate = snapshotGames.find((game) => normalize(game.homeTeam) === normalize(match.home) && normalize(game.awayTeam) === normalize(match.away));
  const competitionConfigured = configured.has(match.competition);
  const manualFixture = manualFor(manual.fixtures, (fixture) => fixture.slug === match.slug);
  const manualHomeCore = manualFor(manual.statisticalCores, (core) => normalize(core.team) === normalize(match.home) && core.sampleType === "home");
  const manualAwayCore = manualFor(manual.statisticalCores, (core) => normalize(core.team) === normalize(match.away) && core.sampleType === "away");
  const manualHomeLineup = manualFor(manual.lineups, (lineup) => lineup.slug === match.slug && normalize(lineup.team) === normalize(match.home));
  const manualAwayLineup = manualFor(manual.lineups, (lineup) => lineup.slug === match.slug && normalize(lineup.team) === normalize(match.away));
  const manualHomeNews = manualFor(manual.teamNews, (news) => news.slug === match.slug && normalize(news.team) === normalize(match.home));
  const manualAwayNews = manualFor(manual.teamNews, (news) => news.slug === match.slug && normalize(news.team) === normalize(match.away));

  const base = { competitionConfigured };
  return {
    slug: match.slug,
    fixture: classifyCell({ ...base, available: Boolean(result.fixture), snapshotCandidate: Boolean(candidate), manualCandidate: manualFixture }),
    venue: classifyCell({ ...base, available: Boolean(result.fixture?.venue), snapshotCandidate: Boolean(candidate?.venue), manualCandidate: manualFixture }),
    fixtureProvenanceUrl: classifyCell({ ...base, available: Boolean(result.fixture?.sourceUrl), snapshotCandidate: Boolean(candidate?.sourceUrl), manualCandidate: manualFixture }),
    coreHome22: classifyCell({ ...base, available: Boolean(result.homeCore), snapshotCandidate: false, manualCandidate: manualHomeCore }),
    coreAway22: classifyCell({ ...base, available: Boolean(result.awayCore), snapshotCandidate: false, manualCandidate: manualAwayCore }),
    homeProjectedLineup: classifyCell({ ...base, available: Boolean(result.homeLineup), snapshotCandidate: false, manualCandidate: manualHomeLineup }),
    awayProjectedLineup: classifyCell({ ...base, available: Boolean(result.awayLineup), snapshotCandidate: false, manualCandidate: manualAwayLineup }),
    homeTeamNews: classifyCell({ ...base, available: Boolean(result.homeTeamNews), snapshotCandidate: false, manualCandidate: manualHomeNews }),
    awayTeamNews: classifyCell({ ...base, available: Boolean(result.awayTeamNews), snapshotCandidate: false, manualCandidate: manualAwayNews }),
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  policy: "integrity-first; disclosed optional gaps do not block a credible fixture and prediction",
  totals: {
    matches: results.length,
    ready: results.filter((item) => item.state === "DATA_READY").length,
    publishableWithGaps: pending.filter((item) => actualBySlug.get(item.slug)?.published === true).length,
    blocked: pending.filter((item) => actualBySlug.get(item.slug)?.published !== true).length,
    published: pending.filter((item) => {
      const prediction = actualBySlug.get(item.slug);
      return prediction?.published === true && getAdSenseContentQualityDecision(prediction).indexable;
    }).length,
  },
  coverageMatrix: matrix,
  results: pending.map((match, index) => ({
    ...match,
    ...results[index],
    state: actualBySlug.get(match.slug)?.published === true ? "DATA_PUBLISHABLE_WITH_GAPS" : results[index].state,
    publication: actualBySlug.get(match.slug)?.published === true && getAdSenseContentQualityDecision(actualBySlug.get(match.slug)).indexable ? "PUBLISHED" : "BLOCKED",
  })),
};

await mkdir("reports/editorial-data", { recursive: true });
await writeFile("reports/editorial-data/latest.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Editorial completion: ${report.totals.matches} pending; ${report.totals.published} published; ${report.totals.ready} DATA_READY; ${report.totals.publishableWithGaps} DATA_PUBLISHABLE_WITH_GAPS; ${report.totals.blocked} DATA_BLOCKED.`);
if (report.totals.matches !== 31 || report.totals.published !== 31 || report.totals.blocked !== 0) process.exitCode = 1;
