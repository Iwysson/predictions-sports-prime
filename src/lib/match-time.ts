import { leaguesBySlug } from "@/data/leagues";
import type { LeagueSlug, Match, MatchPreview } from "@/types";
import { classifyFixture, isActiveFixtureState } from "@/lib/fixture-state";

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
  championship: "Europe/London",
  "super-lig": "Europe/Istanbul",
  "scottish-premiership": "Europe/London",
  eliteserien: "Europe/Oslo",
  mls: "America/New_York",
};

const mlsVenueTimezones: Record<string, string> = {
  "Yankee Stadium": "America/New_York",
  "Q2 Stadium": "America/Chicago",
  "Bank of America Stadium": "America/New_York",
  "ScottsMiracle-Gro Field": "America/New_York",
  "TQL Stadium": "America/New_York",
  "Toyota Stadium": "America/Chicago",
  "Nu Stadium": "America/New_York",
  "Dignity Health Sports Park": "America/Los_Angeles",
  "Inter.co Stadium": "America/New_York",
  "Subaru Park": "America/New_York",
  "Providence Park": "America/Los_Angeles",
  "America First Field": "America/Denver",
  "Lumen Field": "America/Los_Angeles",
  "BMO Field": "America/Toronto",
  "BC Place": "America/Vancouver",
};

function localDateTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return null;

  // Start from the same wall-clock fields in UTC, then compensate for the
  // target zone's actual offset. A second pass handles DST boundaries safely.
  let utcMs = Date.UTC(year, month - 1, day, hour, minute);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(utcMs));
    const fields = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const representedMs = Date.UTC(
      Number(fields.year),
      Number(fields.month) - 1,
      Number(fields.day),
      Number(fields.hour),
      Number(fields.minute)
    );
    utcMs += Date.UTC(year, month - 1, day, hour, minute) - representedMs;
  }
  return new Date(utcMs).toISOString();
}

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
  if (match.league === "mls" && match.venue && mlsVenueTimezones[match.venue]) {
    return { timezone: mlsVenueTimezones[match.venue], timezoneSource: "venue" };
  }
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
  const { timezone, timezoneSource } = resolveMatchTimezone(match);
  const kickoffUtc = match.kickoffUtc && !Number.isNaN(Date.parse(match.kickoffUtc))
    ? match.kickoffUtc
    : match.league === "mls" && timezone && match.date && match.time && match.time !== "TBD"
      ? localDateTimeToUtc(match.date, match.time, timezone)
      : parseKickoffUtc(match);
  if (!kickoffUtc) return null;
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
  const place = normalized.timezoneSource === "competition" || normalized.timezoneSource === "venue" ? normalized.timezone : null;
  const localLabel = locale === "en" ? "Local time" : "Hora local";
  return {
    display: label,
    sublabel: place ? localLabel : "Local time",
    ariaLabel: `Kickoff: ${label} local time${place ? ` in ${place}` : ""}`,
    normalized,
  };
}

type SurfaceMatch = {
  fixtureStatus?: string;
  kickoffUtc?: string;
  date?: string;
  time?: string;
  published?: boolean;
};

export function getMatchSurfaceEligibility(match: SurfaceMatch, now: Date | string = new Date()) {
  const historical = Boolean(match.published && match.fixtureStatus === "completed");
  const active = Boolean(match.published && isActiveFixtureState(classifyFixture(match, now)) && !historical);
  return {
    today: active,
    tomorrow: active,
    upcoming: active,
    history: historical,
  };
}

export function shouldAppearInToday(match: SurfaceMatch, now = new Date()) {
  return getMatchSurfaceEligibility(match, now).today;
}

export function shouldAppearInTomorrow(match: SurfaceMatch, now = new Date()) {
  return getMatchSurfaceEligibility(match, now).tomorrow;
}

export function shouldAppearInUpcoming(match: SurfaceMatch, now = new Date()) {
  return getMatchSurfaceEligibility(match, now).upcoming;
}

export function shouldAppearInPredictionHistory(match: SurfaceMatch, now = new Date()) {
  return getMatchSurfaceEligibility(match, now).history;
}
