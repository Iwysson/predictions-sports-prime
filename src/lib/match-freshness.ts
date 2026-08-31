import type { Match, MatchFreshness, MatchSeoData } from "@/types";

export type MatchFreshnessWindow = "T-48h" | "T-24h" | "T-8h" | "T-3h" | "T-1h" | "kickoff" | "post-match" | "outside-window";

const ISO_FIELDS: Array<keyof MatchFreshness> = [
  "editorialUpdatedAt", "teamNewsUpdatedAt", "lineupUpdatedAt", "statisticsUpdatedAt", "resultUpdatedAt",
];

function validTimestamp(value?: string) {
  return value && !Number.isNaN(Date.parse(value)) ? value : undefined;
}

export function materialMatchUpdatedAt(match: Pick<Match, "updatedAt" | "freshness" | "matchSeo">) {
  const candidates = [
    validTimestamp(match.updatedAt),
    ...ISO_FIELDS.map((field) => validTimestamp(match.freshness?.[field])),
    ...Object.values(match.matchSeo ?? {}).map((module) => validTimestamp(module?.updatedAt)),
  ].filter((value): value is string => Boolean(value));
  return candidates.sort((left, right) => Date.parse(right) - Date.parse(left))[0];
}

export function resolveMatchFreshnessWindow(kickoff: string | Date, now: string | Date = new Date()): MatchFreshnessWindow {
  const deltaHours = (new Date(kickoff).valueOf() - new Date(now).valueOf()) / 3_600_000;
  if (deltaHours < 0) return "post-match";
  if (deltaHours <= 0.25) return "kickoff";
  if (deltaHours <= 1) return "T-1h";
  if (deltaHours <= 3) return "T-3h";
  if (deltaHours <= 8) return "T-8h";
  if (deltaHours <= 24) return "T-24h";
  if (deltaHours <= 48) return "T-48h";
  return "outside-window";
}

export function classifyMatchSeo(matchSeo?: MatchSeoData) {
  if (!matchSeo) return "C" as const;
  return matchSeo.information && matchSeo.lineups && matchSeo.availability && matchSeo.statistics && matchSeo.h2h ? "A" as const : "B" as const;
}
