// Single source of truth for the NHL "Today" day. The official NHL day is America/New_York
// (IANA zone, so DST is handled by Intl). Never use UTC, the browser zone, the server zone or
// the visitor's zone for this decision. Home and /nhl/ both call this helper.
export const NHL_TIME_ZONE = "America/New_York";

const dayParts = new Intl.DateTimeFormat("en-US", {
  timeZone: NHL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// YYYY-MM-DD for the NHL day that contains `now`.
export function getNhlTodayKey(now: Date = new Date()): string {
  const parts = Object.fromEntries(dayParts.formatToParts(now).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

// Human label for a YYYY-MM-DD key, for example "Wednesday, October 7, 2026".
export function formatNhlDayLabel(dayKey: string): string {
  return new Date(`${dayKey}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
