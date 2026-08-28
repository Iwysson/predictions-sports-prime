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
  return <>Published odds</>;
}

export function ResponsibleText() {
  const { t } = useI18n();
  return <>{t("responsible")}</>;
}
