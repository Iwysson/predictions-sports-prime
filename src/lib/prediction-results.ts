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
  | "EXECUTION_DATA_MISSING"
  | "TEAM_NOT_RESOLVED"
  | "EVIDENCE_UNAVAILABLE"
  | "HANDICAP_TYPE_AMBIGUOUS"
  | "MANUAL_PENDING";

export type ParsedPredictionLeg =
  | { kind: "total-goals"; selection: "over" | "under"; line: number; source: string }
  | { kind: "live-entry"; market: string; source: string }
  | { kind: "btts"; selection: "yes" | "no"; source: string }
  | { kind: "double-chance"; team: string; side?: "1X" | "X2"; source: string }
  | { kind: "win"; team: string; source: string }
  | { kind: "team-total"; team: string; selection: "over" | "under"; line: number; source: string }
  | { kind: "handicap"; team: string; line: number; style?: "asian" | "european"; source: string }
  | { kind: "corners"; team?: string; selection: "over" | "under"; line: number; source: string };

export type SettlementEvaluation = {
  status: PredictionResultStatus;
  pendingReason?: SettlementPendingReason;
  missingFields: string[];
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
  const settlementTeamKey = (value: string) => {
    const normalized = normalizeTeamKey(value);
    if (normalized === "vitoriasc" || normalized === "vitoriaguimaraes") return "vitoriaguimaraes";
    return normalized;
  };
  const selected = settlementTeamKey(label);
  const home = settlementTeamKey(match.homeTeam);
  const away = settlementTeamKey(match.awayTeam);
  if (selected === home || home.includes(selected) || selected.includes(home)) return true;
  if (selected === away || away.includes(selected) || selected.includes(away)) return false;
  return null;
}

// Parentheticals that restate a market without changing what is graded. Removing them lets every
// published spelling reach one grammar; the original text is still what the record stores and shows.
const NON_SEMANTIC_SUFFIX = /\s*\((?:90[ -]minutes?(?: moneyline)?|win by \d\+ goals?|same[- ]game combination|handicap)\)$/i;

