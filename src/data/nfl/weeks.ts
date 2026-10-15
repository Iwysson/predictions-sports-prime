import { NFL_WEEK5_2026 } from "@/data/nfl/week5-2026-public";
import { NFL_WEEK6_2026 } from "@/data/nfl/week6-2026-public";
import type { NflPublicGame } from "@/lib/nfl-slates";

export type NflWeek = {
  weekNumber: number;
  season: number;
  // YYYY-MM-DD (America/New_York) of the week's first kickoff - the same role as an NHL slate's
  // dayKey. The active week is the latest one whose startDateKey has started.
  startDateKey: string;
  games: NflPublicGame[];
};

// Every published NFL week, oldest first. Adding a week here is the only change a new NFL week
// needs on the website and mobile feed (see resolveNflWeek below, reused by both - same pattern as
// src/data/nhl/slates.ts's resolveNhlSlate).
export const NFL_WEEKS: NflWeek[] = [
  { weekNumber: 5, season: 2026, startDateKey: "2026-10-08", games: NFL_WEEK5_2026 },
  { weekNumber: 6, season: 2026, startDateKey: "2026-10-15", games: NFL_WEEK6_2026 },
];

// The week for the NFL day `todayKey` (YYYY-MM-DD, America/New_York - reuse getNhlTodayKey, the
// NFL week also runs on the ET calendar day). It switches as soon as the new week's first kickoff
// day starts; nothing else decides it. Before the first week it returns null.
export function resolveNflWeek(todayKey: string): NflWeek | null {
  let active: NflWeek | null = null;
  for (const week of NFL_WEEKS) {
    if (week.startDateKey <= todayKey) active = week;
  }
  return active;
}
