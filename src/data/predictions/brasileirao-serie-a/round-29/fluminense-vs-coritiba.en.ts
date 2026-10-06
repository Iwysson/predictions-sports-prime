import type { EditorialPrediction } from "@/types";
import { buildRound29Editorial } from "./editorial";

export const fluminenseVsCoritiba: EditorialPrediction = {
  league: "brasileirao-serie-a", homeTeam: "Fluminense", awayTeam: "Coritiba", seoTitle: "Fluminense vs Coritiba Prediction – Brasileirão 2026", title: "Fluminense vs Coritiba",
  teaser: "Fluminense have made the Maracanã a major strength, while Coritiba allow opportunities away. The full combined prediction is available with PRIME VIP.", trend: "Fluminense edge",
  ...buildRound29Editorial({
    homeTeam: "Fluminense", awayTeam: "Coritiba", pick: "Fluminense to win + Over 1.5 Goals", price: 1.87, date: "2026-10-08", time: "21:30", venue: "Maracanã",
    overview: "The preference is for Fluminense to win in a match with at least two goals. The Maracanã has been a strong base for the hosts, who produce more effectively in front of their supporters. Coritiba have a competitive away campaign, but Fluminense can turn home advantage into a decisive edge.",
    homeAnalysis: "Fluminense have **10 wins, 3 draws and 1 defeat in 14 home matches**. They average 1.71 goals scored and 1.00 conceded, finding the net in 93% of that sample. Over 1.5 Goals landed in 71% of their home fixtures, and they also average 6.43 corners.",
    awayAnalysis: "Coritiba have **5 wins, 4 draws and 5 defeats in 14 away matches**, averaging 1.29 goals scored and 1.71 conceded. Over 1.5 Goals landed in 79% of those trips. The defence permits opportunities, although the balanced away record shows an ability to collect points outside home.",
    marketAnalysis: "Fluminense's home attack and Coritiba's away concession rate support the two-goal threshold. The hosts' 6.43 home corners also signal sustained attacking presence, but the selection is tied to goals rather than corners. Fluminense must win; a scoring draw does not satisfy the bet.",
    tacticalAnalysis: "Fluminense should be able to establish territory and keep Coritiba's defence under pressure. The visitors can use spaces in transition, potentially forcing the hosts to continue attacking rather than simply protect a lead. Efficient finishing matters because possession or pressure alone will not fulfil either leg.",
    riskAnalysis: "Coritiba's five away wins show that they cannot be treated as passive visitors. A draw with goals would lose the home-win leg, while a 1–0 Fluminense victory would lose the total-goals leg. The combined market therefore demands both superiority and enough scoring output.",
    conclusion: "Fluminense's 10 home wins, strong scoring frequency and Coritiba's away goals-against average support the hosts. The preferred construction is Fluminense to win with Over 1.5 Goals, accepting the extra risk of a combined market.",
    coreRows: [["Matches (N)", "14", "14"], ["W-D-L", "**10-3-1**", "**5-4-5**"], ["GF/game", "1.71", "1.29"], ["GA/game", "1.00", "1.71"], ["Corners for/game", "6.43", "Unavailable"], ["Over 1.5 goals", "71%", "79%"], ["Scored", "93%", "Unavailable"]],
  }),
  picks: { main: "Fluminense to win + Over 1.5 Goals", publishedOdds: 1.87 }, matchInfo: { date: "2026-10-08", time: "21:30", round: "Round 29", venue: "Maracanã" }, analysisAccess: "vip", predictionAccess: "vip", sourceStatus: "partial",
  statisticalCoreProvenance: { season: "2026", home: { sampleType: "home", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 }, away: { sampleType: "away", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 } },
  sources: [{ name: "SoccerSTATS — 2026 Série A home/away splits and league history", url: "https://www.soccerstats.com/pmatch.asp?league=brazil&stats=290-9-3-2026" }, { name: "ge — CBF Round 29 dates, kick-off times and venues", url: "https://ge.globo.com/pr/futebol/brasileirao-serie-a/noticia/2026/08/31/cbf-detalha-datas-e-horarios-dos-jogos-das-rodadas-27-a-30-do-brasileirao-veja-a-tabela.ghtml" }],
  publishedAt: "2026-10-05T15:00:00.000Z", updatedAt: "2026-10-06T18:00:00.000Z", published: true,
};
