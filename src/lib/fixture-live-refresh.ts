import { teamNamesMatch, type OpenFootballGame } from "@/lib/openfootball";
import { isCompletedFixture, isValidFinalScore } from "@/lib/fixture-status";

type Daily = Pick<OpenFootballGame, "homeTeam" | "awayTeam" | "date" | "status" | "homeScore" | "awayScore"> & { id?: string };

/**
 * Applies one provider daily-scoreboard observation to a stored fixture.
 * Pure and idempotent. Rules:
 * - a stored final score is immutable and is never rolled back;
 * - the same home/away orientation is required (reverse fixtures never match);
 * - only the adjacent calendar days are considered (UTC/local drift);
 * - a completed result is accepted only with a valid final score;
 * - scheduled provider rows never overwrite anything.
 * Returns true when the fixture changed.
 */
export function applyDailyFixtureUpdate(fixture: OpenFootballGame, daily: Daily[]) {
  const alreadyFinal = isCompletedFixture(fixture.status) && isValidFinalScore(fixture.homeScore, fixture.awayScore);
  const base = Date.parse(`${fixture.date}T12:00:00Z`);
  const candidates = daily.filter((game) =>
    teamNamesMatch(game.homeTeam, fixture.homeTeam) &&
    teamNamesMatch(game.awayTeam, fixture.awayTeam) &&
    Math.abs(Date.parse(`${game.date}T12:00:00Z`) - base) <= 86_400_000
  );
  if (candidates.length !== 1) return false;
  const [game] = candidates;
  let changed = false;
  // Retain the provider event id so result/market data can be captured later.
  const providerFixture = fixture as OpenFootballGame & { espnEventId?: string };
  if (game.id && providerFixture.espnEventId !== game.id) {
    providerFixture.espnEventId = game.id;
    changed = true;
  }
  if (alreadyFinal) return changed; // a stored final score is immutable; only the event id may be added
  if (isCompletedFixture(game.status)) {
    if (!isValidFinalScore(game.homeScore, game.awayScore)) return changed;
    fixture.status = "completed";
    fixture.homeScore = game.homeScore;
    fixture.awayScore = game.awayScore;
    return true;
  }
  if (game.status === "scheduled" || game.status === "rescheduled" || game.status === fixture.status) return changed;
  fixture.status = game.status;
  return true;
}
