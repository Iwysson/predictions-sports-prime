import type { LeagueSlug, MatchPreview } from "@/types";
import type { OpenFootballGame, OpenFootballRound } from "@/lib/openfootball";
import { normalizeTeamKey, teamNamesMatch } from "@/lib/openfootball";
import { resolveCompetitionRounds } from "@/lib/match-lifecycle";
import { classifyFixture, isActiveFixtureState } from "@/lib/fixture-state";
import { sortMatchesByKickoff } from "@/lib/match-feed";

export type CompetitionRoundSourceState = "validated" | "editorial-fallback" | "unavailable";

export type CompetitionRoundSection = {
  round: number | string;
  factualFixtures: OpenFootballGame[];
  matches: MatchPreview[];
};

export type CompetitionRoundSurface = {
  sourceState: CompetitionRoundSourceState;
  current: CompetitionRoundSection | null;
  next: CompetitionRoundSection | null;
  additional?: CompetitionRoundSection[];
  followingRound: number | string | null;
  /** All active fixtures in one kickoff-ordered list (no round grouping). */
  flat?: boolean;
};

function normalizedRoundKey(value: string | number | undefined) {
  const text = String(value ?? "Current Round").trim().toLowerCase();
  const number = text.match(/\d+/)?.[0];
  return number
    ? `round:${number}`
    : text.replace(/(?:matchday|round|league)/g, "").replace(/\s+/g, " ").trim();
}

function mergePublishedActive(
  surface: CompetitionRoundSurface,
  publishedMatches: MatchPreview[],
  now: Date | string,
): CompetitionRoundSurface {
  const active = publishedMatches.filter((match) =>
    match.status === "published" &&
    isActiveFixtureState(classifyFixture({ ...match, status: match.fixtureStatus ?? "scheduled" }, now))
  );
  const sections = [surface.current, surface.next, ...(surface.additional ?? [])].filter(
    (section): section is CompetitionRoundSection => Boolean(section)
  );
  const known = new Set(sections.flatMap((section) => section.matches.map((match) => match.slug)));

  for (const match of active) {
    if (known.has(match.slug)) continue;
    const key = normalizedRoundKey(match.round);
    let section = sections.find((candidate) => normalizedRoundKey(candidate.round) === key);
    if (!section) {
      section = { round: match.round || "Upcoming fixtures", factualFixtures: [], matches: [] };
      sections.push(section);
    }
    section.matches.push(match);
    known.add(match.slug);
  }

  for (const section of sections) section.matches = sortMatchesByKickoff(section.matches);
  sections.sort((left, right) => {
    const leftFirst = left.matches[0];
    const rightFirst = right.matches[0];
    return `${leftFirst?.date ?? ""}T${leftFirst?.time ?? ""}`.localeCompare(
      `${rightFirst?.date ?? ""}T${rightFirst?.time ?? ""}`
    );
  });

  return {
    ...surface,
    current: sections[0] ?? null,
    next: sections[1] ?? null,
    additional: sections.slice(2),
    followingRound: sections[2]?.round ?? null,
  };
}

// Competitions whose fixtures are shown as a single chronological queue so no
// matchday/group can hide upcoming games.
export const FLAT_FIXTURE_LEAGUES: ReadonlySet<string> = new Set([
  "uefa-nations-league",
  "uefa-nations-league-b",
  "uefa-nations-league-c",
  "uefa-nations-league-d",
  "concacaf-nations-league",
  "international-friendlies",
  "africa-cup-of-nations-qualifying",
  "gulf-cup",
  "fifa-asean-cup",
  "msg-prime-ministers-cup",
]);

