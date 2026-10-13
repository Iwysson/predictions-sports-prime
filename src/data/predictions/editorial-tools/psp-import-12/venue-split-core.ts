import type { ImportStatisticalCore } from "../psp-import-26/factory";

// Venue-split counts for the 17 October 2026 football package. Each entry is one side of one
// venue split (the host's home league games, or the visitor's away league games), computed from the
// season's published results grid (home team in the row, away team in the column) on the Wikipedia
// page named in sourceUrl, through 12 October 2026. The grid totals were reconciled against the
// published standings for every club in the three leagues: all of them match exactly.
export type VenueSplit = { p: number; w: number; d: number; l: number; gf: number; ga: number; btts: number; o15: number; o25: number; o35: number; cs: number; fts: number };

export const venueSplits = {
  "premier-league": {
    "Everton": { p: 3, w: 2, d: 1, l: 0, gf: 5, ga: 2, btts: 1, o15: 2, o25: 1, o35: 1, cs: 2, fts: 0 },
    "Chelsea": { p: 3, w: 1, d: 0, l: 2, gf: 4, ga: 7, btts: 2, o15: 3, o25: 3, o35: 1, cs: 0, fts: 1 },
    "Brentford": { p: 3, w: 2, d: 1, l: 0, gf: 7, ga: 1, btts: 1, o15: 3, o25: 2, o35: 0, cs: 2, fts: 0 },
    "Liverpool": { p: 3, w: 2, d: 1, l: 0, gf: 5, ga: 2, btts: 1, o15: 2, o25: 1, o35: 1, cs: 2, fts: 0 },
    "Fulham": { p: 3, w: 0, d: 1, l: 2, gf: 5, ga: 7, btts: 3, o15: 3, o25: 2, o35: 2, cs: 0, fts: 0 },
    "Hull City": { p: 3, w: 1, d: 1, l: 1, gf: 4, ga: 4, btts: 2, o15: 2, o25: 2, o35: 1, cs: 1, fts: 0 },
    "Manchester City": { p: 3, w: 3, d: 0, l: 0, gf: 8, ga: 4, btts: 2, o15: 2, o25: 2, o35: 1, cs: 1, fts: 0 },
    "Ipswich Town": { p: 3, w: 1, d: 0, l: 2, gf: 5, ga: 8, btts: 2, o15: 2, o25: 2, o35: 2, cs: 0, fts: 1 },
    "Newcastle United": { p: 3, w: 1, d: 2, l: 0, gf: 6, ga: 5, btts: 3, o15: 3, o25: 3, o35: 2, cs: 0, fts: 0 },
    "Aston Villa": { p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 6, btts: 1, o15: 2, o25: 2, o35: 2, cs: 1, fts: 2 },
  },
  "la-liga": {
    "Espanyol": { p: 4, w: 1, d: 1, l: 2, gf: 6, ga: 6, btts: 3, o15: 4, o25: 3, o35: 1, cs: 1, fts: 0 },
    "Atlético Madrid": { p: 4, w: 3, d: 0, l: 1, gf: 8, ga: 5, btts: 2, o15: 4, o25: 4, o35: 1, cs: 1, fts: 1 },
    "Villarreal": { p: 3, w: 1, d: 0, l: 2, gf: 6, ga: 6, btts: 3, o15: 3, o25: 3, o35: 2, cs: 0, fts: 0 },
    "Elche": { p: 4, w: 1, d: 2, l: 1, gf: 7, ga: 6, btts: 4, o15: 4, o25: 2, o35: 2, cs: 0, fts: 0 },
    "Real Betis": { p: 4, w: 4, d: 0, l: 0, gf: 8, ga: 2, btts: 1, o15: 1, o25: 1, o35: 1, cs: 3, fts: 0 },
    "Barcelona": { p: 4, w: 4, d: 0, l: 0, gf: 17, ga: 3, btts: 2, o15: 4, o25: 4, o35: 4, cs: 2, fts: 0 },
    "Valencia": { p: 4, w: 0, d: 1, l: 3, gf: 2, ga: 9, btts: 1, o15: 2, o25: 2, o35: 2, cs: 1, fts: 3 },
    "Athletic Club": { p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 2, btts: 0, o15: 2, o25: 0, o35: 0, cs: 1, fts: 1 },
  },
  "serie-a": {
    "Venezia": { p: 3, w: 0, d: 0, l: 3, gf: 2, ga: 8, btts: 1, o15: 3, o25: 1, o35: 1, cs: 0, fts: 2 },
    "Napoli": { p: 3, w: 1, d: 1, l: 1, gf: 5, ga: 4, btts: 2, o15: 3, o25: 1, o35: 1, cs: 1, fts: 0 },
    "Bologna": { p: 3, w: 0, d: 2, l: 1, gf: 3, ga: 4, btts: 2, o15: 2, o25: 1, o35: 1, cs: 0, fts: 1 },
    "Inter": { p: 2, w: 1, d: 1, l: 0, gf: 3, ga: 2, btts: 1, o15: 1, o25: 1, o35: 1, cs: 1, fts: 0 },
    "Roma": { p: 3, w: 2, d: 1, l: 0, gf: 8, ga: 3, btts: 2, o15: 3, o25: 3, o35: 2, cs: 1, fts: 0 },
    "Genoa": { p: 2, w: 0, d: 0, l: 2, gf: 1, ga: 3, btts: 1, o15: 1, o25: 1, o35: 0, cs: 0, fts: 1 },
  },
} as const satisfies Record<string, Record<string, VenueSplit>>;

