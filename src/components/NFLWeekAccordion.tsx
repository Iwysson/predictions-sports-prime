"use client";

import { Fragment, useEffect, useState } from "react";
import type { NFLGame } from "@/types/nfl";
import type { SeoLocale } from "@/lib/seo-locales";
import { getNFLCopy } from "@/lib/nfl-i18n";

function MarkdownText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <Fragment key={index}>{part}</Fragment>
  );
}

export function NFLWeekAccordion({ games, locale }: { games: NFLGame[]; locale: SeoLocale }) {
  const copy = getNFLCopy(locale);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (games.some((game) => game.id === id)) {
      setOpenId(id);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    }
  }, [games]);

  function toggle(id: string) {
    const next = openId === id ? null : id;
    setOpenId(next);
    history.replaceState(null, "", next ? `#${next}` : window.location.pathname);
  }

  return <div className="nfl-game-list">
    {games.map((game) => {
      const open = openId === game.id;
      const panelId = `${game.id}-details`;
      const dateLabel = new Intl.DateTimeFormat(locale === "en" ? "en-US" : locale, { month: "short", day: "2-digit", timeZone: "UTC" }).format(new Date(`${game.date}T12:00:00Z`)).toUpperCase();
      return <article className={`nfl-game${open ? " nfl-game--open" : ""}`} id={game.id} key={game.id}>
        <h3 className="sr-only">{game.awayTeamShort} vs {game.homeTeamShort} {copy.prediction}</h3>
        <button className="nfl-game__toggle" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => toggle(game.id)}>
          <span className="nfl-game__time">{dateLabel} · {game.kickoff}{game.timezone ? ` ${game.timezone}` : ""}</span>
          <span className="nfl-game__matchup">
            <span className="nfl-team"><img src={game.awayLogo} alt={`${game.awayTeam} logo`} width="42" height="42" loading="lazy" /><span><strong>{game.awayTeam}</strong><small>{copy.awayAtHome}</small></span></span>
            <span className="nfl-at" aria-hidden="true">@</span>
            <span className="nfl-team nfl-team--home"><img src={game.homeLogo} alt={`${game.homeTeam} logo`} width="42" height="42" loading="lazy" /><strong>{game.homeTeam}</strong></span>
          </span>
          <span className="nfl-game__status"><span>{copy.available}</span><span className="nfl-chevron" aria-hidden="true">⌄</span></span>
        </button>
        <div className="nfl-game__panel" id={panelId} hidden={!open}>
          <section className="nfl-detail nfl-detail--prediction">
            <h4>{copy.prediction}</h4>
            {game.predictions.map((prediction) => <div className="nfl-pick" key={prediction.selection}>
              <strong>{prediction.selection}</strong>
              <dl><div><dt>{copy.odds}</dt><dd>{prediction.odds.toFixed(2)}</dd></div><div><dt>{copy.americanOdds}</dt><dd>{prediction.americanOdds > 0 ? "+" : ""}{prediction.americanOdds}</dd></div></dl>
              {prediction.condition ? <p>{prediction.condition}</p> : null}
            </div>)}
          </section>
          <section className="nfl-detail"><h4>{copy.analysis}</h4>{game.analysis.map((paragraph, index) => <p key={index}><MarkdownText text={paragraph} /></p>)}</section>
          <section className="nfl-detail"><h4>{copy.venueKickoff}</h4><dl className="nfl-venue"><div><dt>{copy.venue}</dt><dd>{game.stadium ?? "TBA"}{game.city ? ` — ${game.city}${game.state ? `, ${game.state}` : ""}` : ""}</dd></div><div><dt>{copy.kickoff}</dt><dd>{game.kickoff}{game.timezone ? ` ${game.timezone}` : ""}</dd></div></dl></section>
        </div>
      </article>;
    })}
  </div>;
}
