"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "@/components/DocumentLink";
import { AccessBadge } from "@/components/AccessBadge";
import { TeamBadge } from "@/components/TeamBadge";
import { VipTitleCta } from "@/components/VipTitleCta";
import { resolveNbaSlate } from "@/data/nba/slates";
import { translate } from "@/i18n/dictionaries";
import { formatNbaDayLabel, getNbaDayStart, getNbaTodayKey } from "@/lib/nba-day";
import { sortNbaMatches, type NbaPublicMatch, type NbaPublicSlate } from "@/lib/nba-slates";
import { formatOddsPair } from "@/lib/odds";

// A deferred slate (src/data/nba/slates.ts `deferred: true`) ships no listing in this bundle: its
// matches are fetched from /api/nba/slate/[day], which answers only after the slate's publication
// gate has opened on the server clock. Until then (loading, refused because the clocks disagree,
// offline) this returns null and the caller keeps showing the previous slate (there is none yet for
// the first NBA day, so the page renders nothing until the gate opens - the same behaviour NHL has
// on a day with no earlier slate). A refused or failed request is retried every 20 seconds.
export function useDeferredNbaMatches(slate: NbaPublicSlate | null): NbaPublicMatch[] | null {
  const dayKey = slate?.deferred ? slate.dayKey : null;
  const [fetched, setFetched] = useState<{ dayKey: string; matches: NbaPublicMatch[] } | null>(null);
  useEffect(() => {
    if (!dayKey) return;
    let cancelled = false;
    let timer: number | undefined;
    const load = async () => {
      try {
        const res = await fetch(`/api/nba/slate/${encodeURIComponent(dayKey)}`, { cache: "no-store" });
        const body = res.ok ? await res.json() : null;
        if (!cancelled && body?.dayKey === dayKey && Array.isArray(body?.matches) && body.matches.length) {
          setFetched({ dayKey, matches: body.matches as NbaPublicMatch[] });
          return;
        }
      } catch {
        // fall through to the retry below
      }
      if (!cancelled) timer = window.setTimeout(load, 20_000);
    };
    load();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [dayKey]);
  return dayKey && fetched?.dayKey === dayKey ? fetched.matches : null;
}

// The NBA day is decided only by lib/nba-day (America/Sao_Paulo). The key is re-checked every
// minute, so the slate switches at 00:00 BRT without a rebuild, a purge or a reload. The first
// render uses the key from the build, so the static HTML and the first client render match.
export function useNbaTodayKey(initialKey: string) {
  const [dayKey, setDayKey] = useState(initialKey);
  useEffect(() => {
    let timer: number;
    const tick = () => {
      const current = getNbaTodayKey();
      setDayKey(current);
      const nextKey = new Date(`${current}T12:00:00Z`);
      nextKey.setUTCDate(nextKey.getUTCDate() + 1);
      const boundary = getNbaDayStart(nextKey.toISOString().slice(0, 10));
      timer = window.setTimeout(tick, Math.max(50, Math.min(60_000, (boundary?.getTime() ?? Date.now() + 60_000) - Date.now())));
    };
    const onVisible = () => { if (!document.hidden) { window.clearTimeout(timer); tick(); } };
    tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => { window.clearTimeout(timer); document.removeEventListener("visibilitychange", onVisible); };
  }, []);
  return dayKey;
}

const L = {
  prediction: translate("en", "mainPrediction"),
  odds: translate("en", "odds"),
};

function GameCard({ m, dayLabel }: { m: NbaPublicMatch; dayLabel: string | null }) {
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
        </div>
        <p className="psp-game__meta">
          <span>NBA</span>
          <span>{dayLabel ? ` · ${dayLabel}` : ""}{m.time ? ` · ${m.time}` : ""}</span>
          {m.venue ? <span> · {m.venue}</span> : null}
        </p>
      </div>

      <div className="psp-game__teams">
        <TeamBadge team={m.homeTeam} />
        <h2>
          <Link href={`/nba/${m.slug}/`}>{`${m.homeTeam} vs ${m.awayTeam} Prediction and Picks`}</Link>
        </h2>
        <TeamBadge team={m.awayTeam} />
      </div>

      <p className="psp-game__teaser">{m.teaser}</p>

      {m.pick !== undefined && m.odds !== undefined ? (
        <div className="psp-pick">
          <div>
            <div className="psp-pick__label">{L.prediction}</div>
            <div className="psp-pick__value">{m.pick}</div>
          </div>
          <div className="psp-pick__odds">
            <span className="psp-pick__label">{L.odds}</span>
            <strong>{formatOddsPair(m.odds)}</strong>
          </div>
        </div>
      ) : null}

      <Link className="button auth-primary-action" href={`/nba/${m.slug}/`}>
        Read full analysis
      </Link>
    </section>
  );
}

