import type { EditorialPrediction } from "@/types";

export const utrechtVsPsvEindhoven: EditorialPrediction = {
  league: "eredivisie",
  homeTeam: "Utrecht",
  awayTeam: "PSV Eindhoven",
  analysis: [
    "Utrecht host PSV Eindhoven in Eredivisie. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: PSV Eindhoven or Draw (X2) + Over 2.5 Goals.",
    "the goals component makes the total scoring range part of the selection, while the double-chance component protects one of the drawn-result paths.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to Utrecht and PSV Eindhoven exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "PSV Eindhoven or Draw (X2) + Over 2.5 Goals",
    odds: 1.72,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T13:12:00-03:00",
      market: "PSV Eindhoven or Draw (X2) + Over 2.5 Goals",
    },
  },
  sourceStatus: "verified",
  sources: [
    {
      name: "OpenFootball — Eredivisie 2026/27 fixtures",
      url: "https://raw.githubusercontent.com/openfootball/europe/refs/heads/master/netherlands/2026-27_nl1.txt",
      description: "Direct season fixture data supporting the competition, round, date, home team and away team used in this analysis.",
      accessedAt: "2026-08-24T14:45:00-03:00",
    },
  ],
  publishedAt: "2026-08-24T17:38:36.651Z",
  published: true,
  matchInfo: {
    date: "2026-08-30",
    time: "12:15",
    round: "Matchday 4",
  },
};