export type VenueSplitLeague = keyof typeof venueSplits;

const sourceUrls: Record<VenueSplitLeague, string> = {
  "premier-league": "https://en.wikipedia.org/wiki/2026%E2%80%9327_Premier_League",
  "la-liga": "https://en.wikipedia.org/wiki/2026%E2%80%9327_La_Liga",
  "serie-a": "https://en.wikipedia.org/wiki/2026%E2%80%9327_Serie_A",
};
const competitions: Record<VenueSplitLeague, string> = { "premier-league": "Premier League", "la-liga": "La Liga", "serie-a": "Serie A" };

const pct = (n: number, p: number) => `${Math.round((100 * n) / p)}%`;
const per = (n: number, p: number) => (n / p).toFixed(2);

export function venueSplitCore(league: VenueSplitLeague, home: string, away: string): ImportStatisticalCore {
  const table = venueSplits[league] as Record<string, VenueSplit>;
  const h = table[home];
  const a = table[away];
  if (!h || !a) throw new Error(`Missing venue split for ${league}: ${home} / ${away}`);
  const rows: Array<[string, string, string]> = [
    ["Matches (N)", String(h.p), String(a.p)],
    ["W-D-L", `${h.w}-${h.d}-${h.l}`, `${a.w}-${a.d}-${a.l}`],
    ["Points/game", per(h.w * 3 + h.d, h.p), per(a.w * 3 + a.d, a.p)],
    ["GF/game", per(h.gf, h.p), per(a.gf, a.p)],
    ["GA/game", per(h.ga, h.p), per(a.ga, a.p)],
    ["BTTS", pct(h.btts, h.p), pct(a.btts, a.p)],
    ["Clean sheets", pct(h.cs, h.p), pct(a.cs, a.p)],
    ["Failed to score", pct(h.fts, h.p), pct(a.fts, a.p)],
    ["Over 1.5 goals", pct(h.o15, h.p), pct(a.o15, a.p)],
    ["Over 2.5 goals", pct(h.o25, h.p), pct(a.o25, a.p)],
    ["Over 3.5 goals", pct(h.o35, h.p), pct(a.o35, a.p)],
  ];
  const url = sourceUrls[league];
  return {
    kind: "rows",
    introLine: `Statistical coverage is partial. The table covers ${home}'s ${h.p} home ${competitions[league]} games and ${away}'s ${a.p} away ${competitions[league]} games of 2026/27, computed from published scorelines through 12 October. The samples are very small, so the percentages describe a few matches rather than a settled trend. Expected goals, shots, possession and corner data were not available from the sources used, so those target metrics are left out rather than estimated.`,
    rows,
    provenance: {
      season: "2026/27",
      competition: competitions[league],
      homeSource: `Wikipedia, 2026–27 ${competitions[league]}, results grid (HOME games) ${url}`,
      awaySource: `Wikipedia, 2026–27 ${competitions[league]}, results grid (AWAY games) ${url}`,
      homeMatches: h.p,
      awayMatches: a.p,
    },
  };
}
