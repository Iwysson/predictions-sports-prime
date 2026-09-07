export const CORE_METRICS = [
  "Matches (N)", "W-D-L", "Points/game", "GF/game", "GA/game", "xG/game", "xGA/game",
  "Shots/game", "SOT/game", "Shots allowed/game", "SOT allowed/game", "Possession",
  "Corners for/game", "Corners against/game", "Total corners/game", "First to score",
  "First to concede", "Scored in 1st half", "Conceded in 1st half", "BTTS",
  "Clean sheets", "Failed to score",
] as const;

export type CoreMetric = (typeof CORE_METRICS)[number];
export type SampleType = "home" | "away";
export type TeamSide = "home" | "away";
export type DataState = "DATA_READY" | "DATA_PUBLISHABLE_WITH_GAPS" | "DATA_BLOCKED";

export type SourceRef = {
  source: string;
  sourceUrl: string;
  fetchedAt: string;
};

export type MetricValue = SourceRef & {
  provenanceUrls?: string[];
  metric: CoreMetric;
  value: string | number;
  season: string;
  competition: string;
  sampleType: SampleType;
  matches: number;
};

export type StatisticalCoreData = {
  team: string;
  season: string;
  competition: string;
  sampleType: SampleType;
  matches: number;
  metrics: Partial<Record<CoreMetric, MetricValue>>;
  provider: string;
};

export type ResolvedFixture = SourceRef & {
  slug: string;
  home: string;
  away: string;
  competition: string;
  round: string;
  date: string;
  kickoffUtc: string;
  timezone: string;
  venue: string;
  verifiedAt: string;
  provider: string;
};

export type AvailabilityEntry = { player: string; detail?: string };
export type ProjectedLineup = SourceRef & {
  slug: string;
  team: string;
  formation: string;
  players: string[];
  doubts: AvailabilityEntry[];
  injuries: AvailabilityEntry[];
  suspensions: AvailabilityEntry[];
  sourceDate: string;
  provider: string;
  status: "projected";
};

export type TeamNews = SourceRef & {
  slug: string;
  team: string;
  unavailable: AvailabilityEntry[];
  suspended: AvailabilityEntry[];
  doubtful: AvailabilityEntry[];
  returned: AvailabilityEntry[];
  rotationNotes: string[];
  sourceDate: string;
  provider: string;
};

export type PendingEditorialMatch = {
  slug: string;
  competition: string;
  home: string;
  away: string;
  season: string;
  pick: string;
  odds: number;
  liveEntry?: boolean;
};

export type ProviderCapability = {
  id: string;
  kind: "fixture" | "statistics" | "lineup" | "team-news" | "live";
  competitions: string[] | "configured";
  metrics?: readonly CoreMetric[];
  homeAway: boolean;
  attribution: string;
  freshness: string;
  reliability: "primary" | "secondary" | "manual-verified";
};

export type EditorialDataReadiness = {
  slug: string;
  state: DataState;
  fixture?: ResolvedFixture;
  homeCore?: StatisticalCoreData;
  awayCore?: StatisticalCoreData;
  homeLineup?: ProjectedLineup;
  awayLineup?: ProjectedLineup;
  homeTeamNews?: TeamNews;
  awayTeamNews?: TeamNews;
  reasons: string[];
  gaps: string[];
  providersTried: string[];
};

export interface FixtureProvider {
  capability: ProviderCapability;
  resolve(match: PendingEditorialMatch): Promise<ResolvedFixture | undefined>;
}

export interface StatisticalCoreProvider {
  capability: ProviderCapability;
  get(input: { team: string; competition: string; season: string; sampleType: SampleType }): Promise<StatisticalCoreData | undefined>;
}

export interface LineupProvider {
  capability: ProviderCapability;
  get(match: PendingEditorialMatch, team: TeamSide): Promise<ProjectedLineup | undefined>;
}

export interface TeamNewsProvider {
  capability: ProviderCapability;
  get(match: PendingEditorialMatch, team: TeamSide): Promise<TeamNews | undefined>;
}
