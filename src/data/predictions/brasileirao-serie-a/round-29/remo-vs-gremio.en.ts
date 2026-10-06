import type { EditorialPrediction } from "@/types";
import { buildRound29Editorial } from "./editorial";

export const remoVsGremio: EditorialPrediction = {
  league: "brasileirao-serie-a", homeTeam: "Remo", awayTeam: "Grêmio", seoTitle: "Remo vs Grêmio Prediction – Brasileirão 2026", title: "Remo vs Grêmio",
  teaser: "Home advantage matters in this high-pressure matchup, but Grêmio can still take a point. The prediction is FREE; the full reasoning remains available with PRIME VIP.", trend: "Away double chance",
  ...buildRound29Editorial({
    homeTeam: "Remo", awayTeam: "Grêmio", pick: "Grêmio or Draw (X2)", price: 1.70, date: "2026-10-07", time: "19:30", venue: "Mangueirão",
    overview: "This is a high-pressure game between two teams that need points and have little room to waste opportunities. Remo have 23 points and sit 19th in the referenced table snapshot, while Grêmio have 29 in 17th. Grêmio can leave with at least one point, and the draw is a realistic outcome in this direct contest.",
    homeAnalysis: "Remo have not turned home advantage into a dominant record: **3 wins, 5 draws and 6 defeats in 14 home matches**. They average 1.29 goals scored and 1.36 conceded, allowing a goal in 86% of those fixtures. Their home attacking output is better than Grêmio's away production, but the defensive record regularly gives opponents opportunities.",
    awayAnalysis: "Grêmio have **0 wins, 4 draws and 10 defeats in 14 away matches**. They average only 0.57 goals scored and 1.57 conceded, failing to score in half of those trips. A response depends on better defensive organisation and making more of the openings that Remo tend to allow at home.",
    marketAnalysis: "The six-point difference increases the importance of the matchup. Remo have home advantage and the stronger attacking numbers in these venue splits, yet their six home defeats and frequent concessions leave room for Grêmio to compete. The price is accepted for an away side to earn at least a draw, not because its travel record is strong.",
    tacticalAnalysis: "Remo can try to use the Mangueirão setting to play on the front foot, but an overly aggressive approach could leave transition space. Grêmio's path is likely to rely on compact defending, patience and efficient use of limited chances. A level game deep into the second half would favour the double-chance position.",
    riskAnalysis: "Grêmio's winless away record and 0.57 goals per road game are the principal warning against the selection. Remo's better home scoring rate can punish another low-output visiting performance. The pick therefore depends on Grêmio interrupting a very poor travel pattern, even though draw protection reduces the demand.",
    conclusion: "Remo's home edge is real, but their defensive record creates a route for Grêmio to remain in the contest. With the draw included, the final call is Grêmio or Draw rather than an away win.",
    coreRows: [["Matches (N)", "14", "14"], ["W-D-L", "**3-5-6**", "**0-4-10**"], ["GF/game", "1.29", "0.57"], ["GA/game", "1.36", "1.57"], ["Failed to score", "Unavailable", "50%"], ["Conceded", "86%", "Unavailable"]],
  }),
  picks: { main: "Grêmio or Draw (X2)", publishedOdds: 1.7 }, matchInfo: { date: "2026-10-07", time: "19:30", round: "Round 29", venue: "Mangueirão" }, analysisAccess: "vip", predictionAccess: "free", sourceStatus: "partial",
  statisticalCoreProvenance: { season: "2026", home: { sampleType: "home", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 }, away: { sampleType: "away", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 } },
  sources: [{ name: "SoccerSTATS — 2026 Série A home/away splits and league history", url: "https://www.soccerstats.com/pmatch.asp?league=brazil&stats=281-2-10-2026" }, { name: "ge — CBF Round 29 dates, kick-off times and venues", url: "https://ge.globo.com/pr/futebol/brasileirao-serie-a/noticia/2026/08/31/cbf-detalha-datas-e-horarios-dos-jogos-das-rodadas-27-a-30-do-brasileirao-veja-a-tabela.ghtml" }],
  publishedAt: "2026-10-05T15:00:00.000Z", updatedAt: "2026-10-06T18:00:00.000Z", published: true,
};
