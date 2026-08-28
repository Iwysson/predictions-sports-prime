export type NFLGameStatus = "draft" | "published" | "finished";
export type NFLConference = "AFC" | "NFC";
export type NFLDivision = "AFC East" | "AFC North" | "AFC South" | "AFC West" | "NFC East" | "NFC North" | "NFC South" | "NFC West";
export type NFLPlayoffStatus = "clinched-division" | "clinched-playoff" | "wild-card" | "in-playoff-position" | "in-the-hunt" | "eliminated" | "none";
export type NFLTeam = { id: string; name: string; shortName: string; conference: NFLConference; division: NFLDivision; logo: string };
export type NFLStanding = NFLTeam & { wins: number; losses: number; ties: number; winPct?: number; pointsFor?: number; pointsAgainst?: number; pointDifferential?: number; divisionWins?: number; divisionLosses?: number; divisionTies?: number; conferenceWins?: number; conferenceLosses?: number; conferenceTies?: number; streak?: string; divisionRank?: number; conferenceRank?: number; playoffStatus: NFLPlayoffStatus };
export type NFLStandingRecord = Omit<NFLStanding, keyof NFLTeam> & { teamId: string };
export type NFLStandingsSnapshot = { version: 1; season: number; generatedAt: string; source: string; sourceUrl: string; seasonPhase: "preseason" | "regular" | "postseason"; standings: NFLStandingRecord[] };

export type NFLInjuryStatus =
  | "Questionable"
  | "Doubtful"
  | "Out"
  | "IR"
  | "Probable"
  | "Day-to-Day";

export type NFLInjury = {
  player: string;
  position: string;
  team: string;
  injury: string;
  status: NFLInjuryStatus;
  replacement?: string;
};

export type NFLStarter = { position: string; player: string };
export type NFLProjectedLineups = {
  away?: { offense?: NFLStarter[]; defense?: NFLStarter[]; keyStarters?: NFLStarter[] };
  home?: { offense?: NFLStarter[]; defense?: NFLStarter[]; keyStarters?: NFLStarter[] };
};

export type NFLPrediction = {
  selection: string;
  odds: number;
  americanOdds: number;
  condition?: string;
};

export type NFLGame = {
  id: string;
  season: number;
  week: number | string;
  awayTeam: string;
  homeTeam: string;
  awayTeamId?: string;
  homeTeamId?: string;
  awayTeamShort: string;
  homeTeamShort: string;
  awayLogo: string;
  homeLogo: string;
  date: string;
  kickoff: string;
  timezone?: string;
  stadium?: string;
  city?: string;
  state?: string;
  predictions: NFLPrediction[];
  analysis: string[];
  keyFactors?: string[];
  keyMatchup?: string;
  injuries?: NFLInjury[];
  projectedLineups?: NFLProjectedLineups;
  status: NFLGameStatus;
  result?: { awayScore: number; homeScore: number; outcome: "green" | "red" | "push" };
  published: boolean;
  sourceFile: string;
};
