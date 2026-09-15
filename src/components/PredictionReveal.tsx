import type { AriaRole, ReactNode } from "react";
import type { SeoLocale } from "@/lib/seo-locales";

type PredictionCopy = {
  odds: string;
  latestOdds: string;
};

const predictionCopy: Record<SeoLocale, PredictionCopy> = {
  en: { odds: "Published odds", latestOdds: "Latest observed odds" },
  "pt-br": { odds: "Odds publicadas", latestOdds: "Odds mais recentes observadas" },
  es: { odds: "Cuotas publicadas", latestOdds: "Últimas cuotas observadas" },
  fr: { odds: "Cotes publiées", latestOdds: "Dernières cotes observées" },
  de: { odds: "Veröffentlichte Quoten", latestOdds: "Zuletzt beobachtete Quoten" },
  it: { odds: "Quote pubblicate", latestOdds: "Ultime quote osservate" },
  nl: { odds: "Gepubliceerde odds", latestOdds: "Laatst waargenomen odds" },
  tr: { odds: "Yayımlanan oranlar", latestOdds: "Son gözlenen oranlar" },
};

/**
 * Compatibility wrapper retained so existing match pages do not need a broad
 * refactor. Prediction content is now visible immediately; no client-side
 * reveal state or extra click is required.
 */
export function PredictionRevealProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Google supports data-nosnippet on div/span/section. Keep sensitive pick/odds
 * text visible to readers while preventing those blocks from being selected as
 * search-result snippets.
 */
export function PredictionSensitiveParagraph({ children }: { children: ReactNode }) {
  return <div data-nosnippet=""><p>{children}</p></div>;
}

export function PredictionSensitiveContent({
  children,
  className,
  role,
}: {
  children: ReactNode;
  className?: string;
  role?: AriaRole;
}) {
  return <div className={className} role={role} data-nosnippet="">{children}</div>;
}

export function PredictionRevealPanel({
  prediction,
  odds,
  latestObservedOdds,
  locale = "en",
}: {
  prediction?: string;
  odds?: string;
  latestObservedOdds?: string;
  locale?: SeoLocale;
}) {
  const copy = predictionCopy[locale];

  return (
    <div
      className="main-prediction-block"
      data-nosnippet=""
      data-prediction-visibility="visible"
    >
      <strong>{prediction}</strong>
      {odds ? (
        <div className="prediction-odds">
          <span>{copy.odds}</span>
          <b>{odds}</b>
        </div>
      ) : null}
      {latestObservedOdds ? (
        <div className="prediction-odds">
          <span>{copy.latestOdds}</span>
          <b>{latestObservedOdds}</b>
        </div>
      ) : null}
    </div>
  );
}
