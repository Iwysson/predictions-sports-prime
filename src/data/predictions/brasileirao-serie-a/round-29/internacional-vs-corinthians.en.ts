import type { EditorialPrediction } from "@/types";
import { buildRound29Editorial } from "./editorial";

export const internacionalVsCorinthians: EditorialPrediction = {
  league: "brasileirao-serie-a", homeTeam: "Internacional", awayTeam: "Corinthians",
  seoTitle: "Internacional vs Corinthians Prediction – Brasileirão 2026", title: "Internacional vs Corinthians",
  teaser: "Both teams urgently need a response, and the pressure to get a result could create an appealing corners scenario. The full reasoning is available with PRIME VIP.", trend: "Corners trend",
  ...buildRound29Editorial({
    homeTeam: "Internacional", awayTeam: "Corinthians", pick: "Over 1.5 Goals + Over 7.5 Corners", price: 1.78, date: "2026-10-07", time: "19:30", venue: "Beira-Rio",
    overview: "This is a high-pressure match. Four points separate the teams in the referenced table snapshot: Internacional are 18th with 28 points and Corinthians are 14th with 32. The need to respond could make the contest more open after the first goal. There is not a sufficiently clear favourite to justify choosing a winner, so the preference is to back what the match itself may produce.",
    homeAnalysis: "At home, Internacional have **3 wins, 5 draws and 6 defeats in 14 matches**. They average 1.14 goals scored and 1.14 conceded per game. Over 1.5 Goals landed in 71% of their home fixtures, giving the goals leg a meaningful venue-specific base without suggesting that a high-scoring match is guaranteed.",
    awayAnalysis: "Corinthians have **3 wins, 5 draws and 5 defeats in 13 away matches**. They average 1.08 goals scored and 1.23 conceded on the road, while Over 1.5 Goals landed in 77% of that sample. The away record is balanced enough to resist a one-sided match call but still supports the possibility of at least two goals.",
    marketAnalysis: "Corners add the second part of the selection. Internacional's home matches average 10.36 total corners and Corinthians' away matches average 10.38. At least eight corners were recorded in 79% and 69% of those samples respectively. Those figures support Over 7.5 Corners in a game where both clubs have reasons to apply pressure.",
    tacticalAnalysis: "The expected game state depends heavily on the first goal. A team that falls behind is likely to chase points, increasing pressure, crosses and blocked attacks that can contribute to corners. If the score stays level for a long period, the tempo may remain cautious; an earlier breakthrough would be more favourable to both legs.",
    riskAnalysis: "The main risk is timing. A prolonged 0–0 would weaken the goals leg and may also reduce the urgency needed for corner volume. The two conditions must land in the same match, so strong historical rates for each component do not remove the added risk created by combining them.",
    conclusion: "The home and away samples point more clearly to a moderate goals-and-corners combination than to either side winning. The final preference remains Over 1.5 Goals together with Over 7.5 Corners, with a slow start treated as the principal concern.",
    coreRows: [["Matches (N)", "14", "13"], ["W-D-L", "**3-5-6**", "**3-5-5**"], ["GF/game", "1.14", "1.08"], ["GA/game", "1.14", "1.23"], ["Total corners/game", "10.36", "10.38"], ["Over 1.5 goals", "71%", "77%"], ["Over 7.5 corners", "79%", "69%"]],
  }),
  picks: { main: "Over 1.5 Goals + Over 7.5 Corners", publishedOdds: 1.78 }, matchInfo: { date: "2026-10-07", time: "19:30", round: "Round 29", venue: "Beira-Rio" },
  analysisAccess: "vip", predictionAccess: "vip", sourceStatus: "partial",
  statisticalCoreProvenance: { season: "2026", home: { sampleType: "home", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 }, away: { sampleType: "away", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 13 } },
  sources: [{ name: "SoccerSTATS — 2026 Série A home/away splits and league history", url: "https://www.soccerstats.com/pmatch.asp?league=brazil&stats=284-5-17-2026" }, { name: "ge — CBF Round 29 dates, kick-off times and venues", url: "https://ge.globo.com/pr/futebol/brasileirao-serie-a/noticia/2026/08/31/cbf-detalha-datas-e-horarios-dos-jogos-das-rodadas-27-a-30-do-brasileirao-veja-a-tabela.ghtml" }],
  publishedAt: "2026-10-05T15:00:00.000Z", updatedAt: "2026-10-06T18:00:00.000Z", published: true,
};
