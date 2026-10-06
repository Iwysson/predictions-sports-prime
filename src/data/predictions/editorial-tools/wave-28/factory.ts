import type { EditorialPrediction, LeagueSlug, PredictionAccess } from "@/types";

export type Wave28Input = {
  league: LeagueSlug;
  competition: string;
  slug: string;
  home: string;
  away: string;
  date: string;
  time: string;
  round: string;
  venue: string;
  location: string;
  pick: string;
  odds: number;
  access: PredictionAccess;
  bestAnalysis?: boolean;
  trend: string;
  teaser: string;
  analysis: string[];
  tactical: string;
  risk: string;
  rows: Array<[string, string, string]>;
  homeMatches: number;
  awayMatches: number;
  fixtureSource: { name: string; url: string };
  statsSource: { name: string; url: string };
};

const publishedAt = "2026-10-06T18:00:00.000-03:00";

export function createWave28Prediction(input: Wave28Input): EditorialPrediction {
  const implied = (100 / input.odds).toFixed(2);
  const core = input.rows.map(([metric, home, away]) => `| ${metric} | ${home} | ${away} |`).join("\n");
  const markdown = `# ${input.home} vs ${input.away} Prediction, Odds and Betting Tips

**Prediction:** ${input.pick}
**Odds:** ${input.odds.toFixed(2)}

## Match information

- **Competition:** ${input.competition}
- **Date:** ${new Date(`${input.date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
- **Kick-off:** ${input.time} (local stadium time)
- **Round:** ${input.round}
- **Venue:** ${input.venue}
- **Location:** ${input.location}

## Team news and projected lineups

No sufficiently reliable current team-news report or projected lineup was supplied for ${input.home} or ${input.away}. No injury, suspension, doubt, return, formation or starting player has been inferred from silence; the official teamsheet remains the authority near kick-off.

## Match analysis

${input.analysis.join("\n\n")}

## Tactical analysis and expected game state

${input.tactical}

### Statistical Core Predictions-Sports-Prime

Statistical coverage is partial. The supplied pre-match package contains the HOME and AWAY split metrics below for the 2026 season, but unavailable target metrics have not been synthesized. The sample uses ${input.home}'s HOME matches and ${input.away}'s AWAY matches, with the statistical source checked on 6 October 2026.

| Metric | ${input.home} HOME | ${input.away} AWAY |
| --- | ---: | ---: |
${core}

## Market assessment and integrated risk

${input.risk}

For ${input.home} vs ${input.away}, the published price is **${input.odds.toFixed(2)}**, giving a raw implied probability of **${implied}%** because 1 / ${input.odds.toFixed(2)} = ${implied}%. That market threshold is not the same as the historical frequency in a small venue sample, and it is not presented as a forecast probability. The value judgment comes from this matchup's evidence, while the disclosed limitations keep the conclusion conditional.

## Conclusion

For ${input.home} vs ${input.away}, the statistical case supports ${input.pick}, but the selection still depends on the match developing along the routes described above. The original editor-supplied prediction and publication price are preserved without adjustment.

**Prediction:** ${input.pick}
**Odds:** ${input.odds.toFixed(2)}`;

  return {
    league: input.league,
    homeTeam: input.home,
    awayTeam: input.away,
    slug: input.slug,
    title: `${input.home} vs ${input.away}`,
    seoTitle: `${input.home} vs ${input.away} Prediction, Odds and Betting Tips`,
    trend: input.trend,
    access: input.access,
    analysisAccess: input.access,
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
        source: "Editor-supplied PSP 28-match publication package",
        provenance: "author_attested",
        market: input.pick,
      },
    },
    matchInfo: {
      date: input.date,
      time: input.time,
      round: input.round,
      venue: input.venue,
    },
    published: true,
    publishedAt,
    updatedAt: publishedAt,
    sourceStatus: "partial",
    sources: [
      {
        name: input.fixtureSource.name,
        url: input.fixtureSource.url,
        description: "Official fixture schedule used for matchup, date and kick-off verification.",
        accessedAt: publishedAt,
      },
      {
        name: input.statsSource.name,
        url: input.statsSource.url,
        description: "Established secondary source for the supplied current-season home and away statistical splits.",
        accessedAt: publishedAt,
      },
    ],
    statisticalCoreProvenance: {
      season: input.league === "mls" ? "2026" : "2026/27",
      home: { sampleType: "home", source: input.statsSource.name, competition: input.competition, matches: input.homeMatches },
      away: { sampleType: "away", source: input.statsSource.name, competition: input.competition, matches: input.awayMatches },
    },
  };
}
