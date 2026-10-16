// PSP mandatory NHL publication rule: an NHL slate dated `date` (YYYY-MM-DD) may only become public
// at or after 00:00:00 on that same calendar date in the slate's publication time zone. This is
// reusable for every NHL slate - never a fixed UTC instant, never a one-off exception for specific
// games, and never a hardcoded UTC offset: the zone is an IANA name, so EST/EDT (and any other DST
// change) is handled by Intl.
//
// Slates published before the New York batch keep the original America/Sao_Paulo rule
// (NHL_PUBLICATION_TIME_ZONE) so their behaviour is not changed retroactively. A slate can opt into any
// other IANA zone with `publicationTimezone` (see NhlPublicSlate); the 2026-10-17 slate uses
// America/New_York.
//
// Note: the website's NHL day resolver (src/lib/nhl-day.ts, America/New_York) is a second, independent
// gate that every slate must also pass. For the Sao Paulo rule it is always the later of the two (New
// York's UTC offset is always more negative than Sao Paulo's fixed UTC-3). For an America/New_York slate
// both gates open at exactly the same instant.
export const NHL_PUBLICATION_TIME_ZONE = "America/Sao_Paulo" as const;
export const NHL_NEW_YORK_TIME_ZONE = "America/New_York" as const;

export type NhlSlateRelease = { date: string; timezone: string };

const formatters = new Map<string, Intl.DateTimeFormat>();

// YYYY-MM-DD of `now` as seen on the wall clock of `timeZone`. Returns null for an unknown zone.
export function localDateKeyInZone(timeZone: string, now: Date = new Date()): string | null {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    try {
      formatter = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
    } catch {
      return null;
    }
    formatters.set(timeZone, formatter);
  }
  const parts = formatter.formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

// released = now >= 00:00:00 of `date` in `timezone`. The comparison is on the zone's local calendar date,
// so it is correct on both sides of a DST change. Fails closed: a malformed date or unknown zone is never released.
export function isNhlSlateReleased({ date, timezone }: NhlSlateRelease, now: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const localDate = localDateKeyInZone(timezone, now);
  if (localDate === null) return false;
  return localDate >= date;
}

// Original rule (America/Sao_Paulo), kept for slates that predate per-slate time zones.
export function isNhlMatchDayReleased(matchDate: string, now: Date = new Date()): boolean {
  return isNhlSlateReleased({ date: matchDate, timezone: NHL_PUBLICATION_TIME_ZONE }, now);
}
