// results:reconcile — look up the real result of every published football prediction that has kicked off and
// has no settlement yet, however old it is. It asks the providers directly, one prediction at a time, so it
// does not depend on a league's season feed, its fixture link or any other prediction: one failure stays one
// PENDING record with its reason, and it is retried on every later run. Writes evidence and market snapshots
// only; results:settle then grades them through the same engine as every other result.
import { readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { leaguesBySlug } from "../src/data/leagues.ts";
import { settlementPreviews } from "../src/lib/settlement-source.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { parsePredictionMarket } from "../src/lib/prediction-results.ts";
import { normalizeProviderStatus, type FixtureStatus } from "../src/lib/fixture-status.ts";
import { resultKey, type FootballResultsDataset } from "../src/lib/football-results.ts";
import { emptyPendingDataset, hasKickedOff, type PendingResultsDataset } from "../src/lib/pending-results.ts";
import {
  decideEvidence,
  espnRegulationScore,
  fotmobRegulationScore,
  matchFixture,
  mergeEvidence,
  type ProviderObservation,
  type ReconcilePendingReason,
  type ResultEvidenceDataset,
} from "../src/lib/result-reconciliation.ts";
import type { MatchPreview } from "../src/types/index.ts";

const paths = {
  results: resolve("src/data/football-results.snapshot.json"),
  evidence: resolve("src/data/football-result-evidence.snapshot.json"),
  market: resolve("src/data/market-results.snapshot.json"),
  pending: resolve("src/data/football-results-pending.snapshot.json"),
};
const readJson = async <T,>(path: string, fallback: T): Promise<T> => {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch {
    return fallback;
  }
};
const writeJson = async (path: string, value: unknown) => {
  await writeFile(`${path}.next`, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(`${path}.next`, path);
};
const sortedRecords = <T,>(records: Record<string, T>) =>
  Object.fromEntries(Object.entries(records).sort(([left], [right]) => left.localeCompare(right)));

const now = new Date();
const capturedAt = now.toISOString();
const results = await readJson<FootballResultsDataset>(paths.results, { version: 1, records: {} });
const evidence = await readJson<ResultEvidenceDataset>(paths.evidence, { version: 1, records: {} });
const market = await readJson<Record<string, { homeCorners: number; awayCorners: number; source: string; capturedAt: string }>>(paths.market, {});
const pending = await readJson<PendingResultsDataset>(paths.pending, emptyPendingDataset());

const headers = { Accept: "application/json", "User-Agent": "Mozilla/5.0" };
async function getJson(url: string, attempts = 3) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const response = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(20_000) });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt >= attempts) throw error;
      await new Promise((done) => setTimeout(done, attempt * 750));
    }
  }
}

const memo = <T,>(load: (key: string) => Promise<T>) => {
  const cache = new Map<string, Promise<T>>();
  return (key: string) => {
    if (!cache.has(key)) cache.set(key, load(key));
    return cache.get(key)!;
  };
};
let providerFailures = 0;
const safely = async <T,>(label: string, load: () => Promise<T>, fallback: T) => {
  try {
    return await load();
  } catch (error) {
    providerFailures += 1;
    console.warn(`PROVIDER_FAILED ${label}: ${error instanceof Error ? error.message : String(error)}`);
    return fallback;
  }
};

const espnDay = memo(async (key: string): Promise<ProviderObservation[]> => {
  const [liveDataId, date] = key.split("|");
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${liveDataId}/scoreboard?dates=${date.replace(/-/g, "")}`;
  const data = await safely(`espn ${key}`, () => getJson(url), null);
  return (data?.events ?? []).flatMap((event: any) => {
    const competitors = event.competitions?.[0]?.competitors ?? [];
    const home = competitors.find((item: any) => item.homeAway === "home");
    const away = competitors.find((item: any) => item.homeAway === "away");
    if (!home || !away) return [];
    const type = event.status?.type ?? {};
    const score = (value: unknown) => (typeof value === "string" && /^\d+$/.test(value) ? Number(value) : null);
    return [{
      provider: "espn" as const,
      eventId: String(event.id),
      homeTeam: home.team?.displayName ?? "",
      awayTeam: away.team?.displayName ?? "",
      kickoffUtc: event.competitions?.[0]?.date ?? event.date,
      status: normalizeProviderStatus({ name: type.name, state: type.state, completed: type.completed }),
      regulationScore: espnRegulationScore(String(type.name ?? "")),
      homeScore: score(home.score),
      awayScore: score(away.score),
      sourceUrl: `https://www.espn.com/soccer/match/_/gameId/${event.id}`,
    }];
  });
});

