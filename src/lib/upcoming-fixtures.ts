import fixtureSnapshot from "@/data/fixtures.snapshot.json";
import { matches } from "@/data/matches";
import type { LeagueSlug, Match, UpcomingFixtureDraft } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import { teamNamesMatch } from "@/lib/openfootball";
import { buildMatchSearchIntent } from "@/lib/match-search-intent";
import { isPlayableUpcoming, type FixtureStatus } from "@/lib/fixture-status";
import { factualFixtureIdentity } from "@/lib/competition-rounds";

type SnapshotGame = {
  id?: string;
  round: number;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  kickoffUtc?: string;
  status?: string;
  dataSource?: string;
};

type SnapshotRound = {
  round: number;
  games: SnapshotGame[];
};

type FixtureSnapshot = {
  generatedAt: string;
  leagues: Partial<Record<LeagueSlug, SnapshotRound[]>>;
  predictionIds: Record<string, string>;
};

const snapshot = fixtureSnapshot as FixtureSnapshot;
export const UPCOMING_FIXTURE_WINDOW_DAYS = 14;
export const UPCOMING_FIXTURE_STALE_AFTER_HOURS = 48;

export type EditorialQueueUrgency = "URGENT" | "HIGH" | "NORMAL" | "EARLY";

export type EditorialQueueItem = {
  slug: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  round?: string | number;
  date: string;
  kickoff: string;
  daysUntilKickoff: number;
  urgency: EditorialQueueUrgency;
  editorialStatus: "ready_for_analysis";
};

function toDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function formatRound(round: number) {
  return `Matchday ${round}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function publishedMatchKeys() {
  return new Set(matches.map((match) => `${match.league}:${match.slug}`));
}

export function matchFixtureIdentityKey(fixture: {
  league: LeagueSlug;
  date: string;
  homeTeam: string;
  awayTeam: string;
  id?: string;
  fixtureId?: string;
  externalFixtureId?: string;
}) {
  return factualFixtureIdentity(fixture.league, {
    id: fixture.id ?? fixture.fixtureId ?? fixture.externalFixtureId,
    date: fixture.date,
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
  });
}

function publishedFixtureMatch(league: LeagueSlug, game: SnapshotGame, slug: string, publishedKeys: Set<string>) {
  if (publishedKeys.has(`${league}:${slug}`)) return true;
  return matches.some((match) =>
    match.league === league &&
    match.date === game.date &&
    teamNamesMatch(match.homeTeam, game.homeTeam) &&
    teamNamesMatch(match.awayTeam, game.awayTeam)
  );
}

function hasRealKickoff(game: SnapshotGame) {
  return Boolean(game.date && /^\d{4}-\d{2}-\d{2}$/.test(game.date) && game.time && game.time !== "TBD");
}

function fixtureKickoff(game: SnapshotGame) {
  return toDate(game.kickoffUtc ?? `${game.date}T${game.time}:00Z`);
}

function fixtureIsQueueEligible(game: SnapshotGame) {
  return isPlayableUpcoming(game.status as FixtureStatus | undefined);
}

function toUtcMidnight(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function urgencyForDaysUntilKickoff(daysUntilKickoff: number): EditorialQueueUrgency {
  if (daysUntilKickoff <= 2) return "URGENT";
  if (daysUntilKickoff <= 4) return "HIGH";
  if (daysUntilKickoff <= 7) return "NORMAL";
  return "EARLY";
}

export function buildUpcomingFixtureDrafts(now: Date = new Date()): UpcomingFixtureDraft[] {
  const published = publishedMatchKeys();
  const windowStart = new Date(now);
  const windowEnd = new Date(now);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + UPCOMING_FIXTURE_WINDOW_DAYS);
  const drafts: UpcomingFixtureDraft[] = [];
  const seenIdentities = new Set<string>();

  for (const league of leaguesBySlug && Object.values(leaguesBySlug)) {
    const rounds = snapshot.leagues[league.slug] ?? [];
    for (const round of rounds) {
      for (const game of round.games) {
        if (!hasRealKickoff(game) || !fixtureIsQueueEligible(game)) continue;
        const kickoffDate = fixtureKickoff(game);
        if (!kickoffDate || kickoffDate < windowStart || kickoffDate > windowEnd) continue;
        const slug = `${slugify(game.homeTeam)}-vs-${slugify(game.awayTeam)}`;
        if (publishedFixtureMatch(league.slug, game, slug, published)) continue;
        const identity = matchFixtureIdentityKey({ league: league.slug, ...game });
        if (seenIdentities.has(identity)) continue;
        seenIdentities.add(identity);
        const externalFixtureId = game.id;
        const draftMatch = {
          id: `${league.slug}-${slug}`,
          slug,
          league: league.slug,
          round: formatRound(round.round),
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          date: game.date,
          time: game.time,
          status: "coming-soon",
          title: `${game.homeTeam} vs ${game.awayTeam} Prediction`,
          analysis: [],
          predictions: [],
        } as Match;
        const searchIntent = buildMatchSearchIntent(draftMatch);
        drafts.push({
          slug,
          fixtureId: externalFixtureId,
          league: league.slug,
          round: formatRound(round.round),
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          date: game.date,
          time: game.time,
          venue: undefined,
          status: "fixture-prepared",
          editorialStatus: "ready_for_analysis",
          published: false,
          matchDate: game.date,
          kickoff: game.time,
          kickoffUtc: game.kickoffUtc,
          fixtureLastUpdated: snapshot.generatedAt,
          source: game.dataSource ?? league.sources.fixtures,
          externalFixtureId,
          searchIntent: searchIntent.competitionQueries.length
            ? searchIntent
            : undefined,
        });
      }
    }
  }

  return drafts.sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`) ||
    a.league.localeCompare(b.league) ||
    a.round.localeCompare(b.round) ||
    a.slug.localeCompare(b.slug)
  );
}

