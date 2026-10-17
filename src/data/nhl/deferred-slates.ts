import type { NhlPublicMatch, NhlPublicSlate } from "../../lib/nhl-slates";
import { NHL_PUBLICATION_TIME_ZONE, isNhlSlateReleased } from "../../lib/nhl-publication-policy";
import oct17 from "./deferred-slate-2026-10-17.json";
import oct18 from "./deferred-slate-2026-10-18.json";

// SERVER-ONLY. Never import this module from a client component or from src/data/nhl/slates.ts: it holds
// the public listing (teams, titles, tier badges, teasers - never a pick, odds or analysis) of slates whose
// publication gate has not opened yet, and anything imported by client code ships in the public JS bundle
// before the gate. Only the Pages Functions (/api/nhl/slate/[day], /api/mobile/nhl/feed) and build/test
// scripts import it. Each slate is registered in SLATES (src/data/nhl/slates.ts) with `deferred: true`, an
// empty `matches` and its `publicationTimezone`; the listing is added here and released by that same rule.
const DEFERRED_MATCHES: Record<string, NhlPublicMatch[]> = {
  [oct17.dayKey]: oct17.matches as NhlPublicMatch[],
  [oct18.dayKey]: oct18.matches as NhlPublicMatch[],
};

export function deferredMatchesFor(dayKey: string): NhlPublicMatch[] {
  return DEFERRED_MATCHES[dayKey] ?? [];
}

// A slate with its deferred listing filled in. The release rule is re-checked here, with the same IANA
// zone the resolver uses, so a caller can never obtain the listing of a slate that is not released at `now`.
export function expandDeferredSlate(slate: NhlPublicSlate | null, now: Date = new Date()): NhlPublicSlate | null {
  if (!slate?.deferred) return slate;
  const released = isNhlSlateReleased(
    { date: slate.dayKey, timezone: slate.publicationTimezone ?? NHL_PUBLICATION_TIME_ZONE },
    now,
  );
  return released ? { ...slate, matches: deferredMatchesFor(slate.dayKey) } : { ...slate, matches: [] };
}
