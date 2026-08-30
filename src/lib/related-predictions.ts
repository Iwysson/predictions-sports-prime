import type { Match } from "@/types";
import { fixtureKickoffMillis } from "@/lib/fixture-state";

const DEFAULT_LIMIT = 4;

function stableHash(value: string) {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function rankCandidates(current: Match, candidates: Match[]) {
  return [...candidates].sort((a, b) => {
    const kickoffDifference = fixtureKickoffMillis(a)! - fixtureKickoffMillis(b)!;
    if (kickoffDifference !== 0) return kickoffDifference;

    return stableHash(`${current.slug}:${a.slug}`) - stableHash(`${current.slug}:${b.slug}`);
  });
}

export function selectRelatedPredictions(
  current: Match,
  matches: Match[],
  limit = DEFAULT_LIMIT,
  now: Date | string = new Date()
) {
  const nowMillis = new Date(now).valueOf();
  const candidates = matches.filter(
    (match) => {
      if (match.status !== "published" || match.slug === current.slug) return false;
      if (match.fixtureStatus === "completed" || match.fixtureStatus === "in-progress") return false;
      const kickoff = fixtureKickoffMillis(match);
      return kickoff !== null && kickoff > nowMillis;
    }
  );
  const ranked = rankCandidates(current, candidates);
  if (ranked.length <= limit) return ranked;

  const nearest = ranked.slice(0, Math.ceil(limit / 2));
  const rotationPool = ranked.filter(
    (candidate) => !nearest.some((match) => match.slug === candidate.slug)
  );
  const currentIndex = Math.max(0, matches.findIndex((match) => match.slug === current.slug));
  const rotationSlots = limit - nearest.length;
  const rotationStart = (currentIndex * rotationSlots) % rotationPool.length;
  const rotated = Array.from(
    { length: Math.min(rotationSlots, rotationPool.length) },
    (_, offset) => rotationPool[(rotationStart + offset) % rotationPool.length]
  );

  return [...nearest, ...rotated];
}
