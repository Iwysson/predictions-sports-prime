import { classifyPspEditorialLifecycle } from "@/lib/editorial-standard";
import { fixtureKickoffMillis } from "@/lib/fixture-state";
import { isPlayableUpcoming } from "@/lib/fixture-status";
import { EDITORIAL_DATA_FRESHNESS } from "@/lib/editorial-data/policy";
import type { EditorialPrediction, Match, MatchModuleSource } from "@/types";

export type FreshnessState = "FRESH" | "AGING" | "STALE" | "MISSING" | "NOT_APPLICABLE";
export type FreshnessDomain = "fixture" | "teamNews" | "lineups" | "odds" | "statisticalCore";

export type DomainFreshness = {
  domain: FreshnessDomain;
  state: FreshnessState;
  observedAt?: string;
  ageMs?: number;
  maximumAgeMs?: number;
  sourceUrls: string[];
  issues: string[];
  critical: boolean;
};

export type PredictionFreshness = {
  slug: string;
  lifecycle: ReturnType<typeof classifyPspEditorialLifecycle>;
  kickoffAt?: string;
  hoursToKickoff?: number;
  historicalExcluded: boolean;
  publishedOdds?: number;
  latestObservedOdds?: number;
  domains: Record<FreshnessDomain, DomainFreshness>;
  missingCritical: boolean;
};

export type FreshnessContext = {
  now?: Date;
  runtimeMatch?: Pick<Match, "kickoffUtc" | "fixtureStatus" | "date" | "time" | "timeConfirmed">;
  fixtureObservedAt?: string;
};

const DOMAIN_MAX_AGE_MS: Record<Exclude<FreshnessDomain, "odds">, number> = {
  fixture: EDITORIAL_DATA_FRESHNESS.fixtureMaximumAgeDays * 86_400_000,
  teamNews: EDITORIAL_DATA_FRESHNESS.teamNewsMaximumAgeHours * 3_600_000,
  lineups: EDITORIAL_DATA_FRESHNESS.projectedLineupMaximumAgeHours * 3_600_000,
  statisticalCore: EDITORIAL_DATA_FRESHNESS.statisticsMaximumAgeDays * 86_400_000,
};

const validTime = (value?: string) => Boolean(value && Number.isFinite(Date.parse(value)));
const validHttps = (value: string) => {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
};

function newestTimestamp(values: Array<string | undefined>) {
  return values
    .filter((value): value is string => validTime(value))
    .sort((left, right) => Date.parse(right) - Date.parse(left))[0];
}

function moduleTimestamps(module?: { updatedAt?: string; sources: MatchModuleSource[] }) {
  return [module?.updatedAt, ...(module?.sources ?? []).map((source) => source.accessedAt)];
}

function sourceUrls(prediction: EditorialPrediction, module?: { sources: MatchModuleSource[] }) {
  return [...new Set([
    ...(module?.sources ?? []).map((source) => source.url),
    ...(prediction.sources ?? []).map((source) => source.url),
  ].filter(validHttps))];
}

function inactiveDomain(domain: FreshnessDomain): DomainFreshness {
  return { domain, state: "NOT_APPLICABLE", sourceUrls: [], issues: [], critical: false };
}

function classifyDomain(input: {
  domain: FreshnessDomain;
  present: boolean;
  observedAt?: string;
  maximumAgeMs?: number;
  sourceUrls: string[];
  now: Date;
  kickoffMs?: number;
  criticalWhenMissing?: boolean;
  criticalWhenStale?: boolean;
}): DomainFreshness {
  const issues: string[] = [];
  if (!input.present) {
    return { domain: input.domain, state: "MISSING", sourceUrls: input.sourceUrls, issues: ["data unavailable"], critical: Boolean(input.criticalWhenMissing) };
  }
  if (!input.observedAt || !validTime(input.observedAt)) {
    return { domain: input.domain, state: "MISSING", sourceUrls: input.sourceUrls, issues: ["valid observedAt/fetchedAt unavailable"], critical: Boolean(input.criticalWhenMissing) };
  }
  const observedMs = Date.parse(input.observedAt);
  const ageMs = input.now.valueOf() - observedMs;
  if (ageMs < 0) issues.push("observation timestamp is in the future");
  if (input.kickoffMs !== undefined && observedMs >= input.kickoffMs) issues.push("post-kickoff observation cannot support pre-match content");
  if (!input.sourceUrls.length) issues.push("HTTPS provenance unavailable");
  const invalid = issues.length > 0;
  const maximumAgeMs = input.maximumAgeMs;
  const state: FreshnessState = invalid || (maximumAgeMs !== undefined && ageMs > maximumAgeMs)
    ? "STALE"
    : maximumAgeMs !== undefined && ageMs > maximumAgeMs / 2
      ? "AGING"
      : "FRESH";
  if (!invalid && state === "STALE") issues.push("source age exceeds the established domain limit");
  return {
    domain: input.domain,
    state,
    observedAt: input.observedAt,
    ageMs,
    maximumAgeMs,
    sourceUrls: input.sourceUrls,
    issues,
    critical: state === "STALE" && Boolean(input.criticalWhenStale),
  };
}

