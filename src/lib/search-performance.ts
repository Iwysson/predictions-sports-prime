import type { SearchIntentCategory, SearchLocale } from "@/lib/search-intent-research";

export type SearchQueryPerformanceRecord = {
  match: string;
  locale: SearchLocale;
  query: string;
  category: SearchIntentCategory;
  date: string;
  daysBeforeKickoff: number;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
};

export type SearchOpportunity = "CTR_OPPORTUNITY" | "POSITION_OPPORTUNITY" | "MONITOR";

export function validateSearchPerformanceRecord(record: SearchQueryPerformanceRecord) {
  return Boolean(
    record.match.trim() &&
    record.query.trim() &&
    /^\d{4}-\d{2}-\d{2}$/.test(record.date) &&
    Number.isInteger(record.daysBeforeKickoff) &&
    record.impressions >= 0 &&
    record.clicks >= 0 &&
    record.clicks <= record.impressions &&
    record.ctr >= 0 &&
    record.ctr <= 1 &&
    record.averagePosition > 0
  );
}

export function classifySearchOpportunity(record: SearchQueryPerformanceRecord): SearchOpportunity {
  if (record.impressions >= 100 && record.averagePosition <= 10 && record.ctr < 0.02) {
    return "CTR_OPPORTUNITY";
  }
  if (record.impressions >= 20 && record.averagePosition >= 4 && record.averagePosition <= 15) {
    return "POSITION_OPPORTUNITY";
  }
  return "MONITOR";
}
