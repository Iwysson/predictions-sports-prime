// PSP mandatory NHL publication rule: an NHL match dated `matchDate` (YYYY-MM-DD) may only become
// public at or after 00:00:00 on that same calendar date in America/Sao_Paulo. This is reusable for
// every future NHL prediction — never a fixed UTC instant, never a one-off exception for specific
// games. See NHL-PUBLICATION-RULE.md in the PSP-UNIFIED-2026-10-16-19 publication batch.
//
// Note: the website's existing NHL day resolver (src/lib/nhl-day.ts, America/New_York) already
// switches strictly later than this gate for every date (New York's UTC offset is always more
// negative than Sao Paulo's fixed UTC-3, so ET local midnight is always >= Sao Paulo local midnight
// in absolute time). This helper is the explicit, auditable form of the rule and the one future NHL
// integrations should check directly rather than relying on that incidental ordering.
export const NHL_PUBLICATION_TIME_ZONE = "America/Sao_Paulo" as const;

export function isNhlMatchDayReleased(matchDate: string, now: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(matchDate)) return false;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: NHL_PUBLICATION_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const localDate = `${get("year")}-${get("month")}-${get("day")}`;
  return localDate >= matchDate;
}
