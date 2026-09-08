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

function rankCandidates(current: Match, candidates: Match[], now: Date | string) {
  const referenceKickoff = fixtureKickoffMillis(current) ?? new Date(now).valueOf();
  return [...candidates].sort((a, b) => {
    const leagueDifference = Number(b.league === current.league) - Number(a.league === current.league);
    if (leagueDifference !== 0) return leagueDifference;
    const proximityDifference = Math.abs(fixtureKickoffMillis(a)! - referenceKickoff) - Math.abs(fixtureKickoffMillis(b)! - referenceKickoff);
    if (proximityDifference !== 0) return proximityDifference;
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
  const ranked = rankCandidates(current, candidates, now);
  if (ranked.length <= limit) return ranked;

  const nearest = ranked.slice(0, Math.ceil(limit / 2));
  const rotationPool = ranked.slice(nearest.length);
  const currentIndex = Math.max(0, matches.findIndex((match) => match.slug === current.slug));
  const rotationSlots = limit - nearest.length;
  const rotationStart = (currentIndex * rotationSlots) % rotationPool.length;
  const rotated = Array.from(
    { length: Math.min(rotationSlots, rotationPool.length) },
    (_, offset) => rotationPool[(rotationStart + offset) % rotationPool.length]
  );
  return [...nearest, ...rotated];
}
