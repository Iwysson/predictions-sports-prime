"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function MatchAnalysisLabel() {
  const { t } = useI18n();
  return <>{t("matchAnalysis")}</>;
}

export function MatchPredictionsLabel() {
  const { t } = useI18n();
  return <>{t("predictions")}</>;
}

export function MatchPicksLabel() {
  const { t } = useI18n();
  return <>{t("matchPicks")}</>;
}

export function MatchAvailableLabel() {
  const { t } = useI18n();
  return <>★ {t("available")}</>;
}

export function ResponsibleText() {
  const { t } = useI18n();
  return <>{t("responsible")}</>;
}
