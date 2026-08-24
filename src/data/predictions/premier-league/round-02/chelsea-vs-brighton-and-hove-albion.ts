import type { EditorialPrediction } from "@/types";

export const chelseaVsBrightonAndHoveAlbion: EditorialPrediction = {
  league: "premier-league",
  homeTeam: "Chelsea",
  awayTeam: "Brighton & Hove Albion",
  analysis: [
    "Chelsea host Brighton & Hove Albion in Premier League. This preview is intentionally limited to the verified fixture and the structure of the supplied editorial selection: Chelsea to Win.",
    "the win component requires the named team to finish ahead.",
    "The selection is match-specific because it assigns the relevant protection, scoring line, or winning requirement to Chelsea and Brighton & Hove Albion exactly as shown. It should be assessed as one complete betting position rather than as a claim that either side is certain to produce a particular performance.",
    "The main risk is that the match develops outside the selected market conditions. The pick remains a pre-match editorial opinion, not a guarantee, and the supplied odds do not establish the probability of the outcome without a separately documented market capture.",
  ],
  picks: {
    main: "Chelsea to Win",
    odds: 2,
    oddsProvenance: {
      source: "Betano — author-attested editorial capture",
      bookmaker: "Betano",
      provenance: "author_attested",
      capturedAt: "2026-08-24T12:35:00-03:00",
      market: "Chelsea to Win",
    },
  },
  sourceStatus: "verified",
  sources: [
    {
      name: "OpenFootball — Premier League 2026/27 fixtures",
      url: "https://raw.githubusercontent.com/openfootball/england/refs/heads/master/2026-27/1-premierleague.txt",
      description: "Direct season fixture data supporting the competition, round, date, home team and away team used in this analysis.",
      accessedAt: "2026-08-24T14:45:00-03:00",
    },
  ],
  publishedAt: "2026-08-24T17:38:36.651Z",
  published: true,
  matchInfo: {
    date: "2026-08-30",
    round: "Matchday 2",
  },
};
