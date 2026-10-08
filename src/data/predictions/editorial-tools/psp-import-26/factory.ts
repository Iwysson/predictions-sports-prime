import type { EditorialPrediction, LeagueSlug, PredictionAccess } from "@/types";

export type ImportStatisticalCore =
  | { kind: "rows"; rows: Array<[metric: string, home: string, away: string]>; introLine: string; provenance: { season: string; homeSource: string; awaySource: string; homeMatches: number; awayMatches: number; competition: string } }
  | { kind: "disclosure"; note: string };

export type PspImport26Input = {
  league: LeagueSlug;
  competition: string;
  slug: string;
  home: string;
  away: string;
  date: string;
  time: string;
  round: string;
  venue: string;
  venueAddress?: { addressLocality?: string; addressCountry?: string };
  pick: string;
  odds: number;
  access: PredictionAccess;
  bestAnalysis?: boolean;
  teaser: string;
  trend: string;
  matchAnalysis: string[];
  tactical: string;
  risk: string;
  core: ImportStatisticalCore;
  sources: Array<{ name: string; url: string }>;
  publishedAt: string;
};

export function createPspImport26Prediction(input: PspImport26Input): EditorialPrediction {
  const implied = (100 / input.odds).toFixed(2);
  const coreSection = input.core.kind === "rows"
    ? `${input.core.introLine}

| Metric | ${input.home} HOME | ${input.away} AWAY |
| --- | ---: | ---: |
${input.core.rows.map(([metric, home, away]) => `| ${metric} | ${home} | ${away} |`).join("\n")}`
    : `Statistical coverage is partial. ${input.core.note}`;

  const markdown = `# ${input.home} vs ${input.away} Prediction, Odds and Betting Tips

**Prediction:** ${input.pick}
**Odds:** ${input.odds.toFixed(2)}

## Match information

- **Competition:** ${input.competition}
- **Date:** ${input.date}
- **Kick-off:** ${input.time}
- **Round:** ${input.round}
- **Venue:** ${input.venue}

## Team news and projected lineups

The supplied pre-match source set does not establish reliable team-news lists or projected lineups for both clubs. No absence, suspension or starting player has been inferred, and those fields remain unavailable rather than being filled with unsupported information.

## Match analysis

${input.matchAnalysis.join("\n\n")}

## Tactical analysis and expected game state

${input.tactical}

### Statistical Core Predictions-Sports-Prime

${coreSection}

## Market assessment and risk

${input.risk}

The published market price is **${input.odds.toFixed(2)}**, which carries a raw implied probability of **${implied}%** using 1 / ${input.odds.toFixed(2)}. That percentage is the market threshold, not a claim that the historical frequencies are a direct probability forecast. The value judgment comes from the matchup-specific evidence and the stated game-state interpretation above, while the risks described remain material.

## Conclusion

${input.risk.split(". ")[0]}. Weighing that against the published evidence, the retained call stays ${input.pick} at ${input.odds.toFixed(2)}, with the price unchanged from the original publication package.

**Prediction:** ${input.pick}
**Odds:** ${input.odds.toFixed(2)}`;

  const prediction: EditorialPrediction = {
    league: input.league,
    homeTeam: input.home,
    awayTeam: input.away,
    slug: input.slug,
    title: `${input.home} vs ${input.away}`,
    seoTitle: `${input.home} vs ${input.away} Prediction, Odds and Betting Tips`,
    trend: input.trend,
    access: input.access,
    analysisAccess: "vip",
    predictionAccess: input.access,
    bestAnalysis: input.bestAnalysis,
    teaser: input.teaser,
    editorialStandard: "psp-v1",
    analysisFormat: "markdown",
    analysisLanguage: "en",
    analysis: [markdown],
    picks: {
      main: input.pick,
      publishedOdds: input.odds,
      oddsProvenance: {
        source: "Editor-supplied PSP UCL + Brasileirão publication package (8 October 2026)",
        provenance: "author_attested",
        market: input.pick,
      },
    },
    matchInfo: {
      date: input.date,
      time: input.time,
      round: input.round,
      venue: input.venue,
      venueAddress: input.venueAddress,
    },
    published: true,
    publishedAt: input.publishedAt,
    updatedAt: input.publishedAt,
    sourceStatus: "partial",
    sources: input.sources.map((source) => ({ ...source, accessedAt: input.publishedAt })),
  };

  if (input.core.kind === "rows") {
    prediction.statisticalCoreProvenance = {
      season: input.core.provenance.season,
      home: { sampleType: "home", source: input.core.provenance.homeSource, competition: input.core.provenance.competition, matches: input.core.provenance.homeMatches },
      away: { sampleType: "away", source: input.core.provenance.awaySource, competition: input.core.provenance.competition, matches: input.core.provenance.awayMatches },
    };
  }

  return prediction;
}