export function buildUpcomingFixtureCoverage(now: Date = new Date()) {
  const drafts = buildUpcomingFixtureDrafts(now);
  const published = publishedMatchKeys();
  const draftByIdentity = new Set(drafts.map(matchFixtureIdentityKey));
  const preparedByLeague = new Map<LeagueSlug, number>();
  for (const draft of drafts) {
    preparedByLeague.set(draft.league, (preparedByLeague.get(draft.league) ?? 0) + 1);
  }
  const windowEnd = new Date(now);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + UPCOMING_FIXTURE_WINDOW_DAYS);
  const byLeague = new Map<LeagueSlug, { fixtures: number; published: number; drafts: number; uncovered: number; rounds: Set<number> }>();

  for (const league of Object.values(leaguesBySlug)) {
    const coverage = { fixtures: 0, published: 0, drafts: 0, uncovered: 0, rounds: new Set<number>() };
    for (const round of snapshot.leagues[league.slug] ?? []) {
      for (const game of round.games) {
        if (!hasRealKickoff(game) || !fixtureIsQueueEligible(game)) continue;
        const kickoff = fixtureKickoff(game);
        if (!kickoff || kickoff < now || kickoff > windowEnd) continue;
        coverage.fixtures += 1;
        coverage.rounds.add(round.round);
        const slug = `${slugify(game.homeTeam)}-vs-${slugify(game.awayTeam)}`;
        if (publishedFixtureMatch(league.slug, game, slug, published)) coverage.published += 1;
        else if (draftByIdentity.has(matchFixtureIdentityKey({ league: league.slug, ...game }))) coverage.drafts += 1;
        else coverage.uncovered += 1;
      }
    }
    byLeague.set(league.slug, coverage);
  }

  const snapshotAgeHours = Math.max(0, (now.valueOf() - Date.parse(snapshot.generatedAt)) / 3_600_000);
  return {
    drafts,
    preparedByLeague,
    byLeague,
    windowStart: now.toISOString(),
    windowEnd: windowEnd.toISOString(),
    snapshotGeneratedAt: snapshot.generatedAt,
    snapshotAgeHours,
    sourceStale: snapshotAgeHours > UPCOMING_FIXTURE_STALE_AFTER_HOURS,
  };
}

export function buildEditorialQueue(now: Date = new Date()): EditorialQueueItem[] {
  const drafts = buildUpcomingFixtureDrafts(now);
  const todayUtc = toUtcMidnight(now.toISOString().slice(0, 10)) ?? now;

  return drafts
    .filter((draft) => draft.published === false && draft.editorialStatus === "ready_for_analysis")
    .map((draft) => {
      const kickoffUtc = new Date(draft.kickoffUtc ?? `${draft.date}T${draft.kickoff}:00Z`);
      const daysUntilKickoff = Math.max(
        0,
        Math.ceil((kickoffUtc.valueOf() - todayUtc.valueOf()) / 86_400_000)
      );

      return {
        slug: draft.slug,
        homeTeam: draft.homeTeam,
        awayTeam: draft.awayTeam,
        league: leaguesBySlug[draft.league]?.name ?? draft.league,
        round: draft.round,
        date: draft.date,
        kickoff: draft.kickoff,
        daysUntilKickoff,
        urgency: urgencyForDaysUntilKickoff(daysUntilKickoff),
        editorialStatus: "ready_for_analysis" as const,
      };
    })
    .sort((left, right) => {
      const urgencyOrder: Record<EditorialQueueUrgency, number> = {
        URGENT: 0,
        HIGH: 1,
        NORMAL: 2,
        EARLY: 3,
      };

      return (
        urgencyOrder[left.urgency] - urgencyOrder[right.urgency] ||
        `${left.date}T${left.kickoff}`.localeCompare(`${right.date}T${right.kickoff}`) ||
        left.league.localeCompare(right.league) ||
        left.homeTeam.localeCompare(right.homeTeam) ||
        left.awayTeam.localeCompare(right.awayTeam)
      );
    });
}

export function matchFixtureDraftKey(draft: UpcomingFixtureDraft) {
  return `${draft.league}:${draft.slug}`;
}

export function hasDraftFixtureIdentity(draft: UpcomingFixtureDraft, homeTeam: string, awayTeam: string) {
  return teamNamesMatch(draft.homeTeam, homeTeam) && teamNamesMatch(draft.awayTeam, awayTeam);
}
