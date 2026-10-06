import { NHL_PUBLIC_SLATE_OCT_06 } from "@/data/nhl/public-slate-2026-10-06";
import { NHL_PUBLIC_MATCHES_OCT_07, NHL_PUBLIC_MULTIPLE_OCT_07 } from "@/data/nhl/slate-2026-10-07";
import type { NhlPublicSlate } from "@/lib/nhl-slates";

// Every NHL day with a slate, oldest first. Adding a day here (and its protected entries) is the
// only change a new NHL day needs. The active slate is the latest one whose day has started.
const SLATES: NhlPublicSlate[] = [
  {
    dayKey: "2026-10-06",
    matches: NHL_PUBLIC_SLATE_OCT_06,
    multiple: {
      title: "NHL BEST MULTIPLE TODAY",
      badge: "FREE MULTIPLE",
      legs: [
        { fixture: "New Jersey Devils vs Utah Mammoth", teams: ["New Jersey Devils", "Utah Mammoth"], pick: "New Jersey Devils to win", odds: null },
        { fixture: "Detroit Red Wings vs Ottawa Senators", teams: ["Detroit Red Wings", "Ottawa Senators"], pick: "Over 5.5 Goals", odds: null },
      ],
      combinedOdds: null,
      comment:
        "This editorial multiple is FREE and does not change either game's individual access level. No combined official odds are stated.",
    },
  },
  {
    dayKey: "2026-10-07",
    matches: NHL_PUBLIC_MATCHES_OCT_07,
    multiple: NHL_PUBLIC_MULTIPLE_OCT_07,
  },
];

// The slate for the NHL day `todayKey` (YYYY-MM-DD, America/New_York). It switches at 00:00 ET
// because the key changes; nothing else decides it. Before the first slate it returns null.
export function resolveNhlSlate(todayKey: string): NhlPublicSlate | null {
  let active: NhlPublicSlate | null = null;
  for (const slate of SLATES) {
    if (slate.dayKey <= todayKey) active = slate;
  }
  return active;
}
