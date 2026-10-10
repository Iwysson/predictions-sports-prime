// Automatic NHL prediction history/settlement. Every row here traces back to a prediction that
// was actually published (public free pick, or protected VIP/BEST pick revealed once the game is
// final — the same post-settlement transparency already used by the football /results archive).
// Nothing here fabricates a result: a game that is not FINAL/OFF, or a pick this engine cannot
// parse, settles to "pending"/"unsupported" rather than a guessed win or loss (fail closed).
import { nhlMatches } from "@/lib/nhl";
import protectedOct07 from "@/data/nhl/protected-2026-10-07.json";
import protectedOct08 from "@/data/nhl/protected-2026-10-08.json";
import protectedOct09 from "@/data/nhl/protected-2026-10-09.json";
import protectedOct10 from "@/data/nhl/protected-2026-10-10.json";
import protectedOct11 from "@/data/nhl/protected-2026-10-11.json";
import { decimalToAmericanOdds } from "@/lib/odds";
import type { FinalScoreGame, MatchStatus } from "@/lib/nhl-live";
import { findFinalScore } from "@/lib/nhl-live";
import { findNhlSlateForDay } from "@/data/nhl/slates";
import type { NhlAccessTier } from "@/lib/nhl-slates";

type ProtectedEntry = { slug: string; pick: string; odds: number };

// One entry per published NHL day. A new day needs one line here, mirroring the existing
// slates.ts convention ("adding a day is the only change a new NHL day needs"): no WIN/LOSS is
// ever typed in by hand, only the already-published pick/odds source for that day.
const PROTECTED_BY_DAY: Record<string, ProtectedEntry[]> = {
  "2026-10-06": nhlMatches()
    .filter((m) => m.access === "vip")
    .map((m) => ({ slug: m.slug, pick: m.pick, odds: m.odds })),
  "2026-10-07": (protectedOct07 as { entries: ProtectedEntry[] }).entries,
  "2026-10-08": (protectedOct08 as { entries: ProtectedEntry[] }).entries,
  "2026-10-09": (protectedOct09 as { entries: ProtectedEntry[] }).entries,
  "2026-10-10": (protectedOct10 as { entries: ProtectedEntry[] }).entries,
  "2026-10-11": (protectedOct11 as { entries: ProtectedEntry[] }).entries,
};

export type NhlFullPrediction = {
  slug: string;
  homeTeam: string;
  awayTeam: string;
  access: NhlAccessTier;
  pick: string;
  decimalOdds: number;
};

// Full pick+odds for every match PSP actually published on `dayKey`, merging the public FREE
// fields with the protected VIP/BEST source for that day. A match with no recoverable pick is
// omitted rather than guessed.
export function getNhlFullPredictionsForDay(dayKey: string): NhlFullPrediction[] {
  const slate = findNhlSlateForDay(dayKey);
  if (!slate) return [];
  const protectedBySlug = new Map((PROTECTED_BY_DAY[dayKey] ?? []).map((e) => [e.slug, e]));
  const out: NhlFullPrediction[] = [];
  for (const m of slate.matches) {
    if (m.access === "free" && m.pick !== undefined && m.odds !== undefined) {
      out.push({ slug: m.slug, homeTeam: m.homeTeam, awayTeam: m.awayTeam, access: m.access, pick: m.pick, decimalOdds: m.odds });
      continue;
    }
    const entry = protectedBySlug.get(m.slug);
    if (entry) {
      out.push({ slug: m.slug, homeTeam: m.homeTeam, awayTeam: m.awayTeam, access: m.access, pick: entry.pick, decimalOdds: entry.odds });
    }
  }
  return out;
}

export type NhlSettlementResult = "win" | "loss" | "push" | "pending" | "unsupported";

type ParsedNhlPick =
  | { kind: "moneyline"; side: "home" | "away" }
  | { kind: "total"; direction: "over" | "under"; line: number }
  | { kind: "unsupported" };

