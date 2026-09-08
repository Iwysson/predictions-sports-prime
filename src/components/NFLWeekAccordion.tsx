"use client";

import { Fragment, useEffect, useState } from "react";
import type { NFLGame } from "@/types/nfl";
import type { SeoLocale } from "@/lib/seo-locales";
import { getNFLCopy } from "@/lib/nfl-i18n";
import { localizePredictionText } from "@/lib/localized-presentation";

const localizedAnalysisNotice: Record<Exclude<SeoLocale, "en">, string> = {
  "pt-br": "A análise detalhada deste confronto ainda não está disponível em português. O palpite e as odds abaixo preservam o registro editorial publicado.",
  es: "El análisis detallado de este encuentro aún no está disponible en español. El pronóstico y las cuotas siguientes conservan el registro editorial publicado.",
  it: "L'analisi dettagliata di questo incontro non è ancora disponibile in italiano. Il pronostico e le quote seguenti conservano il dato editoriale pubblicato.",
  fr: "L'analyse détaillée de cette rencontre n'est pas encore disponible en français. Le pronostic et les cotes ci-dessous conservent le dossier éditorial publié.",
  de: "Die ausführliche Analyse dieser Partie ist noch nicht auf Deutsch verfügbar. Die folgende Prognose und die Quoten bewahren den veröffentlichten redaktionellen Datensatz.",
  nl: "De uitgebreide analyse van deze wedstrijd is nog niet in het Nederlands beschikbaar. De voorspelling en odds hieronder bewaren het gepubliceerde redactionele dossier.",
  tr: "Bu karşılaşmanın ayrıntılı analizi henüz Türkçe sunulmuyor. Aşağıdaki tahmin ve oranlar yayımlanan editoryal kaydı korur.",
};

const localizedConditionNotice: Record<Exclude<SeoLocale, "en">, string> = {
  "pt-br": "Seleção válida somente com a confirmação da disponibilidade do jogador.",
  es: "Selección válida solo si se confirma la disponibilidad del jugador.",
  it: "Selezione valida solo con la conferma della disponibilità del giocatore.",
  fr: "Sélection valable uniquement si la disponibilité du joueur est confirmée.",
  de: "Die Auswahl gilt nur bei bestätigter Verfügbarkeit des Spielers.",
  nl: "De selectie geldt alleen wanneer de beschikbaarheid van de speler is bevestigd.",
  tr: "Seçim yalnızca oyuncunun oynayabileceği doğrulanırsa geçerlidir.",
};

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
              <strong>{locale === "en" ? prediction.selection : localizePredictionText(prediction.selection, locale)}</strong>
              <dl><div><dt>{copy.odds}</dt><dd>{prediction.odds.toFixed(2)}</dd></div><div><dt>{copy.americanOdds}</dt><dd>{prediction.americanOdds > 0 ? "+" : ""}{prediction.americanOdds}</dd></div></dl>
              {prediction.condition ? <p>{locale === "en" ? prediction.condition : localizedConditionNotice[locale]}</p> : null}
            </div>)}
          </section>
          <section className="nfl-detail"><h4>{copy.analysis}</h4>{locale === "en"
            ? game.analysis.map((paragraph, index) => <p key={index}><MarkdownText text={paragraph} /></p>)
            : <p>{localizedAnalysisNotice[locale]}</p>}
          </section>
          <section className="nfl-detail"><h4>{copy.venueKickoff}</h4><dl className="nfl-venue"><div><dt>{copy.venue}</dt><dd>{game.stadium ?? "TBA"}{game.city ? ` — ${game.city}${game.state ? `, ${game.state}` : ""}` : ""}</dd></div><div><dt>{copy.kickoff}</dt><dd>{game.kickoff}{game.timezone ? ` ${game.timezone}` : ""}</dd></div></dl></section>
        </div>
      </article>;
    })}
  </div>;
}
