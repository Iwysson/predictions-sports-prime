import type { MatchPreview, PredictionResultStatus } from "@/types";
import { normalizeTeamKey } from "@/lib/openfootball";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";

type Score = { home: number; away: number };

function settle(value: number): PredictionResultStatus {
  return value > 0 ? "green" : value < 0 ? "red" : "push";
}

function merge(left: PredictionResultStatus, right: PredictionResultStatus): PredictionResultStatus | null {
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
  return merge(settle(goalDifference + lower), settle(goalDifference + upper)) ?? "pending";
}

function selectedTeamIsHome(label: string, match: MatchPreview) {
  const selected = normalizeTeamKey(label);
  const home = normalizeTeamKey(match.homeTeam);
  const away = normalizeTeamKey(match.awayTeam);
  if (selected === home || home.includes(selected) || selected.includes(home)) return true;
  if (selected === away || away.includes(selected) || selected.includes(away)) return false;
  return null;
}

function evaluateSingle(market: string, match: MatchPreview, score: Score): PredictionResultStatus | null {
  const totalGoals = score.home + score.away;
  const total = market.match(/^Over (\d+(?:\.\d+)?) Goals$/i);
  if (total) return settle(totalGoals - Number(total[1]));

  if (/^Both Teams to Score\s*[—-]\s*Yes$/i.test(market)) {
    return score.home > 0 && score.away > 0 ? "green" : "red";
  }

  const doubleChance = market.match(/^(.+?) or Draw(?: \((1X|X2)\))?$/i);
  if (doubleChance) {
    const isHome = doubleChance[2]?.toUpperCase() === "1X"
      ? true
      : doubleChance[2]?.toUpperCase() === "X2"
        ? false
        : selectedTeamIsHome(doubleChance[1], match);
    if (isHome === null) return null;
    return isHome ? (score.home >= score.away ? "green" : "red") : (score.away >= score.home ? "green" : "red");
  }

  const win = market.match(/^(.+?) to Win$/i);
  if (win) {
    const isHome = selectedTeamIsHome(win[1], match);
    if (isHome === null) return null;
    return isHome ? settle(score.home - score.away) === "green" ? "green" : "red" : settle(score.away - score.home) === "green" ? "green" : "red";
  }

  const teamTotal = market.match(/^(.+?) Over (\d+(?:\.\d+)?) Team Goals$/i);
  if (teamTotal) {
    const isHome = selectedTeamIsHome(teamTotal[1], match);
    if (isHome === null) return null;
    return settle((isHome ? score.home : score.away) - Number(teamTotal[2]));
  }

  const handicap = market.match(/^(.+?) ([+-]\d+(?:\.\d+)?) Asian Handicap$/i);
  if (handicap) {
    const isHome = selectedTeamIsHome(handicap[1], match);
    if (isHome === null) return null;
    const difference = isHome ? score.home - score.away : score.away - score.home;
    return settleHandicap(difference, Number(handicap[2]));
  }

  return null;
}

export function evaluatePrediction(match: MatchPreview): PredictionResultStatus {
  if (match.betResultSource === "manual" && match.betResult) return match.betResult;
  if (!isHistoryEligibleFixture({
    status: match.fixtureStatus,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  }) || !match.mainPrediction) return "pending";
  const parts = match.mainPrediction.split(/\s+\+\s+/);
  const results = parts.map((part) => evaluateSingle(part.trim(), match, { home: match.homeScore!, away: match.awayScore! }));
  if (results.some((result) => result === null)) return "pending";
  if (results.every((result) => result === "green")) return "green";
  if (results.some((result) => result === "red" || result === "half-red")) return "red";
  if (results.some((result) => result === "half-green")) return "half-green";
  if (results.every((result) => result === "push")) return "push";
  return "pending";
}

export function resolvePredictionResult(match: MatchPreview): MatchPreview {
  if (match.betResultSource === "manual" && match.betResult) return match;
  const status = evaluatePrediction(match);
  return { ...match, betResult: status, betResultSource: status === "pending" ? undefined : "automatic" };
}
