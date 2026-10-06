"use client";

import { useEffect, useState } from "react";
import { AccessBadge } from "@/components/AccessBadge";
import { MatchFullContent } from "@/components/MatchFullContent";
import { MatchGate } from "@/components/MatchGate";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { NhlLeagueMark } from "@/components/NhlBestMultiple";
import { TeamBadge } from "@/components/TeamBadge";
import { resolveNhlSlate } from "@/data/nhl/slates";
import { translate } from "@/i18n/dictionaries";
import { formatNhlDayLabel, getNhlTodayKey } from "@/lib/nhl-day";
import { findLiveGame, liveBadgeText, type LiveGame } from "@/lib/nhl-live";
import { sortNhlMatches, type NhlPublicMatch, type NhlPublicMultiple } from "@/lib/nhl-slates";

// Live games for the given NHL day, from the runtime endpoint only. Polls every 60s, or every 30s
// while a game is live; skips polling while the tab is hidden. Any failure clears the list, so a
// stale LIVE is never kept on screen.
export function useNhlLiveGames(dayKey: string): LiveGame[] {
  const [games, setGames] = useState<LiveGame[]>([]);
  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;
    const load = async () => {
      let nextMs = 60_000;
      if (!document.hidden) {
        try {
          const res = await fetch("/api/nhl/status", { cache: "no-store" });
          const body = res.ok ? await res.json() : null;
          const valid = body?.state === "ok" && body?.date === dayKey && Array.isArray(body?.games);
          if (!cancelled) setGames(valid ? (body.games as LiveGame[]) : []);
          if (valid && body.games.some((g: LiveGame) => g.state === "live")) nextMs = 30_000;
        } catch {
          if (!cancelled) setGames([]);
        }
      }
      if (!cancelled) timer = window.setTimeout(load, nextMs);
    };
    const onVisible = () => {
      if (!document.hidden) {
        window.clearTimeout(timer);
        load();
      }
    };
    load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [dayKey]);
  return games;
}

