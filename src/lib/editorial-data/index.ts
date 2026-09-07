import { EDITORIAL_DATA_FRESHNESS, isFresh } from "./policy";
import {
  fotmobFixtureProvider,
  manualFixtureProvider,
  fotmobStatisticalCoreProvider,
  manualLineupProvider,
  manualStatisticalCoreProvider,
  manualTeamNewsProvider,
  snapshotFixtureProvider,
} from "./providers";
import {
  CORE_METRICS,
  type EditorialDataReadiness,
  type PendingEditorialMatch,
  type ProjectedLineup,
  type ResolvedFixture,
  type SampleType,
  type StatisticalCoreData,
  type TeamNews,
  type TeamSide,
} from "./types";

export * from "./types";
export * from "./policy";
export { providerCapabilities } from "./providers";

const fixtureProviders = [snapshotFixtureProvider, fotmobFixtureProvider, manualFixtureProvider];
const statProviders = [manualStatisticalCoreProvider, fotmobStatisticalCoreProvider];
const lineupProviders = [manualLineupProvider];
const teamNewsProviders = [manualTeamNewsProvider];

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
const same = (left: string, right: string) => normalize(left) === normalize(right);
const isHttps = (value: string) => { try { return new URL(value).protocol === "https:"; } catch { return false; } };

function validSource(value: { source: string; sourceUrl: string; fetchedAt: string }) {
  return Boolean(value.source && isHttps(value.sourceUrl) && Number.isFinite(Date.parse(value.fetchedAt)));
}

function validateFixture(fixture: ResolvedFixture | undefined, match: PendingEditorialMatch, now = new Date()) {
  if (!fixture || !validSource(fixture)) return false;
  return fixture.slug === match.slug &&
    same(fixture.home, match.home) && same(fixture.away, match.away) &&
    fixture.competition === match.competition && Boolean(fixture.timezone) &&
    Number.isFinite(Date.parse(fixture.date)) && Number.isFinite(Date.parse(fixture.kickoffUtc)) &&
    Number.isFinite(Date.parse(fixture.verifiedAt)) &&
    isFresh(fixture.verifiedAt, EDITORIAL_DATA_FRESHNESS.fixtureMaximumAgeDays * 86400000, now);
}

function validateCore(core: StatisticalCoreData | undefined, input: { team: string; competition: string; season: string; sampleType: SampleType }, now = new Date()) {
  if (!core) return false;
  if (!same(core.team, input.team) || core.competition !== input.competition || core.season !== input.season || core.sampleType !== input.sampleType) return false;
  if (!Number.isInteger(core.matches) || core.matches <= 0 || !core.provider) return false;

  const values = Object.values(core.metrics).filter(Boolean);
  if (values.length === 0) return false;
  return values.every((item) => {
    return Boolean(
      item && CORE_METRICS.includes(item.metric) && item.sampleType === input.sampleType && item.matches === core.matches &&
      item.competition === input.competition && item.season === input.season &&
      item.value !== "" && item.value !== null && item.value !== undefined &&
      validSource(item) &&
      (!item.provenanceUrls || (item.provenanceUrls.length > 0 && item.provenanceUrls.every(isHttps))) &&
      isFresh(item.fetchedAt, EDITORIAL_DATA_FRESHNESS.statisticsMaximumAgeDays * 86400000, now)
    );
  });
}

function validateLineup(lineup: ProjectedLineup | undefined, match: PendingEditorialMatch, side: TeamSide, now = new Date()) {
  if (!lineup || !validSource(lineup)) return false;
  const expectedTeam = side === "home" ? match.home : match.away;
  return lineup.slug === match.slug && same(lineup.team, expectedTeam) && lineup.status === "projected" &&
    lineup.players.length === 11 && lineup.players.every(Boolean) && Boolean(lineup.formation) &&
    Number.isFinite(Date.parse(lineup.sourceDate)) &&
    isFresh(lineup.sourceDate, EDITORIAL_DATA_FRESHNESS.projectedLineupMaximumAgeHours * 3600000, now);
}

