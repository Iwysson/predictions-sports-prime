import type { NbaPublicSlate } from "@/lib/nba-slates";
import { NBA_PUBLICATION_TIME_ZONE, isNbaSlateReleased } from "@/lib/nba-publication-policy";

// Every published NBA day, oldest first, mirroring src/data/nhl/slates.ts. Adding a day here (and
// its protected entries) is the only change a new NBA day needs. Deferred: nothing about these 3
// games (not even the teams) is in this client-visible file. The listing is server-only
// (src/data/nba/deferred-slates.ts) and the full content is protected
// (src/data/nba/protected-2026-10-20.json). Release: 2026-10-20 00:00:00 America/Sao_Paulo.
export const NBA_SLATES: NbaPublicSlate[] = [
  { dayKey: "2026-10-20", matches: [], deferred: true, publicationTimezone: NBA_PUBLICATION_TIME_ZONE },
];

// The slate for the NBA day `todayKey` (YYYY-MM-DD, America/Sao_Paulo). It switches at 00:00 BRT
// because the key changes; nothing else decides it. Before the first slate it returns null.
//
// `skipDeferred` lets a client fall back to the previous slate while a deferred slate's listing has
// not been fetched yet (or the fetch was refused because the server clock has not reached the gate).
export function resolveNbaSlate(
  todayKey: string,
  now: Date = new Date(),
  options: { skipDeferred?: boolean } = {},
): NbaPublicSlate | null {
  let active: NbaPublicSlate | null = null;
  for (const slate of NBA_SLATES) {
    if (options.skipDeferred && slate.deferred) continue;
    const release = { date: slate.dayKey, timezone: slate.publicationTimezone ?? NBA_PUBLICATION_TIME_ZONE };
    if (slate.dayKey <= todayKey && isNbaSlateReleased(release, now)) active = slate;
  }
  return active;
}

// The exact slate published for `dayKey`, or null if no slate was published that day.
export function findNbaSlateForDay(dayKey: string): NbaPublicSlate | null {
  return NBA_SLATES.find((slate) => slate.dayKey === dayKey) ?? null;
}

// Every published NBA day, oldest first.
export function allNbaDayKeys(): string[] {
  return NBA_SLATES.map((slate) => slate.dayKey);
}