function flattenSurface(
  surface: CompetitionRoundSurface,
  editorial: CompetitionRoundSurface
): CompetitionRoundSurface {
  const editorialMatches = editorial.current?.matches ?? [];
  if (!surface.current && !editorialMatches.length) return surface;
  const seen = new Set<string>();
  const matches = sortMatchesByKickoff(
    [...(surface.current?.matches ?? []), ...(surface.next?.matches ?? []), ...editorialMatches].filter((match) => {
      if (seen.has(match.id)) return false;
      seen.add(match.id);
      return true;
    })
  );
  return {
    ...surface,
    sourceState: surface.current ? surface.sourceState : editorial.sourceState,
    current: { round: "Upcoming fixtures", factualFixtures: [], matches },
    next: null,
    followingRound: null,
    flat: true,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function factualFixtureIdentity(
  league: LeagueSlug,
  game: Pick<OpenFootballGame, "id" | "date" | "homeTeam" | "awayTeam">
) {
  if (game.id) return `${league}:provider:${game.id}`;
  return [
    league,
    game.date,
    normalizeTeamKey(game.homeTeam),
    normalizeTeamKey(game.awayTeam),
  ].join(":");
}

function fixtureMatchesPrediction(game: OpenFootballGame, match: MatchPreview) {
  if (game.id && match.fixtureId && game.id === match.fixtureId) return true;
  if (!teamNamesMatch(game.homeTeam, match.homeTeam) || !teamNamesMatch(game.awayTeam, match.awayTeam)) {
    return false;
  }
  return !match.date || match.date === game.date;
}

function findPublishedPrediction(game: OpenFootballGame, matches: MatchPreview[], used: Set<string>) {
  const candidates = matches.filter((match) =>
    match.status === "published" && !used.has(match.id) && fixtureMatchesPrediction(game, match)
  );
  if (candidates.length === 1) return candidates[0];

  return matches.find((match) =>
    match.status === "published" &&
    !used.has(match.id) &&
    teamNamesMatch(game.homeTeam, match.homeTeam) &&
    teamNamesMatch(game.awayTeam, match.awayTeam)
  );
}

function fixtureToMatch(
  league: LeagueSlug,
  round: number,
  game: OpenFootballGame,
  publishedMatches: MatchPreview[],
  usedPredictions: Set<string>
): MatchPreview {
  const published = findPublishedPrediction(game, publishedMatches, usedPredictions);
  if (published) {
    usedPredictions.add(published.id);
    const roundLabel = published.round?.trim() || `Matchday ${round}`;
    return {
      ...published,
      fixtureId: game.id ?? published.fixtureId,
      kickoffUtc: game.kickoffUtc ?? published.kickoffUtc,
      timeConfirmed: game.timeConfirmed ?? published.timeConfirmed,
      round: roundLabel,
      date: game.date,
      time: game.time,
      fixtureStatus: game.status,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
    };
  }

  const slug = `${slugify(game.homeTeam)}-vs-${slugify(game.awayTeam)}`;
  return {
    id: factualFixtureIdentity(league, game),
    fixtureId: game.id,
    kickoffUtc: game.kickoffUtc,
    timeConfirmed: game.timeConfirmed,
    slug,
    league,
    round: `Matchday ${round}`,
    homeTeam: game.homeTeam,
    awayTeam: game.awayTeam,
    date: game.date,
    time: game.time,
    status: "coming-soon",
    title: `${game.homeTeam} vs ${game.awayTeam} Prediction`,
    fixtureStatus: game.status,
    homeScore: game.homeScore,
    awayScore: game.awayScore,
  };
}

function buildSection(
  league: LeagueSlug,
  round: OpenFootballRound | null,
  fixtures: OpenFootballGame[],
  publishedMatches: MatchPreview[],
  usedPredictions: Set<string>
): CompetitionRoundSection | null {
  if (!round) return null;
  return {
    round: round.round,
    factualFixtures: fixtures,
    matches: sortMatchesByKickoff(
      fixtures.map((game) => fixtureToMatch(league, round.round, game, publishedMatches, usedPredictions))
    ),
  };
}

function editorialFallback(manualMatches: MatchPreview[], now: Date | string): CompetitionRoundSurface {
  const active = sortMatchesByKickoff(manualMatches.filter((match) =>
    match.status === "published" &&
    isActiveFixtureState(classifyFixture({ ...match, status: match.fixtureStatus ?? "scheduled" }, now))
  ));
  if (!active.length) {
    return { sourceState: "unavailable", current: null, next: null, followingRound: null };
  }

  const currentRound = active[0].round || "Current Round";
  const currentKey = normalizedRoundKey(currentRound);
  const currentMatches = active.filter((match) => normalizedRoundKey(match.round) === currentKey);
  const laterRounds = active.filter((match) => !currentMatches.includes(match));
  const nextRound = laterRounds[0]?.round;
  const nextKey = normalizedRoundKey(nextRound);
  const nextMatches = nextRound ? laterRounds.filter((match) => normalizedRoundKey(match.round) === nextKey) : [];
  const remaining = laterRounds.filter((match) => !nextMatches.includes(match));
  const additional = [...new Map(remaining.map((match) => [normalizedRoundKey(match.round), match.round])).values()]
    .map((round) => ({
      round,
      factualFixtures: [],
      matches: remaining.filter((match) => normalizedRoundKey(match.round) === normalizedRoundKey(round)),
    }));

  return {
    sourceState: "editorial-fallback",
    current: {
      round: currentRound,
      factualFixtures: [],
      matches: currentMatches,
    },
    next: nextRound ? { round: nextRound, factualFixtures: [], matches: nextMatches } : null,
    additional,
    followingRound: additional[0]?.round ?? null,
  };
}

function buildRoundSurface(input: {
  league: LeagueSlug;
  rounds: OpenFootballRound[];
  publishedMatches: MatchPreview[];
  now?: Date | string;
}): CompetitionRoundSurface {
  const now = input.now ?? new Date();

  if (!input.rounds.length) return editorialFallback(input.publishedMatches, now);

  const resolved = resolveCompetitionRounds(input.rounds, now);

  // The factual snapshot can legitimately contain only completed/stale rounds
  // while newer editorial predictions already exist. In that case, keeping the
  // source in "validated" mode produces an empty Current Round even though the
  // published predictions are still active. Reuse the existing guarded
  // editorial fallback rather than weakening fixture validation or inventing
  // factual schedule data.
  if (resolved.currentFixtures.length === 0 && resolved.nextFixtures.length === 0) {
    const fallback = editorialFallback(input.publishedMatches, now);
    if (fallback.current) return fallback;
  }

  const usedPredictions = new Set<string>();
  return {
    sourceState: "validated",
    current: buildSection(
      input.league,
      resolved.currentRound,
      resolved.currentFixtures,
      input.publishedMatches,
      usedPredictions
    ),
    next: buildSection(
      input.league,
      resolved.nextRound,
      resolved.nextFixtures,
      input.publishedMatches,
      usedPredictions
    ),
    followingRound: resolved.followingRound?.round ?? null,
  };
}

export function buildCompetitionRoundSurface(input: Parameters<typeof buildRoundSurface>[0]): CompetitionRoundSurface {
  const now = input.now ?? new Date();
  const surface = mergePublishedActive(buildRoundSurface(input), input.publishedMatches, now);
  if (!FLAT_FIXTURE_LEAGUES.has(input.league)) return surface;
  // Factual schedules can lag behind published editorial fixtures; merge both.
  const active = sortMatchesByKickoff(input.publishedMatches.filter((match) =>
    match.status === "published" &&
    isActiveFixtureState(classifyFixture({ ...match, status: match.fixtureStatus ?? "scheduled" }, now))
  ));
  const editorial: CompetitionRoundSurface = {
    sourceState: active.length ? "editorial-fallback" : "unavailable",
    current: active.length ? { round: "Upcoming fixtures", factualFixtures: [], matches: active } : null,
    next: null,
    followingRound: null,
  };
  return flattenSurface(surface, editorial);
}
