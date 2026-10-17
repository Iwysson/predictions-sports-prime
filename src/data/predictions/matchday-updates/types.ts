export type MatchdayUpdateSource = { name: string; url: string };

export type MatchdayUpdate = {
  /** Absolute kick-off, used only to prove the update was written before kick-off. */
  kickoffUtc: string;
  updatedAt: string;
  comment: string;
  /** Omitted when no credible projected lineup exists. */
  lineups?: { home: string; away: string; homeShape?: string; awayShape?: string; sourceNote: string };
  homeAvailability: string;
  awayAvailability: string;
  sources: MatchdayUpdateSource[];
};
