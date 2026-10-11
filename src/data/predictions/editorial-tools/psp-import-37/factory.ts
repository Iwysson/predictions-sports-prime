import type { EditorialPrediction, LeagueSlug, PredictionAccess } from "@/types";

// Lightweight import factory for short-form packages: a single sourced analysis paragraph plus
// prediction, odds and sources, with no supplied stats split, tactical breakdown or H2H. Every
// mandatory psp-v1 section still appears, but sections with no sourced material are disclosed as
// unavailable rather than fabricated (per AGENTS.md: missing data is disclosed, never invented).
export type PspImport37Input = {
  league: LeagueSlug;
  competition: string;
  slug: string;
  home: string;
  away: string;
  date: string;
  time?: string;
  round: string;
  venue?: string;
  venueAddress?: { addressLocality?: string; addressCountry?: string };
  pick: string;
  odds: number;
  access: PredictionAccess;
  bestAnalysis?: boolean;
  teaser: string;
  trend: string;
  analysis: string[];
  sources: Array<{ name: string; url: string }>;
  publishedAt: string;
};

export function createPspImport37Prediction(input: PspImport37Input): EditorialPrediction {
  const implied = (100 / input.odds).toFixed(2);
  const venueLine = input.venue ? `- **Venue:** ${input.venue}` : "";
  // The supplied package did not include a kick-off time for every fixture (notably MLS). The
  // field is still populated so matchInfo.time is never blank, but with an honest disclosure
  // rather than an invented time.
  const time = input.time ?? "Not confirmed in the supplied source package at publication";

  const markdown = `# ${input.home} vs ${input.away} Prediction, Odds and Betting Tips

**Prediction:** ${input.pick}
**Odds:** ${input.odds.toFixed(2)}

## Match information

- **Fixture:** ${input.home} vs ${input.away}
- **Competition:** ${input.competition}
- **Date:** ${input.date}
- **Kick-off:** ${time}
- **Round:** ${input.round}
${venueLine}

## Team news and projected lineups

The supplied pre-match source set does not establish reliable team-news lists or projected lineups for both clubs. No absence, suspension or starting player has been inferred, and those fields remain unavailable rather than being filled with unsupported information.

## Match analysis

${input.analysis.join("\n\n")}

## Tactical analysis and expected game state

The supplied pre-match source set does not include named-player, formation or in-match tactical detail for this fixture beyond the statistical and form evidence described above. No tactical specifics are asserted beyond what that evidence supports.

### Statistical Core Predictions-Sports-Prime

Statistical coverage is partial. No sourced home and away split is available for this fixture, so no Statistical Core table is published here rather than estimating one. Metrics such as shots, possession and corners remain unavailable from the supplied source package.

## Market assessment and risk

${input.analysis[input.analysis.length - 1]} No further risk factors beyond the evidence described above were identified in the supplied source package.

The published market price is **${input.odds.toFixed(2)}**, which carries a raw implied probability of **${implied}%** using 1 / ${input.odds.toFixed(2)}. That percentage is the market threshold, not a claim that the historical frequencies are a direct probability forecast. The value judgment comes from the matchup-specific evidence described above, while the risks noted remain material.

## Conclusion

Weighing the evidence above against the published market price, the retained call for ${input.home} vs ${input.away} stays ${input.pick} at ${input.odds.toFixed(2)}, unchanged from the original publication package.

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
        source: "Editor-supplied PSP 37-analyses publication package (11 October 2026)",
        provenance: "author_attested",
        market: input.pick,
      },
    },
    matchInfo: {
      date: input.date,
      time,
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
}
