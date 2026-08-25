import type { EditorialPrediction } from "@/types";

export const celtaVigoVsAthleticClub: EditorialPrediction = {
  league: "la-liga",
  homeTeam: "Celta Vigo",
  awayTeam: "Athletic Club",

  analysis: [
    "The attraction here is the low threshold on both parts of the combination. We need two goals and seven corners, numbers that can be reached without the match becoming unusually open.",
    "Celta will play at Balaídos and should have a clear incentive to push higher up the pitch. Their home structure naturally creates periods of possession around the opposition box, while Athletic have enough pace and technical quality to respond through transitions and wide attacks. That gives us two teams capable of contributing to the corner count rather than relying on one side to generate everything.",
    "The historical scoring average between the clubs sits around 2.56 goals in the available sample, while the relevant statistical profile for the two teams points to roughly a 75% combined Over 1.5 tendency. We are using that only as supporting context; the more important point is that the line requires just two goals.",
    "The corner requirement is similarly modest. Seven total corners can be reached through sustained pressure without needing an extreme shot count. Celta’s home initiative and Athletic’s ability to attack the channels should produce crosses, blocks and defensive clearances into corner situations.",
    "Rather than choosing a winner in a matchup that can swing through different phases, we prefer to back the overall activity. At 1.72, two goals plus seven corners gives us a practical route to the selection.",
  ],

  picks: {
    main: "Over 1.5 Goals + Over 6.5 Corners",
    odds: 1.72,
    oddsProvenance: {
      source: "Betano — editor-supplied price",
      bookmaker: "Betano",
      provenance: "author_attested",
      market: "Over 1.5 Goals + Over 6.5 Corners",
    },
  },

  matchInfo: {
    date: "2026-08-30",
    time: "21:30",
    round: "Matchday 3",
    venue: "Balaídos",
  },

  publishedAt: "2026-08-25T06:17:27-03:00",
  sourceStatus: "verified",
  sources: [
    {
      name: "LaLiga — Matchday 3 fixtures and statistics",
      url: "https://www.laliga.com/laliga-easports/resultados/2026-27/jornada-3",
      description: "Official fixture and match-stat context for LaLiga Matchday 3.",
      accessedAt: "2026-08-25T06:17:27-03:00",
    },
  ],
  published: true,
};
