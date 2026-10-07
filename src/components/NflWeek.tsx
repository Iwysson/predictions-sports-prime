import { AccessBadge } from "@/components/AccessBadge";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { NflLeagueMark } from "@/components/NflLeagueMark";
import { NflTeamBadge } from "@/components/NflTeamBadge";
import { NFL_WEEK5_2026 } from "@/data/nfl/week5-2026-public";
import { translate } from "@/i18n/dictionaries";
import { sortNflGames, type NflPublicGame } from "@/lib/nfl-slates";
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
        <h2>{`${g.awayTeam} vs ${g.homeTeam} Prediction, Odds and Betting Tips`}</h2>
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
            labels={{ prediction: L.prediction, odds: L.odds, analysis: translate("en", "matchAnalysisHeading"), sources: translate("en", "matchSourcesHeading") }}
          />
        </>
      ) : (
        <>
          <p className="psp-game__teaser">{g.teaser}</p>
          <MatchGate slug={g.slug} showAnalysis showPrediction />
        </>
      )}
    </section>
  );
}

// The NFL week body: a fixed set of games for the published week. A new week replaces the
// import from src/data/nfl/week*-public.ts the same way NHL slates are replaced.
export function NflWeekSlate() {
  const games = sortNflGames(NFL_WEEK5_2026);
  const free = games.filter((g) => g.access === "free");
  const protectedGames = games.filter((g) => g.access !== "free");
  const analyses = (n: number) => (n === 1 ? "analysis" : "analyses");

  return (
    <>
      <header className="psp-hero">
        <span className="psp-hero__eyebrow">
          <NflLeagueMark compact />
          <span>· NFL Week 5, 2026</span>
        </span>
        <h1>NFL Predictions Today</h1>
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
          <h2 id="nfl-matchups-title">NFL Week 5 Matchups</h2>
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
