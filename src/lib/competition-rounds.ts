import type { LeagueSlug, MatchPreview } from "@/types";
import type { OpenFootballGame, OpenFootballRound } from "@/lib/openfootball";
import { normalizeTeamKey, teamNamesMatch } from "@/lib/openfootball";
import { resolveCompetitionRounds } from "@/lib/match-lifecycle";
import { isLiveFixture, isPlayableUpcoming } from "@/lib/fixture-status";
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
  followingRound: number | string | null;
};

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
    return {
      ...published,
      fixtureId: game.id ?? published.fixtureId,
      kickoffUtc: game.kickoffUtc ?? published.kickoffUtc,
      timeConfirmed: game.timeConfirmed ?? published.timeConfirmed,
      round: `Matchday ${round}`,
      date: game.date,
      time: game.time,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
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

function editorialFallback(manualMatches: MatchPreview[]): CompetitionRoundSurface {
  const active = sortMatchesByKickoff(manualMatches.filter((match) =>
    match.status === "published" &&
    (isPlayableUpcoming(match.fixtureStatus) || isLiveFixture(match.fixtureStatus))
  ));
  if (!active.length) {
    return { sourceState: "unavailable", current: null, next: null, followingRound: null };
  }

  const currentRound = active[0].round || "Current Round";
  const currentMatches = active.filter((match) => (match.round || "Current Round") === currentRound);
  const laterRounds = active.filter((match) => !currentMatches.includes(match));
  const nextRound = laterRounds[0]?.round;
  const nextMatches = nextRound ? laterRounds.filter((match) => match.round === nextRound) : [];

  return {
    sourceState: "editorial-fallback",
    current: {
      round: currentRound,
      factualFixtures: [],
      matches: currentMatches,
    },
    next: nextRound ? { round: nextRound, factualFixtures: [], matches: nextMatches } : null,
    followingRound: null,
  };
}

export function buildCompetitionRoundSurface(input: {
  league: LeagueSlug;
  rounds: OpenFootballRound[];
  publishedMatches: MatchPreview[];
  now?: Date | string;
}): CompetitionRoundSurface {
  if (!input.rounds.length) return editorialFallback(input.publishedMatches);

  const resolved = resolveCompetitionRounds(input.rounds, input.now);
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
