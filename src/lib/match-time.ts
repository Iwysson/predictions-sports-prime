import { leaguesBySlug } from "@/data/leagues";
import type { LeagueSlug, Match, MatchPreview } from "@/types";

export type MatchTimezoneSource = "venue" | "city" | "competition" | "home-team" | "fallback" | "unknown";
export type MatchTimeConfidence = "confirmed" | "derived" | "unknown";

export type NormalizedMatchTime = {
  kickoffUtc: string;
  timezone: string | null;
  localDate: string | null;
  localTime: string | null;
  localDateTime: string | null;
  timezoneSource: MatchTimezoneSource;
  confidence: MatchTimeConfidence;
};

const competitionFallbackTimezones: Record<LeagueSlug, string> = {
  "premier-league": "Europe/London",
  "la-liga": "Europe/Madrid",
  bundesliga: "Europe/Berlin",
  "serie-a": "Europe/Rome",
  "liga-portugal": "Europe/Lisbon",
  "ligue-1": "Europe/Paris",
  eredivisie: "Europe/Amsterdam",
  "brasileirao-serie-a": "America/Sao_Paulo",
  "copa-do-brasil": "America/Sao_Paulo",
  "efl-cup": "Europe/London",
  "super-lig": "Europe/Istanbul",
  "scottish-premiership": "Europe/London",
};

function parseKickoffUtc(match: Pick<Match, "kickoffUtc" | "date" | "time">) {
  if (match.kickoffUtc && !Number.isNaN(Date.parse(match.kickoffUtc))) return match.kickoffUtc;
  if (match.date && match.time && match.time !== "TBD") {
    const candidate = `${match.date}T${match.time}:00Z`;
    if (!Number.isNaN(Date.parse(candidate))) return candidate;
  }
  return null;
}

function formatInTimeZone(value: string, timeZone: string) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    localDate: `${fields.year}-${fields.month}-${fields.day}`,
    localTime: `${fields.hour}:${fields.minute}`,
  };
}

export function resolveMatchTimezone(match: Pick<Match | MatchPreview, "league" | "venue">): {
  timezone: string | null;
  timezoneSource: MatchTimezoneSource;
} {
  const league = leaguesBySlug[match.league];
  if (league?.timezone) {
    return { timezone: league.timezone, timezoneSource: "competition" };
  }
  if (match.league === "brasileirao-serie-a" || match.league === "copa-do-brasil") {
    return { timezone: "America/Sao_Paulo", timezoneSource: "competition" };
  }
  return { timezone: null, timezoneSource: "unknown" };
}

export function normalizeMatchTime(match: Pick<Match | MatchPreview, "league" | "kickoffUtc" | "date" | "time" | "timeConfirmed" | "venue">): NormalizedMatchTime | null {
  const kickoffUtc = parseKickoffUtc(match);
  if (!kickoffUtc) return null;
  const { timezone, timezoneSource } = resolveMatchTimezone(match);
  const formatted = timezone ? formatInTimeZone(kickoffUtc, timezone) : { localDate: null, localTime: null };
  return {
    kickoffUtc,
    timezone,
    localDate: formatted.localDate,
    localTime: formatted.localTime,
    localDateTime: formatted.localDate && formatted.localTime ? `${formatted.localDate}T${formatted.localTime}` : null,
    timezoneSource,
    confidence: match.timeConfirmed ? "confirmed" : "derived",
  };
}

export function getMatchDisplayTime(match: Pick<Match | MatchPreview, "league" | "kickoffUtc" | "date" | "time" | "timeConfirmed" | "venue">, locale = "en") {
  const normalized = normalizeMatchTime(match);
  if (!normalized) return { display: "TBD", sublabel: "", ariaLabel: "Kickoff time unavailable" };
  const label = normalized.localTime ?? "TBD";
  const place = normalized.timezoneSource === "competition" ? normalized.timezone : null;
  const localLabel = locale === "en" ? "Local time" : "Hora local";
  return {
    display: label,
    sublabel: place ? localLabel : "Local time",
    ariaLabel: `Kickoff: ${label} local time${place ? ` in ${place}` : ""}`,
    normalized,
  };
}

export function getMatchSurfaceEligibility(match: { fixtureStatus?: string; published?: boolean }) {
  const completed = match.fixtureStatus === "completed";
  return {
    today: match.published && !completed,
    tomorrow: match.published && !completed,
    upcoming: match.published && !completed,
    history: Boolean(match.published && completed),
  };
}

export function shouldAppearInToday(match: { published?: boolean; fixtureStatus?: string }, _now = new Date()) {
  return Boolean(match.published && match.fixtureStatus !== "completed");
}

export function shouldAppearInTomorrow(match: { published?: boolean; fixtureStatus?: string }, _now = new Date()) {
  return Boolean(match.published && match.fixtureStatus !== "completed");
}

export function shouldAppearInUpcoming(match: { published?: boolean; fixtureStatus?: string }, _now = new Date()) {
  return Boolean(match.published && match.fixtureStatus !== "completed");
}

export function shouldAppearInPredictionHistory(match: { published?: boolean; fixtureStatus?: string }, _now = new Date()) {
  return Boolean(match.published && match.fixtureStatus === "completed");
}