// The NHL day is decided only by lib/nhl-day (America/New_York). The key is re-checked every
// minute, so the slate switches at 00:00 ET without a rebuild, a purge or a reload. The first
// render uses the key from the build, so the static HTML and the first client render match.
export function useNhlTodayKey(initialKey: string) {
  const [dayKey, setDayKey] = useState(initialKey);
  useEffect(() => {
    const tick = () => setDayKey(getNhlTodayKey());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return dayKey;
}

const L = {
  prediction: translate("en", "mainPrediction"),
  odds: translate("en", "odds"),
};

// The day's multiple, in the same slot and with the same classes as before. Only its content changes.
export function NhlBestMultiple({ headingId = "nhl-best-multiple-title", initialKey }: { headingId?: string; initialKey: string }) {
  const dayKey = useNhlTodayKey(initialKey);
  const multiple = resolveNhlSlate(dayKey)?.multiple;
  if (!multiple) return null;
  return (
    <article className="home-best-multiple">
      <div className="home-best-multiple__head">
        <div>
          <NhlLeagueMark />
          <h2 id={headingId}>{multiple.title}</h2>
        </div>
        <span className="psp-badge psp-badge--free">{multiple.badge}</span>
      </div>
      <div className="home-best-multiple__legs">
        {multiple.legs.map((leg, index) => (
          <MultipleLeg key={leg.fixture} first={index === 0} leg={leg} />
        ))}
      </div>
      <p>
        {multiple.combinedOdds !== null ? `Combined odds: ${multiple.combinedOdds.toFixed(2)}. ` : ""}
        {multiple.comment}
      </p>
    </article>
  );
}

function MultipleLeg({ first, leg }: { first: boolean; leg: NhlPublicMultiple["legs"][number] }) {
  return (
    <>
      {first ? null : <b aria-hidden="true">+</b>}
      <div>
        <span className="home-best-multiple__fixture">
          {leg.teams ? <TeamBadge team={leg.teams[0]} size="sm" /> : null}
          <span>{leg.fixture}</span>
          {leg.teams ? <TeamBadge team={leg.teams[1]} size="sm" /> : null}
        </span>
        <strong>
          {leg.pick}
          {leg.odds !== null ? ` @${leg.odds.toFixed(2)}` : ""}
        </strong>
      </div>
    </>
  );
}

function GameCard({ m, dayLabel, liveGames }: { m: NhlPublicMatch; dayLabel: string; liveGames: LiveGame[] }) {
  const isFree = m.access === "free";
  const badgeItem = {
    predictionAccess: isFree ? ("free" as const) : ("vip" as const),
    analysisAccess: isFree ? ("free" as const) : ("vip" as const),
    bestAnalysis: m.access === "best",
  };
  return (
    <section className={`psp-game ${isFree ? "psp-game--free" : "psp-game--vip"}`} id={m.slug}>
      <div className="psp-game__head">
        <div className="psp-game__badges">
          <AccessBadge item={badgeItem} />
          <MatchStatusBadge text={liveBadgeText(findLiveGame(liveGames, m.homeTeam, m.awayTeam))} />
        </div>
        <p className="psp-game__meta">
          <NhlLeagueMark compact />
          <span>· {dayLabel} · Kick-off time not listed</span>
        </p>
      </div>

      <div className="psp-game__teams">
        <TeamBadge team={m.homeTeam} />
        <h2>{`${m.homeTeam} vs ${m.awayTeam} Prediction`}</h2>
        <TeamBadge team={m.awayTeam} />
      </div>

      {isFree && m.pick !== undefined && m.odds !== undefined ? (
        <>
          <div className="psp-pick">
            <div>
              <div className="psp-pick__label">{L.prediction}</div>
              <div className="psp-pick__value">{m.pick}</div>
            </div>
            <div className="psp-pick__odds">
              <span className="psp-pick__label">{L.odds}</span>
              <strong>{m.odds.toFixed(2)}</strong>
            </div>
          </div>
          <MatchFullContent
            analysis={m.analysis ?? []}
            sources={m.sources ?? []}
            comment={null}
            labels={{ prediction: L.prediction, odds: L.odds, analysis: translate("en", "matchAnalysisHeading"), sources: translate("en", "matchSourcesHeading") }}
          />
        </>
      ) : (
        <>
          <p className="psp-game__teaser">{m.teaser}</p>
          <MatchGate slug={m.slug} showAnalysis showPrediction />
        </>
      )}
    </section>
  );
}

// The whole NHL page body for the active day. The H1 and every card follow the same key.
export function NhlDaySlate({ initialKey }: { initialKey: string }) {
  const dayKey = useNhlTodayKey(initialKey);
  const liveGames = useNhlLiveGames(dayKey);
  const slate = resolveNhlSlate(dayKey);
  if (!slate) return null;

  const dayLabel = formatNhlDayLabel(slate.dayKey);
  const matches = sortNhlMatches(slate.matches);
  const free = matches.filter((m) => m.access === "free");
  const protectedGames = matches.filter((m) => m.access !== "free");
  const analyses = (n: number) => (n === 1 ? "analysis" : "analyses");

  return (
    <>
      <header className="psp-hero">
        <span className="psp-hero__eyebrow psp-hero__eyebrow--nhl">
          <NhlLeagueMark compact />
          <span>· {dayLabel}</span>
        </span>
        <h1>{`NHL Predictions Today – ${dayLabel}`}</h1>
        <p>
          {matches.length} NHL games on {dayLabel}. {free.length} {analyses(free.length)} {free.length === 1 ? "is" : "are"}{" "}
          published in full for everyone. The remaining {protectedGames.length} {protectedGames.length === 1 ? "is" : "are"}{" "}
          exclusive to PRIME VIP members.
        </p>
        <div className="psp-chips">
          <span className="psp-chip">{matches.length} games</span>
          <span className="psp-chip">
            <span className="psp-badge psp-badge--free">FREE TO VIEW</span> {free.length} {analyses(free.length)}
          </span>
          <span className="psp-chip">
            <span className="psp-badge psp-badge--vip">PRIME VIP</span> {protectedGames.length} {analyses(protectedGames.length)}
          </span>
        </div>
      </header>

      <section className="nhl-page-best-multiple" aria-labelledby="nhl-page-best-multiple-title">
        <NhlBestMultiple headingId="nhl-page-best-multiple-title" initialKey={initialKey} />
      </section>

      {free.length ? (
        <section className="psp-game-group" aria-labelledby="nhl-free-analyses">
          <div className="psp-game-group__heading">
            <span className="psp-badge psp-badge--free">FREE</span>
            <h2 id="nhl-free-analyses">Free analyses</h2>
          </div>
          <div className="psp-games">
            {free.map((m) => <GameCard key={m.slug} m={m} dayLabel={dayLabel} liveGames={liveGames} />)}
          </div>
        </section>
      ) : null}

      {protectedGames.length ? (
        <section className="psp-game-group" aria-labelledby="nhl-vip-analyses">
          <div className="psp-game-group__heading">
            <span className="psp-badge psp-badge--vip">PRIME VIP</span>
            <h2 id="nhl-vip-analyses">PRIME VIP analyses</h2>
          </div>
          <div className="psp-games">
            {protectedGames.map((m) => <GameCard key={m.slug} m={m} dayLabel={dayLabel} liveGames={liveGames} />)}
          </div>
        </section>
      ) : null}

      <section className="psp-matchup-directory" aria-labelledby="nhl-matchups-title">
        <div className="psp-game-group__heading">
          <h2 id="nhl-matchups-title">{`All NHL Matchups – ${dayLabel}`}</h2>
        </div>
        <nav className="psp-jump" aria-label="NHL games on this page">
          {matches.map((m) => (
            <a key={m.slug} href={`#${m.slug}`}>
              {m.homeTeam} vs {m.awayTeam}
            </a>
          ))}
        </nav>
      </section>
    </>
  );
}
