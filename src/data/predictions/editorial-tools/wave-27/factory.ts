import type { EditorialPrediction, LeagueSlug } from "@/types";

export type PublishableGapInput = {
  league: LeagueSlug;
  home: string;
  away: string;
  slug: string;
  competition: string;
  date: string;
  time: string;
  round?: string;
  venue?: string;
  pick: string;
  odds: number;
  sourceName: string;
  sourceUrl: string;
  evidence: string;
  tactical: string;
  liveEntry?: boolean;
  latestObservedOdds?: number;
  selectionChanged?: boolean;
  refreshedAt?: string;
  teamNews?: string;
  projectedLineups?: string;
  refreshSources?: Array<{ name: string; url: string; description: string }>;
};

function structuredProjectedLineups(value?: string) {
  if (!value) return undefined;
  const teams = [...value.matchAll(/\*\*PROJECTED [^:]+:\*\*\s*([^*]+?)(?=\s*\*\*PROJECTED|\s*These are)/g)]
    .map((match) => match[1].replace(/\.$/, "").split(/[;,]/).map((player) => player.trim()).filter(Boolean));
  return teams.length === 2 && teams.every((players) => players.length === 11)
    ? { home: { players: teams[0] }, away: { players: teams[1] } }
    : undefined;
}

export function publishableWithGaps(input: PublishableGapInput): EditorialPrediction {
  const probability = (100 / input.odds).toFixed(1);
  const latestProbability = input.latestObservedOdds === undefined ? undefined : (100 / input.latestObservedOdds).toFixed(1);
  const expectedLineups = structuredProjectedLineups(input.projectedLineups);
  const fixtureDetails = [
    `**Competition:** ${input.competition}`,
    `**Date:** ${input.date}`,
    `**Kick-off:** ${input.time}`,
    input.round ? `**Round:** ${input.round}` : "**Round:** not available from the sources consulted",
    input.venue ? `**Venue:** ${input.venue}` : "**Venue:** not available from the sources consulted",
  ].join("  \n");
  const liveNote = input.liveEntry
    ? "\n\nThis market was supplied as an in-play entry. Runtime verification unavailable: the site has no approved operational provider for minute, score or live price, so no live state or trigger has been invented. That limitation affects execution verification, not publication of the pre-match prediction record."
    : "";

  const analysis = `# ${input.home} vs ${input.away} Prediction, Odds and Betting Tips

**Prediction:** ${input.pick}  
**Odds:** ${input.odds.toFixed(2)}

### Match Information

${fixtureDetails}

The fixture identity, teams, competition and schedule were checked against ${input.sourceName}. ${input.evidence} ${input.selectionChanged ? "The main selection was expressly updated by the editor while the fixture remained pre-match; the original published price remains preserved separately from the new selection's latest observed price." : "The original editorial selection and price are retained exactly; neither has been adjusted to fit the evidence available after the initial market capture."}

### Team News and Availability

${input.teamNews ? `${input.teamNews} Eligibility and suspension status were checked against the cited matchday source; an omission is not treated as proof of availability.` : `No sufficiently reliable current team-availability report was found for ${input.home} vs ${input.away} at the time of publication. That means this preview does not claim that either squad is complete, and it does not infer injuries, suspensions, doubts or returns from silence. Confirmed club communications and the official teamsheet should take priority if they appear closer to kick-off.`}

### Projected Lineups

${input.projectedLineups ?? `Projected lineup was not available for ${input.home} or ${input.away} from the sources consulted at the time of publication. No eleven, formation or individual availability status has been reconstructed from an older match. This gap matters because personnel can change the pressing height, width, set-piece roles and defensive matchups, so confidence must remain lower than it would be with current team-specific reporting.`}

### Independent Match Analysis

The selection is assessed from the market requirement outward, while keeping the contrary path visible. For ${input.home}, home advantage can matter through territorial familiarity and the ability to set the opening tempo, but it is not treated as proof of dominance. ${input.away} still has routes through transition moments, restarts and changes of game state. The analysis therefore does not turn an unavailable statistic into an implied zero or use an overall figure while calling it a venue split.

${input.tactical} This is a match-specific game-state question rather than a claim that possession automatically produces chances. If the first pressure is played through, the defending side may have to retreat and protect the space behind midfield; if it holds, recoveries nearer goal can shorten the route to the box. Set pieces and second balls can become especially important when open-play access is limited.

The ${input.pick} pick determines the failure conditions in ${input.home} vs ${input.away}. A handicap needs the favoured side to create separation, a win market needs control to become a decisive score, and a goals or combined market needs every listed leg to land. A slow first half, poor finishing, a compact low block or an early lead followed by risk reduction can all work against the selection.

### HOME vs AWAY Data and Advanced Metrics

The preferred comparison is ${input.home}'s HOME sample against ${input.away}'s AWAY sample in the same competition and season. No provider returned a sufficiently attributable paired sample for publication. Consequently xG, xGA, shots, shots on target, possession, goals and corner averages are not printed here. Overall data has not been silently relabelled as HOME or AWAY, friendlies have not been mixed into competitive form, and absent values have not been replaced with zeroes.

For ${input.home} vs ${input.away}, this leaves **0 numeric HOME/AWAY split rows published** rather than a misleading complete table. The absence reduces precision but does not invalidate the verified fixture or the existence of the editor-supplied pick. It does mean the reader should not interpret this page as a quantitative forecast or as evidence of a stable historical hit rate.

### Statistical Core Predictions-Sports-Prime

The target Statistical Core metrics for ${input.home} and ${input.away} remain unavailable from a source that could establish the required competition, season, venue split, match count and metric provenance. The Core is therefore disclosed as unavailable instead of being synthesized. This page is classified as DATA_PUBLISHABLE_WITH_GAPS.

### Tactical Outlook and Risk

${input.home} can improve the pick's prospects by controlling where turnovers occur and by keeping enough players behind the ball to manage the next transition. ${input.away} can undermine it by slowing the rhythm, protecting central lanes and forcing lower-value deliveries from wide areas. The principal uncertainty is personnel: without a current projected XI, there is no responsible basis for naming the exact press, formation or individual duel that will decide the contest.

Game state can overturn the pre-match shape of ${input.home} vs ${input.away} quickly. An early goal may stretch distances and increase shots, corners and transition opportunities; a level score late in the match may instead encourage caution. A red card, penalty or finishing outlier can dominate a small pre-match evidence set. These are genuine risks against the selection, not reasons to rewrite the original call.

### Odds, Implied Probability and Value

The published decimal price is **${input.odds.toFixed(2)}**. Raw implied probability is calculated as 1 / decimal odds, so 1 / ${input.odds.toFixed(2)} = **${probability}% raw implied probability** before bookmaker margin. ${input.latestObservedOdds === undefined ? "The price is an editor-supplied publication record; no bookmaker name or later market movement has been invented." : `The price is an editor-supplied publication record and no bookmaker name has been invented. The latest editor-attested pre-match price is **${input.latestObservedOdds.toFixed(2)}**, equivalent to **${latestProbability}% raw implied probability**. It is kept separate from the immutable opening publication price.`}

For ${input.home} vs ${input.away}, that threshold is not the same as historical frequency or editorial confidence. ${input.teamNews || input.projectedLineups ? "Even with current availability reporting, the missing venue-split metrics leave insufficient evidence to publish a numerical fair price." : "With venue-split metrics, lineups and current team news unavailable, there is not enough evidence to publish a numerical fair price."} The value assessment is therefore conditional: the market may be attractive only if the expected game state develops in the direction described above, while the missing inputs materially widen uncertainty.${liveNote}

### Conclusion

${input.home} vs ${input.away} is published with a verified fixture reference, ${input.selectionChanged ? "the editor-authorized updated selection" : "the preserved selection"} and transparent evidence gaps. ${input.teamNews || input.projectedLineups ? "The available material supports a reasoned pre-match discussion and sourced projected personnel context, but not a fabricated full Statistical Core or confirmed teamsheet." : "The available material supports a reasoned pre-match discussion, but not a fabricated full Statistical Core, projected lineup or availability list."} Readers should recheck official fixture and team information near kick-off and treat the quoted price as the original publication snapshot.

**Prediction:** ${input.pick}  
**Odds:** ${input.odds.toFixed(2)}`;

  return {
    league: input.league,
    homeTeam: input.home,
    awayTeam: input.away,
    slug: input.slug,
    title: `${input.home} vs ${input.away} Prediction, Odds and Betting Tips`,
    analysis: [analysis],
    analysisFormat: "markdown",
    editorialStandard: "psp-v1",
    picks: {
      main: input.pick,
      publishedOdds: input.odds,
      ...(input.latestObservedOdds === undefined ? {} : { latestObservedOdds: input.latestObservedOdds }),
      oddsProvenance: {
        source: input.latestObservedOdds === undefined ? "Editor-supplied Wave 2.7 publication record" : "Editor-attested pre-match refresh on 2026-09-10",
        provenance: "author_attested",
        ...(input.latestObservedOdds === undefined || !input.refreshedAt ? {} : { capturedAt: input.refreshedAt }),
        market: input.pick,
      },
    },
    published: true,
    publishedAt: "2026-09-07T18:30:00-03:00",
    updatedAt: input.refreshedAt ?? "2026-09-07T18:30:00-03:00",
    ...(input.refreshedAt ? { freshness: { editorialUpdatedAt: input.refreshedAt, teamNewsUpdatedAt: input.refreshedAt, lineupUpdatedAt: input.refreshedAt, statisticsUpdatedAt: input.refreshedAt } } : {}),
    sourceStatus: "partial",
    sources: [{
      name: input.sourceName,
      url: input.sourceUrl,
      description: "Fixture identity and schedule reference; optional editorial fields are disclosed when unavailable.",
      accessedAt: input.refreshedAt ?? "2026-09-07T18:30:00-03:00",
    }, ...(input.refreshSources ?? []).map((source) => ({ ...source, accessedAt: input.refreshedAt }))],
    ...(expectedLineups && input.refreshedAt && input.refreshSources?.length ? {
      matchSeo: {
        lineups: {
          status: "expected" as const,
          home: expectedLineups.home,
          away: expectedLineups.away,
          sources: input.refreshSources.map((source) => ({ name: source.name, url: source.url, accessedAt: input.refreshedAt })),
          updatedAt: input.refreshedAt,
        },
      },
    } : {}),
    matchInfo: {
      date: input.date,
      time: input.time,
      ...(input.round ? { round: input.round } : {}),
      ...(input.venue ? { venue: input.venue } : {}),
    },
  };
}
