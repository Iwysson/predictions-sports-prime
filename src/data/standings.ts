import { LeagueSlug } from "@/types";
import type { LeagueConfig } from "@/data/leagues";

export type StandingRow = {
  position: number;
  team: string;
  played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  points: number;
  zone?: "champions" | "europa" | "relegation";
};

export type StandingDataState =
  | "validated"
  | "fallback"
  | "not-available"
  | "not-applicable";

export function normalizeStandingRow(row: StandingRow): StandingRow {
  const goalDifference =
    typeof row.goalDifference === "number"
      ? row.goalDifference
      : typeof row.goalsFor === "number" && typeof row.goalsAgainst === "number"
        ? row.goalsFor - row.goalsAgainst
        : undefined;

  return {
    ...row,
    goalDifference,
  };
}

export function validateStandingRows(
  rows: StandingRow[],
  options: { expectedClubs?: number; requireCompleteStats?: boolean } = {}
) {
  const errors: string[] = [];
  const positions = new Set<number>();
  const teams = new Set<string>();

  if (options.expectedClubs !== undefined && rows.length !== options.expectedClubs) {
    errors.push(`expected ${options.expectedClubs} rows, received ${rows.length}`);
  }

  rows.forEach((row, index) => {
    const team = row.team.trim().toLowerCase();
    if (!team) errors.push(`row ${index + 1}: missing team`);
    if (!Number.isInteger(row.position) || row.position < 1) errors.push(`${row.team || `row ${index + 1}`}: invalid position`);
    if (positions.has(row.position)) errors.push(`${row.team}: duplicate position ${row.position}`);
    if (teams.has(team)) errors.push(`${row.team}: duplicate team`);
    positions.add(row.position);
    teams.add(team);
    if (options.expectedClubs !== undefined && row.position !== index + 1) {
      errors.push(`${row.team}: position sequence/order mismatch`);
    }

    const numericFields = [
      "played", "wins", "draws", "losses", "goalsFor", "goalsAgainst", "points",
    ] as const;
    for (const field of numericFields) {
      const value = row[field];
      if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
        errors.push(`${row.team}: invalid ${field}`);
      }
      if (options.requireCompleteStats && value === undefined) {
        errors.push(`${row.team}: missing ${field}`);
      }
    }

    if (row.goalDifference !== undefined && !Number.isInteger(row.goalDifference)) {
      errors.push(`${row.team}: invalid goalDifference`);
    }
    if (options.requireCompleteStats && row.goalDifference === undefined) {
      errors.push(`${row.team}: missing goalDifference`);
    }
    if (row.played !== undefined && row.wins !== undefined && row.draws !== undefined && row.losses !== undefined && row.wins + row.draws + row.losses !== row.played) {
      errors.push(`${row.team}: W+D+L does not equal P`);
    }
    if (row.goalsFor !== undefined && row.goalsAgainst !== undefined && row.goalDifference !== undefined && row.goalsFor - row.goalsAgainst !== row.goalDifference) {
      errors.push(`${row.team}: GF-GA does not equal GD`);
    }
  });

  return errors;
}

export function standingDataState(league: LeagueConfig, rows: StandingRow[]): StandingDataState {
  if (!league.display.showStandings) return "not-applicable";
  return rows.length > 0 ? "fallback" : "not-available";
}

function placeholderTeams(names: string[]): StandingRow[] {
  return names.map((team, index) => ({
    position: index + 1,
    team,
    played: 0,
    points: 0,
    goalDifference: 0,
  }));
}

export const standingsByLeague: Record<LeagueSlug, StandingRow[]> = {
  "premier-league": placeholderTeams([
    "Arsenal",
    "Aston Villa",
    "Bournemouth",
    "Brentford",
    "Brighton",
    "Chelsea",
    "Crystal Palace",
    "Everton",
    "Fulham",
    "Leeds",
    "Liverpool",
    "Man City",
    "Man United",
    "Newcastle",
    "Nottingham Forest",
    "Sunderland",
    "Tottenham",
    "West Ham",
    "Wolves",
    "Burnley",
  ]),
  "la-liga": placeholderTeams([
    "Athletic Club",
    "Atletico Madrid",
    "Barcelona",
    "Celta Vigo",
    "Elche",
    "Espanyol",
    "Getafe",
    "Girona",
    "Levante",
    "Mallorca",
    "Osasuna",
    "Rayo Vallecano",
    "Real Betis",
    "Real Madrid",
    "Real Oviedo",
    "Real Sociedad",
    "Sevilla",
    "Valencia",
    "Villarreal",
    "Alaves",
  ]),
  bundesliga: placeholderTeams([
    "Augsburg",
    "Bayern",
    "Dortmund",
    "Frankfurt",
    "Freiburg",
    "Hamburg",
    "Heidenheim",
    "Hoffenheim",
    "Koln",
    "Leipzig",
    "Leverkusen",
    "Mainz",
    "Monchengladbach",
    "St Pauli",
    "Stuttgart",
    "Union Berlin",
    "Werder Bremen",
    "Wolfsburg",
  ]),
  "serie-a": placeholderTeams([
    "Atalanta",
    "Bologna",
    "Cagliari",
    "Como",
    "Cremonese",
    "Fiorentina",
    "Genoa",
    "Inter",
    "Juventus",
    "Lazio",
    "Lecce",
    "Milan",
    "Napoli",
    "Parma",
    "Pisa",
    "Roma",
    "Sassuolo",
    "Torino",
    "Udinese",
    "Verona",
  ]),
  // Safe empty fallback: never fabricate a Liga Portugal table.
  "liga-portugal": [],
  // Safe empty fallback: live standings are loaded from the shared source.
  "ligue-1": [],
  eredivisie: [],
  "brasileirao-serie-a": [],
  "copa-do-brasil": [],
  "efl-cup": [],
};
