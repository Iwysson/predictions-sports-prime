import type { EditorialPrediction } from "@/types";

export const aroucaVsMaritimo: EditorialPrediction = {
  league: "liga-portugal",
  homeTeam: "Arouca",
  awayTeam: "Maritimo",
  analysis: [
    "Arouca host Maritimo in Liga Portugal. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Over 1.5 Goals — Live Entry.",
    "the goals component makes the total scoring range part of the selection.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to Arouca and Maritimo exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "This is marked as a live-entry plan, so it is not a standard instruction to enter before kick-off. The stored note defines the intended price conditions; if those conditions or the expected match pattern do not appear, no entry is required.",
  ],
  comment: "Pre-Match Odds: 1.44. Preferred Entry: 1.65+ live. Live Entry Only. Target Odds: 1.65+.",
  picks: {
    main: "Over 1.5 Goals — Live Entry",
    liveEntryProvenance: {
      bookmaker: "Betano",
      provenance: "author_attested",
      preMatchOdds: 1.44,
      capturedAt: "2026-08-24T13:25:00-03:00",
    },
  },
  sourceStatus: "verified",
  sources: [
    {
      name: "OpenFootball — Liga Portugal 2026/27 fixtures",
      url: "https://raw.githubusercontent.com/openfootball/europe/refs/heads/master/portugal/2026-27_pt1.txt",
      description: "Direct season fixture data supporting the competition, round, date, home team and away team used in this analysis.",
      accessedAt: "2026-08-24T14:45:00-03:00",
    },
  ],
  publishedAt: "2026-08-24T17:38:36.651Z",
  published: true,
  matchInfo: {
    date: "2026-08-29",
    round: "Matchday 4",
  },
};
