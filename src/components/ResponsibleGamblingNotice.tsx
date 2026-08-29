"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { responsibleGamblingCopy } from "@/lib/responsible-gambling-copy";
import { ResponsibleGamblingNoticeContent } from "@/components/ResponsibleGamblingNoticeContent";

export function ResponsibleGamblingNotice() {
  const { locale } = useI18n();
  return <ResponsibleGamblingNoticeContent copy={responsibleGamblingCopy[locale]} />;
}
