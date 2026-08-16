import {
  OpenFootballRound,
  OpenLeagueConfig,
  normalizeTeamKey,
} from "@/lib/openfootball";

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isValidTime(value: string) {
  if (value === "TBD") return true;
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  return Boolean(
    match && Number(match[1]) <= 23 && Number(match[2]) <= 59
  );
}

export function validateLeagueRounds(
  rounds: OpenFootballRound[],
  config: OpenLeagueConfig
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rounds.length) {
    errors.push("No rounds found.");
    return { valid: false, errors, warnings };
  }

  const allTeams = new Set<string>();

  for (const round of rounds) {
    const seenTeams = new Set<string>();

    if (round.games.length !== config.expectedGamesPerRound) {
      errors.push(
        `Matchday ${round.round}: expected ${config.expectedGamesPerRound} games, received ${round.games.length}.`
      );
    }

    for (const game of round.games) {
      if (!isIsoDate(game.date)) {
        errors.push(`Matchday ${round.round}: invalid date for ${game.homeTeam} vs ${game.awayTeam}.`);
      }

      if (!isValidTime(game.time)) {
        errors.push(`Matchday ${round.round}: invalid time for ${game.homeTeam} vs ${game.awayTeam}.`);
      }

      const home = normalizeTeamKey(game.homeTeam);
      const away = normalizeTeamKey(game.awayTeam);

      if (!home || !away || home === away) {
        errors.push(`Matchday ${round.round}: invalid teams in one fixture.`);
        continue;
      }

      if (seenTeams.has(home) || seenTeams.has(away)) {
        errors.push(`Matchday ${round.round}: duplicated club in fixtures.`);
      }

      seenTeams.add(home);
      seenTeams.add(away);
      allTeams.add(home);
      allTeams.add(away);

      const hasHomeScore = game.homeScore !== null;
      const hasAwayScore = game.awayScore !== null;

      if (hasHomeScore !== hasAwayScore) {
        errors.push(`Matchday ${round.round}: incomplete score for ${game.homeTeam} vs ${game.awayTeam}.`);
      }

      if (
        game.homeScore !== null &&
        game.awayScore !== null &&
        (game.homeScore < 0 || game.awayScore < 0)
      ) {
        errors.push(`Matchday ${round.round}: negative score detected.`);
      }
    }
  }

  if (allTeams.size !== config.expectedClubs) {
    errors.push(
      `${config.label}: expected ${config.expectedClubs} clubs, detected ${allTeams.size}.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateRoundForDisplay(
  round: OpenFootballRound | null,
  config: OpenLeagueConfig
): ValidationResult {
  if (!round) {
    return {
      valid: false,
      errors: ["Current round not found."],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const seenTeams = new Set<string>();

  if (round.games.length !== config.expectedGamesPerRound) {
    errors.push(
      `Expected ${config.expectedGamesPerRound} games, received ${round.games.length}.`
    );
  }

  for (const game of round.games) {
    const home = normalizeTeamKey(game.homeTeam);
    const away = normalizeTeamKey(game.awayTeam);

    if (!isIsoDate(game.date)) {
      errors.push(`Invalid date: ${game.homeTeam} vs ${game.awayTeam}.`);
    }

    if (!isValidTime(game.time)) {
      errors.push(`Invalid time: ${game.homeTeam} vs ${game.awayTeam}.`);
    }

    if (seenTeams.has(home) || seenTeams.has(away)) {
      errors.push("Duplicated club in current round.");
    }

    seenTeams.add(home);
    seenTeams.add(away);

    if (game.time === "TBD") {
      warnings.push(`${game.homeTeam} vs ${game.awayTeam}: time not confirmed.`);
    }
  }

  if (seenTeams.size !== config.expectedClubs) {
    errors.push(
      `Current round should contain ${config.expectedClubs} unique clubs; found ${seenTeams.size}.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
