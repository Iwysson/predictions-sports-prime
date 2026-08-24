import fixtureSnapshot from "@/data/fixtures.snapshot.json";
import { matches } from "@/data/matches";
import type { LeagueSlug, Match, UpcomingFixtureDraft } from "@/types";
import { leaguesBySlug } from "@/data/leagues";
import { teamNamesMatch } from "@/lib/openfootball";
import { buildMatchSearchIntent } from "@/lib/match-search-intent";

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
const FUTURE_WINDOW_DAYS = 14;

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

function hasRealKickoff(game: SnapshotGame) {
  return Boolean(game.date && /^\d{4}-\d{2}-\d{2}$/.test(game.date) && game.time && game.time !== "TBD");
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
  windowEnd.setUTCDate(windowEnd.getUTCDate() + FUTURE_WINDOW_DAYS);
  const drafts: UpcomingFixtureDraft[] = [];

  for (const league of leaguesBySlug && Object.values(leaguesBySlug)) {
    const rounds = snapshot.leagues[league.slug] ?? [];
    for (const round of rounds) {
      for (const game of round.games) {
        if (!hasRealKickoff(game)) continue;
        const kickoffDate = toDate(`${game.date}T${game.time}:00Z`);
        if (!kickoffDate || kickoffDate < windowStart || kickoffDate > windowEnd) continue;
        const slug = `${slugify(game.homeTeam)}-vs-${slugify(game.awayTeam)}`;
        if (published.has(`${league.slug}:${slug}`)) continue;
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
  const preparedByLeague = new Map<LeagueSlug, number>();
  for (const draft of drafts) {
    preparedByLeague.set(draft.league, (preparedByLeague.get(draft.league) ?? 0) + 1);
  }
  return { drafts, preparedByLeague };
}

export function buildEditorialQueue(now: Date = new Date()): EditorialQueueItem[] {
  const drafts = buildUpcomingFixtureDrafts(now);
  const todayUtc = toUtcMidnight(now.toISOString().slice(0, 10)) ?? now;

  return drafts
    .filter((draft) => draft.published === false && draft.editorialStatus === "ready_for_analysis")
    .map((draft) => {
      const kickoffUtc = new Date(`${draft.date}T${draft.kickoff}:00Z`);
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
