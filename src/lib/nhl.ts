import data from "@/data/nhl/predictions.json";
import type { PredictionAccess } from "@/types";

// NHL 06/10/2026 page data, normalised from src/data/nhl/predictions.json (copied unchanged
// from the editorial package). One page, one anchor per game, no per-game match routes.

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

const paragraphsOf = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

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
      teaser: String(m.teaser ?? m.free_text ?? "").trim(),
      analysis: paragraphsOf(String(m.analysis ?? "")),
      sources: (m.sources ?? []).map((url: string) => ({ name: sourceName(url), url })),
    };
  });
}

export const NHL_PAGE = {
  title: "NHL Predictions Today – October 6, 2026 | Predictions Sports Prime",
  description:
    "NHL predictions for October 6, 2026, including matchup analysis for Sabres vs Wild, Red Wings vs Senators, Devils vs Mammoth and more.",
  path: "/nhl/",
  h1: "NHL Predictions Today – October 6, 2026",
};
