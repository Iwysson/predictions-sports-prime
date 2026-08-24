import type { EditorialPrediction } from "@/types";

export const acfFiorentinaVsFrosinoneCalcio: EditorialPrediction = {
  league: "serie-a",
  homeTeam: "ACF Fiorentina",
  awayTeam: "Frosinone Calcio",
  analysis: [
    "ACF Fiorentina host Frosinone Calcio in Serie A. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Over 2.5 Goals.",
    "the goals component makes the total scoring range part of the selection.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to ACF Fiorentina and Frosinone Calcio exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "Over 2.5 Goals",
    odds: 1.82,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T12:47:00-03:00",
      market: "Over 2.5 Goals",
    },
  },
  sourceStatus: "verified",
  sources: [
    {
      name: "OpenFootball — Serie A 2026/27 fixtures",
      url: "https://raw.githubusercontent.com/openfootball/italy/refs/heads/master/2026-27/1-seriea.txt",
      description: "Direct season fixture data supporting the competition, round, date, home team and away team used in this analysis.",
      accessedAt: "2026-08-24T14:45:00-03:00",
    },
  ],
  publishedAt: "2026-08-24T17:38:36.651Z",
  published: true,
  matchInfo: {
    date: "2026-08-29",
    time: "13:30",
    round: "Matchday 2",
  },
};
