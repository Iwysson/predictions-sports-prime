import type { FixtureStatus } from "@/lib/fixture-status";
import type { SearchIntentCategory, SearchLocale } from "@/lib/search-intent-research";

export type LeagueSlug =
  | "premier-league"
  | "la-liga"
  | "bundesliga"
  | "serie-a"
  | "liga-portugal"
  | "ligue-1"
  | "eredivisie"
  | "brasileirao-serie-a"
  | "copa-do-brasil"
  | "efl-cup"
  | "super-lig"
  | "scottish-premiership";

export type PredictionItem = {
  label: string;
  value: string;
};

export type PredictionResultStatus =
  | "pending"
  | "awaiting-data"
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
  /** Immutable price recorded when the prediction was published. */
  publishedOdds?: number;
  /** A later observed price. It must never replace publishedOdds. */
  latestObservedOdds?: number;
  /** @deprecated Use publishedOdds for new and updated predictions. */
  odds?: number;
  /** @deprecated Ambiguous legacy field; use latestObservedOdds. */
  previousOdds?: number;
  oddsProvenance?: {
    source: string;
    bookmaker?: string;
    provenance?: "author_attested" | "external_verified";
    capturedAt?: string;
    market?: string;
  };
  liveEntryProvenance?: {
    bookmaker: string;
    provenance: "author_attested" | "external_verified";
    preMatchOdds: number;
    capturedAt: string;
  };
  result?: PredictionResultInput;
};

export type EditorialSource = {
  name: string;
  url: string;
  description?: string;
  accessedAt?: string;
};

export type VenueAddress = {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
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

  // Required for content first published after the Phase 2 source-policy cutoff.
  sourceStatus?: "verified" | "partial" | "incomplete";
  sources?: EditorialSource[];

  // Optional manual fallback when the external fixture feed is unavailable.
  matchInfo?: {
    date?: string;
    time?: string;
    round?: string;
    venue?: string;
    venueAddress?: VenueAddress;
  };
};

export type Match = {
  id: string;
  fixtureId?: string;
  kickoffUtc?: string;
  timeConfirmed?: boolean;
  slug: string;
  league: LeagueSlug;
  round: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue?: string;
  venueAddress?: VenueAddress;
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
  marketStats?: {
    homeCorners?: number;
    awayCorners?: number;
    source: string;
    capturedAt: string;
  };
  publishedAt?: string;
  updatedAt?: string;
  sources?: EditorialSource[];
};

export type EditorialStatus = "draft" | "ready_for_analysis" | "published";

export type UpcomingFixtureDraft = {
  slug: string;
  fixtureId?: string;
  league: LeagueSlug;
  round: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue?: string;
  status: "fixture-prepared";
  editorialStatus: Exclude<EditorialStatus, "published">;
  published: false;
  matchDate: string;
  kickoff: string;
  kickoffUtc?: string;
  fixtureLastUpdated?: string;
  source?: string;
  externalFixtureId?: string;
  searchIntent?: {
    locale: SearchLocale;
    categories: SearchIntentCategory[];
    primaryQuery: string;
    alternateMatchQueries: string[];
    predictionQueries: string[];
    bettingQueries: string[];
    oddsQueries: string[];
    analysisQueries: string[];
    secondaryQueries: string[];
    marketQueries: string[];
    statisticalQueries: string[];
    temporalQueries: string[];
    competitionQueries: string[];
    temporalState: "today" | "tomorrow" | "upcoming" | "historical" | null;
  };
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
