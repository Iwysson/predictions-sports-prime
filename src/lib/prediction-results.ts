import type { MatchPreview, PredictionResultStatus } from "@/types";
import { normalizeTeamKey } from "@/lib/openfootball";
import { isCompletedFixture, isValidFinalScore } from "@/lib/fixture-status";

type Score = { home: number; away: number };

export type SettlementPendingReason =
  | "NOT_COMPLETED"
  | "FINAL_SCORE_MISSING"
  | "PICK_MISSING"
  | "UNSUPPORTED_MARKET"
  | "MARKET_DATA_MISSING"
  | "TEAM_NOT_RESOLVED"
  | "MANUAL_PENDING";

export type ParsedPredictionLeg =
  | { kind: "total-goals"; selection: "over" | "under"; line: number; source: string }
  | { kind: "btts"; selection: "yes" | "no"; source: string }
  | { kind: "double-chance"; team: string; side?: "1X" | "X2"; source: string }
  | { kind: "win"; team: string; source: string }
  | { kind: "team-total"; team: string; selection: "over" | "under"; line: number; source: string }
  | { kind: "handicap"; team: string; line: number; source: string }
  | { kind: "corners"; source: string };

export type SettlementEvaluation = {
  status: PredictionResultStatus;
  pendingReason?: SettlementPendingReason;
  legs: ParsedPredictionLeg[];
  unsupportedLegs: string[];
};

function settle(value: number): PredictionResultStatus {
  return value > 0 ? "green" : value < 0 ? "red" : "push";
}

function mergeQuarterHandicap(left: PredictionResultStatus, right: PredictionResultStatus): PredictionResultStatus | null {
  if (left === right) return left;
  const states = new Set([left, right]);
  if (states.has("green") && states.has("push")) return "half-green";
  if (states.has("red") && states.has("push")) return "half-red";
  return null;
}

function settleHandicap(goalDifference: number, line: number): PredictionResultStatus {
  const quarter = Math.round(Math.abs(line * 100)) % 50 === 25;
  if (!quarter) return settle(goalDifference + line);
  const lower = Math.floor(line * 2) / 2;
  const upper = Math.ceil(line * 2) / 2;
  return mergeQuarterHandicap(settle(goalDifference + lower), settle(goalDifference + upper)) ?? "pending";
}

function selectedTeamIsHome(label: string, match: MatchPreview) {
  const selected = normalizeTeamKey(label);
  const home = normalizeTeamKey(match.homeTeam);
  const away = normalizeTeamKey(match.awayTeam);
  if (selected === home || home.includes(selected) || selected.includes(home)) return true;
  if (selected === away || away.includes(selected) || selected.includes(away)) return false;
  return null;
}

function parseLeg(source: string): ParsedPredictionLeg | null {
  if (/\bCorners?$/i.test(source)) return { kind: "corners", source };

  const total = source.match(/^(Over|Under) (\d+(?:\.\d+)?) Goals$/i);
  if (total) return { kind: "total-goals", selection: total[1].toLowerCase() as "over" | "under", line: Number(total[2]), source };

  const btts = source.match(/^Both Teams to Score\s*[-\u2014]\s*(Yes|No)$/i);
  if (btts) return { kind: "btts", selection: btts[1].toLowerCase() as "yes" | "no", source };

  const doubleChance = source.match(/^(.+?) or Draw(?: \((1X|X2)\))?$/i);
  if (doubleChance) return { kind: "double-chance", team: doubleChance[1], side: doubleChance[2]?.toUpperCase() as "1X" | "X2" | undefined, source };

  const teamTotal = source.match(/^(.+?) (Over|Under) (\d+(?:\.\d+)?) Team Goals$/i);
  if (teamTotal) return { kind: "team-total", team: teamTotal[1], selection: teamTotal[2].toLowerCase() as "over" | "under", line: Number(teamTotal[3]), source };

  const handicap = source.match(/^(.+?) ([+-]\d+(?:\.\d+)?) (?:Asian )?Handicap$/i);
  if (handicap) return { kind: "handicap", team: handicap[1], line: Number(handicap[2]), source };

  const win = source.match(/^(.+?) to Win$/i);
  if (win) return { kind: "win", team: win[1], source };

  return null;
}

