// Single source of truth for the NBA "Today" day, mirroring src/lib/nhl-day.ts. Per the PSP NBA
// publication rule, the NBA day is America/Sao_Paulo (Brasilia time), never UTC, the browser zone,
// the server zone or the visitor's zone.
export const NBA_TIME_ZONE = "America/Sao_Paulo";

const dayParts = new Intl.DateTimeFormat("en-US", {
  timeZone: NBA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// YYYY-MM-DD for the NBA day that contains `now`.
export function getNbaTodayKey(now: Date = new Date()): string {
  const parts = Object.fromEntries(dayParts.formatToParts(now).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

// Human label for a YYYY-MM-DD key, for example "Tuesday, October 20, 2026".
export function formatNbaDayLabel(dayKey: string): string {
  return new Date(`${dayKey}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// The instant (UTC) at which `dayKey` becomes the active NBA day: 00:00 America/Sao_Paulo (fixed
// UTC-3, no DST since 2019). Used as the editorial "published/active since" timestamp of a slate.
export function getNbaDayStart(dayKey: string): Date | null {
  const candidate = new Date(`${dayKey}T03:00:00Z`);
  if (Number.isNaN(candidate.getTime())) return null;
  const before = new Date(candidate.getTime() - 1000);
  return getNbaTodayKey(candidate) === dayKey && getNbaTodayKey(before) !== dayKey ? candidate : null;
}
