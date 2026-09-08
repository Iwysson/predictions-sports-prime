"use client";

import type { LeagueSlug } from "@/types";
import { localizeRoundText } from "@/lib/localized-presentation";
import { seoLocales, type SeoLocale } from "@/lib/seo-locales";

const localTimeCopy: Record<SeoLocale, { localTime: string; at: string }> = {
  en: { localTime: "League local time", at: "at" },
  "pt-br": { localTime: "Horário local da competição", at: "às" },
  es: { localTime: "Hora local de la competición", at: "a las" },
  it: { localTime: "Ora locale della competizione", at: "alle" },
  fr: { localTime: "Heure locale de la compétition", at: "à" },
  de: { localTime: "Ortszeit des Wettbewerbs", at: "um" },
  nl: { localTime: "Lokale tijd van de competitie", at: "om" },
  tr: { localTime: "Organizasyonun yerel saati", at: "saat" },
};

function formatLeagueLocalDateTime(date: string, time: string, locale: SeoLocale) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const copy = localTimeCopy[locale];

  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    return {
      display: `${date} · ${time}`,
      ariaLabel: `${date} ${copy.at} ${time}`,
      sublabel: copy.localTime,
    };
  }

  const intlLocale = locale === "en" ? "en" : seoLocales[locale].htmlLang;
  const displayDate = new Intl.DateTimeFormat(intlLocale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));

  const displayTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  return {
    display: `${displayDate} · ${displayTime}`,
    ariaLabel: `${displayDate} ${copy.at} ${displayTime}, ${copy.localTime}`,
    sublabel: copy.localTime,
  };
}

export function LiveMatchMeta({
  league: _league,
  homeTeam: _homeTeam,
  awayTeam: _awayTeam,
  fallbackRound,
  fallbackDate,
  fallbackTime,
  venue,
  locale = "en",
}: {
  league: LeagueSlug;
  homeTeam: string;
  awayTeam: string;
  fallbackRound: string;
  fallbackDate: string;
  fallbackTime: string;
  venue?: string;
  locale?: SeoLocale;
}) {
  const fallback = formatLeagueLocalDateTime(fallbackDate, fallbackTime, locale);
  const round = locale === "en" ? fallbackRound : localizeRoundText(fallbackRound, locale);

  return (
    <>
      <small>{round}</small>
      <div className="compact-match-meta">
        <span aria-label={fallback.ariaLabel}>{fallback.display}</span>
        <small>{fallback.sublabel}</small>
        {venue ? <span>{venue}</span> : null}
      </div>
    </>
  );
}
