"use client";

import { useEffect, useMemo, useState } from "react";
import { MatchPreview, LeagueSlug } from "@/types";
import { MatchCard } from "@/components/MatchCard";
import {
  findCurrentOrNextRound,
  loadLeagueSeason,
  openLeagueConfigs,
  OpenFootballGame,
  teamNamesMatch,
} from "@/lib/openfootball";
import { useI18n } from "@/i18n/I18nProvider";
import {
  validateLeagueRounds,
  validateRoundForDisplay,
} from "@/lib/data-validation";

type SupportedSlug = Exclude<LeagueSlug, "other-leagues">;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function findManualPrediction(
  game: OpenFootballGame,
  manualMatches: MatchPreview[]
): MatchPreview | undefined {
  return manualMatches.find(
    (match) =>
      teamNamesMatch(match.homeTeam, game.homeTeam) &&
      teamNamesMatch(match.awayTeam, game.awayTeam)
  );
}

function toMatch(
  league: SupportedSlug,
  game: OpenFootballGame,
  manualMatches: MatchPreview[]
): MatchPreview {
  const manual = findManualPrediction(game, manualMatches);

  if (manual) {
    return {
      ...manual,
      league,
      round: `Matchday ${game.round}`,
      date: manual.date || game.date,
      time: game.time,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
    };
  }

  const slug = `${slugify(game.homeTeam)}-vs-${slugify(game.awayTeam)}`;

  return {
    id: `live-${league}-${game.round}-${slug}`,
    slug,
    league,
    round: `Matchday ${game.round}`,
    homeTeam: game.homeTeam,
    awayTeam: game.awayTeam,
    date: game.date,
    time: game.time,
    status: "coming-soon",
    title: `${game.homeTeam} vs ${game.awayTeam} Prediction`,
  };
}

export function LiveLeagueRound({
  league,
  manualMatches,
}: {
    league: SupportedSlug;
  manualMatches: MatchPreview[];
}) {
  const config = openLeagueConfigs[league];
  const { t } = useI18n();

  const [games, setGames] = useState<OpenFootballGame[]>([]);
  const [roundNumber, setRoundNumber] = useState<number | null>(null);
  const [state, setState] = useState<
    "loading" | "validated" | "fallback" | "invalid"
  >("loading");
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    loadLeagueSeason(league)
      .then((rounds) => {
        const seasonValidation = validateLeagueRounds(rounds, config);

        if (!seasonValidation.valid) {
          throw new Error(
            `${config.label}: ${seasonValidation.errors.join(" | ")}`
          );
        }

        const round = findCurrentOrNextRound(rounds);
        const roundValidation = validateRoundForDisplay(round, config);

        if (!roundValidation.valid || !round) {
          throw new Error(
            `${config.label}: ${roundValidation.errors.join(" | ")}`
          );
        }

        if (!cancelled) {
          setGames(round.games);
          setRoundNumber(round.round);
          setWarningCount(roundValidation.warnings.length);
          setState("validated");
        }
      })
      .catch((error) => {
        console.warn(`Using fixture fallback for ${config.label}:`, error);

        if (!cancelled) {
          setGames([]);
          setRoundNumber(null);

          if (manualMatches.length > 0) {
            setState("fallback");
          } else {
            setState("invalid");
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [config, league, manualMatches.length]);

  const renderedMatches = useMemo(() => {
    if (state === "validated") {
      return games.map((game) => toMatch(league, game, manualMatches));
    }

    if (state === "fallback") {
      return manualMatches.slice(0, config.expectedGamesPerRound);
    }

    return [];
  }, [config.expectedGamesPerRound, games, league, manualMatches, state]);

  return (
    <div className="live-round-block">
      <div className="round-source-line">
        <span>
          {roundNumber ? `Matchday ${roundNumber}` : "Current Round"}
        </span>

        <span className={`round-source-status round-source-status--${state}`}>
          <i />
          {state === "loading"
            ? t("validating")
            : state === "validated"
              ? warningCount > 0
                ? `Validated • ${warningCount} TBD`
                : t("validated")
              : state === "fallback"
                ? t("saved")
                : t("unavailable")}
        </span>
      </div>

      {renderedMatches.length > 0 ? (
        <div className="league-match-list">
          {renderedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : state === "loading" ? (
        <div className="data-validation-message">
          {t("checkingFixtures")}
        </div>
      ) : (
        <div className="data-validation-message data-validation-message--warning">
          {t("awaitingConfirmedData")}
        </div>
      )}
    </div>
  );
}