// The whole NBA page body for the active day. The H1 and every card follow the same key.
export function NbaDaySlate({ initialKey, afterHero }: { initialKey: string; afterHero?: ReactNode }) {
  const dayKey = useNbaTodayKey(initialKey);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const resolved = resolveNbaSlate(dayKey);
  const deferredMatches = useDeferredNbaMatches(resolved);
  // A deferred slate is shown only once its listing has been served; until then the previous slate
  // stays (there is none for the first NBA day, matching NHL's own first-day behaviour).
  const slate: NbaPublicSlate | null = resolved?.deferred
    ? deferredMatches
      ? { ...resolved, matches: deferredMatches }
      : resolveNbaSlate(dayKey, new Date(), { skipDeferred: true })
    : resolved;
  if (!slate) return null;

  // The static HTML carries no current-day text: the date is rendered only after mount, so crawlers
  // and search snippets never see a build-day date. It still follows America/Sao_Paulo at runtime.
  const dayLabel = mounted ? formatNbaDayLabel(slate.dayKey) : null;
  const matches = sortNbaMatches(slate.matches);
  const free = matches.filter((m) => m.access === "free");
  const protectedGames = matches.filter((m) => m.access !== "free");
  const analyses = (n: number) => (n === 1 ? "analysis" : "analyses");

  return (
    <>
      <header className="psp-hero">
        <span className="psp-hero__eyebrow">
          <span>NBA</span>
        </span>
        <VipTitleCta>NBA Predictions Today</VipTitleCta>
        <p className="psp-hero__date" style={{ minHeight: "1.5em", fontWeight: 600 }}>{dayLabel}</p>
        <p>
          {matches.length} NBA games today. {free.length} {analyses(free.length)} {free.length === 1 ? "is" : "are"}{" "}
          published in full for everyone.
          {protectedGames.length ? ` The remaining ${protectedGames.length} ${protectedGames.length === 1 ? "is" : "are"} exclusive to PRIME VIP members.` : ""}
        </p>
        <div className="psp-chips">
          <span className="psp-chip">{matches.length} games</span>
          <span className="psp-chip">
            <span className="psp-badge psp-badge--free">FREE TO VIEW</span> {free.length} {analyses(free.length)}
          </span>
          {protectedGames.length ? (
            <span className="psp-chip">
              <span className="psp-badge psp-badge--vip">PRIME VIP</span> {protectedGames.length} {analyses(protectedGames.length)}
            </span>
          ) : null}
        </div>
      </header>

      {afterHero}

      {free.length ? (
        <section className="psp-game-group" aria-labelledby="nba-free-analyses">
          <div className="psp-game-group__heading">
            <span className="psp-badge psp-badge--free">FREE</span>
            <h2 id="nba-free-analyses">Free analyses</h2>
          </div>
          <div className="psp-games">
            {free.map((m) => <GameCard key={m.slug} m={m} dayLabel={dayLabel} />)}
          </div>
        </section>
      ) : null}

      {protectedGames.length ? (
        <section className="psp-game-group" aria-labelledby="nba-vip-analyses">
          <div className="psp-game-group__heading">
            <span className="psp-badge psp-badge--vip">PRIME VIP</span>
            <h2 id="nba-vip-analyses">PRIME VIP analyses</h2>
          </div>
          <div className="psp-games">
            {protectedGames.map((m) => <GameCard key={m.slug} m={m} dayLabel={dayLabel} />)}
          </div>
        </section>
      ) : null}

      <section className="psp-matchup-directory" aria-labelledby="nba-matchups-title">
        <div className="psp-game-group__heading">
          <h2 id="nba-matchups-title">{dayLabel ? `All NBA Matchups – ${dayLabel}` : "All NBA Matchups"}</h2>
        </div>
        <nav className="psp-jump" aria-label="NBA games on this page">
          {matches.map((m) => (
            <Link key={m.slug} href={`/nba/${m.slug}/`}>
              {m.awayTeam} vs {m.homeTeam}
            </Link>
          ))}
        </nav>
      </section>
    </>
  );
}
