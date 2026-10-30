// PSP NBA publication rule, mirroring the NHL rule (src/lib/nhl-publication-policy.ts) without
// modifying it: an NBA slate dated `date` (YYYY-MM-DD) may only become public at or after 00:00:00
// on that same calendar date in America/Sao_Paulo (Brasilia time), per the user-mandated rule.
// `isNhlSlateReleased` is a generic "now >= 00:00 of `date` in `timezone`" check (not NHL-specific
// despite its name - see src/lib/match-release.ts, which already reuses it for football), so this
// file only wraps it with NBA-appropriate names rather than duplicating the comparison logic.
import { isNhlSlateReleased, type NhlSlateRelease } from "@/lib/nhl-publication-policy";

export const NBA_PUBLICATION_TIME_ZONE = "America/Sao_Paulo" as const;

export type NbaSlateRelease = NhlSlateRelease;

export function isNbaSlateReleased(release: NbaSlateRelease, now: Date = new Date()): boolean {
  return isNhlSlateReleased(release, now);
}

export function isNbaMatchDayReleased(matchDate: string, now: Date = new Date()): boolean {
  return isNbaSlateReleased({ date: matchDate, timezone: NBA_PUBLICATION_TIME_ZONE }, now);
}