function validateTeamNews(news: TeamNews | undefined, match: PendingEditorialMatch, side: TeamSide, now = new Date()) {
  if (!news || !validSource(news)) return false;
  const expectedTeam = side === "home" ? match.home : match.away;
  return news.slug === match.slug && same(news.team, expectedTeam) && Number.isFinite(Date.parse(news.sourceDate)) &&
    isFresh(news.sourceDate, EDITORIAL_DATA_FRESHNESS.teamNewsMaximumAgeHours * 3600000, now);
}

export async function resolveFixture(match: PendingEditorialMatch, now = new Date()) {
  for (const provider of fixtureProviders) {
    const value = await provider.resolve(match);
    if (validateFixture(value, match, now)) return value;
  }
}

export async function getStatisticalCoreData(input: { team: string; competition: string; season: string; sampleType: SampleType }, now = new Date()) {
  for (const provider of statProviders) {
    const value = await provider.get(input);
    if (validateCore(value, input, now)) return value;
  }
}

export async function getProjectedLineup(match: PendingEditorialMatch, side: TeamSide, now = new Date()) {
  for (const provider of lineupProviders) {
    const value = await provider.get(match, side);
    if (validateLineup(value, match, side, now)) return value;
  }
}

export async function getTeamNews(match: PendingEditorialMatch, side: TeamSide, now = new Date()) {
  for (const provider of teamNewsProviders) {
    const value = await provider.get(match, side);
    if (validateTeamNews(value, match, side, now)) return value;
  }
}

export async function evaluateEditorialDataReadiness(match: PendingEditorialMatch, now = new Date()): Promise<EditorialDataReadiness> {
  const homeCoreInput = { team: match.home, competition: match.competition, season: match.season, sampleType: "home" as const };
  const awayCoreInput = { team: match.away, competition: match.competition, season: match.season, sampleType: "away" as const };

  const [fixture, homeCore, awayCore, homeLineup, awayLineup, homeTeamNews, awayTeamNews] = await Promise.all([
    resolveFixture(match, now),
    getStatisticalCoreData(homeCoreInput, now),
    getStatisticalCoreData(awayCoreInput, now),
    getProjectedLineup(match, "home", now),
    getProjectedLineup(match, "away", now),
    getTeamNews(match, "home", now),
    getTeamNews(match, "away", now),
  ]);

  const reasons: string[] = [];
  const gaps: string[] = [];
  if (!fixture) reasons.push("fixture: no provider returned a fresh, sourced fixture matching both teams, competition and date");
  if (!homeCore) gaps.push("homeCore: sourced HOME metrics unavailable or partial");
  if (!awayCore) gaps.push("awayCore: sourced AWAY metrics unavailable or partial");
  if (!homeLineup) gaps.push("homeLineup: projected lineup unavailable");
  if (!awayLineup) gaps.push("awayLineup: projected lineup unavailable");
  if (!homeTeamNews) gaps.push("homeTeamNews: current availability report unavailable");
  if (!awayTeamNews) gaps.push("awayTeamNews: current availability report unavailable");
  if (match.liveEntry) gaps.push("live: runtime verification unavailable");

  const complete = fixture && homeCore && awayCore && homeLineup && awayLineup && homeTeamNews && awayTeamNews && !match.liveEntry;
  return {
    slug: match.slug,
    state: reasons.length ? "DATA_BLOCKED" : complete ? "DATA_READY" : "DATA_PUBLISHABLE_WITH_GAPS",
    fixture,
    homeCore,
    awayCore,
    homeLineup,
    awayLineup,
    homeTeamNews,
    awayTeamNews,
    reasons,
    gaps,
    providersTried: [...fixtureProviders, ...statProviders, ...lineupProviders, ...teamNewsProviders].map((provider) => provider.capability.id),
  };
}
