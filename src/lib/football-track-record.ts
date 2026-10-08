import { summarizeResults, type FootballResultRecord } from "@/lib/football-results";

export type FootballTrackRecordPeriod = {
  date: string;
  summary: ReturnType<typeof summarizeResults>;
};

export function latestFootballTrackRecord(records: FootballResultRecord[]): FootballTrackRecordPeriod | null {
  if (records.length === 0) return null;
  const date = records.reduce((latest, record) => (record.date > latest ? record.date : latest), records[0].date);
  return { date, summary: summarizeResults(records.filter((record) => record.date === date)) };
}

export function shouldShowOverallTrackRecord(records: FootballResultRecord[]): boolean {
  return new Set(records.map((record) => record.date)).size > 1;
}

export type TrackRecordPromoState = "loading" | "vip" | "free";

export function trackRecordPromoState(loading: boolean, isVip: boolean): TrackRecordPromoState {
  if (loading) return "loading";
  return isVip ? "vip" : "free";
}
