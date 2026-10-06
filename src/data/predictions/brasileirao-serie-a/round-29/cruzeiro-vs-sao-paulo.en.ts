import type { EditorialPrediction } from "@/types";
import { buildRound29Editorial } from "./editorial";

export const cruzeiroVsSaoPaulo: EditorialPrediction = {
  league: "brasileirao-serie-a", homeTeam: "Cruzeiro", awayTeam: "São Paulo", seoTitle: "Cruzeiro vs São Paulo Prediction – Brasileirão 2026", title: "Cruzeiro vs São Paulo",
  teaser: "The Mineirão factor and São Paulo's away difficulties favour Cruzeiro, but the way the market is built matters. Full details are available with PRIME VIP.", trend: "Home-side edge",
  ...buildRound29Editorial({
    homeTeam: "Cruzeiro", awayTeam: "São Paulo", pick: "Cruzeiro or Draw (1X) + Over 1.5 Goals", price: 1.67, date: "2026-10-07", time: "21:30", venue: "Mineirão",
    overview: "Cruzeiro are favoured mainly because of the contrast between their Mineirão performance and São Paulo's away results. The selection retains protection against a draw while following the hosts' stronger venue record. Cruzeiro should still be capable of directing substantial periods of the match.",
    homeAnalysis: "Cruzeiro have **7 wins, 4 draws and 3 defeats in 14 home matches**. They average 1.71 goals scored and 1.14 conceded, scoring in 86% of that sample. Over 1.5 Goals landed in 86% of their home fixtures.",
    awayAnalysis: "São Paulo have **2 wins, 3 draws and 9 defeats in 14 away matches**, averaging only 0.79 goals scored and 1.43 conceded. They failed to score in 36% of those trips and conceded first in 79%. Over 1.5 Goals landed in 71% of the away sample.",
    marketAnalysis: "São Paulo won four of the seven league meetings in the sourced history, with two Cruzeiro wins and one draw. That contrary head-to-head record deserves respect, but the current home/away contrast points toward Cruzeiro avoiding defeat. The goals leg is supported by both venue samples.",
    tacticalAnalysis: "Cruzeiro are expected to apply pressure and make São Paulo manage stretches without the ball. If the visitors resist, the draw remains covered; if they concede first, the game state can become more open as they chase. Cruzeiro's home attack is the main driver, with São Paulo's road output a reason not to demand a home win.",
    riskAnalysis: "A disciplined São Paulo performance could keep the contest level and low scoring. The double chance would survive a draw, but a match with only one total goal would lose the Over leg. The visitors' favourable recent league-meeting record is also evidence against treating the matchup as straightforward.",
    conclusion: "Cruzeiro's home production and São Paulo's away difficulties justify backing the hosts not to lose, while the venue-specific goal rates support Over 1.5. Both conditions remain necessary for the combined pick.",
    coreRows: [["Matches (N)", "14", "14"], ["W-D-L", "**7-4-3**", "**2-3-9**"], ["GF/game", "1.71", "0.79"], ["GA/game", "1.14", "1.43"], ["Over 1.5 goals", "86%", "71%"], ["First to concede", "Unavailable", "79%"], ["Failed to score", "Unavailable", "36%"]],
  }),
  picks: { main: "Cruzeiro or Draw (1X) + Over 1.5 Goals", publishedOdds: 1.67 }, matchInfo: { date: "2026-10-07", time: "21:30", round: "Round 29", venue: "Mineirão" }, analysisAccess: "vip", predictionAccess: "vip", sourceStatus: "partial",
  statisticalCoreProvenance: { season: "2026", home: { sampleType: "home", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 }, away: { sampleType: "away", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 } },
  sources: [{ name: "SoccerSTATS — 2026 Série A home/away splits and league history", url: "https://www.soccerstats.com/pmatch.asp?league=brazil&stats=285-20-15-2026" }, { name: "ge — CBF Round 29 dates, kick-off times and venues", url: "https://ge.globo.com/pr/futebol/brasileirao-serie-a/noticia/2026/08/31/cbf-detalha-datas-e-horarios-dos-jogos-das-rodadas-27-a-30-do-brasileirao-veja-a-tabela.ghtml" }],
  publishedAt: "2026-10-05T15:00:00.000Z", updatedAt: "2026-10-06T18:00:00.000Z", published: true,
};
