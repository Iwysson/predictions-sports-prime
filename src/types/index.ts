import type { FixtureStatus } from "@/lib/fixture-status";

export type LeagueSlug =
  | "premier-league"
  | "la-liga"
  | "bundesliga"
  | "serie-a"
  | "liga-portugal"
  | "ligue-1"
  | "eredivisie"
  | "brasileirao-serie-a";

export type PredictionItem = {
  label: string;
  value: string;
};

export type PredictionResultStatus =
  | "pending"
  | "green"
  | "red"
  | "push"
  | "half-green"
  | "half-red"
  | "void";

export type PredictionResultInput =
  | PredictionResultStatus
  | {
      status: PredictionResultStatus;
      source?: "automatic" | "manual";
      finalScore?: { home: number; away: number };
    };

export type EditorialPicks = {
  main: string;
  odds?: number;
  result?: PredictionResultInput;
};

export type EditorialPrediction = {
  league: LeagueSlug;
  homeTeam: string;
  awayTeam: string;

  // Optional stable override for legitimate rematches between the same teams.
  slug?: string;

  // Seu texto manual.
  analysis: string[];

  // Optional note shown below the analysis.
  comment?: string;

  // Seus palpites manuais.
  picks: EditorialPicks;

  // Opcional. Se não informar, o título é criado automaticamente.
  title?: string;

  // Opcional. false = rascunho e não aparece no site.
  published?: boolean;

  // ISO 8601 editorial metadata. Sitemap/structured data only emit these
  // values when an editor explicitly provides them.
  publishedAt?: string;
  updatedAt?: string;

  // Optional manual fallback when the external fixture feed is unavailable.
  matchInfo?: {
    date?: string;
    time?: string;
    round?: string;
    venue?: string;
  };
};

export type Match = {
  id: string;
  slug: string;
  league: LeagueSlug;
  round: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue?: string;
  status: "published" | "coming-soon";
  title: string;
  analysis: string[];
  comment?: string;
  predictions: PredictionItem[];
  betResult?: PredictionResultStatus;
  betResultSource?: "automatic" | "manual";
  fixtureStatus?: FixtureStatus;
  homeScore?: number | null;
  awayScore?: number | null;
  publishedAt?: string;
  updatedAt?: string;
};

export type MatchPreview = Omit<Match, "analysis" | "comment" | "predictions"> & {
  mainPrediction?: string;
  odds?: number;
};

export type TeamVisual = {
  code: string;
  primary: string;
  secondary: string;
};
