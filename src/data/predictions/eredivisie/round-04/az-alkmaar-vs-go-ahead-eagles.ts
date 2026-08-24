import type { EditorialPrediction } from "@/types";

export const azAlkmaarVsGoAheadEagles: EditorialPrediction = {
  league: "eredivisie",
  homeTeam: "AZ Alkmaar",
  awayTeam: "Go Ahead Eagles",
  analysis: [
    "AZ Alkmaar host Go Ahead Eagles in Eredivisie. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Go Ahead Eagles +1.5 Handicap.",
    "The handicap component sets the required scoring margin rather than relying only on the match winner.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to AZ Alkmaar and Go Ahead Eagles exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "Go Ahead Eagles +1.5 Handicap",
    odds: 1.83,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T13:08:00-03:00",
      market: "Go Ahead Eagles +1.5 Handicap",
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
    date: "2026-08-29",
    time: "18:45",
    round: "Matchday 4",
  },
};
