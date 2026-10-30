// Automatic NHL prediction history/settlement. Every row here traces back to a prediction that
// was actually published (public free pick, or protected VIP/BEST pick revealed once the game is
// final — the same post-settlement transparency already used by the football /results archive).
// Nothing here fabricates a result: a game that is not FINAL/OFF, or a pick this engine cannot
// parse, settles to "pending"/"unsupported" rather than a guessed win or loss (fail closed).
import { nhlMatches } from "@/lib/nhl";
import { PROTECTED_NHL_PICKS_BY_DAY } from "@/data/nhl/protected-registry";
import { expandDeferredSlate } from "@/data/nhl/deferred-slates";
import { NHL_PUBLICATION_TIME_ZONE, isNhlSlateReleased } from "@/lib/nhl-publication-policy";
import { decimalToAmericanOdds } from "@/lib/odds";
import type { FinalScoreGame, MatchStatus } from "@/lib/nhl-live";
import { findFinalScore } from "@/lib/nhl-live";
import { findNhlSlateForDay } from "@/data/nhl/slates";
import type { NhlAccessTier } from "@/lib/nhl-slates";

type ProtectedEntry = { slug: string; pick: string; odds: number };

// Original pick/odds of the PRIME VIP / BEST BET games of every published NHL day, keyed by day. 2026-10-06
// predates the protected files and comes from the legacy matches.en.json; every later day is read from
// src/data/nhl/protected-registry.ts, so a newly published day is settled with no change in this file.
const PROTECTED_BY_DAY: Record<string, ProtectedEntry[]> = {
  "2026-10-06": nhlMatches()
    .filter((m) => m.access === "vip")
    .map((m) => ({ slug: m.slug, pick: m.pick, odds: m.odds })),
  ...PROTECTED_NHL_PICKS_BY_DAY,
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
export function getNhlFullPredictionsForDay(dayKey: string, now: Date = new Date()): NhlFullPrediction[] {
  const registered = findNhlSlateForDay(dayKey);
  if (!registered) return [];
  // Never return anything for a slate that is not released at `now`, in the slate's own publication zone
  // (fail closed, same rule as the public site). A deferred slate's listing is filled in from the server-only module.
  const release = { date: registered.dayKey, timezone: registered.publicationTimezone ?? NHL_PUBLICATION_TIME_ZONE };
  if (!isNhlSlateReleased(release, now)) return [];
  const slate = expandDeferredSlate(registered, now) ?? registered;
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

// "void" = the game was cancelled (provider schedule state CNCL): the stake is returned, neither a win nor a loss.
export type NhlSettlementResult = "win" | "loss" | "push" | "void" | "pending" | "unsupported";

type ParsedNhlPick =
  | { kind: "moneyline"; side: "home" | "away" }
  | { kind: "spread"; side: "home" | "away"; line: number }
  | { kind: "total"; direction: "over" | "under"; line: number }
  | { kind: "unsupported" };

// Markets settled automatically: moneyline ("X to win", "X win", "X ML", each optionally followed by
// "(including OT/SO)" or "(including overtime and shootout)"), totals ("Over/Under N goals", "total goals"; a whole
// line such as 5.0 can push) and a spread / puck line ("X -1.5", "X +1.5 puck line"). Anything else - including a
// moneyline explicitly marked "Regulation Only" - is "unsupported" and is never guessed.
function teamSide(team: string, homeTeam: string, awayTeam: string): "home" | "away" | null {
  const name = team.trim().toLowerCase();
  if (name === homeTeam.toLowerCase()) return "home";
  if (name === awayTeam.toLowerCase()) return "away";
  return null;
}

const MONEYLINE_PICK = /^(.+?)\s+(?:to\s+win|win|ML)(?:\s*\(\s*including\s+(?:OT|overtime)[^)]*\))?$/i;

function parseNhlPick(pick: string, homeTeam: string, awayTeam: string): ParsedNhlPick {
  const normalized = pick.trim();
  const total = normalized.match(/^(Over|Under)\s+(\d+(?:\.\d+)?)\s*(?:Total\s+)?Goals?$/i);
  if (total) {
    return { kind: "total", direction: total[1].toLowerCase() as "over" | "under", line: Number(total[2]) };
  }
  const spread = normalized.match(/^(.+?)\s+([+-]\d+(?:\.\d+)?)(?:\s+puck\s*line)?$/i);
  if (spread) {
    const side = teamSide(spread[1], homeTeam, awayTeam);
    if (side) return { kind: "spread", side, line: Number(spread[2]) };
  }
  const moneyline = normalized.match(MONEYLINE_PICK);
  if (moneyline) {
    const side = teamSide(moneyline[1], homeTeam, awayTeam);
    if (side) return { kind: "moneyline", side };
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
  finalScore: { homeScore: number; awayScore: number; state: MatchStatus; voided?: boolean } | null,
): NhlSettlementResult {
  const parsed = parseNhlPick(pick, homeTeam, awayTeam);
  if (parsed.kind === "unsupported") return "unsupported";
  if (finalScore?.voided) return "void";
  if (!finalScore || finalScore.state !== "finished") return "pending";
  const { homeScore, awayScore } = finalScore;
  if (parsed.kind === "spread") {
    // The picked side's margin plus the handicap: > 0 wins, 0 pushes (whole-number lines), < 0 loses.
    const margin = (parsed.side === "home" ? homeScore - awayScore : awayScore - homeScore) + parsed.line;
    return margin > 0 ? "win" : margin === 0 ? "push" : "loss";
  }
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
export function buildNhlHistoryDay(dayKey: string, finalScores: FinalScoreGame[], now: Date = new Date()): NhlHistoryDay {
  const rows: NhlHistoryRow[] = getNhlFullPredictionsForDay(dayKey, now)
    .map((p) => {
      const game = findFinalScore(finalScores, p.homeTeam, p.awayTeam);
      const revealed = p.access === "free" || (game !== null && (game.state === "finished" || game.voided === true));
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
