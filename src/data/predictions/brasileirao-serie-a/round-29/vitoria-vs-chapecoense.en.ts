import type { EditorialPrediction } from "@/types";
import { buildRound29Editorial } from "./editorial";

export const vitoriaVsChapecoense: EditorialPrediction = {
  league: "brasileirao-serie-a", homeTeam: "Vitória", awayTeam: "Chapecoense", seoTitle: "Vitória vs Chapecoense Prediction – Brasileirão 2026", title: "Vitória vs Chapecoense",
  teaser: "The Barradão factor and Chapecoense's difficult position strengthen the case for Vitória. The prediction is FREE; the supporting numbers remain available with PRIME VIP.", trend: "Vitória edge",
  ...buildRound29Editorial({
    homeTeam: "Vitória", awayTeam: "Chapecoense", pick: "Vitória to win", price: 1.72, date: "2026-10-07", time: "20:00", venue: "Barradão",
    overview: "Vitória are strong favourites in this matchup. Chapecoense are bottom with 18 points from 27 matches in the referenced snapshot, while Vitória have 33 from 28. The visitors' position is extremely difficult at this stage of the season, and the largest contrast is between Vitória at the Barradão and Chapecoense away.",
    homeAnalysis: "Vitória have **9 wins, 1 draw and 4 defeats in 14 home matches**. They average 1.29 goals scored and only 0.86 conceded, kept clean sheets in 64% and scored first in 71%. Home conditions have helped the team compete more effectively and protect leads.",
    awayAnalysis: "Chapecoense have **1 win, 4 draws and 9 defeats in 14 away matches**. They average 0.79 goals scored and 1.71 conceded, allowed a goal in every trip and conceded first in 86%. The difference concerns both chance creation and the ability to control the match after falling behind.",
    marketAnalysis: "The selection is a straightforward home win. It does not add a goals line or handicap, so Vitória can satisfy it with a narrow victory. That keeps the market aligned with the strongest venue evidence instead of demanding an additional outcome not established by the data.",
    tacticalAnalysis: "Vitória are expected to take the initiative and use the Barradão atmosphere to apply early pressure. Once ahead, their home defensive record suggests a route to controlling the game state. Chapecoense need to stay compact and avoid conceding first, because chasing from behind has repeatedly been a difficult away scenario.",
    riskAnalysis: "Vitória could become anxious, miss chances and leave a close scoreline alive until late. That would give Chapecoense a path to frustrate the home side. Easy transition chances for the visitors would also undermine the control suggested by Vitória's home record.",
    conclusion: "The home and away split is decisive: Vitória's strong Barradão results meet a Chapecoense side with one away win and persistent defensive problems. The simple home-win market remains the preferred option.",
    coreRows: [["Matches (N)", "14", "14"], ["W-D-L", "**9-1-4**", "**1-4-9**"], ["GF/game", "1.29", "0.79"], ["GA/game", "0.86", "1.71"], ["First to score", "71%", "Unavailable"], ["First to concede", "Unavailable", "86%"], ["Clean sheets", "64%", "Unavailable"], ["Conceded", "Unavailable", "100%"]],
  }),
  picks: { main: "Vitória to win", publishedOdds: 1.72 }, matchInfo: { date: "2026-10-07", time: "20:00", round: "Round 29", venue: "Barradão" }, analysisAccess: "vip", predictionAccess: "free", sourceStatus: "partial",
  statisticalCoreProvenance: { season: "2026", home: { sampleType: "home", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 }, away: { sampleType: "away", source: "SoccerSTATS", competition: "Brasileirão Série A", matches: 14 } },
  sources: [{ name: "SoccerSTATS — 2026 Série A home/away splits and league history", url: "https://www.soccerstats.com/pmatch.asp?league=brazil&stats=282-1-11-2026" }, { name: "ge — CBF Round 29 dates, kick-off times and venues", url: "https://ge.globo.com/pr/futebol/brasileirao-serie-a/noticia/2026/08/31/cbf-detalha-datas-e-horarios-dos-jogos-das-rodadas-27-a-30-do-brasileirao-veja-a-tabela.ghtml" }],
  publishedAt: "2026-10-05T15:00:00.000Z", updatedAt: "2026-10-06T18:00:00.000Z", published: true,
};