function editorialKickoff(prediction: EditorialPrediction) {
  const date = prediction.matchInfo?.date;
  const time = prediction.matchInfo?.time;
  if (!date || !time || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return undefined;
  const value = `${date}T${time}:00-03:00`;
  return validTime(value) ? value : undefined;
}

export function evaluatePredictionFreshness(
  prediction: EditorialPrediction,
  context: FreshnessContext = {},
): PredictionFreshness {
  const now = context.now ?? new Date();
  const lifecycle = classifyPspEditorialLifecycle(prediction, now);
  const slug = prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`;
  const domainNames: FreshnessDomain[] = ["fixture", "teamNews", "lineups", "odds", "statisticalCore"];
  if (lifecycle !== "future-pre-match") {
    return {
      slug,
      lifecycle,
      historicalExcluded: lifecycle === "historical-frozen",
      publishedOdds: prediction.picks.publishedOdds ?? prediction.picks.odds,
      latestObservedOdds: prediction.picks.latestObservedOdds,
      domains: Object.fromEntries(domainNames.map((domain) => [domain, inactiveDomain(domain)])) as Record<FreshnessDomain, DomainFreshness>,
      missingCritical: false,
    };
  }

  const runtimeKickoff = context.runtimeMatch ? fixtureKickoffMillis(context.runtimeMatch) : null;
  const kickoffAt = runtimeKickoff !== null && runtimeKickoff !== undefined
    ? new Date(runtimeKickoff).toISOString()
    : editorialKickoff(prediction);
  const kickoffMs = kickoffAt ? Date.parse(kickoffAt) : undefined;
  const hoursToKickoff = kickoffMs === undefined ? undefined : (kickoffMs - now.valueOf()) / 3_600_000;
  const commonEditorialTimes = [prediction.updatedAt, prediction.freshness?.editorialUpdatedAt, prediction.publishedAt];
  const fixtureSources = sourceUrls(prediction, prediction.matchSeo?.information);
  const fixtureObservedAt = newestTimestamp([context.fixtureObservedAt, ...moduleTimestamps(prediction.matchSeo?.information), ...commonEditorialTimes]);
  const fixturePresent = Boolean(
    kickoffAt &&
    prediction.matchInfo?.date &&
    prediction.matchInfo?.time &&
    isPlayableUpcoming(context.runtimeMatch?.fixtureStatus)
  );

  const lineupModule = prediction.matchSeo?.lineups;
  const lineupPresent = Boolean(lineupModule || /\b(?:probable|projected|expected|confirmed)\s+(?:lineups?|xi)\b/i.test(prediction.analysis.join("\n")));
  const lineupObservedAt = newestTimestamp([prediction.freshness?.lineupUpdatedAt, ...moduleTimestamps(lineupModule), ...commonEditorialTimes]);
  const teamNewsModule = prediction.matchSeo?.teamNews;
  const availabilityModule = prediction.matchSeo?.availability;
  const teamNewsPresent = Boolean(teamNewsModule || availabilityModule || /\b(?:team news|injur(?:y|ies)|suspension|suspended|availability)\b/i.test(prediction.analysis.join("\n")));
  const teamNewsObservedAt = newestTimestamp([
    prediction.freshness?.teamNewsUpdatedAt,
    ...moduleTimestamps(teamNewsModule),
    ...moduleTimestamps(availabilityModule),
    ...commonEditorialTimes,
  ]);
  const statisticsModule = prediction.matchSeo?.statistics;
  const corePresent = Boolean(statisticsModule || /Statistical Core Predictions-Sports-Prime/i.test(prediction.analysis.join("\n")));
  const coreObservedAt = newestTimestamp([prediction.freshness?.statisticsUpdatedAt, ...moduleTimestamps(statisticsModule), ...commonEditorialTimes]);
  const latestOdds = prediction.picks.latestObservedOdds;
  const oddsObservedAt = latestOdds === undefined ? undefined : prediction.picks.oddsProvenance?.capturedAt;
  const closeToKickoff = hoursToKickoff !== undefined && hoursToKickoff <= 3;

  const domains: Record<FreshnessDomain, DomainFreshness> = {
    fixture: classifyDomain({ domain: "fixture", present: fixturePresent, observedAt: fixtureObservedAt, maximumAgeMs: DOMAIN_MAX_AGE_MS.fixture, sourceUrls: fixtureSources, now, kickoffMs, criticalWhenMissing: true, criticalWhenStale: hoursToKickoff !== undefined && hoursToKickoff <= 24 }),
    teamNews: classifyDomain({ domain: "teamNews", present: teamNewsPresent, observedAt: teamNewsObservedAt, maximumAgeMs: DOMAIN_MAX_AGE_MS.teamNews, sourceUrls: sourceUrls(prediction, teamNewsModule ?? availabilityModule), now, kickoffMs, criticalWhenStale: closeToKickoff }),
    lineups: classifyDomain({ domain: "lineups", present: lineupPresent, observedAt: lineupObservedAt, maximumAgeMs: DOMAIN_MAX_AGE_MS.lineups, sourceUrls: sourceUrls(prediction, lineupModule), now, kickoffMs, criticalWhenStale: closeToKickoff && lineupModule?.status === "confirmed" }),
    odds: latestOdds === undefined
      ? inactiveDomain("odds")
      : classifyDomain({ domain: "odds", present: true, observedAt: oddsObservedAt, sourceUrls: prediction.picks.oddsProvenance?.source?.startsWith("http") ? [prediction.picks.oddsProvenance.source] : [], now, kickoffMs }),
    statisticalCore: classifyDomain({ domain: "statisticalCore", present: corePresent, observedAt: coreObservedAt, maximumAgeMs: DOMAIN_MAX_AGE_MS.statisticalCore, sourceUrls: sourceUrls(prediction, statisticsModule), now, kickoffMs }),
  };

  return {
    slug,
    lifecycle,
    kickoffAt,
    hoursToKickoff,
    historicalExcluded: false,
    publishedOdds: prediction.picks.publishedOdds ?? prediction.picks.odds,
    latestObservedOdds: latestOdds,
    domains,
    missingCritical: Object.values(domains).some((domain) => domain.critical),
  };
}
