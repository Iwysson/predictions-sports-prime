import type { Match } from "@/types";

const DEFAULT_LIMIT = 4;

function timestamp(match: Match) {
  const value = match.date || match.publishedAt || match.updatedAt;
  const parsed = value ? Date.parse(value) : Number.NaN;
  return Number.isNaN(parsed) ? null : parsed;
}

function stableHash(value: string) {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function rankCandidates(current: Match, candidates: Match[]) {
  const currentTime = timestamp(current);

  return [...candidates].sort((a, b) => {
    const roundDifference = Number(a.round !== current.round) - Number(b.round !== current.round);
    if (roundDifference !== 0) return roundDifference;

    const aTime = timestamp(a);
    const bTime = timestamp(b);

    if (currentTime !== null && aTime !== null && bTime !== null) {
      const distanceDifference =
        Math.abs(aTime - currentTime) - Math.abs(bTime - currentTime);
      if (distanceDifference !== 0) return distanceDifference;

      const aUpcoming = aTime >= currentTime;
      const bUpcoming = bTime >= currentTime;

      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
    } else if ((aTime === null) !== (bTime === null)) {
      return aTime === null ? 1 : -1;
    }

    return stableHash(`${current.slug}:${a.slug}`) - stableHash(`${current.slug}:${b.slug}`);
  });
}

export function selectRelatedPredictions(
  current: Match,
  matches: Match[],
  limit = DEFAULT_LIMIT
) {
  const candidates = matches.filter(
    (match) => match.status === "published" && match.slug !== current.slug
  );
  const sameLeague = rankCandidates(
    current,
    candidates.filter((match) => match.league === current.league)
  );
  const selected = sameLeague.slice(0, limit);

  if (selected.length < limit) {
    const fallback = rankCandidates(
      current,
      candidates.filter((match) => match.league !== current.league)
    );
    selected.push(...fallback.slice(0, limit - selected.length));
  }

  return selected;
}
