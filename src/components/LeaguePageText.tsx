"use client";

import { ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function LeaguePageText({
  children,
  matchCount,
}: {
  children: ReactNode;
  matchCount?: number;
}) {
  const { t } = useI18n();

  return (
    <>
      <div className="section-heading section-heading--compact">
        <div className="heading-with-icon">
          <span className="section-icon">▣</span>
          <div>
            <span className="eyebrow">{t("fixtures")}</span>
            <h2>{t("currentRound")}</h2>
          </div>
        </div>

        {typeof matchCount === "number" ? (
          <span className="league-match-count">
            {matchCount}
          </span>
        ) : null}
      </div>

      {children}
    </>
  );
}
