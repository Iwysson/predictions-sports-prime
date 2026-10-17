import type { EditorialPrediction } from "@/types";
import { matchdayUpdatesEurope20261017 } from "./2026-10-17-europe";
import { matchdayUpdatesRest20261017 } from "./2026-10-17-rest";
import type { MatchdayUpdate } from "./types";

export type { MatchdayUpdate } from "./types";

// Brief pre-match refreshes (lineups, availability, updated comment). Each entry keeps the original
// publishedAt, picks and odds, and only advances updatedAt/freshness. Entries exist only for fixtures
// whose kick-off was still in the future when the update was written (Historical Freeze Policy).
export const matchdayUpdates: Record<string, MatchdayUpdate> = {
  ...matchdayUpdatesEurope20261017,
  ...matchdayUpdatesRest20261017,
};

const ANCHOR_HEADING = /^(#{2,3})\s+(?:Match analysis|Statistical Core Predictions-Sports-Prime)\s*$/m;

function sideLine(label: string, shape: string | undefined, players: string) {
  return `- **PROJECTED ${label}${shape ? ` (${shape})` : ""}:** ${players}`;
}

export function renderMatchdayUpdate(prediction: EditorialPrediction, update: MatchdayUpdate, level: string) {
  const home = prediction.homeTeam;
  const away = prediction.awayTeam;
  const lineups = update.lineups
    ? [
        sideLine(home, update.lineups.homeShape, update.lineups.home),
        sideLine(away, update.lineups.awayShape, update.lineups.away),
        `- *${update.lineups.sourceNote}*`,
      ].join("\n")
    : `- No credible projected lineup was found for ${home} or ${away} at the time of this update, so no starting XI is projected. Official teamsheets, released about an hour before kick-off, will settle both elevens.`;

  return `${level} Matchday update — 17 October 2026

${update.comment}

**Projected lineups (not officially confirmed):**
${lineups}

**Availability check:**
- **${home}:** ${update.homeAvailability}
- **${away}:** ${update.awayAvailability}

*The original publication date, pick and published odds are unchanged. Where this update differs from the earlier team news or projected lineups above, it reflects the later check.*`;
}

export function applyMatchdayUpdate(prediction: EditorialPrediction): EditorialPrediction {
  const update = prediction.slug ? matchdayUpdates[prediction.slug] : undefined;
  if (!update) return prediction;
  const markdown = prediction.analysis[0];
  const anchor = markdown ? ANCHOR_HEADING.exec(markdown) : null;
  if (!markdown || !anchor) {
    throw new Error(`matchday update for ${prediction.slug}: no anchor heading found`);
  }
  const block = renderMatchdayUpdate(prediction, update, anchor[1]);
  const analysis = [
    `${markdown.slice(0, anchor.index)}${block}\n\n${markdown.slice(anchor.index)}`,
    ...prediction.analysis.slice(1),
  ];
  const known = new Set((prediction.sources ?? []).map((source) => source.url));
  const sources = [
    ...(prediction.sources ?? []),
    ...update.sources
      .filter((source) => !known.has(source.url))
      .map((source) => ({ ...source, accessedAt: update.updatedAt })),
  ];
  return {
    ...prediction,
    analysis,
    updatedAt: update.updatedAt,
    freshness: {
      ...prediction.freshness,
      editorialUpdatedAt: update.updatedAt,
      teamNewsUpdatedAt: update.updatedAt,
      lineupUpdatedAt: update.updatedAt,
    },
    sources,
  };
}
