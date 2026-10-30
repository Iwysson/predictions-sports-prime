import source from "./week-2-source.json";
import { NFL_TEAM_BY_NAME } from "./teams";
import type { NFLGame, NFLPrediction } from "@/types/nfl";

type GameSeed = Omit<NFLGame, "analysis" | "awayLogo" | "homeLogo" | "published" | "season" | "status" | "week" | "sourceFile">;

const seeds: GameSeed[] = [
  { id: "lions-vs-bills", awayTeam: "Detroit Lions", homeTeam: "Buffalo Bills", awayTeamShort: "Lions", homeTeamShort: "Bills", date: "2026-09-17", kickoff: "8:20 PM", timezone: "EDT", stadium: "Highmark Stadium", city: "Orchard Park", state: "NY", predictions: [{ selection: "Buffalo Bills -3.5 Handicap", odds: 1.70, americanOdds: -143 }] },
  { id: "panthers-vs-falcons", awayTeam: "Carolina Panthers", homeTeam: "Atlanta Falcons", awayTeamShort: "Panthers", homeTeamShort: "Falcons", date: "2026-09-20", kickoff: "1:00 PM", timezone: "EDT", stadium: "Mercedes-Benz Stadium", city: "Atlanta", state: "GA", predictions: [{ selection: "Over 43.5 Total Points", odds: 1.87, americanOdds: -115 }] },
  { id: "bengals-vs-texans", awayTeam: "Cincinnati Bengals", homeTeam: "Houston Texans", awayTeamShort: "Bengals", homeTeamShort: "Texans", date: "2026-09-20", kickoff: "1:00 PM", timezone: "EDT", stadium: "NRG Stadium", city: "Houston", state: "TX", predictions: [{ selection: "Over 44.5 Total Points", odds: 1.75, americanOdds: -133 }] },
  { id: "browns-vs-buccaneers", awayTeam: "Cleveland Browns", homeTeam: "Tampa Bay Buccaneers", awayTeamShort: "Browns", homeTeamShort: "Buccaneers", date: "2026-09-20", kickoff: "1:00 PM", timezone: "EDT", stadium: "Raymond James Stadium", city: "Tampa", state: "FL", predictions: [{ selection: "Tampa Bay Buccaneers -6.5 Handicap", odds: 1.65, americanOdds: -154 }] },
  { id: "packers-vs-jets", awayTeam: "Green Bay Packers", homeTeam: "New York Jets", awayTeamShort: "Packers", homeTeamShort: "Jets", date: "2026-09-20", kickoff: "1:00 PM", timezone: "EDT", stadium: "MetLife Stadium", city: "East Rutherford", state: "NJ", predictions: [{ selection: "Green Bay Packers -3.5 Handicap", odds: 1.87, americanOdds: -115 }] },
  { id: "jaguars-vs-broncos", awayTeam: "Jacksonville Jaguars", homeTeam: "Denver Broncos", awayTeamShort: "Jaguars", homeTeamShort: "Broncos", date: "2026-09-20", kickoff: "4:25 PM", timezone: "EDT", stadium: "Empower Field at Mile High", city: "Denver", state: "CO", predictions: [{ selection: "Denver Broncos Moneyline", odds: 1.67, americanOdds: -149 }] },
  { id: "raiders-vs-chargers", awayTeam: "Las Vegas Raiders", homeTeam: "Los Angeles Chargers", awayTeamShort: "Raiders", homeTeamShort: "Chargers", date: "2026-09-20", kickoff: "4:25 PM", timezone: "EDT", stadium: "SoFi Stadium", city: "Inglewood", state: "CA", predictions: [{ selection: "Los Angeles Chargers -6.5 Handicap", odds: 1.80, americanOdds: -125 }] },
  { id: "dolphins-vs-49ers", awayTeam: "Miami Dolphins", homeTeam: "San Francisco 49ers", awayTeamShort: "Dolphins", homeTeamShort: "49ers", date: "2026-09-20", kickoff: "4:25 PM", timezone: "EDT", stadium: "Levi's Stadium", city: "Santa Clara", state: "CA", predictions: [{ selection: "San Francisco 49ers -12.5 Handicap", odds: 1.80, americanOdds: -125 }] },
  { id: "vikings-vs-bears", awayTeam: "Minnesota Vikings", homeTeam: "Chicago Bears", awayTeamShort: "Vikings", homeTeamShort: "Bears", date: "2026-09-20", kickoff: "1:00 PM", timezone: "EDT", stadium: "Soldier Field", city: "Chicago", state: "IL", predictions: [{ selection: "Chicago Bears -2.5 Handicap", odds: 1.57, americanOdds: -175 }] },
  { id: "saints-vs-ravens", awayTeam: "New Orleans Saints", homeTeam: "Baltimore Ravens", awayTeamShort: "Saints", homeTeamShort: "Ravens", date: "2026-09-20", kickoff: "1:00 PM", timezone: "EDT", stadium: "M&T Bank Stadium", city: "Baltimore", state: "MD", predictions: [{ selection: "Over 46.5 Total Points", odds: 1.80, americanOdds: -125 }] },
  { id: "eagles-vs-titans", awayTeam: "Philadelphia Eagles", homeTeam: "Tennessee Titans", awayTeamShort: "Eagles", homeTeamShort: "Titans", date: "2026-09-20", kickoff: "1:00 PM", timezone: "EDT", stadium: "Nissan Stadium", city: "Nashville", state: "TN", predictions: [{ selection: "Over 39 Total Points", odds: 1.82, americanOdds: -122 }] },
  { id: "steelers-vs-patriots", awayTeam: "Pittsburgh Steelers", homeTeam: "New England Patriots", awayTeamShort: "Steelers", homeTeamShort: "Patriots", date: "2026-09-20", kickoff: "1:00 PM", timezone: "EDT", stadium: "Gillette Stadium", city: "Foxborough", state: "MA", predictions: [{ selection: "New England Patriots -5.5 Handicap", odds: 1.83, americanOdds: -120 }] },
  { id: "seahawks-vs-cardinals", awayTeam: "Seattle Seahawks", homeTeam: "Arizona Cardinals", awayTeamShort: "Seahawks", homeTeamShort: "Cardinals", date: "2026-09-20", kickoff: "4:25 PM", timezone: "EDT", stadium: "State Farm Stadium", city: "Glendale", state: "AZ", predictions: [{ selection: "Seattle Seahawks -3.5 Handicap", odds: 1.83, americanOdds: -120 }] },
  { id: "commanders-vs-cowboys", awayTeam: "Washington Commanders", homeTeam: "Dallas Cowboys", awayTeamShort: "Commanders", homeTeamShort: "Cowboys", date: "2026-09-20", kickoff: "4:25 PM", timezone: "EDT", stadium: "AT&T Stadium", city: "Arlington", state: "TX", predictions: [{ selection: "Dallas Cowboys -3.5 Handicap", odds: 1.80, americanOdds: -125 }] },
  { id: "colts-vs-chiefs", awayTeam: "Indianapolis Colts", homeTeam: "Kansas City Chiefs", awayTeamShort: "Colts", homeTeamShort: "Chiefs", date: "2026-09-20", kickoff: "8:20 PM", timezone: "EDT", stadium: "GEHA Field at Arrowhead Stadium", city: "Kansas City", state: "MO", predictions: [{ selection: "Kansas City Chiefs -6.5 Handicap", odds: 1.85, americanOdds: -118 }] },
  { id: "giants-vs-rams", awayTeam: "New York Giants", homeTeam: "Los Angeles Rams", awayTeamShort: "Giants", homeTeamShort: "Rams", date: "2026-09-21", kickoff: "8:15 PM", timezone: "EDT", stadium: "SoFi Stadium", city: "Inglewood", state: "CA", predictions: [{ selection: "Los Angeles Rams -6.5 Handicap", odds: 1.70, americanOdds: -143 }] },
];

function analysisParagraphs(markdown: string) {
  return markdown.split(/\r?\n\r?\n/).slice(1).filter((part) => !part.startsWith("🎯") && !part.startsWith("💰"));
}

export const nflWeek2Games: NFLGame[] = seeds.map((seed, index) => ({
  ...seed,
  season: 2026,
  week: 2,
  awayTeamId: NFL_TEAM_BY_NAME[seed.awayTeam].id,
  homeTeamId: NFL_TEAM_BY_NAME[seed.homeTeam].id,
  awayLogo: NFL_TEAM_BY_NAME[seed.awayTeam].logo,
  homeLogo: NFL_TEAM_BY_NAME[seed.homeTeam].logo,
  analysis: analysisParagraphs(source[index].markdown),
  sourceFile: source[index].sourceFile,
  status: "published",
  published: true,
}));

export const nflWeek2Predictions = nflWeek2Games.flatMap((game) => game.predictions as NFLPrediction[]);
