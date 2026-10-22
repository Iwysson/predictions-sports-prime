"use client";

import { useEffect, useState } from "react";
import { AccessBadge } from "@/components/AccessBadge";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { NflLeagueMark } from "@/components/NflLeagueMark";
import { NflTeamBadge } from "@/components/NflTeamBadge";
import { NhlBestMultiple } from "@/components/NhlToday";
import { PredictionsCompleteNotice } from "@/components/PredictionsCompleteNotice";
import { resolveNflWeek } from "@/data/nfl/weeks";
import { translate } from "@/i18n/dictionaries";
import { sortNflGames, type NflPublicGame } from "@/lib/nfl-slates";
import { getNhlTodayKey } from "@/lib/nhl-day";
import { formatOddsPair } from "@/lib/odds";

const L = {
  prediction: translate("en", "mainPrediction"),
  odds: translate("en", "odds"),
};

function formatKickoff(game: NflPublicGame) {
  const date = new Date(`${game.date}T12:00:00Z`);
  const dateLabel = Number.isNaN(date.getTime())
    ? game.date
    : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
  return `${dateLabel} · ${game.kickoff} ${game.timezone}`;
}

function GameCard({ g }: { g: NflPublicGame }) {
  const isFree = g.access === "free";
  const badgeItem = {
    predictionAccess: isFree ? ("free" as const) : ("vip" as const),
    analysisAccess: isFree ? ("free" as const) : ("vip" as const),
    bestAnalysis: g.access === "best",
  };
  return (
    <section className={`psp-game ${isFree ? "psp-game--free" : "psp-game--vip"}`} id={g.slug}>
      <div className="psp-game__head">
        <div className="psp-game__badges">
          <AccessBadge item={badgeItem} />
        </div>
        <p className="psp-game__meta">
          <NflLeagueMark compact />
          <span>· {formatKickoff(g)} · {g.stadium}, {g.city}, {g.state}</span>
        </p>
      </div>

      <div className="psp-game__teams">
        <NflTeamBadge team={g.awayTeam} />
        <h2>{`${g.awayTeam} vs ${g.homeTeam} Prediction, Odds and Picks`}</h2>
        <NflTeamBadge team={g.homeTeam} />
      </div>

      {isFree && g.pick !== undefined && g.odds !== undefined ? (
        <>
          <div className="psp-pick">
            <div>
              <div className="psp-pick__label">{L.prediction}</div>
              <div className="psp-pick__value">{g.pick}</div>
            </div>
            <div className="psp-pick__odds">
              <span className="psp-pick__label">{L.odds}</span>
              <strong>{formatOddsPair(g.odds)}</strong>
            </div>
          </div>
          <MatchFullContent
            analysis={g.analysis ?? []}
            sources={g.sources ?? []}
            comment={null}
            labels={{ prediction: L.prediction, odds: L.odds, analysis: "Game analysis", sources: translate("en", "matchSourcesHeading") }}
          />
        </>
      ) : (
        <>
          <p className="psp-game__teaser">{g.teaser}</p>
          <MatchGate slug={g.slug} showAnalysis showPrediction variant="game" />
        </>
      )}
    </section>
  );
}

// The NFL week body: the active published week, resolved the same way the NHL slate is (the
// latest week whose first kickoff day has started, on the America/New_York calendar). Adding a
// new week only means adding it to src/data/nfl/weeks.ts - nothing here changes.
export function NflWeekSlate({ initialKey }: { initialKey: string }) {
  const [todayKey, setTodayKey] = useState(initialKey);
  useEffect(() => {
    const refresh = () => setTodayKey(getNhlTodayKey());
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const week = resolveNflWeek(todayKey);
  if (!week) {
    // No active week is published yet (resolveNflWeek returns null until the next week is added to
    // src/data/nfl/weeks.ts): show the same closing notice as the other sports rather than nothing.
    // NFL has no live/finished-game tracking, so - unlike NHL - this cannot detect a week whose games
    // have all been played while it is still the active week; that case is out of scope for now.
    return (
      <header className="psp-hero">
        <span className="psp-hero__eyebrow">
          <NflLeagueMark compact />
          <span>· NFL</span>
        </span>
        <h2>NFL games and picks</h2>
        <PredictionsCompleteNotice />
      </header>
    );
  }
  const games = sortNflGames(week.games.filter((game) => game.date <= todayKey));
  const free = games.filter((g) => g.access === "free");
  const protectedGames = games.filter((g) => g.access !== "free");
  const analyses = (n: number) => (n === 1 ? "analysis" : "analyses");

  return (
    <>
      <header className="psp-hero">
        <span className="psp-hero__eyebrow">
          <NflLeagueMark compact />
          <span>· NFL Week {week.weekNumber}, {week.season}</span>
        </span>
        <h2>NFL Week {week.weekNumber} games and picks</h2>
        <p>
          {games.length} NFL games this week. {free.length} {analyses(free.length)} {free.length === 1 ? "is" : "are"}{" "}
          published in full for everyone. The remaining {protectedGames.length} {protectedGames.length === 1 ? "is" : "are"}{" "}
          exclusive to PRIME VIP members.
        </p>
        <div className="psp-chips">
          <span className="psp-chip">{games.length} games</span>
          <span className="psp-chip">
            <span className="psp-badge psp-badge--free">FREE TO VIEW</span> {free.length} {analyses(free.length)}
          </span>
          <span className="psp-chip">
            <span className="psp-badge psp-badge--vip">PRIME VIP</span> {protectedGames.length} {analyses(protectedGames.length)}
          </span>
        </div>
      </header>

      <section className="nhl-page-best-multiple" aria-labelledby="nfl-best-multiple-title">
        <NhlBestMultiple headingId="nfl-best-multiple-title" initialKey={todayKey} surface="nfl" />
      </section>

      {free.length ? (
        <section className="psp-game-group" aria-labelledby="nfl-free-analyses">
          <div className="psp-game-group__heading">
            <span className="psp-badge psp-badge--free">FREE</span>
            <h2 id="nfl-free-analyses">Free analyses</h2>
          </div>
          <div className="psp-games">
            {free.map((g) => <GameCard key={g.slug} g={g} />)}
          </div>
        </section>
      ) : null}

      {protectedGames.length ? (
        <section className="psp-game-group" aria-labelledby="nfl-vip-analyses">
          <div className="psp-game-group__heading">
            <span className="psp-badge psp-badge--vip">PRIME VIP</span>
            <h2 id="nfl-vip-analyses">PRIME VIP analyses</h2>
          </div>
          <div className="psp-games">
            {protectedGames.map((g) => <GameCard key={g.slug} g={g} />)}
          </div>
        </section>
      ) : null}

      <section className="psp-matchup-directory" aria-labelledby="nfl-matchups-title">
        <div className="psp-game-group__heading">
          <h2 id="nfl-matchups-title">NFL Week {week.weekNumber} Matchups</h2>
        </div>
        <nav className="psp-jump" aria-label="NFL games on this page">
          {games.map((g) => (
            <a key={g.slug} href={`#${g.slug}`}>
              {g.awayTeam} vs {g.homeTeam}
            </a>
          ))}
        </nav>
      </section>
    </>
  );
}
