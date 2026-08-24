import type { EditorialPrediction } from "@/types";

export const telstarVsAjaxAmsterdam: EditorialPrediction = {
  league: "eredivisie",
  homeTeam: "Telstar",
  awayTeam: "Ajax Amsterdam",
  analysis: [
    "Telstar host Ajax Amsterdam in Eredivisie. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Ajax to Win.",
    "the win component requires the named team to finish ahead.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to Telstar and Ajax Amsterdam exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "Ajax to Win",
    odds: 1.67,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T13:17:00-03:00",
      market: "Ajax to Win",
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
    time: "16:45",
    round: "Matchday 4",
  },
};
