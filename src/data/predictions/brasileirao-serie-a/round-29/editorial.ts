import type { EditorialPrediction } from "@/types";

type CoreRow = [label: string, home: string, away: string];

type Round29EditorialInput = {
  homeTeam: string;
  awayTeam: string;
  pick: string;
  price: number;
  date: string;
  time: string;
  venue: string;
  overview: string;
  homeAnalysis: string;
  awayAnalysis: string;
  marketAnalysis: string;
  tacticalAnalysis: string;
  riskAnalysis: string;
  conclusion: string;
  coreRows: CoreRow[];
};

export function buildRound29Editorial(input: Round29EditorialInput): Pick<
  EditorialPrediction,
  "analysis" | "analysisFormat" | "analysisLanguage" | "editorialStandard"
> {
  const impliedProbability = (100 / input.price).toFixed(1);
  const core = input.coreRows
    .map(([label, home, away]) => `| ${label} | ${home} | ${away} |`)
    .join("\n");

  return {
    editorialStandard: "psp-v1",
    analysisFormat: "markdown",
    analysisLanguage: "en",
    analysis: [
      `# ${input.homeTeam} vs ${input.awayTeam} Prediction, Odds and Betting Tips

**Prediction:** ${input.pick}

**Odds:** ${input.price.toFixed(2)}

## Match information

- **Competition:** Brasileirão Série A
- **Date:** ${input.date}
- **Kick-off:** ${input.time}
- **Round:** Round 29
- **Venue:** ${input.venue}

## Team news and projected lineups

The supplied pre-match source set does not establish reliable team-news lists or projected lineups for both clubs. No absence, suspension or starting player has been inferred, and those fields remain unavailable rather than being filled with unsupported information.

## Match analysis

${input.overview}

${input.homeAnalysis}

${input.awayAnalysis}

${input.marketAnalysis}

## Tactical analysis and expected game state

${input.tacticalAnalysis}

### Statistical Core Predictions-Sports-Prime

The figures below use the host's home matches and the visitor's away matches in the 2026 league season. Statistical coverage is partial; unavailable target metrics, including xG, xGA, shots, shots on target and possession, were not synthesized.

| Metric | ${input.homeTeam} HOME | ${input.awayTeam} AWAY |
| --- | ---: | ---: |
${core}

${input.homeTeam}'s figures describe only its league matches at home, while ${input.awayTeam}'s figures describe only its league matches away. That venue alignment makes the comparison more relevant to this fixture, but it does not turn past frequency into certainty. The partial dataset is strongest for results, goals and any corner measures shown above; metrics not listed were unavailable in the retained source set. The sample should therefore inform the selection alongside the tactical matchup, market price and the specific risks identified below, rather than carry the judgment on its own.

## Market assessment and risk

${input.riskAnalysis}

The published market price is **${input.price.toFixed(2)}**, which carries a raw implied probability of **${impliedProbability}%** using 1 / ${input.price.toFixed(2)}. That percentage is the market threshold, not a claim that the historical frequencies are a direct probability forecast. The value judgment comes from the matchup-specific home/away evidence and the stated game-state interpretation, while the risks above remain material.

## Conclusion

${input.conclusion}

**Prediction:** ${input.pick}

**Odds:** ${input.price.toFixed(2)}`,
    ],
  };
}
