export type LeagueSlug =
  | "premier-league"
  | "la-liga"
  | "bundesliga"
  | "serie-a"
  | "liga-portugal"
  | "ligue-1";

export type PredictionItem = {
  label: string;
  value: string;
};

export type EditorialPicks = {
  main: string;
  odds?: number;
};

export type EditorialPrediction = {
  league: LeagueSlug;
  homeTeam: string;
  awayTeam: string;

  // Seu texto manual.
  analysis: string[];

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
  predictions: PredictionItem[];
  publishedAt?: string;
  updatedAt?: string;
};

export type MatchPreview = Omit<Match, "analysis" | "predictions">;

export type TeamVisual = {
  code: string;
  primary: string;
  secondary: string;
};
