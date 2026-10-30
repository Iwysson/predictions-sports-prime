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

// The instant (UTC) at which `dayKey` becomes the active NHL day: 00:00 America/New_York. DST is handled by
// probing the two possible offsets (UTC-4 and UTC-5) with the same day resolver the page uses. Used as the
// editorial "published/active since" timestamp of a slate; it is never the build time.
export function getNhlDayStart(dayKey: string): Date | null {
  for (const hours of [4, 5]) {
    const candidate = new Date(`${dayKey}T0${hours}:00:00Z`);
    if (Number.isNaN(candidate.getTime())) return null;
    const before = new Date(candidate.getTime() - 1000);
    if (getNhlTodayKey(candidate) === dayKey && getNhlTodayKey(before) !== dayKey) return candidate;
  }
  return null;
}
