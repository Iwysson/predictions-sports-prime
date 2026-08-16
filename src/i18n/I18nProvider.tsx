"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  dictionaries,
  Locale,
  rtlLocales,
  supportedLocales,
  TranslationKey,
} from "@/i18n/dictionaries";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  let saved: Locale | null = null;

  try {
    saved = window.localStorage.getItem("psp-locale") as Locale | null;
  } catch {
    // Privacy settings may disable storage; browser detection still works.
  }

  if (saved && supportedLocales.includes(saved)) {
    return saved;
  }

  const browser = navigator.language || "en";
  const lower = browser.toLowerCase();

  const exact = supportedLocales.find(
    (locale) => locale.toLowerCase() === lower
  );

  if (exact) {
    return exact;
  }

  const language = lower.split("-")[0];

  const mapped = supportedLocales.find(
    (locale) => locale.toLowerCase().split("-")[0] === language
  );

  return mapped ?? "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem("psp-locale", next);
    } catch {
      // Keep the selection for this session if persistence is unavailable.
    }
  }

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      dir,
      t: (key) => dictionaries[locale][key] ?? dictionaries.en[key],
    }),
    [dir, locale]
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}
