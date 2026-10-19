import oct07 from "./protected-2026-10-07.json";
import oct08 from "./protected-2026-10-08.json";
import oct09 from "./protected-2026-10-09.json";
import oct10 from "./protected-2026-10-10.json";
import oct11 from "./protected-2026-10-11.json";
import oct12 from "./protected-2026-10-12.json";
import oct13 from "./protected-2026-10-13.json";
import oct14 from "./protected-2026-10-14.json";
import oct15 from "./protected-2026-10-15.json";
import oct16 from "./protected-2026-10-16.json";
import oct17 from "./protected-2026-10-17.json";
import oct18 from "./protected-2026-10-18.json";
import oct19 from "./protected-2026-10-19.json";

// SERVER-ONLY registry of every NHL protected-picks file (history settlement, tests). It holds the original
// pick and odds of PRIME VIP / BEST BET games, so it must never be imported by a client component or by
// src/data/nhl/slates.ts. One import line per published NHL day is the only change a new day needs here;
// test-nhl-settlement.mts fails if a protected-<day>.json file exists that this registry does not list, so a
// day can no longer be published without being wired into automatic settlement (the gap that left
// Oct 13-17 unsettled).
export type ProtectedNhlPick = { slug: string; pick: string; odds: number };
type ProtectedFile = { activeFromKey: string; entries: ProtectedNhlPick[] };

const FILES: ProtectedFile[] = [oct07, oct08, oct09, oct10, oct11, oct12, oct13, oct14, oct15, oct16, oct17, oct18, oct19] as ProtectedFile[];

export const PROTECTED_NHL_PICKS_BY_DAY: Record<string, ProtectedNhlPick[]> = Object.fromEntries(
  FILES.map((file) => [file.activeFromKey, file.entries]),
);
