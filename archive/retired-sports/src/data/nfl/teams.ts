import type { NFLConference, NFLDivision, NFLTeam } from "@/types/nfl";

const team = (id: string, name: string, shortName: string, conference: NFLConference, division: NFLDivision): NFLTeam => ({ id, name, shortName, conference, division, logo: `/nfl/team-logos/${id}.png` });

export const NFL_TEAMS: readonly NFLTeam[] = [
  team("buf", "Buffalo Bills", "Bills", "AFC", "AFC East"), team("mia", "Miami Dolphins", "Dolphins", "AFC", "AFC East"), team("ne", "New England Patriots", "Patriots", "AFC", "AFC East"), team("nyj", "New York Jets", "Jets", "AFC", "AFC East"),
  team("bal", "Baltimore Ravens", "Ravens", "AFC", "AFC North"), team("cin", "Cincinnati Bengals", "Bengals", "AFC", "AFC North"), team("cle", "Cleveland Browns", "Browns", "AFC", "AFC North"), team("pit", "Pittsburgh Steelers", "Steelers", "AFC", "AFC North"),
  team("hou", "Houston Texans", "Texans", "AFC", "AFC South"), team("ind", "Indianapolis Colts", "Colts", "AFC", "AFC South"), team("jax", "Jacksonville Jaguars", "Jaguars", "AFC", "AFC South"), team("ten", "Tennessee Titans", "Titans", "AFC", "AFC South"),
  team("den", "Denver Broncos", "Broncos", "AFC", "AFC West"), team("kc", "Kansas City Chiefs", "Chiefs", "AFC", "AFC West"), team("lv", "Las Vegas Raiders", "Raiders", "AFC", "AFC West"), team("lac", "Los Angeles Chargers", "Chargers", "AFC", "AFC West"),
  team("dal", "Dallas Cowboys", "Cowboys", "NFC", "NFC East"), team("nyg", "New York Giants", "Giants", "NFC", "NFC East"), team("phi", "Philadelphia Eagles", "Eagles", "NFC", "NFC East"), team("wsh", "Washington Commanders", "Commanders", "NFC", "NFC East"),
  team("chi", "Chicago Bears", "Bears", "NFC", "NFC North"), team("det", "Detroit Lions", "Lions", "NFC", "NFC North"), team("gb", "Green Bay Packers", "Packers", "NFC", "NFC North"), team("min", "Minnesota Vikings", "Vikings", "NFC", "NFC North"),
  team("atl", "Atlanta Falcons", "Falcons", "NFC", "NFC South"), team("car", "Carolina Panthers", "Panthers", "NFC", "NFC South"), team("no", "New Orleans Saints", "Saints", "NFC", "NFC South"), team("tb", "Tampa Bay Buccaneers", "Buccaneers", "NFC", "NFC South"),
  team("ari", "Arizona Cardinals", "Cardinals", "NFC", "NFC West"), team("lar", "Los Angeles Rams", "Rams", "NFC", "NFC West"), team("sf", "San Francisco 49ers", "49ers", "NFC", "NFC West"), team("sea", "Seattle Seahawks", "Seahawks", "NFC", "NFC West"),
];

export const NFL_TEAM_BY_ID = Object.fromEntries(NFL_TEAMS.map((item) => [item.id, item])) as Record<string, NFLTeam>;
export const NFL_TEAM_BY_NAME = Object.fromEntries(NFL_TEAMS.map((item) => [item.name, item])) as Record<string, NFLTeam>;
export const nflTeamLogos = Object.fromEntries(NFL_TEAMS.map((item) => [item.name, item.logo])) as Record<string, string>;
export const NFL_DIVISIONS: Record<NFLConference, readonly NFLDivision[]> = { AFC: ["AFC East", "AFC North", "AFC South", "AFC West"], NFC: ["NFC East", "NFC North", "NFC South", "NFC West"] };
