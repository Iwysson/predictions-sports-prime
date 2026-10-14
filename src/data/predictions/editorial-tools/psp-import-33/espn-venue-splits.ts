import type { ImportStatisticalCore } from "../psp-import-26/factory";

// HOME and AWAY league splits for the 17-19 October 2026 football package (Brasileirão, Eliteserien,
// Eredivisie and Süper Lig). Each entry is computed from the completed league results published by ESPN
// (site.api.espn.com, team schedules) through 13 October 2026 and kept only when the club's computed
// played/W-D-L/goals-for/goals-against totals equal ESPN's league standings exactly. Clubs whose results
// feed did not reconcile with the standings (HamKam, Kristiansund, Aalesund and Vålerenga) are left out,
// so their fixtures publish a disclosed partial Core instead of unreliable figures.
export type EspnVenueSplit = { p: number; w: number; d: number; l: number; gf: number; ga: number; btts: number; o15: number; o25: number; o35: number; cs: number; fts: number };
type Entry = { home: EspnVenueSplit; away: EspnVenueSplit };

export const espnVenueSplits = {
  "eredivisie": {
    "ADO Den Haag": { home: { p: 3, w: 0, d: 1, l: 2, gf: 4, ga: 8, btts: 3, o15: 3, o25: 2, o35: 2, cs: 0, fts: 0 }, away: { p: 5, w: 0, d: 2, l: 3, gf: 5, ga: 11, btts: 3, o15: 5, o25: 3, o35: 3, cs: 0, fts: 2 } },
    "PSV Eindhoven": { home: { p: 4, w: 3, d: 1, l: 0, gf: 13, ga: 4, btts: 3, o15: 4, o25: 3, o35: 3, cs: 1, fts: 0 }, away: { p: 4, w: 3, d: 0, l: 1, gf: 13, ga: 6, btts: 4, o15: 4, o25: 4, o35: 3, cs: 0, fts: 0 } },
    "Telstar": { home: { p: 4, w: 0, d: 2, l: 2, gf: 5, ga: 11, btts: 3, o15: 4, o25: 4, o35: 4, cs: 0, fts: 1 }, away: { p: 4, w: 1, d: 1, l: 2, gf: 2, ga: 3, btts: 1, o15: 1, o25: 1, o35: 0, cs: 1, fts: 3 } },
    "Feyenoord": { home: { p: 4, w: 2, d: 2, l: 0, gf: 11, ga: 4, btts: 2, o15: 4, o25: 3, o35: 3, cs: 2, fts: 0 }, away: { p: 4, w: 4, d: 0, l: 0, gf: 16, ga: 3, btts: 2, o15: 3, o25: 3, o35: 3, cs: 2, fts: 0 } },
    "Sparta Rotterdam": { home: { p: 4, w: 0, d: 2, l: 2, gf: 5, ga: 10, btts: 2, o15: 3, o25: 3, o35: 3, cs: 0, fts: 2 }, away: { p: 4, w: 1, d: 1, l: 2, gf: 8, ga: 10, btts: 4, o15: 4, o25: 4, o35: 3, cs: 0, fts: 0 } },
    "Willem II": { home: { p: 4, w: 0, d: 1, l: 3, gf: 3, ga: 10, btts: 2, o15: 3, o25: 3, o35: 2, cs: 0, fts: 2 }, away: { p: 4, w: 0, d: 1, l: 3, gf: 4, ga: 13, btts: 4, o15: 4, o25: 3, o35: 3, cs: 0, fts: 0 } },
    "PEC Zwolle": { home: { p: 4, w: 0, d: 0, l: 4, gf: 1, ga: 13, btts: 1, o15: 3, o25: 2, o35: 2, cs: 0, fts: 3 }, away: { p: 4, w: 1, d: 1, l: 2, gf: 5, ga: 8, btts: 2, o15: 4, o25: 3, o35: 2, cs: 1, fts: 1 } },
    "Go Ahead Eagles": { home: { p: 4, w: 2, d: 2, l: 0, gf: 11, ga: 6, btts: 4, o15: 4, o25: 3, o35: 3, cs: 0, fts: 0 }, away: { p: 4, w: 0, d: 3, l: 1, gf: 8, ga: 11, btts: 4, o15: 4, o25: 3, o35: 3, cs: 0, fts: 0 } },
    "SC Cambuur": { home: { p: 4, w: 1, d: 0, l: 3, gf: 6, ga: 13, btts: 2, o15: 4, o25: 4, o35: 3, cs: 1, fts: 1 }, away: { p: 4, w: 1, d: 2, l: 1, gf: 5, ga: 6, btts: 3, o15: 3, o25: 2, o35: 2, cs: 1, fts: 0 } },
    "AZ Alkmaar": { home: { p: 4, w: 3, d: 1, l: 0, gf: 9, ga: 3, btts: 2, o15: 3, o25: 1, o35: 1, cs: 2, fts: 0 }, away: { p: 4, w: 3, d: 0, l: 1, gf: 9, ga: 5, btts: 2, o15: 4, o25: 2, o35: 2, cs: 1, fts: 1 } },
    "FC Groningen": { home: { p: 4, w: 2, d: 1, l: 1, gf: 9, ga: 6, btts: 3, o15: 4, o25: 4, o35: 2, cs: 1, fts: 0 }, away: { p: 4, w: 2, d: 1, l: 1, gf: 11, ga: 8, btts: 4, o15: 4, o25: 3, o35: 3, cs: 0, fts: 0 } },
    "Ajax": { home: { p: 5, w: 1, d: 3, l: 1, gf: 11, ga: 9, btts: 5, o15: 5, o25: 4, o35: 4, cs: 0, fts: 0 }, away: { p: 3, w: 3, d: 0, l: 0, gf: 11, ga: 1, btts: 1, o15: 3, o25: 2, o35: 2, cs: 2, fts: 0 } },
    "NEC Nijmegen": { home: { p: 4, w: 0, d: 2, l: 2, gf: 5, ga: 8, btts: 4, o15: 4, o25: 3, o35: 2, cs: 0, fts: 0 }, away: { p: 4, w: 2, d: 1, l: 1, gf: 8, ga: 6, btts: 3, o15: 4, o25: 3, o35: 2, cs: 0, fts: 1 } },
    "Fortuna Sittard": { home: { p: 4, w: 1, d: 1, l: 2, gf: 5, ga: 9, btts: 3, o15: 4, o25: 2, o35: 2, cs: 0, fts: 1 }, away: { p: 4, w: 3, d: 1, l: 0, gf: 9, ga: 6, btts: 3, o15: 3, o25: 3, o35: 3, cs: 1, fts: 0 } },
    "FC Twente": { home: { p: 4, w: 4, d: 0, l: 0, gf: 9, ga: 3, btts: 2, o15: 3, o25: 2, o35: 2, cs: 2, fts: 0 }, away: { p: 4, w: 1, d: 2, l: 1, gf: 7, ga: 5, btts: 3, o15: 3, o25: 2, o35: 2, cs: 0, fts: 1 } },
    "FC Utrecht": { home: { p: 4, w: 1, d: 1, l: 2, gf: 8, ga: 14, btts: 4, o15: 4, o25: 4, o35: 4, cs: 0, fts: 0 }, away: { p: 4, w: 1, d: 1, l: 2, gf: 6, ga: 11, btts: 3, o15: 4, o25: 4, o35: 2, cs: 0, fts: 1 } },
  },
  "brasileirao-serie-a": {
    "Botafogo": { home: { p: 15, w: 5, d: 6, l: 4, gf: 25, ga: 22, btts: 11, o15: 13, o25: 11, o35: 7, cs: 3, fts: 3 }, away: { p: 15, w: 4, d: 3, l: 8, gf: 18, ga: 26, btts: 10, o15: 12, o25: 8, o35: 3, cs: 1, fts: 4 } },
    "Chapecoense": { home: { p: 14, w: 2, d: 5, l: 7, gf: 19, ga: 33, btts: 10, o15: 12, o25: 10, o35: 8, cs: 2, fts: 3 }, away: { p: 15, w: 1, d: 4, l: 10, gf: 11, ga: 28, btts: 9, o15: 14, o25: 7, o35: 3, cs: 0, fts: 6 } },
    "Atlético-MG": { home: { p: 15, w: 9, d: 5, l: 1, gf: 26, ga: 17, btts: 10, o15: 12, o25: 9, o35: 5, cs: 4, fts: 1 }, away: { p: 15, w: 4, d: 3, l: 8, gf: 15, ga: 18, btts: 5, o15: 9, o25: 6, o35: 4, cs: 3, fts: 8 } },
    "Coritiba": { home: { p: 15, w: 5, d: 5, l: 5, gf: 20, ga: 20, btts: 10, o15: 11, o25: 7, o35: 4, cs: 2, fts: 3 }, away: { p: 15, w: 5, d: 4, l: 6, gf: 18, ga: 28, btts: 6, o15: 12, o25: 9, o35: 6, cs: 4, fts: 6 } },
    "Athletico-PR": { home: { p: 15, w: 9, d: 5, l: 1, gf: 27, ga: 13, btts: 9, o15: 12, o25: 7, o35: 4, cs: 5, fts: 2 }, away: { p: 15, w: 6, d: 3, l: 6, gf: 22, ga: 22, btts: 9, o15: 11, o25: 9, o35: 5, cs: 3, fts: 4 } },
    "Palmeiras": { home: { p: 15, w: 11, d: 3, l: 1, gf: 28, ga: 10, btts: 9, o15: 10, o25: 7, o35: 3, cs: 6, fts: 1 }, away: { p: 15, w: 7, d: 6, l: 2, gf: 24, ga: 12, btts: 8, o15: 10, o25: 8, o35: 5, cs: 7, fts: 3 } },
    "São Paulo": { home: { p: 15, w: 9, d: 3, l: 3, gf: 24, ga: 13, btts: 9, o15: 12, o25: 7, o35: 2, cs: 5, fts: 1 }, away: { p: 15, w: 2, d: 3, l: 10, gf: 11, ga: 22, btts: 8, o15: 11, o25: 5, o35: 1, cs: 1, fts: 6 } },
    "Vasco": { home: { p: 15, w: 7, d: 3, l: 5, gf: 21, ga: 18, btts: 8, o15: 11, o25: 9, o35: 3, cs: 3, fts: 5 }, away: { p: 14, w: 2, d: 5, l: 7, gf: 15, ga: 24, btts: 10, o15: 10, o25: 8, o35: 4, cs: 1, fts: 4 } },
    "Fluminense": { home: { p: 15, w: 11, d: 3, l: 1, gf: 28, ga: 14, btts: 10, o15: 11, o25: 10, o35: 5, cs: 5, fts: 1 }, away: { p: 15, w: 3, d: 6, l: 6, gf: 20, ga: 23, btts: 11, o15: 13, o25: 6, o35: 5, cs: 1, fts: 3 } },
    "Santos": { home: { p: 15, w: 6, d: 5, l: 4, gf: 22, ga: 20, btts: 10, o15: 14, o25: 8, o35: 4, cs: 3, fts: 2 }, away: { p: 15, w: 5, d: 4, l: 6, gf: 24, ga: 25, btts: 12, o15: 13, o25: 12, o35: 6, cs: 3, fts: 1 } },
    "Grêmio": { home: { p: 15, w: 7, d: 5, l: 3, gf: 23, ga: 17, btts: 10, o15: 11, o25: 7, o35: 4, cs: 4, fts: 3 }, away: { p: 15, w: 0, d: 5, l: 10, gf: 9, ga: 23, btts: 8, o15: 11, o25: 6, o35: 1, cs: 2, fts: 7 } },
    "Cruzeiro": { home: { p: 15, w: 8, d: 4, l: 3, gf: 26, ga: 16, btts: 10, o15: 13, o25: 9, o35: 4, cs: 4, fts: 2 }, away: { p: 15, w: 6, d: 2, l: 7, gf: 20, ga: 28, btts: 11, o15: 13, o25: 11, o35: 6, cs: 2, fts: 2 } },
    "Bahia": { home: { p: 15, w: 7, d: 6, l: 2, gf: 23, ga: 14, btts: 10, o15: 13, o25: 7, o35: 2, cs: 5, fts: 1 }, away: { p: 15, w: 6, d: 4, l: 5, gf: 21, ga: 22, btts: 9, o15: 11, o25: 8, o35: 5, cs: 4, fts: 3 } },
    "Flamengo": { home: { p: 15, w: 11, d: 3, l: 1, gf: 29, ga: 10, btts: 6, o15: 14, o25: 8, o35: 2, cs: 8, fts: 1 }, away: { p: 15, w: 8, d: 4, l: 3, gf: 29, ga: 15, btts: 9, o15: 13, o25: 10, o35: 4, cs: 5, fts: 1 } },
    "Remo": { home: { p: 15, w: 3, d: 6, l: 6, gf: 19, ga: 20, btts: 10, o15: 12, o25: 6, o35: 4, cs: 2, fts: 3 }, away: { p: 15, w: 2, d: 4, l: 9, gf: 14, ga: 28, btts: 8, o15: 12, o25: 9, o35: 3, cs: 2, fts: 7 } },
    "Red Bull Bragantino": { home: { p: 15, w: 7, d: 3, l: 5, gf: 24, ga: 17, btts: 8, o15: 11, o25: 7, o35: 4, cs: 5, fts: 3 }, away: { p: 15, w: 4, d: 4, l: 7, gf: 14, ga: 18, btts: 8, o15: 12, o25: 5, o35: 0, cs: 3, fts: 4 } },
    "Corinthians": { home: { p: 15, w: 5, d: 3, l: 7, gf: 15, ga: 16, btts: 6, o15: 9, o25: 6, o35: 2, cs: 6, fts: 5 }, away: { p: 15, w: 3, d: 5, l: 7, gf: 16, ga: 22, btts: 11, o15: 12, o25: 8, o35: 4, cs: 4, fts: 2 } },
    "Vitória": { home: { p: 15, w: 10, d: 1, l: 4, gf: 22, ga: 12, btts: 3, o15: 10, o25: 5, o35: 4, cs: 10, fts: 3 }, away: { p: 15, w: 0, d: 5, l: 10, gf: 11, ga: 32, btts: 9, o15: 14, o25: 8, o35: 5, cs: 1, fts: 6 } },
  },
  "eliteserien": {
    "Bodø/Glimt": { home: { p: 11, w: 10, d: 0, l: 1, gf: 34, ga: 7, btts: 4, o15: 9, o25: 9, o35: 7, cs: 6, fts: 1 }, away: { p: 11, w: 7, d: 2, l: 2, gf: 22, ga: 13, btts: 6, o15: 11, o25: 8, o35: 3, cs: 4, fts: 1 } },
    "Viking": { home: { p: 10, w: 10, d: 0, l: 0, gf: 38, ga: 10, btts: 7, o15: 10, o25: 10, o35: 5, cs: 3, fts: 0 }, away: { p: 12, w: 7, d: 2, l: 3, gf: 18, ga: 10, btts: 7, o15: 10, o25: 6, o35: 0, cs: 4, fts: 1 } },
    "Fredrikstad": { home: { p: 11, w: 5, d: 3, l: 3, gf: 14, ga: 12, btts: 8, o15: 9, o25: 5, o35: 1, cs: 2, fts: 1 }, away: { p: 11, w: 3, d: 2, l: 6, gf: 12, ga: 21, btts: 6, o15: 9, o25: 6, o35: 5, cs: 1, fts: 4 } },
    "Sarpsborg 08": { home: { p: 10, w: 4, d: 3, l: 3, gf: 12, ga: 12, btts: 7, o15: 7, o25: 5, o35: 2, cs: 2, fts: 1 }, away: { p: 12, w: 3, d: 4, l: 5, gf: 16, ga: 19, btts: 7, o15: 9, o25: 7, o35: 4, cs: 3, fts: 4 } },
    "Rosenborg": { home: { p: 12, w: 7, d: 3, l: 2, gf: 28, ga: 14, btts: 7, o15: 12, o25: 8, o35: 5, cs: 4, fts: 1 }, away: { p: 10, w: 3, d: 1, l: 6, gf: 12, ga: 17, btts: 3, o15: 9, o25: 5, o35: 3, cs: 3, fts: 5 } },
    "Molde": { home: { p: 11, w: 7, d: 1, l: 3, gf: 24, ga: 13, btts: 7, o15: 9, o25: 7, o35: 4, cs: 3, fts: 1 }, away: { p: 11, w: 4, d: 3, l: 4, gf: 22, ga: 21, btts: 9, o15: 10, o25: 8, o35: 6, cs: 1, fts: 1 } },
    "Start": { home: { p: 11, w: 3, d: 3, l: 5, gf: 14, ga: 19, btts: 6, o15: 10, o25: 5, o35: 3, cs: 2, fts: 3 }, away: { p: 11, w: 1, d: 1, l: 9, gf: 10, ga: 29, btts: 7, o15: 11, o25: 8, o35: 3, cs: 0, fts: 4 } },
    "Sandefjord": { home: { p: 11, w: 3, d: 5, l: 3, gf: 10, ga: 10, btts: 3, o15: 7, o25: 3, o35: 1, cs: 5, fts: 5 }, away: { p: 11, w: 3, d: 1, l: 7, gf: 12, ga: 18, btts: 8, o15: 8, o25: 7, o35: 3, cs: 1, fts: 2 } },
    "Lillestrøm": { home: { p: 11, w: 5, d: 1, l: 5, gf: 19, ga: 17, btts: 7, o15: 11, o25: 8, o35: 5, cs: 2, fts: 2 }, away: { p: 11, w: 5, d: 2, l: 4, gf: 11, ga: 14, btts: 3, o15: 9, o25: 4, o35: 2, cs: 4, fts: 5 } },
    "Brann": { home: { p: 12, w: 6, d: 0, l: 6, gf: 20, ga: 18, btts: 9, o15: 11, o25: 10, o35: 3, cs: 1, fts: 2 }, away: { p: 10, w: 3, d: 2, l: 5, gf: 19, ga: 16, btts: 7, o15: 9, o25: 7, o35: 5, cs: 2, fts: 2 } },
    "Tromsø": { home: { p: 11, w: 7, d: 3, l: 1, gf: 21, ga: 9, btts: 3, o15: 9, o25: 5, o35: 5, cs: 7, fts: 3 }, away: { p: 11, w: 4, d: 3, l: 4, gf: 20, ga: 21, btts: 7, o15: 9, o25: 6, o35: 5, cs: 2, fts: 3 } },
    "KFUM Oslo": { home: { p: 12, w: 6, d: 2, l: 4, gf: 15, ga: 14, btts: 6, o15: 10, o25: 5, o35: 1, cs: 4, fts: 3 }, away: { p: 10, w: 2, d: 2, l: 6, gf: 12, ga: 22, btts: 7, o15: 9, o25: 8, o35: 6, cs: 1, fts: 2 } },
  },
  "super-lig": {
    "Erzurumspor": { home: { p: 3, w: 2, d: 0, l: 1, gf: 2, ga: 4, btts: 0, o15: 1, o25: 1, o35: 1, cs: 2, fts: 1 }, away: { p: 4, w: 0, d: 2, l: 2, gf: 1, ga: 7, btts: 1, o15: 3, o25: 2, o35: 0, cs: 1, fts: 3 } },
    "Eyüpspor": { home: { p: 4, w: 1, d: 0, l: 3, gf: 2, ga: 8, btts: 1, o15: 3, o25: 2, o35: 1, cs: 0, fts: 3 }, away: { p: 3, w: 0, d: 0, l: 3, gf: 0, ga: 12, btts: 0, o15: 2, o25: 2, o35: 1, cs: 0, fts: 3 } },
    "Amedspor": { home: { p: 4, w: 4, d: 0, l: 0, gf: 13, ga: 3, btts: 2, o15: 4, o25: 4, o35: 2, cs: 2, fts: 0 }, away: { p: 3, w: 0, d: 2, l: 1, gf: 4, ga: 6, btts: 2, o15: 3, o25: 2, o35: 2, cs: 0, fts: 1 } },
    "Konyaspor": { home: { p: 4, w: 1, d: 1, l: 2, gf: 2, ga: 3, btts: 1, o15: 1, o25: 1, o35: 0, cs: 2, fts: 2 }, away: { p: 3, w: 0, d: 1, l: 2, gf: 2, ga: 5, btts: 1, o15: 1, o25: 1, o35: 1, cs: 1, fts: 2 } },
    "Gençlerbirliği": { home: { p: 4, w: 1, d: 2, l: 1, gf: 6, ga: 6, btts: 4, o15: 4, o25: 3, o35: 1, cs: 0, fts: 0 }, away: { p: 3, w: 1, d: 0, l: 2, gf: 1, ga: 9, btts: 0, o15: 2, o25: 2, o35: 2, cs: 1, fts: 2 } },
    "Galatasaray": { home: { p: 4, w: 3, d: 1, l: 0, gf: 9, ga: 5, btts: 3, o15: 3, o25: 3, o35: 3, cs: 1, fts: 0 }, away: { p: 3, w: 2, d: 0, l: 1, gf: 7, ga: 6, btts: 1, o15: 3, o25: 3, o35: 3, cs: 1, fts: 1 } },
    "Fenerbahçe": { home: { p: 3, w: 2, d: 0, l: 1, gf: 13, ga: 4, btts: 2, o15: 3, o25: 3, o35: 2, cs: 1, fts: 0 }, away: { p: 4, w: 2, d: 1, l: 1, gf: 6, ga: 2, btts: 1, o15: 3, o25: 2, o35: 0, cs: 3, fts: 1 } },
    "Alanyaspor": { home: { p: 3, w: 1, d: 2, l: 0, gf: 3, ga: 2, btts: 1, o15: 1, o25: 1, o35: 1, cs: 2, fts: 1 }, away: { p: 4, w: 2, d: 1, l: 1, gf: 5, ga: 4, btts: 3, o15: 3, o25: 2, o35: 0, cs: 1, fts: 0 } },
    "Kasımpaşa": { home: { p: 3, w: 0, d: 3, l: 0, gf: 3, ga: 3, btts: 2, o15: 2, o25: 1, o35: 1, cs: 1, fts: 1 }, away: { p: 4, w: 2, d: 1, l: 1, gf: 5, ga: 5, btts: 3, o15: 3, o25: 2, o35: 1, cs: 1, fts: 0 } },
    "Samsunspor": { home: { p: 4, w: 0, d: 1, l: 3, gf: 4, ga: 13, btts: 2, o15: 4, o25: 3, o35: 2, cs: 0, fts: 2 }, away: { p: 3, w: 1, d: 0, l: 2, gf: 2, ga: 2, btts: 0, o15: 1, o25: 0, o35: 0, cs: 1, fts: 2 } },
    "Kocaelispor": { home: { p: 3, w: 3, d: 0, l: 0, gf: 5, ga: 0, btts: 0, o15: 2, o25: 0, o35: 0, cs: 3, fts: 0 }, away: { p: 4, w: 1, d: 0, l: 3, gf: 3, ga: 6, btts: 2, o15: 3, o25: 2, o35: 0, cs: 0, fts: 2 } },
    "Göztepe": { home: { p: 3, w: 0, d: 1, l: 2, gf: 4, ga: 7, btts: 2, o15: 2, o25: 2, o35: 2, cs: 0, fts: 1 }, away: { p: 4, w: 1, d: 2, l: 1, gf: 11, ga: 8, btts: 3, o15: 4, o25: 4, o35: 4, cs: 1, fts: 0 } },
    "İstanbul Başakşehir": { home: { p: 4, w: 2, d: 1, l: 1, gf: 9, ga: 4, btts: 2, o15: 4, o25: 2, o35: 2, cs: 2, fts: 0 }, away: { p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 7, btts: 1, o15: 2, o25: 2, o35: 1, cs: 1, fts: 2 } },
    "Gaziantep FK": { home: { p: 4, w: 0, d: 2, l: 2, gf: 2, ga: 6, btts: 2, o15: 3, o25: 2, o35: 0, cs: 1, fts: 2 }, away: { p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 4, btts: 1, o15: 2, o25: 1, o35: 1, cs: 1, fts: 1 } },
    "Trabzonspor": { home: { p: 3, w: 3, d: 0, l: 0, gf: 11, ga: 1, btts: 1, o15: 3, o25: 3, o35: 2, cs: 2, fts: 0 }, away: { p: 4, w: 1, d: 1, l: 2, gf: 5, ga: 4, btts: 2, o15: 3, o25: 2, o35: 0, cs: 1, fts: 1 } },
    "Beşiktaş": { home: { p: 4, w: 4, d: 0, l: 0, gf: 12, ga: 3, btts: 2, o15: 3, o25: 3, o35: 1, cs: 2, fts: 0 }, away: { p: 3, w: 1, d: 0, l: 2, gf: 4, ga: 5, btts: 2, o15: 2, o25: 2, o35: 1, cs: 0, fts: 1 } },
  },
} as const satisfies Record<string, Record<string, Entry>>;

