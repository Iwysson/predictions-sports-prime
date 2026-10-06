import data from "@/data/nhl/matches.en.json";
import type { PredictionAccess } from "@/types";

// NHL 06/10/2026 page data, English only, from src/data/nhl/matches.en.json.
// One page, one anchor per game, no per-game match routes.

export type NhlMatch = {
  slug: string;
  anchor: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  access: PredictionAccess;
  pick: string;
  odds: number;
  teaser: string;
  analysis: string[];
  sources: Array<{ name: string; url: string }>;
};

// Host and path, so two sources from the same site stay distinguishable.
const sourceName = (url: string) => {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 1 ? u.pathname.replace(/\/$/, "") : "";
    const label = `${u.hostname.replace(/^www\./, "")}${path}`;
    return label.length > 64 ? `${label.slice(0, 61)}…` : label;
  } catch {
    return url;
  }
};

export function nhlMatches(): NhlMatch[] {
  return (data.matches as any[]).map((m) => {
    const [home, away] = String(m.title).split("×").map((t) => t.trim());
    return {
      slug: m.slug,
      anchor: m.slug,
      title: m.title,
      homeTeam: home,
      awayTeam: away,
      date: m.date,
      access: m.access === "free" ? "free" : "vip",
      pick: m.pick,
      odds: Number(m.odds),
      teaser: String(m.teaser ?? "").trim(),
      analysis: m.analysis as string[],
      sources: (m.sources ?? []).map((url: string) => ({ name: sourceName(url), url })),
    };
  });
}

// Evergreen static metadata: the static export cannot date it, so the day lives only in the client H1.
export const NHL_PAGE = {
  title: "NHL Predictions Today | Predictions Sports Prime",
  description:
    "Today's NHL predictions, statistical analysis, free picks and PRIME VIP insights from Predictions Sports Prime.",
  path: "/nhl/",
  h1: "NHL Predictions Today",
};
