"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type AriaRole,
  type ReactNode,
} from "react";
import type { SeoLocale } from "@/lib/seo-locales";

type RevealCopy = {
  button: string;
  locked: string;
  odds: string;
  latestOdds: string;
  javascript: string;
};

const revealCopy: Record<SeoLocale, RevealCopy> = {
  en: {
    button: "Reveal prediction and odds",
    locked: "The prediction and published odds are hidden until you choose to reveal them.",
    odds: "Published odds",
    latestOdds: "Latest observed odds",
    javascript: "Enable JavaScript to reveal the prediction.",
  },
  "pt-br": {
    button: "Ver palpite e odds",
    locked: "O palpite e as odds publicadas ficam ocultos até você decidir revelá-los.",
    odds: "Odds publicadas",
    latestOdds: "Odds mais recentes observadas",
    javascript: "Ative o JavaScript para revelar o palpite.",
  },
  es: {
    button: "Ver pronóstico y cuotas",
    locked: "El pronóstico y las cuotas publicadas permanecen ocultos hasta que decidas verlos.",
    odds: "Cuotas publicadas",
    latestOdds: "Últimas cuotas observadas",
    javascript: "Activa JavaScript para ver el pronóstico.",
  },
  fr: {
    button: "Voir le pronostic et les cotes",
    locked: "Le pronostic et les cotes publiées restent masqués jusqu'à votre choix.",
    odds: "Cotes publiées",
    latestOdds: "Dernières cotes observées",
    javascript: "Activez JavaScript pour afficher le pronostic.",
  },
  de: {
    button: "Prognose und Quoten anzeigen",
    locked: "Prognose und veröffentlichte Quoten bleiben verborgen, bis du sie anzeigst.",
    odds: "Veröffentlichte Quoten",
    latestOdds: "Zuletzt beobachtete Quoten",
    javascript: "Aktiviere JavaScript, um die Prognose anzuzeigen.",
  },
  it: {
    button: "Mostra pronostico e quote",
    locked: "Il pronostico e le quote pubblicate restano nascosti finché non scegli di mostrarli.",
    odds: "Quote pubblicate",
    latestOdds: "Ultime quote osservate",
    javascript: "Attiva JavaScript per mostrare il pronostico.",
  },
  nl: {
    button: "Toon voorspelling en odds",
    locked: "De voorspelling en gepubliceerde odds blijven verborgen totdat je ze toont.",
    odds: "Gepubliceerde odds",
    latestOdds: "Laatst waargenomen odds",
    javascript: "Schakel JavaScript in om de voorspelling te tonen.",
  },
  tr: {
    button: "Tahmini ve oranları göster",
    locked: "Tahmin ve yayımlanan oranlar siz gösterene kadar gizli kalır.",
    odds: "Yayımlanan oranlar",
    latestOdds: "Son gözlenen oranlar",
    javascript: "Tahmini göstermek için JavaScript'i etkinleştirin.",
  },
};

const PredictionRevealContext = createContext<{
  revealed: boolean;
  reveal: () => void;
}>({
  revealed: false,
  reveal: () => {},
});

export function PredictionRevealProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <PredictionRevealContext.Provider
      value={{ revealed, reveal: () => setRevealed(true) }}
    >
      {children}
    </PredictionRevealContext.Provider>
  );
}

export function PredictionSensitiveParagraph({ children }: { children: ReactNode }) {
  const { revealed } = useContext(PredictionRevealContext);
  if (!revealed) return null;
  return <p data-nosnippet="">{children}</p>;
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
  const { revealed } = useContext(PredictionRevealContext);
  if (!revealed) return null;
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
  const { revealed, reveal } = useContext(PredictionRevealContext);
  const panelId = useId();
  const copy = revealCopy[locale];

  if (!revealed) {
    return (
      <div className="prediction-reveal" data-prediction-reveal="locked">
        <p>{copy.locked}</p>
        <button
          type="button"
          className="button prediction-reveal__button"
          aria-controls={panelId}
          aria-expanded="false"
          onClick={reveal}
        >
          {copy.button}
        </button>
        <noscript><small>{copy.javascript}</small></noscript>
      </div>
    );
  }

  return (
    <div
      id={panelId}
      className="main-prediction-block"
      data-nosnippet=""
      data-prediction-reveal="revealed"
      aria-live="polite"
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
