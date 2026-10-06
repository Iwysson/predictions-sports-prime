import type { EditorialPrediction } from "@/types";
import { buildRound29Editorial } from "./editorial";

export const botafogoVsVasco: EditorialPrediction = {
  league: "brasileirao-serie-a", homeTeam: "Botafogo", awayTeam: "Vasco", seoTitle: "Botafogo vs Vasco Prediction – Brasileirão 2026", title: "Botafogo vs Vasco",
  teaser: "Derbies demand caution, but Vasco's away record gives Botafogo an opening. The full construction of the prediction is available with PRIME VIP.", trend: "Home-side edge",
  ...buildRound29Editorial({
    homeTeam: "Botafogo", awayTeam: "Vasco", pick: "Botafogo or Draw (1X) + Over 1.5 Goals", price: 1.95, date: "2026-10-07", time: "20:30", venue: "Nilton Santos",
    overview: "This derby requires caution, but home advantage weighs in Botafogo's favour. The crowd and familiarity with the Nilton Santos can help the hosts find their rhythm. Vasco arrive for an important rivalry match, and the need for points on both sides should keep the contest intense.",
    homeAnalysis: "Botafogo have **5 wins, 6 draws and 3 defeats in 14 home matches**, averaging 1.71 goals scored and 1.43 conceded. Two or more goals were recorded in 86% of that home sample. The record supports draw protection for Botafogo but also shows that the hosts are not defensively impenetrable.",
    awayAnalysis: "Vasco have **1 win, 5 draws and 7 defeats in 13 away matches**. They average 1.00 goal scored and 1.77 conceded, allowed a goal in 92% of their trips and kept a clean sheet in only 8%. Two or more goals were recorded in 69% of the away sample.",
    marketAnalysis: "Botafogo won five of the seven league meetings gathered by the source, with one draw and one Vasco win. That record, home advantage and Vasco's travel performance reinforce the preference for Botafogo not to lose. The Over 1.5 leg avoids requiring a high total but still needs at least two goals.",
    tacticalAnalysis: "Botafogo can use home territory to press and create, but conceding 1.43 goals per home game leaves a route for Vasco to affect the score. The derby setting may produce aggressive duels and transitions rather than steady control. Draw protection accommodates that volatility while the goals leg benefits if either team has to chase.",
    riskAnalysis: "A 1–0 Botafogo win would fit the home-side reading but lose the combined bet. Vasco can also exploit Botafogo's defensive vulnerability, so the hosts must avoid turning territorial initiative into exposed transitions. Derby variance remains an important limitation.",
    conclusion: "The evidence favours Botafogo avoiding defeat and at least two total goals, without requiring a clean sheet or an outright home win. That balance leads to the combined double-chance and Over 1.5 selection.",
    coreRows: [["Matches (N)", "14", "13"], ["W-D-L", "**5-6-3**", "**1-5-7**"], ["GF/game", "1.71", "1.00"], ["GA/game", "1.43", "1.77"], ["Over 1.5 goals", "86%", "69%"], ["Clean sheets", "Unavailable", "8%"], ["Conceded", "Unavailable", "92%"]],
  }),
  picks: { main: "Botafogo or Draw (1X) + Over 1.5 Goals", publishedOdds: 1.95 }, matchInfo: { date: "2026-10-07", time: "20:30", round: "Round 29", venue: "Nilton Santos" }, analysisAccess: "vip", predictionAccess: "vip", sourceStatus: "partial",
  statisticalCoreProvenance: { season: "2026", home: { sampleType: "home", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 }, away: { sampleType: "away", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 13 } },
  sources: [{ name: "SoccerSTATS — 2026 Série A home/away splits and league history", url: "https://www.soccerstats.com/pmatch.asp?league=brazil&stats=289-19-14-2026" }, { name: "ge — CBF Round 29 dates, kick-off times and venues", url: "https://ge.globo.com/pr/futebol/brasileirao-serie-a/noticia/2026/08/31/cbf-detalha-datas-e-horarios-dos-jogos-das-rodadas-27-a-30-do-brasileirao-veja-a-tabela.ghtml" }],
  publishedAt: "2026-10-05T15:00:00.000Z", updatedAt: "2026-10-06T18:00:00.000Z", published: true,
};
