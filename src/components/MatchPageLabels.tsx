"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function MatchAnalysisLabel() {
  const { t } = useI18n();
  return <>{t("matchAnalysis")}</>;
}

export function MainPredictionLabel() {
  const { t } = useI18n();
  return <>{t("mainPrediction")}</>;
}

export function OddsLabel() {
  const { locale } = useI18n();
  const labels = {
    en: "Published odds",
    "pt-br": "Odd publicada",
    es: "Cuota publicada",
    fr: "Cote publiée",
    de: "Veröffentlichte Quote",
    it: "Quota pubblicata",
    nl: "Gepubliceerde odds",
    tr: "Yayımlanan oran",
  } as const;
  return <>{labels[locale as keyof typeof labels] ?? labels.en}</>;
}

export function ResponsibleText() {
  const { t } = useI18n();
  return <>{t("responsible")}</>;
}
