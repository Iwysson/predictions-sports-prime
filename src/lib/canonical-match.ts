import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { isHistoryEligibleFixture } from "@/lib/fixture-status";
import { hydratePrediction } from "@/lib/live-predictions";
import type { Match } from "@/types";

const canonicalMatches = new Map<string, Promise<Match | undefined>>();
let allCanonicalMatches: Promise<Match[]> | undefined;
const publishedMatchesBySlug = new Map(
  matches
    .filter((match) => match.status === "published")
    .map((match) => [match.slug, match])
);

function mergeCanonicalFixture(
  match: Match,
  fixture: Awaited<ReturnType<typeof hydratePrediction>>
): Match {
  const completed = isHistoryEligibleFixture({
    status: fixture.fixtureStatus,
    homeScore: fixture.homeScore,
    awayScore: fixture.awayScore,
  });
  const preserveEditorialTeamNames = match.slug === "athletic-bilbao-vs-elche";

  return {
    ...match,
    fixtureId: fixture.fixtureId,
    kickoffUtc: fixture.kickoffUtc,
    timeConfirmed: fixture.timeConfirmed,
    round: fixture.round,
    homeTeam: preserveEditorialTeamNames ? match.homeTeam : fixture.homeTeam,
    awayTeam: preserveEditorialTeamNames ? match.awayTeam : fixture.awayTeam,
    date: fixture.date,
    time: fixture.time,
    venue: fixture.venue ?? match.venue,
    fixtureStatus: fixture.fixtureStatus,
    homeScore: fixture.homeScore,
    awayScore: fixture.awayScore,
    betResult: completed ? fixture.betResult : match.betResult,
    betResultSource: completed ? fixture.betResultSource : match.betResultSource,
  };
}

/** Resolves the same fixture snapshot for every SEO surface handling a slug. */
export function resolveCanonicalMatch(slug: string) {
  if (!canonicalMatches.has(slug)) {
    canonicalMatches.set(slug, (async () => {
      const match = publishedMatchesBySlug.get(slug);
      if (!match) return undefined;
      return mergeCanonicalFixture(
        match,
        await hydratePrediction(toMatchPreview(match))
      );
    })());
  }

  return canonicalMatches.get(slug)!;
}

export async function resolveCanonicalMatches(
  source: readonly Match[] = matches
): Promise<Match[]> {
  if (source === matches) {
    allCanonicalMatches ??= resolveCanonicalMatches([...matches]);
    return allCanonicalMatches;
  }
  const resolved = await Promise.all(
    source.map((match) => resolveCanonicalMatch(match.slug))
  );
  return resolved.filter((match): match is Match => Boolean(match));
}
