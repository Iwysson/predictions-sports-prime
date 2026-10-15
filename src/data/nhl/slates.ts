import { NHL_PUBLIC_SLATE_OCT_06 } from "@/data/nhl/public-slate-2026-10-06";
import { NHL_PUBLIC_MATCHES_OCT_07, NHL_PUBLIC_MULTIPLE_OCT_07 } from "@/data/nhl/slate-2026-10-07";
import {
  NHL_PUBLIC_MATCHES_OCT_08,
  NHL_MULTIPLE_OCT_08,
  NHL_FOOTBALL_MULTIPLE_OCT_08,
  NFL_FOOTBALL_MULTIPLE_OCT_08,
} from "@/data/nhl/slate-2026-10-08";
import { NHL_PUBLIC_MATCHES_OCT_09 } from "@/data/nhl/slate-2026-10-09";
import { NHL_PUBLIC_MATCHES_OCT_10 } from "@/data/nhl/slate-2026-10-10";
import { NHL_PUBLIC_MATCHES_OCT_11 } from "@/data/nhl/slate-2026-10-11";
import { NHL_PUBLIC_MATCHES_OCT_12 } from "@/data/nhl/slate-2026-10-12";
import { NHL_PUBLIC_MATCHES_OCT_13 } from "@/data/nhl/slate-2026-10-13";
import { NHL_PUBLIC_MATCHES_OCT_14 } from "@/data/nhl/slate-2026-10-14";
import { NHL_PUBLIC_MATCHES_OCT_15 } from "@/data/nhl/slate-2026-10-15";
import { NHL_PUBLIC_MATCHES_OCT_16 } from "@/data/nhl/slate-2026-10-16";
import type { NhlPublicSlate } from "@/lib/nhl-slates";
import { isNhlMatchDayReleased } from "@/lib/nhl-publication-policy";

// Every NHL day with a slate, oldest first. Adding a day here (and its protected entries) is the
// only change a new NHL day needs. The active slate is the latest one whose day has started.
export const SLATES: NhlPublicSlate[] = [
  {
    dayKey: "2026-10-06",
    matches: NHL_PUBLIC_SLATE_OCT_06,
    multiples: [
      {
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
    ],
  },
  {
    dayKey: "2026-10-07",
    matches: NHL_PUBLIC_MATCHES_OCT_07,
    multiples: [NHL_PUBLIC_MULTIPLE_OCT_07],
  },
  {
    dayKey: "2026-10-08",
    matches: NHL_PUBLIC_MATCHES_OCT_08,
    multiples: [NHL_MULTIPLE_OCT_08, NHL_FOOTBALL_MULTIPLE_OCT_08, NFL_FOOTBALL_MULTIPLE_OCT_08],
  },
  {
    dayKey: "2026-10-09",
    matches: NHL_PUBLIC_MATCHES_OCT_09,
    multiples: [],
  },
  {
    dayKey: "2026-10-10",
    matches: NHL_PUBLIC_MATCHES_OCT_10,
    multiples: [],
  },
  {
    dayKey: "2026-10-11",
    matches: NHL_PUBLIC_MATCHES_OCT_11,
    multiples: [],
  },
  {
    dayKey: "2026-10-12",
    matches: NHL_PUBLIC_MATCHES_OCT_12,
    multiples: [],
  },
  {
    dayKey: "2026-10-13",
    matches: NHL_PUBLIC_MATCHES_OCT_13,
    multiples: [],
  },
  { dayKey: "2026-10-14", matches: NHL_PUBLIC_MATCHES_OCT_14, multiples: [] },
  { dayKey: "2026-10-15", matches: NHL_PUBLIC_MATCHES_OCT_15, multiples: [] },
  { dayKey: "2026-10-16", matches: NHL_PUBLIC_MATCHES_OCT_16, multiples: [] },
];

// The slate for the NHL day `todayKey` (YYYY-MM-DD, America/New_York). It switches at 00:00 ET
// because the key changes; nothing else decides it. Before the first slate it returns null.
//
// Mandatory PSP NHL publication rule: a slate also never activates before 00:00 America/Sao_Paulo
// on its own dayKey (src/lib/nhl-publication-policy.ts). In practice America/New_York's local
// midnight is always at or after America/Sao_Paulo's for the same date (New York's UTC offset is
// always more negative than Sao Paulo's fixed UTC-3), so this check is normally already satisfied
// by the dayKey comparison above; it is kept explicit so the rule is enforced directly rather than
// relying on that incidental ordering.
export function resolveNhlSlate(todayKey: string, now: Date = new Date()): NhlPublicSlate | null {
  let active: NhlPublicSlate | null = null;
  for (const slate of SLATES) {
    if (slate.dayKey <= todayKey && isNhlMatchDayReleased(slate.dayKey, now)) active = slate;
  }
  return active;
}

// The exact slate published for `dayKey`, or null if no slate was published that day. Unlike
// resolveNhlSlate, this never falls back to an earlier day — used by history/settlement, which
// must only ever grade a prediction that was actually published for that day.
export function findNhlSlateForDay(dayKey: string): NhlPublicSlate | null {
  return SLATES.find((slate) => slate.dayKey === dayKey) ?? null;
}

// Every published NHL day, oldest first. Adding a day to SLATES is the only change this needs.
export function allNhlDayKeys(): string[] {
  return SLATES.map((slate) => slate.dayKey);
}
