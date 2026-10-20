import type { NbaPublicMatch, NbaPublicSlate } from "@/lib/nba-slates";
import { NBA_PUBLICATION_TIME_ZONE, isNbaSlateReleased } from "@/lib/nba-publication-policy";
import oct20 from "./deferred-slate-2026-10-20.json";
import oct21 from "./deferred-slate-2026-10-21.json";

// SERVER-ONLY, mirroring src/data/nhl/deferred-slates.ts. Never import this module from a client
// component or from src/data/nba/slates.ts: it holds the public listing (teams, titles, tier
// badges, teasers - never a pick, odds or analysis) of slates whose publication gate has not opened
// yet, and anything imported by client code ships in the public JS bundle before the gate. Only the
// Pages Functions (/api/nba/slate/[day]) and build/test scripts import it.
const DEFERRED_MATCHES: Record<string, NbaPublicMatch[]> = {
  [oct20.dayKey]: oct20.matches as NbaPublicMatch[],
  [oct21.dayKey]: oct21.matches as NbaPublicMatch[],
};

export function deferredNbaMatchesFor(dayKey: string): NbaPublicMatch[] {
  return DEFERRED_MATCHES[dayKey] ?? [];
}

// A slate with its deferred listing filled in. The release rule is re-checked here, with the same
// IANA zone the resolver uses, so a caller can never obtain the listing of a slate that is not
// released at `now`.
export function expandDeferredNbaSlate(slate: NbaPublicSlate | null, now: Date = new Date()): NbaPublicSlate | null {
  if (!slate?.deferred) return slate;
  const released = isNbaSlateReleased(
    { date: slate.dayKey, timezone: slate.publicationTimezone ?? NBA_PUBLICATION_TIME_ZONE },
    now,
  );
  return released ? { ...slate, matches: deferredNbaMatchesFor(slate.dayKey) } : { ...slate, matches: [] };
}
