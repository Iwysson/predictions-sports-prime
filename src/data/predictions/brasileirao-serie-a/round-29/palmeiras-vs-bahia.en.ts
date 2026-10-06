import type { EditorialPrediction } from "@/types";
import { buildRound29Editorial } from "./editorial";

export const palmeirasVsBahia: EditorialPrediction = {
  league: "brasileirao-serie-a", homeTeam: "Palmeiras", awayTeam: "Bahia", seoTitle: "Palmeiras vs Bahia Prediction – Brasileirão 2026", title: "Palmeiras vs Bahia",
  teaser: "Palmeiras' home defence is impressive, but Bahia have been competitive away. The full case for the home favourite is available with PRIME VIP.", trend: "Palmeiras edge",
  ...buildRound29Editorial({
    homeTeam: "Palmeiras", awayTeam: "Bahia", pick: "Palmeiras to win", price: 1.57, date: "2026-10-08", time: "21:30", venue: "Nubank Parque",
    overview: "This is a higher-level matchup in which Palmeiras are favoured by home advantage and defensive consistency. Bahia's away campaign deserves respect and makes them a difficult opponent. The preference is for a simple Palmeiras win without adding a goals line that would place an extra demand on the selection.",
    homeAnalysis: "Palmeiras have **9 wins, 3 draws and 1 defeat in 13 home matches**. They average 1.77 goals scored and only 0.69 conceded, scored in 92% and opened the scoring in 69%. The balance between attack and defence is the strongest part of the case: they can create without needing a disorganised contest.",
    awayAnalysis: "Bahia have **6 wins, 4 draws and 4 defeats in 14 away matches**. They average 1.50 goals both scored and conceded and found the net in 86% of those trips. That record is substantial contrary evidence and shows why the visitors cannot be considered an easy matchup.",
    marketAnalysis: "Palmeiras won four of the seven sourced league meetings and Bahia won three. Only 29% went over 2.5 goals, describing a history of often controlled matches but divided results. A simple moneyline allows a narrow Palmeiras victory and avoids forcing a goals total onto that evidence.",
    tacticalAnalysis: "Palmeiras need to control the ball after turnovers so Bahia's attacking quality cannot find open transition lanes. Their home defensive record provides a base for managing the game state, especially if they score first. Bahia's away scoring frequency means the hosts must remain attentive throughout rather than rely on passive control.",
    riskAnalysis: "Bahia have already won six times away and score 1.50 goals per road game, so they present a credible threat against the pick. The head-to-head split is also competitive. Palmeiras' home numbers justify favouritism, but they do not remove the danger of a draw or a successful Bahia transition.",
    conclusion: "Palmeiras' one home defeat, 0.69 goals conceded per home game and reliable scoring record make them the preferred side. Keeping the selection to a straight home win respects Bahia's quality and the history of lower-scoring meetings.",
    coreRows: [["Matches (N)", "13", "14"], ["W-D-L", "**9-3-1**", "**6-4-4**"], ["GF/game", "1.77", "1.50"], ["GA/game", "0.69", "1.50"], ["First to score", "69%", "Unavailable"], ["Scored", "92%", "86%"], ["Over 2.5 goals", "Unavailable", "Unavailable (H2H: 29%)"]],
  }),
  picks: { main: "Palmeiras to win", publishedOdds: 1.57 }, matchInfo: { date: "2026-10-08", time: "21:30", round: "Round 29", venue: "Nubank Parque" }, analysisAccess: "vip", predictionAccess: "vip", sourceStatus: "partial",
  statisticalCoreProvenance: { season: "2026", home: { sampleType: "home", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 13 }, away: { sampleType: "away", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 } },
  sources: [{ name: "SoccerSTATS — 2026 Série A home/away splits and league history", url: "https://www.soccerstats.com/pmatch.asp?league=brazil&stats=287-8-18-2026" }, { name: "ge — CBF Round 29 dates, kick-off times and venues", url: "https://ge.globo.com/pr/futebol/brasileirao-serie-a/noticia/2026/08/31/cbf-detalha-datas-e-horarios-dos-jogos-das-rodadas-27-a-30-do-brasileirao-veja-a-tabela.ghtml" }, { name: "Palmeiras — match venue and kick-off time", url: "https://www.palmeiras.com.br/ingressos/?idjogo=2813" }],
  publishedAt: "2026-10-05T15:00:00.000Z", updatedAt: "2026-10-06T18:00:00.000Z", published: true,
};
