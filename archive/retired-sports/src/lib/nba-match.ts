// Server-only assembly of one NBA match's full data: team names/venue/teaser from the deferred
// listing (src/data/nba/deferred-slate-2026-10-20.json) plus the full protected content
// (src/data/nba/protected-2026-10-20.json). There is no per-game page: this feeds
// scripts/build-match-content.mts, which indexes the same content behind /api/match-content/[slug]
// for the inline expand/collapse analysis on the /nba/ listing (src/components/NbaToday.tsx) - never
// imported by a client component, mirroring the NHL server-only data files this reads from.
import protectedOct20 from "@/data/nba/protected-2026-10-20.json";
import deferredOct20 from "@/data/nba/deferred-slate-2026-10-20.json";
import protectedOct21 from "@/data/nba/protected-2026-10-21.json";
import deferredOct21 from "@/data/nba/deferred-slate-2026-10-21.json";
import protectedOct22 from "@/data/nba/protected-2026-10-22.json";
import deferredOct22 from "@/data/nba/deferred-slate-2026-10-22.json";
import protectedOct23 from "@/data/nba/protected-2026-10-23.json";
import deferredOct23 from "@/data/nba/deferred-slate-2026-10-23.json";

export type NbaMatchInfo = {
  date: string;
  time: string;
  venue: string;
  venueAddress?: { addressLocality?: string; addressRegion?: string; addressCountry?: string };
};

export type NbaMatchData = {
  slug: string;
  homeTeam: string;
  awayTeam: string;
  title: string;
  teaser: string;
  venue: string;
  analysisAccess: "free" | "vip";
  predictionAccess: "free" | "vip";
  pick: string;
  odds: number;
  matchInfo: NbaMatchInfo;
  releaseTimeZone: string;
  analysisFormat?: "markdown";
  analysis: string[];
  sources: Array<{ name: string; url: string }>;
};

type ProtectedEntry = {
  slug: string;
  analysisAccess: "free" | "vip";
  predictionAccess: "free" | "vip";
  pick: string;
  odds: number;
  matchInfo: NbaMatchInfo;
  analysisFormat?: "markdown";
  analysis: string[];
  sources: Array<{ name: string; url: string }>;
};

type DeferredEntry = { slug: string; title: string; homeTeam: string; awayTeam: string; venue: string; teaser: string };

const PROTECTED_DAYS: Array<{ entries: ProtectedEntry[]; releaseTimeZone: string }> = [protectedOct20, protectedOct21, protectedOct22, protectedOct23] as Array<{ entries: ProtectedEntry[]; releaseTimeZone: string }>;
const DEFERRED_DAYS: Array<{ matches: DeferredEntry[] }> = [deferredOct20, deferredOct21, deferredOct22, deferredOct23] as Array<{ matches: DeferredEntry[] }>;

export function allNbaMatches(): NbaMatchData[] {
  const deferredBySlug = new Map<string, DeferredEntry>();
  for (const day of DEFERRED_DAYS) for (const entry of day.matches) deferredBySlug.set(entry.slug, entry);

  return PROTECTED_DAYS.flatMap((day) =>
    day.entries.flatMap((entry) => {
      const listing = deferredBySlug.get(entry.slug);
      if (!listing) return [];
      return [{
        slug: entry.slug,
        homeTeam: listing.homeTeam,
        awayTeam: listing.awayTeam,
        title: listing.title,
        teaser: listing.teaser,
        venue: listing.venue,
        analysisAccess: entry.analysisAccess,
        predictionAccess: entry.predictionAccess,
        pick: entry.pick,
        odds: entry.odds,
        matchInfo: entry.matchInfo,
        releaseTimeZone: day.releaseTimeZone,
        analysisFormat: entry.analysisFormat,
        analysis: entry.analysis,
        sources: entry.sources,
      }];
    }),
  );
}

export function findNbaMatch(slug: string): NbaMatchData | null {
  return allNbaMatches().find((match) => match.slug === slug) ?? null;
}