export function parsePredictionMarket(value: string) {
  const sourceLegs = value.split(/\s+\+\s+/).map((part) => part.trim()).filter(Boolean);
  const legs: ParsedPredictionLeg[] = [];
  const unsupportedLegs: string[] = [];
  for (const source of sourceLegs) {
    const leg = parseLeg(source);
    if (leg) legs.push(leg);
    else unsupportedLegs.push(source);
  }
  return { legs, unsupportedLegs };
}

function settleDirectional(value: number, selection: "over" | "under") {
  return settle(selection === "over" ? value : -value);
}

function evaluateLeg(leg: ParsedPredictionLeg, match: MatchPreview, score: Score) {
  const totalGoals = score.home + score.away;
  if (leg.kind === "corners") return { status: "pending" as const, reason: "MARKET_DATA_MISSING" as const };
  if (leg.kind === "total-goals") return { status: settleDirectional(totalGoals - leg.line, leg.selection) };
  if (leg.kind === "btts") {
    const bothScored = score.home > 0 && score.away > 0;
    return { status: bothScored === (leg.selection === "yes") ? "green" as const : "red" as const };
  }

  const isHome = leg.kind === "double-chance" && leg.side
    ? leg.side === "1X"
    : selectedTeamIsHome(leg.team, match);
  if (isHome === null) return { status: "pending" as const, reason: "TEAM_NOT_RESOLVED" as const };

  if (leg.kind === "double-chance") {
    return { status: isHome ? (score.home >= score.away ? "green" as const : "red" as const) : (score.away >= score.home ? "green" as const : "red" as const) };
  }
  if (leg.kind === "win") {
    return { status: isHome ? (score.home > score.away ? "green" as const : "red" as const) : (score.away > score.home ? "green" as const : "red" as const) };
  }
  if (leg.kind === "team-total") {
    return { status: settleDirectional((isHome ? score.home : score.away) - leg.line, leg.selection) };
  }
  return { status: settleHandicap(isHome ? score.home - score.away : score.away - score.home, leg.line) };
}

function combineLegResults(results: PredictionResultStatus[]): PredictionResultStatus {
  if (results.some((result) => result === "red")) return "red";
  if (results.some((result) => result === "half-red")) return "half-red";
  if (results.every((result) => result === "push" || result === "void")) return "push";
  if (results.some((result) => result === "half-green")) return "half-green";
  if (results.some((result) => result === "green")) return "green";
  return "pending";
}

export function evaluatePredictionSettlement(match: MatchPreview): SettlementEvaluation {
  const parsed = parsePredictionMarket(match.mainPrediction ?? "");
  if (match.betResultSource === "manual" && match.betResult) {
    return {
      status: match.betResult,
      pendingReason: match.betResult === "pending" ? "MANUAL_PENDING" : undefined,
      ...parsed,
    };
  }
  if (!match.mainPrediction) return { status: "pending", pendingReason: "PICK_MISSING", ...parsed };
  if (!isCompletedFixture(match.fixtureStatus)) return { status: "pending", pendingReason: "NOT_COMPLETED", ...parsed };
  if (!isValidFinalScore(match.homeScore, match.awayScore)) return { status: "pending", pendingReason: "FINAL_SCORE_MISSING", ...parsed };
  if (parsed.unsupportedLegs.length > 0) return { status: "pending", pendingReason: "UNSUPPORTED_MARKET", ...parsed };

  const evaluations = parsed.legs.map((leg) => evaluateLeg(leg, match, { home: match.homeScore!, away: match.awayScore! }));
  const pending = evaluations.find((evaluation) => evaluation.status === "pending");
  if (pending) return { status: "pending", pendingReason: pending.reason ?? "UNSUPPORTED_MARKET", ...parsed };
  return { status: combineLegResults(evaluations.map((evaluation) => evaluation.status)), ...parsed };
}

export function evaluatePrediction(match: MatchPreview): PredictionResultStatus {
  return evaluatePredictionSettlement(match).status;
}

export function resolvePredictionResult(match: MatchPreview): MatchPreview {
  if (match.betResultSource === "manual" && match.betResult) return match;
  const status = evaluatePrediction(match);
  return { ...match, betResult: status, betResultSource: status === "pending" ? undefined : "automatic" };
}
