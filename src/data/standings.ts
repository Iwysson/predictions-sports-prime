import { LeagueSlug } from "@/types";

export type StandingRow = {
  position: number;
  team: string;
  played: number;
  points: number;
  zone?: "champions" | "europa" | "relegation";
};

function placeholderTeams(names: string[]): StandingRow[] {
  return names.map((team, index) => ({
    position: index + 1,
    team,
    played: 0,
    points: 0,
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
  "other-leagues": [],
};
