import source from "./week-1-source.json";
import { NFL_TEAM_BY_NAME } from "./teams";
import type { NFLGame, NFLPrediction } from "@/types/nfl";

type GameSeed = Omit<NFLGame, "analysis" | "awayLogo" | "homeLogo" | "published" | "season" | "status" | "week" | "sourceFile">;

const seeds: GameSeed[] = [
  { id: "patriots-vs-seahawks", awayTeam: "New England Patriots", homeTeam: "Seattle Seahawks", awayTeamShort: "Patriots", homeTeamShort: "Seahawks", date: "2026-09-09", kickoff: "5:20 PM", timezone: "PDT", stadium: "Lumen Field", city: "Seattle", state: "WA", predictions: [{ selection: "Seattle Seahawks -2.5 Handicap", odds: 1.65, americanOdds: -154 }] },
  { id: "49ers-vs-rams", awayTeam: "San Francisco 49ers", homeTeam: "Los Angeles Rams", awayTeamShort: "49ers", homeTeamShort: "Rams", date: "2026-09-10", kickoff: "TBA", stadium: "Melbourne Cricket Ground", city: "Melbourne", predictions: [{ selection: "Over 47.5 Total Points", odds: 1.8, americanOdds: -125 }] },
  { id: "bears-vs-panthers", awayTeam: "Chicago Bears", homeTeam: "Carolina Panthers", awayTeamShort: "Bears", homeTeamShort: "Panthers", date: "2026-09-13", kickoff: "1:00 PM", timezone: "ET", stadium: "Bank of America Stadium", city: "Charlotte", state: "NC", predictions: [{ selection: "Over 47.5 Total Points", odds: 1.85, americanOdds: -118 }] },
  { id: "bengals-vs-buccaneers", awayTeam: "Tampa Bay Buccaneers", homeTeam: "Cincinnati Bengals", awayTeamShort: "Buccaneers", homeTeamShort: "Bengals", date: "2026-09-13", kickoff: "1:00 PM", timezone: "EDT", stadium: "Paycor Stadium", city: "Cincinnati", state: "OH", predictions: [{ selection: "Cincinnati Bengals -2.5 Handicap", odds: 1.62, americanOdds: -161 }] },
  { id: "saints-vs-lions", awayTeam: "New Orleans Saints", homeTeam: "Detroit Lions", awayTeamShort: "Saints", homeTeamShort: "Lions", date: "2026-09-13", kickoff: "1:00 PM", timezone: "ET", stadium: "Ford Field", city: "Detroit", state: "MI", predictions: [{ selection: "Detroit Lions -6.5 Handicap", odds: 1.72, americanOdds: -139 }] },
  { id: "bills-vs-texans", awayTeam: "Buffalo Bills", homeTeam: "Houston Texans", awayTeamShort: "Bills", homeTeamShort: "Texans", date: "2026-09-13", kickoff: "12:00 PM", timezone: "CT", predictions: [{ selection: "Under 47.5 Total Points", odds: 1.6, americanOdds: -167 }] },
  { id: "ravens-vs-colts", awayTeam: "Baltimore Ravens", homeTeam: "Indianapolis Colts", awayTeamShort: "Ravens", homeTeamShort: "Colts", date: "2026-09-13", kickoff: "1:00 PM", timezone: "ET", stadium: "Lucas Oil Stadium", city: "Indianapolis", state: "IN", predictions: [{ selection: "Baltimore Ravens -2.5 Handicap", odds: 1.65, americanOdds: -154 }] },
  { id: "browns-vs-jaguars", awayTeam: "Cleveland Browns", homeTeam: "Jacksonville Jaguars", awayTeamShort: "Browns", homeTeamShort: "Jaguars", date: "2026-09-13", kickoff: "1:00 PM", timezone: "ET", stadium: "EverBank Stadium", city: "Jacksonville", state: "FL", predictions: [{ selection: "Jacksonville Jaguars -6.5 Handicap", odds: 1.7, americanOdds: -143 }] },
  { id: "falcons-vs-steelers", awayTeam: "Atlanta Falcons", homeTeam: "Pittsburgh Steelers", awayTeamShort: "Falcons", homeTeamShort: "Steelers", date: "2026-09-13", kickoff: "1:00 PM", timezone: "ET", stadium: "Acrisure Stadium", city: "Pittsburgh", state: "PA", predictions: [{ selection: "Pittsburgh Steelers -2.5 Handicap", odds: 1.72, americanOdds: -139 }] },
  { id: "jets-vs-titans", awayTeam: "New York Jets", homeTeam: "Tennessee Titans", awayTeamShort: "Jets", homeTeamShort: "Titans", date: "2026-09-13", kickoff: "12:00 PM", timezone: "CDT", stadium: "Nissan Stadium", city: "Nashville", state: "TN", predictions: [{ selection: "Over 38.5 Total Points", odds: 1.82, americanOdds: -122 }] },
  { id: "dolphins-vs-raiders", awayTeam: "Miami Dolphins", homeTeam: "Las Vegas Raiders", awayTeamShort: "Dolphins", homeTeamShort: "Raiders", date: "2026-09-13", kickoff: "1:25 PM", timezone: "PT", stadium: "Allegiant Stadium", city: "Las Vegas", state: "NV", predictions: [{ selection: "Over 40.5 Total Points", odds: 1.85, americanOdds: -118 }] },
  { id: "cardinals-vs-chargers", awayTeam: "Arizona Cardinals", homeTeam: "Los Angeles Chargers", awayTeamShort: "Cardinals", homeTeamShort: "Chargers", date: "2026-09-13", kickoff: "1:25 PM", timezone: "PT", stadium: "SoFi Stadium", city: "Inglewood", state: "CA", predictions: [{ selection: "Los Angeles Chargers -6.5 Handicap", odds: 1.53, americanOdds: -189 }] },
  { id: "packers-vs-vikings", awayTeam: "Green Bay Packers", homeTeam: "Minnesota Vikings", awayTeamShort: "Packers", homeTeamShort: "Vikings", date: "2026-09-13", kickoff: "TBA", stadium: "U.S. Bank Stadium", predictions: [{ selection: "Jordan Mason — Anytime Touchdown", odds: 2.8, americanOdds: 180 }, { selection: "Josh Jacobs — Anytime Touchdown", odds: 2.05, americanOdds: 105, condition: "Valid only if Josh Jacobs is confirmed active for Week 1." }] },
  { id: "commanders-vs-eagles", awayTeam: "Washington Commanders", homeTeam: "Philadelphia Eagles", awayTeamShort: "Commanders", homeTeamShort: "Eagles", date: "2026-09-13", kickoff: "4:25 PM", timezone: "ET", stadium: "Lincoln Financial Field", city: "Philadelphia", state: "PA", predictions: [{ selection: "Philadelphia Eagles -6.5 Handicap", odds: 2, americanOdds: 100 }] },
  { id: "cowboys-vs-giants", awayTeam: "Dallas Cowboys", homeTeam: "New York Giants", awayTeamShort: "Cowboys", homeTeamShort: "Giants", date: "2026-09-13", kickoff: "8:20 PM", timezone: "ET", stadium: "MetLife Stadium", city: "East Rutherford", state: "NJ", predictions: [{ selection: "Dallas Cowboys to Win (Moneyline)", odds: 1.7, americanOdds: -143 }] },
  { id: "broncos-vs-chiefs", awayTeam: "Denver Broncos", homeTeam: "Kansas City Chiefs", awayTeamShort: "Broncos", homeTeamShort: "Chiefs", date: "2026-09-14", kickoff: "7:15 PM", timezone: "CT", stadium: "Arrowhead", city: "Kansas City", state: "MO", predictions: [{ selection: "Denver Broncos +3.5 Handicap", odds: 1.72, americanOdds: -139 }] },
];

function analysisParagraphs(markdown: string) {
  return markdown.split(/\r?\n\r?\n/).slice(1).filter((part) => !part.startsWith("🎯") && !part.startsWith("💰") && !part.startsWith("**Josh Jacobs prediction**"));
}

export const nflWeek1Games: NFLGame[] = seeds.map((seed, index) => ({
  ...seed,
  season: 2026,
  week: 1,
  awayTeamId: NFL_TEAM_BY_NAME[seed.awayTeam].id,
  homeTeamId: NFL_TEAM_BY_NAME[seed.homeTeam].id,
  awayLogo: NFL_TEAM_BY_NAME[seed.awayTeam].logo,
  homeLogo: NFL_TEAM_BY_NAME[seed.homeTeam].logo,
  analysis: analysisParagraphs(source[index].markdown),
  sourceFile: source[index].sourceFile,
  status: "published",
  published: true,
}));

export const nflWeek1Predictions = nflWeek1Games.flatMap((game) => game.predictions as NFLPrediction[]);
