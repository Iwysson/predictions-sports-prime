import type { EditorialPrediction } from "@/types";

export const vascoDaGamaVsCruzeiro: EditorialPrediction = {
  league: "brasileirao-serie-a",
  homeTeam: "Vasco da Gama",
  awayTeam: "Cruzeiro",

  analysis: [
    "Cruzeiro arrive with one of the strongest momentum profiles in the league. Their 2-1 victory over Flamengo took them to 39 points and extended their winning run in the Brasileirão to four matches. Vasco, by contrast, remain inside the relegation zone after the latest round.",
    "That gap in current performance is the foundation for the X2. We do not need Cruzeiro to win at São Januário; a draw keeps the result leg alive. That protection matters because Vasco at home can play with far more aggression than their league position suggests.",
    "The Over 1.5 leg requires only two goals. Cruzeiro have just shown against Flamengo that they can stay competitive after falling behind and still produce enough attacking quality to turn a match. Vasco’s situation also makes a purely passive approach difficult: they need points and cannot spend the entire game protecting a draw.",
    "This creates a favorable game-state profile. If Vasco score first, Cruzeiro have the quality and confidence to respond. If Cruzeiro lead, Vasco are forced to open the game. Either route helps the two-goal requirement.",
    "At 2.15, the price is attractive because we combine current form on Cruzeiro’s side with protection against a draw and a relatively low scoring threshold.",
  ],

  picks: {
    main: "Cruzeiro or Draw (X2) + Over 1.5 Goals",
    odds: 2.15,
    oddsProvenance: {
      source: "Betano — editor-supplied price",
      bookmaker: "Betano",
      provenance: "author_attested",
      market: "Cruzeiro or Draw (X2) + Over 1.5 Goals",
    },
  },

  matchInfo: {
    date: "2026-08-29",
    time: "21:20",
    round: "Matchday 25",
    venue: "São Januário",
  },

  publishedAt: "2026-08-25T06:17:27-03:00",
  sourceStatus: "verified",
  sources: [
    {
      name: "CBF — Brasileirão 2026 Matchdays 25 and 26",
      url: "https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/cbf-detalha-rodadas-25-e-26-do-brasileirao-betano",
      description: "Official schedule and competition context for Brasileirão Matchday 25.",
      accessedAt: "2026-08-25T06:17:27-03:00",
    },
  ],
  published: true,
};
