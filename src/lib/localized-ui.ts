import type { SeoLocale } from "@/lib/seo-locales";

const fixtureStatusCopy: Record<SeoLocale, Record<string, string>> = {
  en: { live: "LIVE", postponed: "POSTPONED", canceled: "CANCELED", cancelled: "CANCELED", completed: "COMPLETED", scheduled: "SCHEDULED" },
  "pt-br": { live: "AO VIVO", postponed: "ADIADO", canceled: "CANCELADO", cancelled: "CANCELADO", completed: "ENCERRADO", scheduled: "AGENDADO" },
  es: { live: "EN DIRECTO", postponed: "APLAZADO", canceled: "CANCELADO", cancelled: "CANCELADO", completed: "FINALIZADO", scheduled: "PROGRAMADO" },
  fr: { live: "EN DIRECT", postponed: "REPORTÉ", canceled: "ANNULÉ", cancelled: "ANNULÉ", completed: "TERMINÉ", scheduled: "PROGRAMMÉ" },
  de: { live: "LIVE", postponed: "VERSCHOBEN", canceled: "ABGESAGT", cancelled: "ABGESAGT", completed: "BEENDET", scheduled: "ANGESETZT" },
  it: { live: "IN DIRETTA", postponed: "RINVIATA", canceled: "ANNULLATA", cancelled: "ANNULLATA", completed: "CONCLUSA", scheduled: "PROGRAMMATA" },
  nl: { live: "LIVE", postponed: "UITGESTELD", canceled: "GEANNULEERD", cancelled: "GEANNULEERD", completed: "AFGELOPEN", scheduled: "GEPLAND" },
  tr: { live: "CANLI", postponed: "ERTELENDİ", canceled: "İPTAL", cancelled: "İPTAL", completed: "TAMAMLANDI", scheduled: "PLANLANDI" },
};

const resultCopy: Record<SeoLocale, Record<string, string>> = {
  en: { green: "WIN", red: "LOSS", push: "PUSH", void: "VOID", pending: "PENDING", "half-green": "HALF WIN", "half-red": "HALF LOSS" },
  "pt-br": { green: "GREEN", red: "RED", push: "DEVOLVIDA", void: "ANULADA", pending: "PENDENTE", "half-green": "MEIO GREEN", "half-red": "MEIO RED" },
  es: { green: "ACIERTO", red: "FALLO", push: "REEMBOLSO", void: "ANULADA", pending: "PENDIENTE", "half-green": "MEDIO ACIERTO", "half-red": "MEDIO FALLO" },
  fr: { green: "GAGNÉ", red: "PERDU", push: "REMBOURSÉ", void: "ANNULÉ", pending: "EN ATTENTE", "half-green": "DEMI-GAGNÉ", "half-red": "DEMI-PERDU" },
  de: { green: "GEWONNEN", red: "VERLOREN", push: "ERSTATTET", void: "ANNULLIERT", pending: "OFFEN", "half-green": "HALB GEWONNEN", "half-red": "HALB VERLOREN" },
  it: { green: "VINTA", red: "PERSA", push: "RIMBORSATA", void: "ANNULLATA", pending: "IN ATTESA", "half-green": "MEZZA VINTA", "half-red": "MEZZA PERSA" },
  nl: { green: "GEWONNEN", red: "VERLOREN", push: "TERUGBETAALD", void: "ONGELDIG", pending: "IN AFWACHTING", "half-green": "HALF GEWONNEN", "half-red": "HALF VERLOREN" },
  tr: { green: "KAZANDI", red: "KAYBETTİ", push: "İADE", void: "GEÇERSİZ", pending: "BEKLEMEDE", "half-green": "YARIM KAZANDI", "half-red": "YARIM KAYBETTİ" },
};

const countries: Record<string, Record<Exclude<SeoLocale, "en">, string>> = {
  England: { "pt-br": "Inglaterra", es: "Inglaterra", fr: "Angleterre", de: "England", it: "Inghilterra", nl: "Engeland", tr: "İngiltere" },
  Spain: { "pt-br": "Espanha", es: "España", fr: "Espagne", de: "Spanien", it: "Spagna", nl: "Spanje", tr: "İspanya" },
  Germany: { "pt-br": "Alemanha", es: "Alemania", fr: "Allemagne", de: "Deutschland", it: "Germania", nl: "Duitsland", tr: "Almanya" },
  Italy: { "pt-br": "Itália", es: "Italia", fr: "Italie", de: "Italien", it: "Italia", nl: "Italië", tr: "İtalya" },
  Portugal: { "pt-br": "Portugal", es: "Portugal", fr: "Portugal", de: "Portugal", it: "Portogallo", nl: "Portugal", tr: "Portekiz" },
  France: { "pt-br": "França", es: "Francia", fr: "France", de: "Frankreich", it: "Francia", nl: "Frankrijk", tr: "Fransa" },
  Netherlands: { "pt-br": "Países Baixos", es: "Países Bajos", fr: "Pays-Bas", de: "Niederlande", it: "Paesi Bassi", nl: "Nederland", tr: "Hollanda" },
  Brazil: { "pt-br": "Brasil", es: "Brasil", fr: "Brésil", de: "Brasilien", it: "Brasile", nl: "Brazilië", tr: "Brezilya" },
  Turkey: { "pt-br": "Turquia", es: "Turquía", fr: "Turquie", de: "Türkei", it: "Turchia", nl: "Turkije", tr: "Türkiye" },
  Scotland: { "pt-br": "Escócia", es: "Escocia", fr: "Écosse", de: "Schottland", it: "Scozia", nl: "Schotland", tr: "İskoçya" },
  Norway: { "pt-br": "Noruega", es: "Noruega", fr: "Norvège", de: "Norwegen", it: "Norvegia", nl: "Noorwegen", tr: "Norveç" },
  USA: { "pt-br": "Estados Unidos", es: "Estados Unidos", fr: "États-Unis", de: "USA", it: "Stati Uniti", nl: "Verenigde Staten", tr: "ABD" },
  Europe: { "pt-br": "Europa", es: "Europa", fr: "Europe", de: "Europa", it: "Europa", nl: "Europa", tr: "Avrupa" },
  "South America": { "pt-br": "América do Sul", es: "Sudamérica", fr: "Amérique du Sud", de: "Südamerika", it: "Sud America", nl: "Zuid-Amerika", tr: "Güney Amerika" },
};

export function localizedFixtureStatus(status: string | undefined, locale: SeoLocale) {
  if (!status) return "";
  return fixtureStatusCopy[locale]?.[status.toLowerCase()] ?? status;
}

export function localizedLive(locale: SeoLocale) {
  return fixtureStatusCopy[locale].live;
}

export function localizedResult(result: string | undefined, locale: SeoLocale) {
  const key = result ?? "pending";
  return resultCopy[locale]?.[key] ?? key;
}

export function localizedCountry(country: string, locale: SeoLocale) {
  if (locale === "en") return country;
  return countries[country]?.[locale] ?? country;
}