function parseLeg(source: string): ParsedPredictionLeg | null {
  const text = source.replace(NON_SEMANTIC_SUFFIX, "").trim();
  const liveEntry = text.match(/^(.+?)\s*[-—]\s*(?:Live Entry|Wait Live)$/i);
  if (liveEntry) {
    // "Live Entry" describes timing/price provenance, not a different sports
    // market. Once the fixture is final, grade the explicit market written
    // before the suffix (for example Over 1.5 Goals) from the factual result.
    // Retain the execution-only state only when that market cannot be parsed.
    return parseLeg(liveEntry[1].trim()) ?? { kind: "live-entry", market: liveEntry[1].trim(), source };
  }

  const totalCorners = text.match(/^(Over|Under) (\d+(?:\.\d+)?) (?:Total )?Corners?$/i);
  if (totalCorners) return { kind: "corners", selection: totalCorners[1].toLowerCase() as "over" | "under", line: Number(totalCorners[2]), source };

  const teamCorners = text.match(/^(.+?) (Over|Under) (\d+(?:\.\d+)?) (?:Team )?Corners?$/i);
  if (teamCorners) return { kind: "corners", team: teamCorners[1], selection: teamCorners[2].toLowerCase() as "over" | "under", line: Number(teamCorners[3]), source };

  const total = text.match(/^(Over|Under) (\d+(?:\.\d+)?)(?: Total)?(?: Goals?)?$/i);
  if (total) return { kind: "total-goals", selection: total[1].toLowerCase() as "over" | "under", line: Number(total[2]), source };

  const btts = text.match(/^Both Teams to Score\s*[-—]\s*(Yes|No)$/i);
  if (btts) return { kind: "btts", selection: btts[1].toLowerCase() as "yes" | "no", source };

  const doubleChance = text.match(/^(.+?) or Draw(?: \((1X|X1|X2|Double Chance)\))?$/i);
  if (doubleChance) {
    const side = doubleChance[2]?.toUpperCase();
    return { kind: "double-chance", team: doubleChance[1], side: side === "X2" ? "X2" : side === "1X" || side === "X1" ? "1X" : undefined, source };
  }

  const leadingDoubleChance = text.match(/^(1X|X1|X2) \((.+?) or Draw\)$/i);
  if (leadingDoubleChance) {
    return { kind: "double-chance", team: leadingDoubleChance[2], side: leadingDoubleChance[1].toUpperCase() === "X2" ? "X2" : "1X", source };
  }

  const labelledDoubleChance = text.match(/^(.+?) double chance \((1X|X1|X2)\)$/i);
  if (labelledDoubleChance) {
    const side = labelledDoubleChance[2].toUpperCase() === "X2" ? "X2" : "1X";
    return { kind: "double-chance", team: labelledDoubleChance[1], side, source };
  }

  const compactDoubleChance = text.match(/^(.+?) (1X|X1|X2)$/i);
  if (compactDoubleChance) {
    const side = compactDoubleChance[2].toUpperCase() === "X2" ? "X2" : "1X";
    return { kind: "double-chance", team: compactDoubleChance[1], side, source };
  }

  const bareDoubleChance = text.match(/^(1X|X1|X2)$/i);
  if (bareDoubleChance) {
    const side = bareDoubleChance[1].toUpperCase() === "X2" ? "X2" : "1X";
    return { kind: "double-chance", team: "", side, source };
  }

  const teamTotal = text.match(/^(.+?) (Over|Under) (\d+(?:\.\d+)?) Team Goals$/i);
  if (teamTotal) return { kind: "team-total", team: teamTotal[1], selection: teamTotal[2].toLowerCase() as "over" | "under", line: Number(teamTotal[3]), source };

  const handicap = text.match(/^(.+?) ([+-]\d+(?:\.\d+)?)(?: Goals?)?(?: (Asian|European|Asian\/European))?(?: Goals?)? Handicap$/i);
  if (handicap) {
    const style = handicap[3]?.toLowerCase();
    return { kind: "handicap", team: handicap[1], line: Number(handicap[2]), ...(style === "asian" || style === "european" ? { style } : {}), source };
  }

  const reversedHandicap = text.match(/^(.+?) handicap ([+-]\d+(?:\.\d+)?)$/i);
  if (reversedHandicap) return { kind: "handicap", team: reversedHandicap[1], line: Number(reversedHandicap[2]), source };

  const compactHandicap = text.match(/^(.+?) ([+-]\d+(?:\.\d+)?)(?: Goals?)?$/i);
  if (compactHandicap) return { kind: "handicap", team: compactHandicap[1], line: Number(compactHandicap[2]), source };

  const win = text.match(/^(.+?) (?:to )?Win$/i);
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
  if (leg.kind === "live-entry") {
    return { status: "awaiting-data" as const, reason: "EXECUTION_DATA_MISSING" as const, missingField: "live-entry execution" };
  }
  if (leg.kind === "corners") {
    const homeCorners = match.marketStats?.homeCorners;
    const awayCorners = match.marketStats?.awayCorners;
    if (homeCorners === undefined || awayCorners === undefined) {
      return { status: "awaiting-data" as const, reason: "MARKET_DATA_MISSING" as const, missingField: "corners" };
    }
    if (!leg.team) return { status: settleDirectional(homeCorners + awayCorners - leg.line, leg.selection) };
    const isHome = selectedTeamIsHome(leg.team, match);
    if (isHome === null) return { status: "pending" as const, reason: "TEAM_NOT_RESOLVED" as const };
    return { status: settleDirectional((isHome ? homeCorners : awayCorners) - leg.line, leg.selection) };
  }
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
  const margin = isHome ? score.home - score.away : score.away - score.home;
  // A whole-goal line lands exactly on the margin only here: Asian rules refund it, a European (three-way)
  // line loses it. A published pick that does not say which it was is never graded by assumption.
  if (Number.isInteger(leg.line) && margin + leg.line === 0) {
    if (leg.style === "european") return { status: "red" as const };
    if (leg.style !== "asian") return { status: "pending" as const, reason: "HANDICAP_TYPE_AMBIGUOUS" as const };
  }
  return { status: settleHandicap(margin, leg.line) };
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
      missingFields: [],
      ...parsed,
    };
  }
  if (!match.mainPrediction) return { status: "pending", pendingReason: "PICK_MISSING", missingFields: [], ...parsed };
  if (match.historicalResolution?.status === "true-unresolved") {
    return {
      status: "pending",
      pendingReason: "EVIDENCE_UNAVAILABLE",
      missingFields: [match.historicalResolution.missingFact],
      ...parsed,
    };
  }
  if (!isCompletedFixture(match.fixtureStatus)) return { status: "pending", pendingReason: "NOT_COMPLETED", missingFields: [], ...parsed };
  if (!isValidFinalScore(match.homeScore, match.awayScore)) {
    return { status: "awaiting-data", pendingReason: "FINAL_SCORE_MISSING", missingFields: ["final score"], ...parsed };
  }
  if (parsed.unsupportedLegs.length > 0) return { status: "pending", pendingReason: "UNSUPPORTED_MARKET", missingFields: [], ...parsed };

  const evaluations = parsed.legs.map((leg) => evaluateLeg(leg, match, { home: match.homeScore!, away: match.awayScore! }));
  const awaiting = evaluations.filter((evaluation) => evaluation.status === "awaiting-data");
  if (awaiting.length) {
    const executionMissing = awaiting.some((evaluation) => evaluation.reason === "EXECUTION_DATA_MISSING");
    return {
      status: "awaiting-data",
      pendingReason: executionMissing ? "EXECUTION_DATA_MISSING" : "MARKET_DATA_MISSING",
      missingFields: [...new Set(awaiting.flatMap((evaluation) => evaluation.missingField ?? []))],
      ...parsed,
    };
  }
  const pending = evaluations.find((evaluation) => evaluation.status === "pending");
  if (pending) return { status: "pending", pendingReason: pending.reason ?? "UNSUPPORTED_MARKET", missingFields: [], ...parsed };
  return { status: combineLegResults(evaluations.map((evaluation) => evaluation.status)), missingFields: [], ...parsed };
}

export function evaluatePrediction(match: MatchPreview): PredictionResultStatus {
  return evaluatePredictionSettlement(match).status;
}

export function resolvePredictionResult(match: MatchPreview): MatchPreview {
  if (match.betResultSource === "manual" && match.betResult) return match;
  const status = evaluatePrediction(match);
  return { ...match, betResult: status, betResultSource: status === "pending" ? undefined : "automatic" };
}
