import { normalizeTeamKey, teamNamesMatch, type OpenFootballGame, type OpenFootballRound } from "@/lib/openfootball";

type PredictionIdentity = {
  homeTeam: string;
  awayTeam: string;
  date: string;
  round?: string | number;
  league?: string;
  slug?: string;
};

export type DocumentedFixtureReconciliation = {
  fixtureId: string;
  originalHomeTeam: string;
  originalAwayTeam: string;
  providerHomeTeam: string;
  providerAwayTeam: string;
  date: string;
  round: number;
  sourceUrl: string;
  reason: string;
};

/**
 * Exceptional fixture-identity changes must be documented explicitly.
 *
 * The PSG-Rennes Matchday 1 preview was published while PSG were the listed
 * home side. PSG later announced that, because the Parc des Princes pitch was
 * unplayable, the same fixture would keep its original date/time but be played
 * at Roazhon Park in Rennes. This is not a generic reverse-leg allowance: the
 * provider event, teams, date and round all have to match this record exactly.
 */
export const DOCUMENTED_FIXTURE_RECONCILIATIONS: Readonly<Record<string, DocumentedFixtureReconciliation>> = {
  "ligue-1:paris-saint-germain-vs-rennes": {
    fixtureId: "401876487",
    originalHomeTeam: "Paris Saint-Germain",
    originalAwayTeam: "Rennes",
    providerHomeTeam: "Rennes",
    providerAwayTeam: "Paris Saint-Germain",
    date: "2026-08-23",
    round: 1,
    sourceUrl: "https://www.psg.fr/en/content/pr-paris-saint-germain-stade-rennais-match-on-august-23",
    reason: "Official venue/home-away relocation after publication; original date and kickoff retained.",
  },
};

function reconciliationFor(prediction: PredictionIdentity) {
  if (!prediction.league || !prediction.slug) return undefined;
  return DOCUMENTED_FIXTURE_RECONCILIATIONS[`${prediction.league}:${prediction.slug}`];
}

export function getDocumentedFixtureReconciliation(prediction: PredictionIdentity) {
  return reconciliationFor(prediction);
}

export function fixtureIdentityMatchesPrediction(prediction: PredictionIdentity, fixture: OpenFootballGame | undefined | null) {
  if (!fixture) return false;
  if (teamNamesMatch(fixture.homeTeam, prediction.homeTeam) && teamNamesMatch(fixture.awayTeam, prediction.awayTeam)) {
    return true;
  }
  const reconciliation = reconciliationFor(prediction);
  if (!reconciliation) return false;
  return (
    fixture.id === reconciliation.fixtureId &&
    fixture.date === reconciliation.date &&
    fixture.round === reconciliation.round &&
    teamNamesMatch(prediction.homeTeam, reconciliation.originalHomeTeam) &&
    teamNamesMatch(prediction.awayTeam, reconciliation.originalAwayTeam) &&
    teamNamesMatch(fixture.homeTeam, reconciliation.providerHomeTeam) &&
    teamNamesMatch(fixture.awayTeam, reconciliation.providerAwayTeam)
  );
}

export function findPredictionFixture(rounds: OpenFootballRound[], prediction: PredictionIdentity) {
  const reconciliation = reconciliationFor(prediction);
  if (reconciliation) {
    const documented = rounds.flatMap((round) => round.games).find((game) => game.id === reconciliation.fixtureId);
    if (documented) {
      if (!fixtureIdentityMatchesPrediction(prediction, documented)) {
        throw new Error(`Documented fixture reconciliation drift: ${prediction.homeTeam} vs ${prediction.awayTeam}`);
      }
      return documented;
    }
  }

  let candidates = rounds.flatMap((round) => round.games).filter((game) =>
    teamNamesMatch(game.homeTeam, prediction.homeTeam) && teamNamesMatch(game.awayTeam, prediction.awayTeam)
  );
  const suppliedRound = typeof prediction.round === "number" ? prediction.round : Number(prediction.round?.match(/(?:Matchday|Matchweek|Round|Week)\s+(\d+)/i)?.[1]);
  if (Number.isInteger(suppliedRound) && suppliedRound > 0) candidates = candidates.filter((game) => game.round === suppliedRound);
  const exactDate = candidates.filter((game) => game.date === prediction.date);
  if (exactDate.length) candidates = exactDate;
  // A unique same-season, same-round pairing can represent a reschedule.
  // Multiple pairings must never be resolved merely by nearest date, including
  // when the editorial date is absent and Date.parse would produce NaN.
  if (candidates.length > 1) {
    throw new Error(`Ambiguous fixture: ${prediction.homeTeam} vs ${prediction.awayTeam} on ${prediction.date}`);
  }
  return candidates[0];
}

/** Regroup by supplied round metadata; discard only identical normalized records. */
export function normalizeFixtureRounds(rounds: OpenFootballRound[]) {
  const grouped = new Map<number, OpenFootballGame[]>();
  const identities = new Map<string, string>();
  for (const round of rounds) {
    for (const game of round.games) {
      const home = normalizeTeamKey(game.homeTeam);
      const away = normalizeTeamKey(game.awayTeam);
      const key = game.id ? `id:${game.id}` : `${game.date}:${home}:${away}`;
      const signature = JSON.stringify({ ...game, homeTeam: home, awayTeam: away });
      const previous = identities.get(key);
      if (previous && previous !== signature) throw new Error(`Conflicting provider fixture ${key}`);
      if (previous) continue;
      identities.set(key, signature);
      if (!Number.isInteger(game.round) || game.round <= 0) throw new Error(`Invalid supplied round for ${key}`);
      const games = grouped.get(game.round) ?? [];
      games.push(game);
      grouped.set(game.round, games);
    }
  }
  return [...grouped].sort(([left], [right]) => left - right).map(([round, games]) => ({ round, games }));
}

export function isCompleteFixture(fixture: OpenFootballGame | undefined | null): fixture is OpenFootballGame & { id: string; kickoffUtc: string } {
  return Boolean(fixture?.id && fixture.kickoffUtc && Number.isFinite(Date.parse(fixture.kickoffUtc)));
}
