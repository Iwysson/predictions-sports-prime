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
  "super-lig": [
    { position: 1, team: "Gençlerbirliği", played: 2, wins: 2, draws: 0, losses: 0, goalsFor: 3, goalsAgainst: 1, goalDifference: 2, points: 6, zone: "champions" },
    { position: 2, team: "Galatasaray", played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4, points: 4, zone: "champions" },
    { position: 3, team: "Samsunspor", played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 4, zone: "europa" },
    { position: 4, team: "Trabzonspor", played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 4, zone: "europa" },
    { position: 5, team: "Alanyaspor", played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 4 },
    { position: 6, team: "Gaziantep FK", played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 4 },
    { position: 7, team: "Kasımpaşa", played: 2, wins: 1, draws: 1, losses: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 4 },
    { position: 8, team: "Fenerbahçe", played: 2, wins: 1, draws: 0, losses: 1, goalsFor: 5, goalsAgainst: 4, goalDifference: 1, points: 3 },
    { position: 9, team: "Amedspor", played: 2, wins: 1, draws: 0, losses: 1, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 3 },
    { position: 10, team: "İstanbul Başakşehir", played: 2, wins: 1, draws: 0, losses: 1, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 3 },
    { position: 11, team: "Kocaelispor", played: 2, wins: 1, draws: 0, losses: 1, goalsFor: 2, goalsAgainst: 2, goalDifference: 0, points: 3 },
    { position: 12, team: "Beşiktaş", played: 2, wins: 1, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 1, goalDifference: 0, points: 3 },
    { position: 13, team: "Çaykur Rizespor", played: 2, wins: 1, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 2, goalDifference: -1, points: 3 },
    { position: 14, team: "Göztepe", played: 2, wins: 0, draws: 1, losses: 1, goalsFor: 3, goalsAgainst: 4, goalDifference: -1, points: 1 },
    { position: 15, team: "Çorum FK", played: 2, wins: 0, draws: 1, losses: 1, goalsFor: 2, goalsAgainst: 3, goalDifference: -1, points: 1 },
    { position: 16, team: "Eyüpspor", played: 2, wins: 0, draws: 0, losses: 2, goalsFor: 0, goalsAgainst: 2, goalDifference: -2, points: 0, zone: "relegation" },
    { position: 17, team: "Konyaspor", played: 2, wins: 0, draws: 0, losses: 2, goalsFor: 2, goalsAgainst: 5, goalDifference: -3, points: 0, zone: "relegation" },
    { position: 18, team: "Erzurumspor", played: 2, wins: 0, draws: 0, losses: 2, goalsFor: 0, goalsAgainst: 7, goalDifference: -7, points: 0, zone: "relegation" },
  ],
  "scottish-premiership": [
    { position: 1, team: "Celtic", played: 2, goalDifference: 5, points: 6, zone: "champions" },
    { position: 2, team: "Dundee", played: 3, goalDifference: 3, points: 6, zone: "champions" },
    { position: 3, team: "St Mirren", played: 2, goalDifference: 3, points: 6, zone: "europa" },
    { position: 4, team: "Motherwell", played: 2, goalDifference: 1, points: 4, zone: "europa" },
    { position: 5, team: "Hearts", played: 2, goalDifference: 3, points: 3 },
    { position: 6, team: "St Johnstone", played: 2, goalDifference: 0, points: 3 },
    { position: 7, team: "Hibernian", played: 2, goalDifference: 0, points: 3 },
    { position: 8, team: "Aberdeen", played: 2, goalDifference: -1, points: 3 },
    { position: 9, team: "Rangers", played: 2, goalDifference: -1, points: 1 },
    { position: 10, team: "Falkirk", played: 2, goalDifference: -2, points: 1 },
    { position: 11, team: "Dundee United", played: 3, goalDifference: -6, points: 1, zone: "relegation" },
    { position: 12, team: "Kilmarnock", played: 2, goalDifference: -5, points: 0, zone: "relegation" },
  ],
};