// Moneyline / Team to Win, and Over/Under X.5 Goals are the only NHL markets settled
// automatically today, per the current editorial scope. Anything else is "unsupported".
function parseNhlPick(pick: string, homeTeam: string, awayTeam: string): ParsedNhlPick {
  const normalized = pick.trim();
  const total = normalized.match(/^(Over|Under)\s+(\d+(?:\.\d+)?)\s*(?:Total\s+)?Goals?$/i);
  if (total) {
    return { kind: "total", direction: total[1].toLowerCase() as "over" | "under", line: Number(total[2]) };
  }
  const moneyline = normalized.match(/^(.+?)\s+to\s+win(?:\s*\(\s*including\s+OT[^)]*\))?$/i);
  if (moneyline) {
    const team = moneyline[1].trim().toLowerCase();
    if (team === homeTeam.toLowerCase()) return { kind: "moneyline", side: "home" };
    if (team === awayTeam.toLowerCase()) return { kind: "moneyline", side: "away" };
  }
  return { kind: "unsupported" };
}

// NHL MONEYLINE RULE: unless a pick is explicitly marked "Regulation Only", a moneyline selection
// includes overtime and shootout. The NHL Web API's final score already reflects the actual
// winner after OT/SO once the game reaches FINAL/OFF, so grading it is a plain score comparison —
// no separate OT/SO branch is needed, and NHL games are never drawn.
export function settleNhlPrediction(
  pick: string,
  homeTeam: string,
  awayTeam: string,
  finalScore: { homeScore: number; awayScore: number; state: MatchStatus } | null,
): NhlSettlementResult {
  const parsed = parseNhlPick(pick, homeTeam, awayTeam);
  if (parsed.kind === "unsupported") return "unsupported";
  if (!finalScore || finalScore.state !== "finished") return "pending";
  const { homeScore, awayScore } = finalScore;
  if (parsed.kind === "moneyline") {
    if (homeScore === awayScore) return "unsupported"; // a finished NHL game is never drawn
    const homeWon = homeScore > awayScore;
    const picked = parsed.side === "home" ? homeWon : !homeWon;
    return picked ? "win" : "loss";
  }
  const total = homeScore + awayScore;
  if (total === parsed.line) return "push";
  const covered = parsed.direction === "over" ? total > parsed.line : total < parsed.line;
  return covered ? "win" : "loss";
}

export type NhlHistoryRow = NhlFullPrediction & {
  result: NhlSettlementResult;
  americanOdds: number;
  finalScore: { home: number; away: number } | null;
};

export type NhlHistoryDay = {
  dayKey: string;
  rows: NhlHistoryRow[];
  wins: number;
  losses: number;
};

// Settles every published prediction for `dayKey` against the provider's final scores for that
// day. `finalScores` may be an empty array (provider unavailable) — every row then settles to
// "pending", never to a guessed loss.
//
// VIP leak guard: this endpoint is public, so a PRIME VIP/BEST BET pick is only ever included
// once the game it belongs to is actually FINAL/OFF. Before that, the row is dropped entirely —
// the gated daily card remains the only place that pick can appear pre-kickoff. A FREE pick is
// already public on the daily card, so it is never withheld, including while still pending.
export function buildNhlHistoryDay(dayKey: string, finalScores: FinalScoreGame[]): NhlHistoryDay {
  const rows: NhlHistoryRow[] = getNhlFullPredictionsForDay(dayKey)
    .map((p) => {
      const game = findFinalScore(finalScores, p.homeTeam, p.awayTeam);
      const revealed = p.access === "free" || (game !== null && game.state === "finished");
      if (!revealed) return null;
      const result = settleNhlPrediction(p.pick, p.homeTeam, p.awayTeam, game);
      return {
        ...p,
        result,
        americanOdds: decimalToAmericanOdds(p.decimalOdds),
        finalScore: game ? { home: game.homeScore, away: game.awayScore } : null,
      } satisfies NhlHistoryRow;
    })
    .filter((row): row is NhlHistoryRow => row !== null);
  return {
    dayKey,
    rows,
    wins: rows.filter((r) => r.result === "win").length,
    losses: rows.filter((r) => r.result === "loss").length,
  };
}