const fotmobDay = memo(async (date: string): Promise<ProviderObservation[]> => {
  const data = await safely(`fotmob ${date}`, () => getJson(`https://www.fotmob.com/api/data/matches?date=${date.replace(/-/g, "")}`), null);
  return (data?.leagues ?? []).flatMap((league: any) => league.matches ?? []).flatMap((event: any) => {
    const status = event.status ?? {};
    const score = String(status.scoreStr ?? "").match(/^(\d+)\s*-\s*(\d+)$/);
    const fixtureStatus: FixtureStatus = status.cancelled
      ? "canceled"
      : status.awarded
        ? "awarded"
        : status.finished && score
          ? "completed"
          : status.started
            ? "in-progress"
            : "scheduled";
    return [{
      provider: "fotmob" as const,
      eventId: String(event.id),
      homeTeam: event.home?.name ?? "",
      awayTeam: event.away?.name ?? "",
      kickoffUtc: status.utcTime ?? "",
      status: fixtureStatus,
      regulationScore: fotmobRegulationScore(status.reason?.short),
      homeScore: score ? Number(score[1]) : null,
      awayScore: score ? Number(score[2]) : null,
      sourceUrl: `https://www.fotmob.com/match/${event.id}`,
    }];
  });
});

const nearbyDates = (date: string) => [0, -1, 1].map((offset) => {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
});

async function observationsFor(match: MatchPreview, dates: string[]) {
  const liveDataId = leaguesBySlug[match.league as keyof typeof leaguesBySlug]?.liveDataId;
  const days = await Promise.all(dates.flatMap((date) => [
    ...(liveDataId ? [espnDay(`${liveDataId}|${date}`)] : []),
    fotmobDay(date),
  ]));
  return days.flat();
}

function cornerStat(statistics: any[] | undefined) {
  const item = statistics?.find((stat) => /^(wonCorners|cornerKicks|corners)$/i.test(stat.name ?? stat.label ?? ""));
  const value = Number(item?.value ?? item?.displayValue);
  return item && Number.isInteger(value) && value >= 0 ? value : null;
}

async function fetchCorners(match: MatchPreview, observations: ProviderObservation[]) {
  const liveDataId = leaguesBySlug[match.league as keyof typeof leaguesBySlug]?.liveDataId;
  const espn = observations.find((item) => item.provider === "espn");
  if (espn && liveDataId) {
    const source = `https://site.api.espn.com/apis/site/v2/sports/soccer/${liveDataId}/summary?event=${espn.eventId}`;
    const data = await safely(`espn summary ${match.slug}`, () => getJson(source), null);
    const teams = data?.boxscore?.teams ?? [];
    const homeCorners = cornerStat(teams.find((team: any) => team.homeAway === "home")?.statistics);
    const awayCorners = cornerStat(teams.find((team: any) => team.homeAway === "away")?.statistics);
    if (homeCorners !== null && awayCorners !== null) return { homeCorners, awayCorners, source };
  }
  const fotmob = observations.find((item) => item.provider === "fotmob");
  if (fotmob) {
    const source = `https://www.fotmob.com/api/data/matchDetails?matchId=${fotmob.eventId}`;
    const data = await safely(`fotmob details ${match.slug}`, () => getJson(source), null);
    const corners = data?.content?.stats?.Periods?.All?.stats
      ?.flatMap((group: any) => group.stats ?? [])
      .find((stat: any) => stat.key === "corners" || stat.title === "Corners")?.stats;
    const [homeCorners, awayCorners] = [Number(corners?.[0]), Number(corners?.[1])];
    if (Number.isInteger(homeCorners) && Number.isInteger(awayCorners)) return { homeCorners, awayCorners, source };
  }
  return null;
}

