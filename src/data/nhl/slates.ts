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
import { NHL_NEW_YORK_TIME_ZONE, NHL_PUBLICATION_TIME_ZONE, isNhlSlateReleased } from "@/lib/nhl-publication-policy";

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
  // Deferred slate: nothing about these 14 games (not even the teams) is in this client-visible file. The
  // listing is server-only (src/data/nhl/deferred-slates.ts) and the full content is protected
  // (src/data/nhl/protected-2026-10-17.json). Release: 2026-10-17 00:00:00 America/New_York.
  { dayKey: "2026-10-17", matches: [], multiples: [], deferred: true, publicationTimezone: NHL_NEW_YORK_TIME_ZONE },
  // Deferred slate (2 games), same pattern. Server-only listing: src/data/nhl/deferred-slate-2026-10-18.json;
  // protected content: src/data/nhl/protected-2026-10-18.json. Release: 2026-10-18 00:00:00 America/New_York.
  { dayKey: "2026-10-18", matches: [], multiples: [], deferred: true, publicationTimezone: NHL_NEW_YORK_TIME_ZONE },
  // Deferred slate (4 games, 2 FREE + 2 PRIME VIP), same pattern. Server-only listing:
  // src/data/nhl/deferred-slate-2026-10-19.json; protected content: src/data/nhl/protected-2026-10-19.json.
  // Release: 2026-10-19 00:00:00 America/New_York.
  { dayKey: "2026-10-19", matches: [], multiples: [], deferred: true, publicationTimezone: NHL_NEW_YORK_TIME_ZONE },
];

// The slate for the NHL day `todayKey` (YYYY-MM-DD, America/New_York). It switches at 00:00 ET
// because the key changes; nothing else decides it. Before the first slate it returns null.
//
// Mandatory PSP NHL publication rule: a slate also never activates before 00:00 on its own dayKey in its
// publication time zone (src/lib/nhl-publication-policy.ts). A slate without `publicationTimezone` keeps
// the original America/Sao_Paulo rule, whose midnight is never later than New York's, so for those slates
// the dayKey comparison is the binding one. A slate with `publicationTimezone: "America/New_York"` opens at
// exactly the New York midnight, evaluated with the IANA zone (EST/EDT handled by Intl, no fixed offset).
//
// `skipDeferred` lets a client fall back to the previous slate while a deferred slate's listing has not
// been fetched yet (or the fetch was refused because the server clock has not reached the gate).
export function resolveNhlSlate(
  todayKey: string,
  now: Date = new Date(),
  options: { skipDeferred?: boolean } = {},
): NhlPublicSlate | null {
  let active: NhlPublicSlate | null = null;
  for (const slate of SLATES) {
    if (options.skipDeferred && slate.deferred) continue;
    const release = { date: slate.dayKey, timezone: slate.publicationTimezone ?? NHL_PUBLICATION_TIME_ZONE };
    if (slate.dayKey <= todayKey && isNhlSlateReleased(release, now)) active = slate;
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