export type EspnSplitLeague = keyof typeof espnVenueSplits;

const competitions: Record<EspnSplitLeague, { name: string; season: string }> = {
  "brasileirao-serie-a": { name: "Brasileirão Série A", season: "2026" },
  eliteserien: { name: "Eliteserien", season: "2026" },
  eredivisie: { name: "Eredivisie", season: "2026/27" },
  "super-lig": { name: "Süper Lig", season: "2026/27" },
};

const pct = (n: number, p: number) => `${Math.round((100 * n) / p)}%`;
const per = (n: number, p: number) => (n / p).toFixed(2);

export function espnVenueSplitCore(league: EspnSplitLeague, home: string, away: string): ImportStatisticalCore {
  const table = espnVenueSplits[league] as Record<string, Entry>;
  const meta = competitions[league];
  const h = table[home]?.home;
  const a = table[away]?.away;
  if (!h || !a) {
    return {
      kind: "disclosure",
      note: `A reliable HOME split for ${home} and AWAY split for ${away} in the ${meta.season} ${meta.name} could not be reconciled with the official league table, so those venue metrics remain unavailable rather than approximated. Expected-goals, shots, possession and corner metrics were also unavailable from the sources used and have not been estimated.`,
    };
  }
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
  const source = "ESPN, completed league results through 13 October 2026 (site.api.espn.com)";
  return {
    kind: "rows",
    introLine: `Statistical coverage is partial. The table covers ${home}'s ${h.p} home ${meta.name} games and ${away}'s ${a.p} away ${meta.name} games of ${meta.season}, computed from completed results and checked against the league table. Samples of this size describe a handful of matches rather than a settled trend. Expected goals, shots, possession and corner data were not available from the sources used, so those target metrics are left out rather than estimated.`,
    rows,
    provenance: { season: meta.season, competition: meta.name, homeSource: `${source} (HOME games)`, awaySource: `${source} (AWAY games)`, homeMatches: h.p, awayMatches: a.p },
  };
}