// Goal markets settle on the 90-minute score. For a tie that went to extra time or penalties the scoreboard
// total is not that score, so it comes from ESPN's per-period line: periods 1 and 2 are regular time.
async function espnRegulationObservation(match: MatchPreview, observations: ProviderObservation[]) {
  const liveDataId = leaguesBySlug[match.league as keyof typeof leaguesBySlug]?.liveDataId;
  const espn = observations.find((item) => item.provider === "espn");
  if (!espn || !liveDataId) return null;
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${liveDataId}/summary?event=${espn.eventId}`;
  const data = await safely(`espn summary ${match.slug}`, () => getJson(url), null);
  const competitors = data?.header?.competitions?.[0]?.competitors ?? [];
  const regularTime = (side: "home" | "away") => {
    const periods = competitors.find((item: any) => item.homeAway === side)?.linescores ?? [];
    const [first, second] = [periods[0]?.displayValue, periods[1]?.displayValue].map(Number);
    return periods.length >= 2 && Number.isInteger(first) && Number.isInteger(second) ? first + second : null;
  };
  const [homeScore, awayScore] = [regularTime("home"), regularTime("away")];
  return homeScore === null || awayScore === null ? null : { ...espn, homeScore, awayScore, regulationScore: true };
}

const needsCorners = (match: MatchPreview) =>
  parsePredictionMarket(match.mainPrediction ?? "").legs.some((leg) => leg.kind === "corners");

// A prediction becomes reconcilable at kickoff. Its date alone never opens it: a same-day fixture that has
// not started is not yet a result, and a future VIP pick must never reach the pending ledger.
const previews = settlementPreviews();
const hydrated = await hydratePredictions(previews);
const candidates = hydrated.filter((match) => !results.records[resultKey(match)] && hasKickedOff(match, now));
console.log(`results:reconcile — ${candidates.length} unsettled prediction(s) past kickoff of ${previews.length} published.`);

const reasons = new Map<string, ReconcilePendingReason>();
const concurrency = 6;
let cursor = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (cursor < candidates.length) {
    const match = candidates[cursor++];
    const key = resultKey(match);
    const original = previews.find((item) => resultKey(item) === key)!;
    // Search both the published date and the date the fixture feed moved it to.
    const dates = [...new Set([...nearbyDates(original.date), ...(match.date ? nearbyDates(match.date) : [])])];
    const observations = await observationsFor(match, dates);
    const fixture = matchFixture(original, observations);
    if (fixture.kind === "reversed") { reasons.set(key, "FIXTURE_IDENTITY_CONFLICT"); continue; }
    if (fixture.kind === "ambiguous") { reasons.set(key, "FIXTURE_IDENTITY_CONFLICT"); continue; }
    if (fixture.kind === "none") { reasons.set(key, "FIXTURE_NOT_FOUND"); continue; }
    if (needsCorners(match) && !market[key] && fixture.observations.some((item) => item.status === "completed")) {
      const corners = await fetchCorners(match, fixture.observations);
      if (corners) market[key] = { ...corners, capturedAt };
    }
    // A final score the fixture feed already holds is graded from there; only a missing one needs evidence.
    if (match.fixtureStatus === "completed" && Number.isInteger(match.homeScore) && Number.isInteger(match.awayScore)) continue;
    const regulation = fixture.observations.some((item) => item.status === "completed" && !item.regulationScore)
      ? await espnRegulationObservation(match, fixture.observations)
      : null;
    const decision = decideEvidence(regulation ? [regulation, ...fixture.observations.filter((item) => item.provider !== "espn")] : fixture.observations, capturedAt);
    if (decision.kind === "pending") { reasons.set(key, decision.reason); continue; }
    evidence.records[key] = mergeEvidence(evidence.records[key], decision.evidence);
  }
}));

await writeJson(paths.evidence, { version: 1, records: sortedRecords(evidence.records) });
await writeJson(paths.market, sortedRecords(market));

// Grading stays in results:settle, which sees these snapshots in a fresh process and builds the pending ledger.
await writeJson(paths.pending, { ...pending, reconcileReasons: sortedRecords(Object.fromEntries(reasons)) });

const counts = new Map<string, number>();
for (const reason of reasons.values()) counts.set(reason, (counts.get(reason) ?? 0) + 1);
console.log(`  evidence records: ${Object.keys(evidence.records).length}; still unresolved here: ${reasons.size}; provider failures: ${providerFailures}`);
for (const [reason, count] of counts) console.log(`  ${reason}: ${count}`);
