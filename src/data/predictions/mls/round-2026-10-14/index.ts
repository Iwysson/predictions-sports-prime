import { createPspImport26Prediction, type ImportStatisticalCore } from "../../editorial-tools/psp-import-26/factory";

// Source: PSP 37-analyses consolidated publication package (11 October 2026). Predictions, odds
// and FREE/BEST BET/PRIME VIP labels are taken from the package unchanged.
// Matchday-eve editorial refresh (13 October 2026): venues, current form, availability, projected
// lineups and a partial HOME/AWAY Statistical Core were added around the unchanged selections.
const common = {
  league: "mls" as const,
  competition: "Major League Soccer — 2026 Regular Season",
  round: "Regular season",
  publishedAt: "2026-10-11T12:00:00.000-03:00",
};
const refreshedAt = "2026-10-13T08:30:00.000-03:00";
const oddsSource = "Editor-supplied PSP 37-analyses publication package (11 October 2026)";

// Venue-split counts come from the 2026 MLS regular-season results grid (home team in the row,
// away team in the column) published at the URL below, through 12 October 2026. For each team the
// HOME counts cover its home league games and the AWAY counts its away league games. The grid's
// totals were reconciled against the published standings for every club; the only inconsistency
// (one 3-1 St. Louis home win listed under New England instead of New York Red Bulls) was
// corrected so that both clubs' totals match the standings exactly.
const gridUrl = "https://en.wikipedia.org/wiki/2026_Major_League_Soccer_season";
const availabilityUrl = "https://www.mlssoccer.com/league-reports/player-availability-report/";

type Split = { p: number; w: number; d: number; l: number; gf: number; ga: number; btts: number; o15: number; o25: number; o35: number; cs: number; fts: number };

const homeSplits: Record<string, Split> = {
  "CF Montréal": { p: 14, w: 4, d: 5, l: 5, gf: 19, ga: 18, btts: 8, o15: 11, o25: 7, o35: 5, cs: 3, fts: 4 },
  "Atlanta United FC": { p: 14, w: 4, d: 2, l: 8, gf: 20, ga: 26, btts: 11, o15: 13, o25: 11, o35: 7, cs: 1, fts: 3 },
  "Chicago Fire FC": { p: 14, w: 9, d: 1, l: 4, gf: 27, ga: 16, btts: 10, o15: 12, o25: 11, o35: 4, cs: 4, fts: 0 },
  "Philadelphia Union": { p: 14, w: 7, d: 4, l: 3, gf: 25, ga: 14, btts: 8, o15: 10, o25: 8, o35: 5, cs: 5, fts: 3 },
  "Colorado Rapids": { p: 14, w: 9, d: 2, l: 3, gf: 26, ga: 13, btts: 6, o15: 8, o25: 5, o35: 4, cs: 7, fts: 1 },
  "Minnesota United FC": { p: 14, w: 2, d: 7, l: 5, gf: 16, ga: 18, btts: 8, o15: 9, o25: 6, o35: 4, cs: 4, fts: 4 },
  "Columbus Crew": { p: 14, w: 6, d: 2, l: 6, gf: 19, ga: 16, btts: 8, o15: 11, o25: 8, o35: 2, cs: 4, fts: 3 },
  "Charlotte FC": { p: 15, w: 8, d: 4, l: 3, gf: 29, ga: 16, btts: 10, o15: 10, o25: 10, o35: 8, cs: 3, fts: 4 },
  "D.C. United": { p: 14, w: 4, d: 5, l: 5, gf: 18, ga: 25, btts: 9, o15: 11, o25: 10, o35: 5, cs: 3, fts: 4 },
  "New York Red Bulls": { p: 14, w: 5, d: 3, l: 6, gf: 22, ga: 27, btts: 8, o15: 12, o25: 8, o35: 6, cs: 1, fts: 5 },
  "FC Cincinnati": { p: 12, w: 7, d: 3, l: 2, gf: 34, ga: 24, btts: 9, o15: 11, o25: 8, o35: 7, cs: 2, fts: 1 },
  "New England Revolution": { p: 14, w: 9, d: 2, l: 3, gf: 26, ga: 16, btts: 7, o15: 11, o25: 9, o35: 3, cs: 4, fts: 4 },
  "FC Dallas": { p: 13, w: 6, d: 5, l: 2, gf: 25, ga: 20, btts: 9, o15: 9, o25: 8, o35: 7, cs: 3, fts: 3 },
  "Seattle Sounders FC": { p: 14, w: 7, d: 3, l: 4, gf: 23, ga: 20, btts: 9, o15: 13, o25: 8, o35: 5, cs: 3, fts: 3 },
  "Inter Miami CF": { p: 14, w: 5, d: 7, l: 2, gf: 39, ga: 26, btts: 12, o15: 14, o25: 12, o35: 11, cs: 2, fts: 0 },
  "New York City FC": { p: 14, w: 4, d: 4, l: 6, gf: 26, ga: 21, btts: 9, o15: 12, o25: 9, o35: 6, cs: 3, fts: 3 },
  "LA Galaxy": { p: 14, w: 5, d: 5, l: 4, gf: 18, ga: 18, btts: 10, o15: 12, o25: 8, o35: 2, cs: 3, fts: 2 },
  "Portland Timbers": { p: 14, w: 7, d: 3, l: 4, gf: 31, ga: 25, btts: 12, o15: 13, o25: 12, o35: 8, cs: 1, fts: 1 },
  "Los Angeles FC": { p: 14, w: 8, d: 3, l: 3, gf: 26, ga: 12, btts: 5, o15: 10, o25: 6, o35: 5, cs: 8, fts: 2 },
  "Austin FC": { p: 14, w: 4, d: 6, l: 4, gf: 20, ga: 19, btts: 10, o15: 12, o25: 7, o35: 4, cs: 4, fts: 1 },
  "Nashville SC": { p: 14, w: 13, d: 1, l: 0, gf: 41, ga: 12, btts: 8, o15: 12, o25: 11, o35: 9, cs: 6, fts: 0 },
  "Sporting Kansas City": { p: 14, w: 3, d: 4, l: 7, gf: 21, ga: 29, btts: 11, o15: 13, o25: 10, o35: 7, cs: 0, fts: 3 },
  "Real Salt Lake": { p: 14, w: 8, d: 2, l: 4, gf: 27, ga: 20, btts: 8, o15: 14, o25: 10, o35: 4, cs: 3, fts: 3 },
  "San Jose Earthquakes": { p: 14, w: 6, d: 3, l: 5, gf: 25, ga: 22, btts: 8, o15: 12, o25: 9, o35: 7, cs: 4, fts: 2 },
  "San Diego FC": { p: 14, w: 6, d: 3, l: 5, gf: 32, ga: 24, btts: 8, o15: 13, o25: 12, o35: 9, cs: 5, fts: 1 },
  "Houston Dynamo FC": { p: 14, w: 8, d: 3, l: 3, gf: 17, ga: 12, btts: 5, o15: 8, o25: 5, o35: 2, cs: 6, fts: 4 },
  "St. Louis City SC": { p: 14, w: 9, d: 3, l: 2, gf: 34, ga: 19, btts: 11, o15: 12, o25: 10, o35: 7, cs: 2, fts: 1 },
  "Vancouver Whitecaps FC": { p: 15, w: 9, d: 2, l: 4, gf: 35, ga: 14, btts: 6, o15: 12, o25: 10, o35: 6, cs: 7, fts: 2 },
  "Toronto FC": { p: 15, w: 5, d: 8, l: 2, gf: 31, ga: 29, btts: 15, o15: 15, o25: 11, o35: 6, cs: 0, fts: 0 },
  "Orlando City SC": { p: 14, w: 8, d: 2, l: 4, gf: 26, ga: 19, btts: 10, o15: 11, o25: 9, o35: 4, cs: 3, fts: 1 },
};
const awaySplits: Record<string, Split> = {
  "CF Montréal": { p: 14, w: 2, d: 1, l: 11, gf: 16, ga: 38, btts: 7, o15: 12, o25: 11, o35: 5, cs: 1, fts: 6 },
  "Atlanta United FC": { p: 14, w: 3, d: 4, l: 7, gf: 13, ga: 22, btts: 7, o15: 10, o25: 6, o35: 4, cs: 2, fts: 6 },
  "Chicago Fire FC": { p: 14, w: 5, d: 5, l: 4, gf: 24, ga: 24, btts: 10, o15: 12, o25: 10, o35: 6, cs: 3, fts: 2 },
  "Philadelphia Union": { p: 14, w: 5, d: 2, l: 7, gf: 31, ga: 31, btts: 11, o15: 13, o25: 11, o35: 8, cs: 1, fts: 2 },
  "Colorado Rapids": { p: 14, w: 2, d: 2, l: 10, gf: 13, ga: 26, btts: 7, o15: 10, o25: 8, o35: 5, cs: 2, fts: 6 },
  "Minnesota United FC": { p: 14, w: 5, d: 2, l: 7, gf: 26, ga: 33, btts: 12, o15: 13, o25: 12, o35: 8, cs: 1, fts: 1 },
  "Columbus Crew": { p: 14, w: 2, d: 3, l: 9, gf: 22, ga: 30, btts: 12, o15: 14, o25: 12, o35: 8, cs: 1, fts: 1 },
  "Charlotte FC": { p: 13, w: 5, d: 3, l: 5, gf: 21, ga: 24, btts: 9, o15: 12, o25: 9, o35: 4, cs: 2, fts: 2 },
  "D.C. United": { p: 13, w: 2, d: 7, l: 4, gf: 16, ga: 21, btts: 7, o15: 9, o25: 6, o35: 5, cs: 3, fts: 5 },
  "New York Red Bulls": { p: 14, w: 5, d: 3, l: 6, gf: 16, ga: 25, btts: 9, o15: 11, o25: 8, o35: 5, cs: 3, fts: 3 },
  "FC Cincinnati": { p: 15, w: 2, d: 6, l: 7, gf: 24, ga: 41, btts: 12, o15: 14, o25: 12, o35: 11, cs: 0, fts: 3 },
  "New England Revolution": { p: 14, w: 5, d: 2, l: 7, gf: 19, ga: 23, btts: 10, o15: 12, o25: 11, o35: 4, cs: 1, fts: 3 },
  "FC Dallas": { p: 15, w: 7, d: 3, l: 5, gf: 27, ga: 25, btts: 9, o15: 12, o25: 11, o35: 7, cs: 3, fts: 4 },
  "Seattle Sounders FC": { p: 14, w: 4, d: 5, l: 5, gf: 15, ga: 15, btts: 7, o15: 8, o25: 5, o35: 2, cs: 5, fts: 3 },
  "Inter Miami CF": { p: 14, w: 8, d: 3, l: 3, gf: 29, ga: 24, btts: 10, o15: 12, o25: 10, o35: 7, cs: 3, fts: 2 },
  "New York City FC": { p: 14, w: 4, d: 5, l: 5, gf: 16, ga: 17, btts: 10, o15: 12, o25: 6, o35: 1, cs: 2, fts: 2 },
  "LA Galaxy": { p: 15, w: 4, d: 4, l: 7, gf: 21, ga: 32, btts: 12, o15: 14, o25: 11, o35: 7, cs: 1, fts: 2 },
  "Portland Timbers": { p: 14, w: 2, d: 3, l: 9, gf: 20, ga: 29, btts: 10, o15: 14, o25: 9, o35: 6, cs: 0, fts: 4 },
  "Los Angeles FC": { p: 15, w: 3, d: 6, l: 6, gf: 18, ga: 19, btts: 8, o15: 10, o25: 8, o35: 5, cs: 5, fts: 4 },
  "Austin FC": { p: 14, w: 3, d: 4, l: 7, gf: 16, ga: 32, btts: 9, o15: 12, o25: 12, o35: 6, cs: 1, fts: 5 },
  "Nashville SC": { p: 14, w: 6, d: 5, l: 3, gf: 18, ga: 10, btts: 5, o15: 7, o25: 6, o35: 3, cs: 7, fts: 5 },
  "Sporting Kansas City": { p: 14, w: 3, d: 0, l: 11, gf: 14, ga: 39, btts: 7, o15: 14, o25: 12, o35: 6, cs: 1, fts: 6 },
  "Real Salt Lake": { p: 14, w: 1, d: 3, l: 10, gf: 14, ga: 26, btts: 11, o15: 12, o25: 9, o35: 4, cs: 0, fts: 3 },
  "San Jose Earthquakes": { p: 14, w: 7, d: 4, l: 3, gf: 25, ga: 18, btts: 10, o15: 10, o25: 7, o35: 7, cs: 3, fts: 2 },
  "San Diego FC": { p: 14, w: 2, d: 5, l: 7, gf: 16, ga: 27, btts: 8, o15: 9, o25: 7, o35: 6, cs: 2, fts: 4 },
  "Houston Dynamo FC": { p: 14, w: 5, d: 3, l: 6, gf: 19, ga: 22, btts: 6, o15: 10, o25: 6, o35: 4, cs: 5, fts: 4 },
  "St. Louis City SC": { p: 14, w: 5, d: 5, l: 4, gf: 20, ga: 19, btts: 9, o15: 13, o25: 6, o35: 5, cs: 2, fts: 3 },
  "Vancouver Whitecaps FC": { p: 13, w: 6, d: 4, l: 3, gf: 26, ga: 16, btts: 8, o15: 11, o25: 7, o35: 5, cs: 4, fts: 2 },
  "Toronto FC": { p: 13, w: 2, d: 3, l: 8, gf: 10, ga: 23, btts: 7, o15: 10, o25: 8, o35: 3, cs: 3, fts: 5 },
  "Orlando City SC": { p: 14, w: 3, d: 2, l: 9, gf: 25, ga: 47, btts: 9, o15: 14, o25: 12, o35: 12, cs: 1, fts: 4 },
};

const pct = (n: number, p: number) => `${Math.round((100 * n) / p)}%`;
const per = (n: number, p: number) => (n / p).toFixed(2);
const correctedGridTeams = new Set(["New England Revolution", "New York Red Bulls"]);

function mlsCore(home: string, away: string): ImportStatisticalCore {
  const h = homeSplits[home];
  const a = awaySplits[away];
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
  const correction = correctedGridTeams.has(home) || correctedGridTeams.has(away)
    ? " One misfiled result in the published grid was corrected so that the club's totals match the league standings."
    : "";
  return {
    kind: "rows",
    introLine: `Statistical coverage is partial. The table covers ${home}'s ${h.p} home league games and ${away}'s ${a.p} away league games in the 2026 regular season, computed from published scorelines through 12 October. Expected goals, shots, possession and corner data were not available from the sources used, so those target metrics are left out rather than estimated.${correction}`,
    rows,
    provenance: {
      season: "2026",
      competition: "Major League Soccer",
      homeSource: `Wikipedia, 2026 Major League Soccer season, regular-season results grid (HOME games) ${gridUrl}`,
      awaySource: `Wikipedia, 2026 Major League Soccer season, regular-season results grid (AWAY games) ${gridUrl}`,
      homeMatches: h.p,
      awayMatches: a.p,
    },
  };
}

type MlsInput = {
  slug: string;
  home: string;
  away: string;
  venue: string;
  locality: string;
  country?: string;
  pick: string;
  odds: number;
  access: "free" | "vip";
  best?: boolean;
  teaser: string;
  trend: string;
  matchAnalysis: string[];
  tactical: string;
  risk: string;
  market: string;
  conclusion: string;
  teamNews: string;
  squawkaUrl: string;
};

function mls(input: MlsInput) {
  return createPspImport26Prediction({
    ...common,
    slug: input.slug,
    home: input.home,
    away: input.away,
    date: "2026-10-14",
    time: "19:30",
    venue: input.venue,
    venueAddress: { addressLocality: input.locality, addressCountry: input.country ?? "United States" },
    pick: input.pick,
    odds: input.odds,
    access: input.access,
    bestAnalysis: input.best,
    teaser: input.teaser,
    trend: input.trend,
    matchAnalysis: input.matchAnalysis,
    tactical: input.tactical,
    risk: input.risk,
    market: input.market,
    conclusion: input.conclusion,
    teamNews: input.teamNews,
    core: mlsCore(input.home, input.away),
    sources: [
      { name: "Wikipedia — 2026 Major League Soccer season (standings, results grid, head coaches)", url: gridUrl },
      { name: "MLS — Player Availability Report (updated through Matchday 29)", url: availabilityUrl },
      { name: `Squawka — ${input.home} vs ${input.away} MLS preview (13 October 2026)`, url: input.squawkaUrl },
    ],
    oddsSource,
    updatedAt: refreshedAt,
  });
}

const newsIntro = (fixture: string) => `${fixture} follows the league's Player Availability Report, the latest version available on 13 October 2026 (updated through Matchday 29), and Squawka's preview published the same day. Both lineups are PROJECTED; the official lineups arrive about an hour before the 7:30 p.m. local kick-off.`;

export const mlsRound2026_10_14 = [
  mls({
    slug: "cf-montreal-vs-atlanta-united-fc",
    home: "CF Montréal",
    away: "Atlanta United FC",
    venue: "Stade Saputo",
    locality: "Montréal",
    country: "Canada",
    pick: "Over 2.5 Total Goals",
    odds: 1.59,
    access: "vip",
    teaser: "Two bottom-three Eastern Conference sides meet at Stade Saputo, with Montréal in a deep slump and Atlanta short of goals on the road. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Montréal's slump meets Atlanta's road struggles at the foot of the East",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-cf-montreal-vs-atlanta-united-10-14-26-mls/",
    matchAnalysis: [
      "CF Montréal are 15th in the East on **24 points** from 28 games and have lost four of their last five, the latest a 2–1 defeat at Toronto on Saturday after a stoppage-time collapse. The home split is closer to level than the table suggests, with four wins, five draws and five defeats at Stade Saputo and 19 goals scored against 18 conceded in 14 games. Interim coach Philippe Eullaffroy has Prince Osei Owusu, who has scored 15 goals from 69 shots, and Matthew Longstaff creating through midfield, but Brayan Ceballos, Bode Hidalgo and Thomas Gillier are listed out.",
      "Atlanta United are 14th on 27 points and arrive after a 3–1 home defeat to Cincinnati. Away from Atlanta they have won three, drawn four and lost seven, scoring **13 goals and conceding 22** in 14 games, and they have failed to score in six of those trips. Gerardo Martino's side still has Aleksey Miranchuk, who has six goals and 46 chances created, and Miguel Almirón, with only Will Reilly (ankle) listed out. Blending the two venue splits points to roughly 2.6 goals, right at the line, so the pick leans on two leaky defences rather than on scoring volume.",
    ],
    tactical: "Squawka projects a 3-4-2-1 for Montréal with Owusu as the lone striker, against an Atlanta 4-3-3 built around Embolo, Almirón and Fortune in the front line. A back three leaves room in the channels for Atlanta's wide forwards on the break, while Atlanta's midfield of Muyumba, Amaro and Galoppo will try to keep the ball away from a team scoring 1.36 goals per home game. A first-half Montréal goal would force Atlanta, who have failed to score in six of 14 away games, to chase the match, whereas a goalless first half leaves a low-event game in which both sides could settle for a point.",
    risk: "The venue splits cut against the over. Montréal's home games have reached three goals half of the time, Atlanta's road games only 43% of the time, and Atlanta's 0.93 goals per away game makes a 1–0 or 1–1 a very live result between two teams short of form. Montréal's interim-coach set-up and the three absentees add uncertainty rather than direction.",
    market: "The market price of **1.59** corresponds to a raw implied probability of **62.89%** (1 / 1.59). The home and away over-2.5 frequencies of **50%** and **43%** both sit below that figure, so the price asks for more than either side's recent pattern delivers. The case is one of defensive exposure, with Montréal conceding 1.29 and Atlanta 1.57 per game in these splits, and it is a value call that depends on that weakness turning into goals on the night.",
    conclusion: "This is a thin call: both defences give goals away, but neither attack travels or finishes consistently, and the opening goal will shape the night. The confirmed lineups, particularly Owusu's fitness for Montréal and whether Almirón starts for Atlanta, are worth checking before kick-off. Over 2.5 total goals at 1.59 therefore stands.",
    teamNews: `${newsIntro("Team news for CF Montréal against Atlanta United FC")}

**CF Montréal**
- **Out:** Brayan Ceballos (lower body), Bode Hidalgo (lower body) and Thomas Gillier (upper body).
- Interim coach Philippe Eullaffroy has been in charge since April. No suspensions were reported.

**Atlanta United**
- **Out:** Will Reilly (ankle). No other absences or suspensions were reported.

**PROJECTED CF Montréal (3-4-2-1):** Breza; Vera, Craig, Neal; Petrasso, Longstaff, Loturi, Bugaj; Sanchez, Rios; Owusu.

**PROJECTED Atlanta United (4-3-3):** Hoyos; Baez, Alonso, Mihaj, Jacob; Muyumba, Amaro, Galoppo; Fortune, Embolo, Almirón.`,
  }),

  mls({
    slug: "chicago-fire-fc-vs-philadelphia-union",
    home: "Chicago Fire FC",
    away: "Philadelphia Union",
    venue: "Soldier Field",
    locality: "Chicago, Illinois",
    pick: "Chicago Fire FC or Draw (1X)",
    odds: 1.51,
    access: "vip",
    teaser: "Chicago's home record is among the best in the East, but Philadelphia arrive on a five-game winning run that has produced 20 goals. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Chicago's home record against Philadelphia's five-match winning run",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-chicago-fire-vs-philadelphia-union-10-14-26-mls/",
    matchAnalysis: [
      "Chicago Fire are third in the East on **48 points** and Soldier Field has supplied most of them: nine wins, one draw and four defeats at home, 27 goals scored and 16 conceded, **2.00 points per game**. They have won their last three, 2–1 against NYCFC on Saturday, 3–1 against Vancouver on 7 October and 1–0 at Charlotte, after consecutive defeats to New England and Nashville. Gregg Berhalter's side relies on Maren Haile-Selassie, with 10 goals, and Philip Zinckernagel, who has created 60 chances, though André Franco and Robin Lod are out and Anzor Mekvabishvili and Sam Rogers are questionable.",
      "Philadelphia have won five in a row and scored 20 goals doing it, with 5–0 wins over Cincinnati and at San Diego, a 4–3 win at Sporting Kansas City, a 4–2 win over Orlando and a 2–1 win over Real Salt Lake on Sunday. Under interim coach Ryan Richter they sit sixth on 42 points, with Milan Iloski on 17 goals from 105 shots and Cavan Sullivan on seven, and only Agustin Anello (adductor) is listed out. The road split is the issue for a team on this run: five wins, two draws and seven defeats away from home, 31 goals scored and 31 conceded, and one clean sheet in 14. That openness is why Chicago's home record, rather than the visitors' streak, anchors the double chance.",
    ],
    tactical: "Squawka projects a 4-4-2 for both teams, so the contest sits in the wide midfield areas and between the two strike partnerships. Chicago will look to Zinckernagel's passing from midfield to release Haile-Selassie, and at Soldier Field the hosts score 1.93 goals per game. Philadelphia's counter-attacking pace through Iloski and Sullivan is what Chicago have to manage, because the visitors have scored in 12 of 14 away games. An early Chicago goal would force Philadelphia to open up, which suits a side that concedes 2.21 per away game, while a Philadelphia goal first would test the home composure that has produced four home clean sheets.",
    risk: "Philadelphia's form is the real contrary signal to the home record: they scored at least two in each of the five wins and their road games see both teams scoring 79% of the time. A Philadelphia win would defeat the selection, and Chicago have conceded in each of their last two home matches. The draw cover matters in a game likely to be decided by a single goal.",
    market: "At **1.51** the double chance carries a raw implied probability of **66.23%** (1 / 1.51). Chicago's home points rate of 2.00 and Philadelphia's road rate of 1.21 per game explain a price in that range, while the visitors' current run argues for caution. The value is therefore at the margin: Chicago have avoided defeat in 10 of 14 home games, which is 71%, a little above the implied figure.",
    conclusion: "Chicago's home record is the strongest argument in a fixture where Philadelphia's form makes a simple home win less secure, and the double chance keeps the draw available. The late fitness news on Mekvabishvili and Rogers is worth a look before kick-off. On balance, Chicago Fire FC or Draw (1X) at 1.51 still reads as the better side of the argument.",
    teamNews: `${newsIntro("Team news for Chicago Fire FC against Philadelphia Union")}

**Chicago Fire FC**
- **Out:** André Franco (lower body) and Robin Lod (lower body).
- **Questionable:** Anzor Mekvabishvili (lower body) and Sam Rogers (lower body).
- No suspensions were reported.

**Philadelphia Union**
- **Out:** Agustin Anello (adductor). Interim coach Ryan Richter has been in charge since May.
- No other absences or suspensions were reported.

**PROJECTED Chicago Fire FC (4-4-2):** Brady; Barroso, Mbokazi, Elliott, Dean; Bamba, D'Avilla, Saletros, Zinckernagel; Haile-Selassie, Lewandowski.

**PROJECTED Philadelphia Union (4-4-2):** Blake; Wagner, Harriel, Pierre, Westfield; Vassilev, Lukic, Jean Jacques, Sullivan; Damiani, Iloski.`,
  }),

  mls({
    slug: "colorado-rapids-vs-minnesota-united-fc",
    home: "Colorado Rapids",
    away: "Minnesota United FC",
    venue: "Dick's Sporting Goods Park",
    locality: "Commerce City, Colorado",
    pick: "Colorado Rapids or Draw (1X) + Over 1.5 Total Goals",
    odds: 1.66,
    access: "vip",
    teaser: "Colorado have been one of the strongest home sides in the West, while Minnesota arrive on a four-game losing run with a leaky road record. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Colorado's home record against Minnesota's open road form",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-colorado-rapids-vs-minnesota-united-10-14-26-mls/",
    matchAnalysis: [
      "Colorado Rapids are eighth in the West on **37 points** and their home split is the foundation of the pick: nine wins, two draws and three defeats at Dick's Sporting Goods Park, 26 goals scored and 13 conceded, **2.07 points per game**, with seven clean sheets in 14. The same record carries a warning for the goals leg, because only eight of those 14 home games reached two goals. Matt Wells's side drew 1–1 with San Jose on Sunday and lost 3–2 at LA Galaxy on 27 September. Goalkeeper Zack Steffen (shoulder), Ali Fadal and Youssef Maziz are out, Ted Ku-DiPietro is questionable, and Paxten Aaronson (seven goals, 53 chances created) drives the attack.",
      "Minnesota United are 14th on 30 points and lost four straight league games before a 2–2 draw with Houston on Sunday. Their road split is open at both ends: five wins, two draws and seven defeats away from home, 26 goals scored and 33 conceded, and 13 of 14 away games have produced at least two goals. Cameron Knowles's side relies on Kelvin Yeboah, with 15 goals, while Joaquín Pereyra, Alec Smir and Peter Stroud are out. A road team that concedes 2.36 per game and scores 1.86 is the best argument for the second half of this combination.",
    ],
    tactical: "Colorado's projected 4-3-3 centres on Aaronson's creativity from midfield and Donavan Phillip's width, while Minnesota's projected 3-4-3 leaves Yeboah and his partners stretched against a home defence that concedes 0.93 per game. Minnesota's back three can be pulled apart by Colorado's wide runners, and if the hosts score first the visitors have to chase with a defence that has already conceded 33 away goals. A Colorado goal in the opening half makes the Over 1.5 almost a formality, whereas a cagey 1–0 home win, the one scoreline that satisfies the result leg but not the goals leg, is the outcome to guard against.",
    risk: "The combination fails in two ways. A Minnesota win ends it, and Yeboah's finishing keeps that possible, and a 0–0 draw or a 1–0 Colorado win leaves the goals line short, which has happened in six of Colorado's 14 home games. With Steffen out, the change in goal adds a small variable to an otherwise settled home side.",
    market: "Dividing one by the **1.66** price gives a raw implied probability of **60.24%** (1 / 1.66) for the combination. Colorado have avoided defeat in 11 of 14 home games (79%), and Minnesota's away games average 4.2 goals, so each leg is individually well supported. Their combination is less certain than either part, and the value lies mainly in the visitors' defensive record.",
    conclusion: "Colorado's home form and Minnesota's open road games make this a reasoned combination, with the main danger a tight home win or a rare Minnesota victory. Steffen's replacement in goal and Ku-DiPietro's fitness are worth confirming before kick-off. That keeps Colorado Rapids or Draw (1X) plus over 1.5 total goals at 1.66 as the position.",
    teamNews: `${newsIntro("Team news for Colorado Rapids against Minnesota United FC")} The kick-off is 7:30 p.m. Mountain time (9:30 p.m. Eastern).

**Colorado Rapids**
- **Out:** Zack Steffen (shoulder), Ali Fadal (torso) and Youssef Maziz (leg).
- **Questionable:** Ted Ku-DiPietro (shoulder).
- No suspensions were reported.

**Minnesota United FC**
- **Out:** Joaquín Pereyra, Alec Smir and Peter Stroud (all lower extremity).
- No suspensions were reported.

**PROJECTED Colorado Rapids (4-3-3):** Hansen; Navarro, Williams, Holding, Cannon; Frederick, Whittaker, Atencio; Aaronson, Abu Farhi, Phillip.

**PROJECTED Minnesota United FC (3-4-3):** Callender; Duggan, Boxall, Valerius; Markanich, Trapp, Gene, Hlongwane; Chancalay, Yeboah, Jackson.`,
  }),

  mls({
    slug: "columbus-crew-vs-charlotte-fc",
    home: "Columbus Crew",
    away: "Charlotte FC",
    venue: "ScottsMiracle-Gro Field",
    locality: "Columbus, Ohio",
    pick: "Charlotte FC or Draw (X2)",
    odds: 1.79,
    access: "vip",
    teaser: "Charlotte have 17 more points than Columbus, yet their road form is much closer to the hosts' home form than the table suggests. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "A 17-point table gap against almost identical venue splits",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-columbus-crew-vs-charlotte-fc-10-14-26-mls/",
    matchAnalysis: [
      "Columbus Crew are 13th in the East on **29 points**, under interim coach Laurent Courtois since May, and arrive after a 3–2 defeat at Orlando City on Sunday. Their home split is modest, with six wins, two draws and six defeats at ScottsMiracle-Gro Field, 19 goals scored and 16 conceded, **1.43 points per game**. Wessam Abou Ali (knee) is the one player listed out, and Brais Méndez, who has four goals in 832 minutes, and Taha Habroune, who has created 43 chances, carry the creative load for a side that has conceded in its recent defeats to Orlando and the Red Bulls.",
      "Charlotte FC are fifth on **46 points** after a 3–2 win over FC Dallas, with Pep Biel on 12 goals and 52 chances created and Liel Abada adding five. The table gap overstates the difference in venue terms, because their road split is five wins, three draws and five defeats from 13 games, 1.38 points per game, against Columbus's 1.43 at home. Charlotte have also conceded 24 in those 13 trips, and Dean Smith's side are missing Nimfasha Berchimas, Archie Goodwin and Aron John. That makes the double chance a reasoned price for the better side rather than an easy pick for a visiting win.",
    ],
    tactical: "Columbus's projected 3-5-2 pairs Josef Martínez with Méndez up front and uses Habroune and Chambost in midfield, while Charlotte's 4-2-3-1 asks Bronico and Westwood to screen behind Biel, with Abada on one flank. The duel is the space between Charlotte's two holding midfielders and their centre-backs, where Habroune and Méndez will look to receive. If Charlotte score first, Columbus's three-man defence, which has conceded in recent defeats, may be stretched, but Charlotte's own road games have produced both teams scoring 69% of the time, so a lead is rarely safe.",
    risk: "The selection fails if Columbus win, and their home form is not weak enough to rule that out: they have lost six of 14 at home but also kept four clean sheets. Charlotte's away record of 24 goals conceded in 13 matches, and the fact that the venue splits of the two teams are almost identical, mean the visitors should not be treated as a clear favourite.",
    market: "The double chance at **1.79** has a raw implied probability of **55.87%** (1 / 1.79). Charlotte have avoided defeat in eight of 13 away games (62%), and the gap in overall points explains why the market treats them as the stronger side. The value is modest, as the price is a little below that frequency and the table gap is wider than the venue form.",
    conclusion: "Charlotte are the better team overall, but the venue splits are closer than the table, which is why the double chance is preferable to backing the visitors to win. The injury and lineup news on Biel and the Crew's attack is worth checking before kick-off. The selection therefore remains Charlotte FC or Draw (X2) at 1.79.",
    teamNews: `${newsIntro("Team news for Columbus Crew against Charlotte FC")}

**Columbus Crew**
- **Out:** Wessam Abou Ali (knee). Interim coach Laurent Courtois has been in charge since May.
- No suspensions were reported.

**Charlotte FC**
- **Out:** Nimfasha Berchimas (lower body), Archie Goodwin (lower body) and Aron John (upper body).
- No suspensions were reported.

**PROJECTED Columbus Crew (3-5-2):** Schulte; Amundsen, Zawadzki, Moreira; Zaroury, Rodriguez, Habroune, Chambost, Farsi; Josef Martínez, Méndez.

**PROJECTED Charlotte FC (4-2-3-1):** Kahlina; Schnegg, Kessler, Agyemang, Byrne; Bronico, Westwood; Saint-Maximin, Biel, Abada; Toklomati.`,
  }),

  mls({
    slug: "d-c-united-vs-new-york-red-bulls",
    home: "D.C. United",
    away: "New York Red Bulls",
    venue: "Audi Field",
    locality: "Washington, D.C.",
    pick: "Over 2.5 Total Goals",
    odds: 1.5,
    access: "vip",
    teaser: "D.C. United and the Red Bulls drew 4–4 in April, and both sides have been involved in lopsided scorelines since. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "A 4–4 draw in April frames a meeting of volatile sides",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-dc-united-vs-new-york-red-bulls-10-14-26-mls/",
    matchAnalysis: [
      "D.C. United are 12th in the East on **30 points** with a goal difference of −12, and they arrive after a 4–0 defeat at Inter Miami that followed a 3–3 draw at Vancouver. René Weiler's side leans on Tai Baribo, who has 14 goals from 48 shots, with Louis Munteanu, Kamil Castillo and Gabe Segal listed out. At Audi Field they have won four, drawn five and lost five, scoring 18 and conceding 25 in 14 games, and **ten of those 14** went over 2.5 goals.",
      "The Red Bulls are eighth on 36 points after a 4–1 win over San Diego, with Julian Hall on 11 goals and Jorge Ruvalcaba on eight, and Emil Forsberg creating behind them. Michael Bradley's side lost 3–0 at home to St. Louis on 1 October, so the form line swings between heavy wins and heavy defeats. Away from home they have won five, drawn three and lost six, scoring 16 and conceding 25, and eight of 14 road games went over 2.5. The April meeting finished 4–4, and no Red Bulls player is listed out in the league report.",
    ],
    tactical: "D.C.'s projected 4-4-2 depends on Baribo and João Peglow's creativity, with the playmaker credited with 45 chances created, while the Red Bulls' 4-3-3 gives Hall and Ruvalcaba space to attack a home defence that concedes 1.79 per game. Both back lines have shown they can be opened, and the first goal is likely to push the other side into an exchange rather than a controlled recovery. The road to three goals is a game in which D.C. concede early and chase, or the Red Bulls' recent habit of scoring in bunches repeats.",
    risk: "Both sides can fail to score: D.C. have not scored in four of 14 home games and the Red Bulls in three of 14 away games, and D.C.'s 0–0 draw with Atlanta last month is a reminder that a low-event match is possible. The over also needs some luck in a fixture where Baribo is the only player who reliably carries a goal threat for the hosts.",
    market: "Converted to a raw implied probability, **1.50** is **66.67%** (1 / 1.50) before the bookmaker's margin. The two venue frequencies of **71%** for D.C.'s home games and 57% for the Red Bulls' away games average about 64%, a little below the implied figure, so the value is thin and depends on the April meeting and both defences' poor records being decisive.",
    conclusion: "Both teams concede 1.79 per game in these venue splits and have strikers in form, which makes three goals plausible, though not guaranteed. The Red Bulls' travel record and D.C.'s injuries are worth checking in the lineups before kick-off. With that caveat in mind, over 2.5 total goals at 1.50 remains the call.",
    teamNews: `${newsIntro("Team news for D.C. United against New York Red Bulls")}

**D.C. United**
- **Out:** Kamil Castillo (upper body), Louis Munteanu (lower leg) and Gabe Segal (lower leg).
- No suspensions were reported.

**New York Red Bulls**
- No players are listed out in the league report, and no suspensions were reported.

**PROJECTED D.C. United (4-4-2):** Johnson; Kurokawa, Rowles, Bartlett, Nono; Peglow, Dozzell, Markovic, Kijima; Hopkins, Baribo.

**PROJECTED New York Red Bulls (4-3-3):** Horvath; Padelford, Bazan, Che, Nealis; Sofo, Mehmeti, Donkor; Cowell, Hall, Ruvalcaba.`,
  }),

  mls({
    slug: "fc-cincinnati-vs-new-england-revolution",
    home: "FC Cincinnati",
    away: "New England Revolution",
    venue: "TQL Stadium",
    locality: "Cincinnati, Ohio",
    pick: "New England Revolution or Draw (X2)",
    odds: 1.77,
    access: "free",
    teaser: "Cincinnati have one of the East's best home attacks and one of its worst defences, which is the tension behind the visitors' draw cover. The prediction and full analysis are FREE for everyone.",
    trend: "Cincinnati's high-scoring home form against New England's road record",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-fc-cincinnati-vs-new-england-revolution-10-14-26-mls/",
    matchAnalysis: [
      "FC Cincinnati are ninth in the East on **36 points** with the third-best attack in the conference and the second-worst defence, 58 goals scored and 65 conceded in 27 games. At TQL Stadium the numbers are generous to goals: seven wins, three draws and two defeats in 12 home games, 34 scored and 24 conceded, **2.00 points per game**. They ended a six-game winless run with a 3–1 win at Atlanta on Sunday, and Kevin Denkey leads the line with 16 goals, but Evander (leg) and José Martínez (knee) are listed out.",
      "New England are fourth on **46 points** but arrive after consecutive 3–0 defeats, at Real Salt Lake and at home to Seattle on Sunday, with Marko Mitrović saying that every game from here is like a playoff game. Their away split is five wins, two draws and seven defeats from 14, 19 scored and 23 conceded, and their matchday guide says six regular-season matches are left. Leo Campana, Mamadou Fofana, Jack Harrison and Alhassan Yusuf are out, and Carles Gil, with 12 goals and 76 chances created, carries the creative burden. The Revolution won 6–1 at Gillette Stadium in March, while Cincinnati won the last meeting at TQL Stadium by 1–0 in April 2025.",
    ],
    tactical: "Cincinnati's projected 3-5-2 puts Denkey and Barlow ahead of Malacia and Doudera as wing-backs and a midfield of Nwobodo, Bucha and Gidi, which suits a home side that scores 2.83 goals per game but concedes two. New England's 4-3-3 depends on Gil finding space between Cincinnati's midfield and back three, with Langoni and Turgeman as the wide outlets. The visitors' best chance of avoiding defeat lies in an early goal that makes Cincinnati chase.",
    risk: "The X2 fails only if Cincinnati win, and their home form is the strongest in this fixture: two points per game, 2.83 goals per game and a 75% rate of both teams scoring. New England have lost two straight heavily and their road record is poor, so the double chance relies on their ability to take a point from a team that has been winning at home.",
    market: "Taking **1.77** at face value gives a raw implied probability of **56.50%** (1 / 1.77). Cincinnati have won seven of 12 home games (58%), which leaves the visitors a 42% chance of not losing on the home record alone, so the price already asks for a little more than the venue frequency. The value case is New England's overall points advantage and Cincinnati's weak defence.",
    conclusion: "New England's draw cover rests on Cincinnati's defensive record and the Revolution's overall standing, but the hosts' home form and the Revolution's two heavy defeats argue for caution. The late injury news on Evander and Gil is worth checking before kick-off. Nothing in the latest news changes the selection: New England Revolution or Draw (X2) at 1.77.",
    teamNews: `${newsIntro("Team news for FC Cincinnati against New England Revolution")}

**FC Cincinnati**
- **Out:** Evander (leg) and José Martínez (knee).
- No suspensions were reported.

**New England Revolution**
- **Out:** Leo Campana, Mamadou Fofana (both lower body), Jack Harrison (quad) and Alhassan Yusuf (hamstring).
- No suspensions were reported.

**PROJECTED FC Cincinnati (3-5-2):** Louro; Hadebe, Robinson, Smith; Malacia, Nwobodo, Bucha, Gidi, Doudera; Denkey, Barlow.

**PROJECTED New England Revolution (4-3-3):** Turner; Sands, Wynder, Kohler, Polster; Yueill, Raines, Gil; Miller, Turgeman, Langoni.`,
  }),

  mls({
    slug: "fc-dallas-vs-seattle-sounders-fc",
    home: "FC Dallas",
    away: "Seattle Sounders FC",
    venue: "Toyota Stadium",
    locality: "Frisco, Texas",
    pick: "Over 2.5 Total Goals",
    odds: 1.59,
    access: "vip",
    teaser: "Dallas are third in the West with a goal-heavy home record, while Seattle arrive on a four-game winning run built on a steadier road defence. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Dallas's goal-heavy home games against Seattle's measured road form",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-fc-dallas-vs-seattle-sounders-10-14-26-mls/",
    matchAnalysis: [
      "FC Dallas are third in the West on **47 points** and their home games have been open: six wins, five draws and two defeats from 13, 25 goals scored and 20 conceded, with **eight of 13** going over 2.5 goals and seven of those at four goals or more. Eric Quill's side lost 3–2 at Charlotte on Sunday after wins over LAFC and Portland, and Petar Musa (19 goals from 80 shots) and Logan Farrington (10) provide the finishing, though Anderson Julio is questionable. Squawka's projected eleven does not include Musa even though its preview text expects him to lead the line, so his place is worth confirming.",
      "Seattle Sounders are seventh on 41 points and have won four in a row, 3–0 at New England on Sunday, 2–1 over Sporting KC, 3–1 over Minnesota and 2–0 over Real Salt Lake. Brian Schmetzer's side travel less freely than that run suggests: four wins, five draws and five defeats away from home, 15 goals scored and 15 conceded, and only five of 14 road games went over 2.5 goals. Pedro de la Vega, Nikola Petković and Paul Rothrock are out, while Albert Rusnák has created 71 chances. The two venue splits are therefore at odds with each other, which is why this over is not a certainty.",
    ],
    tactical: "Dallas's projected 3-4-2-1 asks Delgado and Valiente to supply Farrington, while Seattle's 4-2-3-1 relies on Rusnák between the lines and Cristian Roldan and Dotson to cover the middle. The visitors have conceded only 15 goals in 14 away games, so the hosts will need to create their own chances rather than wait for Seattle errors. An early Dallas goal would test whether a Seattle side with a stingy road record can chase a game, whereas an early Seattle goal might produce the conservative second half their away split suggests.",
    risk: "Seattle's road games are the counterweight: only 36% of them have gone over 2.5 goals and five have been clean sheets, and the visitors have won four in a row without needing to open up. A 1–0 or 2–0 result in either direction would defeat the pick, and the missing Rothrock and de la Vega do not obviously make Seattle weaker defensively.",
    market: "The market price of **1.59** corresponds to a raw implied probability of **62.89%** (1 / 1.59). Dallas's home frequency of **62%** is close to that figure, but Seattle's **36%** away frequency pulls the blended expectation closer to 49%, so the market price asks for more than the venue form delivers. The value rests on Dallas's attacking output at home overcoming Seattle's discipline.",
    conclusion: "Dallas's home games are among the most open in the West, but Seattle's away record points the other way, and the over is a close call. The confirmed forward lines for Dallas, particularly Musa, are worth checking before kick-off. Over 2.5 total goals at 1.59 therefore stands.",
    teamNews: `${newsIntro("Team news for FC Dallas against Seattle Sounders FC")} The kick-off is 7:30 p.m. Central time (8:30 p.m. Eastern).

**FC Dallas**
- **Questionable:** Anderson Julio (lower body).
- No players are listed out in the league report, and no suspensions were reported.

**Seattle Sounders FC**
- **Out:** Pedro de la Vega (quad), Nikola Petković (knee) and Paul Rothrock (hamstring).
- No suspensions were reported.

**PROJECTED FC Dallas (3-4-2-1):** Daniel; Norris, Abubakar, Urhoghide; Moore, Cappis, Kaick, Johansson; Delgado, Valiente; Farrington. Squawka's preview text also expects Petar Musa to lead the line.

**PROJECTED Seattle Sounders FC (4-2-3-1):** Thomas; Tolo, Ragen, Y. Gomez, Roldan; C. Roldan, Dotson; S. Gomez, Rusnák, Morris; Joveljić.`,
  }),

  mls({
    slug: "inter-miami-cf-vs-new-york-city-fc",
    home: "Inter Miami CF",
    away: "New York City FC",
    venue: "Nu Stadium",
    locality: "Miami Gardens, Florida",
    pick: "Inter Miami CF to Win",
    odds: 1.53,
    access: "vip",
    teaser: "Inter Miami have the East's most productive attack but have drawn half of their home games, while NYCFC are missing seven players through injury. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Miami's attack against NYCFC's thin, injury-hit squad",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-inter-miami-vs-new-york-city-fc-10-14-26-mls/",
    matchAnalysis: [
      "Inter Miami are second in the East on **49 points** with a league-high 68 goals, and Lionel Messi leads MLS with **23 goals**, two of them in Saturday's 4–0 win over D.C. United in which Luis Suárez also scored twice. Kily González, who took over in September after Javier Mascherano's resignation in April and Guillermo Hoyos's interim spell, ended a five-game winless run with that result. The home numbers are less one-sided than the attack suggests: five wins, seven draws and two defeats at Nu Stadium, 39 goals scored and 26 conceded, and only 1.57 points per game. Yannick Bright (foot) and Facundo Mura (ankle) are listed out.",
      "NYCFC are 10th on 33 points and lost 2–1 at Chicago on Saturday, with one win in their last five league games, a 2–0 at Real Salt Lake. Pascal Jansen's side is short of bodies: Drew Baiera, Arnau Farnós, Talles Magno, Maxi Moralez, Keaton Parks and Kai Trewin are out with leg injuries and Mitja Illenic is out with illness. Away from home they have won four, drawn five and lost five, scoring 16 and conceding 17 in 14, with only six of 14 road games going over 2.5. Nicolás Fernández Mercau, with 15 goals and 55 chances created, is the one player who can keep the visitors in it.",
    ],
    tactical: "Miami's projected 4-3-3 places De Paul, Ayala and Galarza behind Messi, Suárez and Berterame, so the front line has pace and combination play against an NYCFC 4-2-3-1 with Fernández Mercau and Ojeda behind Martínez. NYCFC concede 1.21 goals per away game, and with seven players out the match turns on whether Miami can score first. An early goal would force NYCFC to leave their shape, while a goalless first half would increase Miami's tendency to draw at home.",
    risk: "Miami's home record is the clearest contrary evidence: seven of 14 home games have been drawn and only five won, which is 36% win frequency against a market probability near 65%. NYCFC's low-scoring road games also make a 1–1 draw plausible, and a Miami defence that concedes 1.86 per home game gives the visitors a route to a goal.",
    market: "At **1.53** the win carries a raw implied probability of **65.36%** (1 / 1.53), well above Miami's **36%** home win frequency. The price therefore rests on the matchup, with NYCFC's seven absentees and Messi's form, rather than on the home record, and that makes it a value call with real uncertainty about Miami's draw habit.",
    conclusion: "Miami's attacking quality and NYCFC's depleted squad justify the favourite's price, but the home draws are a warning, and a single goal conceded can change the shape of the evening. The lineup news, particularly for Messi and the NYCFC defence, is worth confirming before kick-off. On balance, Inter Miami CF to win at 1.53 still reads as the better side of the argument.",
    teamNews: `${newsIntro("Team news for Inter Miami CF against New York City FC")}

**Inter Miami CF**
- **Out:** Yannick Bright (foot) and Facundo Mura (ankle).
- Coach Kily González has been in charge since 15 September. No suspensions were reported.

**New York City FC**
- **Out:** Drew Baiera (leg), Arnau Farnós (leg), Mitja Illenic (illness), Talles Magno (leg), Maxi Moralez (leg), Keaton Parks (leg) and Kai Trewin (leg).
- No suspensions were reported.

**PROJECTED Inter Miami CF (4-3-3):** St. Clair; Reguilón, Micael, Casemiro, Luján; Galarza, Ayala, De Paul; Berterame, Suárez, Messi.

**PROJECTED New York City FC (4-2-3-1):** Freese; Cavallo, Sands, Thiago Martins, Gray; Perea, O'Neill; Wolf, Fernández Mercau, Ojeda; Martínez.`,
  }),

  mls({
    slug: "la-galaxy-vs-portland-timbers",
    home: "LA Galaxy",
    away: "Portland Timbers",
    venue: "Dignity Health Sports Park",
    locality: "Carson, California",
    pick: "Over 2.5 Total Goals",
    odds: 1.4,
    access: "vip",
    teaser: "Portland's injury-hit defence meets a Galaxy side that conceded six two days earlier, in a fixture between two clubs outside the playoff places. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "A short turnaround for the Galaxy meets Portland's depleted defence",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-la-galaxy-vs-portland-timbers-10-14-26-mls/",
    matchAnalysis: [
      "LA Galaxy are ninth in the West on 36 points and play for the second time in three days after a **6–2 defeat at St. Louis** on Monday. At Dignity Health Sports Park their split is level, five wins, five draws and four defeats, 18 goals scored and 18 conceded, and **eight of 14** home games have gone over 2.5. Greg Vanney's side are without Hirving Lozano (thigh), while João Klauss, with eight goals, and Marco Reus, with seven, lead a forward line that now has to recover quickly after the heavy loss.",
      "Portland Timbers are 10th on 33 points and winless in their last five, after a 3–3 draw at Sporting Kansas City on Sunday that followed three straight defeats. Their road split is poor, two wins, three draws and nine defeats, but it is eventful: 20 goals scored and 29 conceded in 14, with every one of those games producing at least two goals and nine of 14 going over 2.5. Martí Cifuentes, in charge since August, has Kristoffer Velde with eight goals and 54 chances created, while six players are out, including Brandon Bye, Zac McGraw and Finn Surman.",
    ],
    tactical: "Squawka projects a 4-3-3 for both teams. The Galaxy have Thommy, Sergi Roberto and Ruiz in midfield behind Furuhashi and Elgersma, and Portland's Velde, Janssen and Lassiter run at a squad missing six players. The Galaxy's quick turnaround is the unknown: a tired side can concede early, as St. Louis showed, or fall into a cautious second half. A Portland goal in the first half would put the Galaxy's home record under pressure, while a Galaxy goal against a squad missing six players is the likeliest route to a high-scoring game.",
    risk: "The Galaxy's home games have rarely gone beyond three goals, with only two of 14 at four or more, and a team playing for the second time in three days may protect itself with a tighter shape. If Portland's injury list produces a more conservative approach from them, a 2–0 or 1–1 would leave the line short.",
    market: "Dividing one by the **1.40** price gives a raw implied probability of **71.43%** (1 / 1.40) for the over. The home frequency of **57%** and Portland's 64% on the road both fall below that figure, so the price asks for more than the splits show. The case is a combination of Portland's six injuries and a Galaxy defence that has conceded 18 in 14 home games, which makes this a narrow value call.",
    conclusion: "The injuries on Portland's side and the Galaxy's short rest give three goals a clear route, although neither team's recent over frequency fully supports the price. The Galaxy's confirmed lineup after Monday's heavy defeat is the main detail to check. That keeps over 2.5 total goals at 1.40 as the position.",
    teamNews: `${newsIntro("Team news for LA Galaxy against Portland Timbers")} The kick-off is 7:30 p.m. Pacific time (10:30 p.m. Eastern).

**LA Galaxy**
- **Out:** Hirving Lozano (thigh). The Galaxy also played on Monday, losing 6–2 at St. Louis, so rotation is possible.
- No suspensions were reported.

**Portland Timbers**
- **Out:** Alex Bonetig (shoulder), Brandon Bye (knee), Zac McGraw (back), Juan Mosquera (foot/ankle), Hunter Sulte (lower body) and Finn Surman (lower body).
- No suspensions were reported.

**PROJECTED LA Galaxy (4-3-3):** Marcinkowski; Aude, Haak, Glesnes, Miller; Thommy, Sergi Roberto, Ruiz; Taylor, Furuhashi, Elgersma.

**PROJECTED Portland Timbers (4-3-3):** Pantemis; Fory, K. Miller, Waterman, Hernandez; da Costa, Chará, Ortiz; Velde, Janssen, Lassiter.`,
  }),

  mls({
    slug: "los-angeles-fc-vs-austin-fc",
    home: "Los Angeles FC",
    away: "Austin FC",
    venue: "BMO Stadium",
    locality: "Los Angeles, California",
    pick: "Los Angeles FC to Win",
    odds: 1.43,
    access: "vip",
    best: true,
    teaser: "LAFC have conceded only 12 goals in 14 home games, while Austin have allowed 32 on the road. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "LAFC's home defence against Austin's leaky road record",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-lafc-vs-austin-fc-10-14-26-mls/",
    matchAnalysis: [
      "LAFC are sixth in the West on 42 points and their home split is the strongest argument in this fixture: eight wins, three draws and three defeats at BMO Stadium, 26 goals scored and just **12 conceded**, with eight clean sheets in 14 home games. Xavi Tamarit has been interim coach since Marc Dos Santos was dismissed on 27 September, and Sunday's 1–1 draw with Vancouver is the only league result in the recent form line since the change. Denis Bouanga has 15 goals and 52 chances created, Son Heung-Min six goals from 94 shots, and Cabral Carter, Jeremy Ebobisse and Timothy Tillman are out.",
      "Austin FC are 13th on 31 points under interim coach Davy Arnaud, who replaced Nico Estévez in May, and lost 4–1 at home to Nashville on Sunday. Away from home they have won three, drawn four and lost seven, scoring 16 and conceding **32** (2.29 per game), with 12 of 14 road games going over 2.5 goals and five failures to score. Žan Kolmanič (hamstring) is the only player listed out, while Christian Ramirez has nine goals from 26 shots and Facundo Torres has created 61 chances, so the visitors can threaten even with a poor defence.",
    ],
    tactical: "LAFC's projected 4-2-3-1 gives Son the free role behind Bouanga, with Choiniere and Vasquez as the double pivot and Shaffelburg and Sieb on the flanks, while Austin's 3-4-3 relies on Facundo Torres and Uzuni to create the chances. The hosts have kept eight clean sheets at home, and an early LAFC goal would invite Austin, who have conceded two or more in most road games, to open up. The visitors' route is to score first, since BTTS appears in 64% of their away matches and LAFC have conceded in six of 14 at home.",
    risk: "LAFC's win rate at home, 57%, is well below the price, and their three home draws and three defeats show that they can drop points. The interim-coach change adds some uncertainty after the dismissal, and Austin score regularly on the road, so a 1–1 or 2–2 draw is plausible.",
    market: "The win at **1.43** has a raw implied probability of **69.93%** (1 / 1.43). LAFC's home win frequency of **57%** and Austin's away defeat frequency of 50% are both below that number, so the price is a premium for the matchup, the gap in goals conceded and the home clean-sheet record. It is a favourite's price, so the value is modest.",
    conclusion: "LAFC's defensive home record and Austin's road collapse are the best-supported elements of this call, while the coaching change and the missing midfielder Tillman are the details to watch. The confirmed lineup and Son's role are worth checking before kick-off. The selection therefore remains Los Angeles FC to win at 1.43.",
    teamNews: `${newsIntro("Team news for Los Angeles FC against Austin FC")} The kick-off is 7:30 p.m. Pacific time (10:30 p.m. Eastern).

**Los Angeles FC**
- **Out:** Cabral Carter (arm), Jeremy Ebobisse (leg) and Timothy Tillman (pelvis).
- Interim coach Xavi Tamarit has been in charge since early October. No suspensions were reported.

**Austin FC**
- **Out:** Žan Kolmanič (hamstring). Interim coach Davy Arnaud has been in charge since May.
- No suspensions were reported.

**PROJECTED Los Angeles FC (4-2-3-1):** Lloris; Cheberko, Segura, Porteous, Palencia; Choiniere, Vasquez; Shaffelburg, Son, Sieb; Bouanga.

**PROJECTED Austin FC (3-4-3):** Stuver; Biro, Bell, Desler; Gallagher, Sánchez, E. Torres, F. Torres; Uzuni, Vazquez, Alastuey.`,
  }),

  mls({
    slug: "nashville-sc-vs-sporting-kansas-city",
    home: "Nashville SC",
    away: "Sporting Kansas City",
    venue: "GEODIS Park",
    locality: "Nashville, Tennessee",
    pick: "Nashville SC to Win",
    odds: 1.31,
    access: "vip",
    best: true,
    teaser: "Nashville have won 13 of their 14 home games, while Sporting Kansas City have lost 11 of 14 on the road. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "MLS's best home record against the league's weakest road side",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-nashville-sc-vs-sporting-kc-10-14-26-mls/",
    matchAnalysis: [
      "Nashville SC lead the East on **63 points** and have already secured a playoff place, and their home form is the best in MLS: **13 wins and a draw from 14 matches** at GEODIS Park, 41 goals scored and 12 conceded, with a goal in every home game. B.J. Callaghan's side beat Austin 4–1 on Sunday and Sam Surridge (16 goals) and Hany Mukhtar (14 goals, 42 chances created) lead an attack that has produced three or more goals in 11 of its 14 home matches. Only Owen Presthus (lower body) is listed out.",
      "Sporting Kansas City are bottom of the West on 22 points, with six wins from 28 games, 35 goals scored and 68 conceded. Away from home they have won three and lost eleven of 14, scoring 14 and conceding **39**, and they failed to score in six of those trips. Raphaël Wicky's side drew 3–3 with Portland on Sunday and lost 2–1 at Seattle on 2 October, and André Luiz has scored seven goals in 475 minutes since arriving. Six players are out (Or Blorian, Diego Borges, Capita Capemba, Jake Davis, Moisés Mosquera and Owen Wolff), and Lasse Berg Johnsen is questionable.",
    ],
    tactical: "Nashville's projected 4-2-3-1 gives Mukhtar the free role behind Surridge, supported by Espinoza and Saad on the flanks, and the home side has scored in all 14 games at GEODIS Park. Sporting KC's 4-4-2 will look to André Luiz and Calvin Harris on the break, but a side conceding 2.79 goals per away game is unlikely to hold a lead. An early Nashville goal would force the visitors to open up, while the hosts' six home clean sheets show how little room Kansas City will find if they fall behind.",
    risk: "At this price there is little margin. Nashville have not lost at home all season, but a draw is still possible in a game of 14 data points, and the visitors can score, since they have found the net in eight of 14 away games.",
    market: "Converted to a raw implied probability, **1.31** is **76.34%** (1 / 1.31) before the bookmaker's margin. That is below Nashville's home win rate of **93%** (13 of 14), so the market is giving a margin for a one-off result, and Kansas City's road record supports the figure. It is a short price, and the value lies in the gap between the venue splits and the missing visitors.",
    conclusion: "Nashville's home record and Kansas City's road form are heavily lopsided, and the injuries to six Kansas City players add to the case. The Nashville lineup is the main detail to confirm before kick-off. With that caveat in mind, Nashville SC to win at 1.31 remains the call.",
    teamNews: `${newsIntro("Team news for Nashville SC against Sporting Kansas City")} The kick-off is 7:30 p.m. Central time (8:30 p.m. Eastern).

**Nashville SC**
- **Out:** Owen Presthus (lower body).
- No suspensions were reported.

**Sporting Kansas City**
- **Out:** Or Blorian (chest), Diego Borges (adductor), Capita Capemba (FIFA regulation), Jake Davis (knee), Moisés Mosquera (hamstring) and Owen Wolff (quad).
- **Questionable:** Lasse Berg Johnsen (hamstring).
- No suspensions were reported.

**PROJECTED Nashville SC (4-2-3-1):** Schwake; Baker-Whiting, Woledzi, Palacios, Najar; Corcoran, Yazbek; Saad, Mukhtar, Espinoza; Surridge.

**PROJECTED Sporting Kansas City (4-4-2):** Cleveland; Karic, Meyer, Miller, Reynolds; Harris, Agyabeng, Bassong, André Luiz; Afrifa, Calheira.`,
  }),

  mls({
    slug: "real-salt-lake-vs-san-jose-earthquakes",
    home: "Real Salt Lake",
    away: "San Jose Earthquakes",
    venue: "America First Field",
    locality: "Sandy, Utah",
    pick: "Over 2.5 Total Goals",
    odds: 1.43,
    access: "vip",
    teaser: "Real Salt Lake's home games have all produced at least two goals, but San Jose's road matches have been more measured. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Real Salt Lake's home goals against San Jose's measured road form",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-real-salt-lake-vs-san-jose-earthquakes-10-14-26-mls/",
    matchAnalysis: [
      "Real Salt Lake are 11th in the West on 32 points and have lost four of their last five, the latest a 2–1 defeat at Philadelphia on Sunday. At America First Field their split is strong: eight wins, two draws and four defeats, 27 goals scored and 20 conceded, and **every one of 14 home games** has produced at least two goals, with ten of 14 reaching three or more. Pablo Mastroeni's side is stretched by absences, with Juan José Arias, Emeka Eneli, Lukas Engel, Justen Glad and Diego Luna out and Griffin Dillon questionable, and Sergi Solans, on 11 goals, leads the line.",
      "San Jose Earthquakes are fourth on **46 points** and unbeaten in five, with a 1–1 draw at Colorado on Sunday following a 3–1 win over Portland and a 3–2 win at San Diego. Bruce Arena's side has a good road record: seven wins, four draws and three defeats on the road, 25 goals scored and 18 conceded, although only half of those games went over 2.5. Preston Judd (15 goals from 73 shots) and Timo Werner lead the attack, while Nonso Adimabua, Jonathan Gonzalez, Darius Johnson, DeJuan Jones, Jack Skahan and Niko Tsakiris are out and Benji Kikanovic is questionable.",
    ],
    tactical: "Real Salt Lake's projected 3-4-2-1 has Solans as the focal point, with Guilavogui and Hezarkhani supporting, in front of a back line that has lost Engel and Glad, which is a heavy loss for any defence. San Jose's 5-3-2 is built for a compact game, but Judd and Werner have the finishing to punish a rebuilt back three. An early Real Salt Lake goal would invite San Jose onto the counter, while an early visiting goal would force a home side with a poor recent run to chase.",
    risk: "San Jose's road matches go over 2.5 only half the time, and a five-man defence is designed to limit the home side to a low-scoring game. Real Salt Lake's own recent form, with four defeats in their last five, suggests that the pattern of high-scoring home games depends on opponents who open up.",
    market: "Taking **1.43** at face value gives a raw implied probability of **69.93%** (1 / 1.43). Real Salt Lake's home frequency of **71%** matches the price, but San Jose's **50%** road frequency lowers the blended expectation, so the value rests on the hosts' defensive injuries and the number of goals in their home games.",
    conclusion: "Real Salt Lake's home games are reliably eventful and their defence is depleted, which supports the over, though San Jose's road structure is a real counter-weight. The confirmed back line and Luna's absence are the details to check before kick-off. Nothing in the latest news changes the selection: over 2.5 total goals at 1.43.",
    teamNews: `${newsIntro("Team news for Real Salt Lake against San Jose Earthquakes")} The kick-off is 7:30 p.m. Mountain time (9:30 p.m. Eastern).

**Real Salt Lake**
- **Out:** Juan José Arias (hamstring), Emeka Eneli (knee), Lukas Engel (hamstring), Justen Glad (adductor) and Diego Luna (knee).
- **Questionable:** Griffin Dillon (foot).
- No suspensions were reported.

**San Jose Earthquakes**
- **Out:** Nonso Adimabua, Jonathan Gonzalez, Darius Johnson, DeJuan Jones and Jack Skahan (all lower body) and Niko Tsakiris (upper body).
- **Questionable:** Benji Kikanovic (lower body).
- No suspensions were reported.

**PROJECTED Real Salt Lake (3-4-2-1):** Cabral; Henry, Quinton, Yedlin; Junqua, Caliskan, Spierings, Marczuk; Guilavogui, Hezarkhani; Solans.

**PROJECTED San Jose Earthquakes (5-3-2):** Edwards; Vitor Costa, Romney, Munie, Jasinski, Marie; Leroux, Vieira, Lowen; Werner, Judd.`,
  }),

  mls({
    slug: "san-diego-fc-vs-houston-dynamo-fc",
    home: "San Diego FC",
    away: "Houston Dynamo FC",
    venue: "Snapdragon Stadium",
    locality: "San Diego, California",
    pick: "Houston Dynamo FC or Draw (X2)",
    odds: 1.72,
    access: "free",
    teaser: "San Diego score freely at home but concede nearly as often, while Houston's road record rests on a defence that has kept five clean sheets. The prediction and full analysis are FREE for everyone.",
    trend: "San Diego's open home games against Houston's solid road defence",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-san-diego-fc-vs-houston-dynamo-10-14-26-mls/",
    matchAnalysis: [
      "San Diego FC are 12th in the West on **32 points** and winless in five, losing 4–1 at the Red Bulls on Sunday after draws with Austin (3–3) and Miami (2–2). At Snapdragon Stadium they have won six, drawn three and lost five, scoring 32 and conceding 24 in 14, and **12 of 14** home games have gone over 2.5 goals. Marcus Ingvartsen has 12 goals and Anders Dreyer 11 with 72 chances created, while Osvald Søe (lower body) is the only player listed out.",
      "Houston Dynamo are fifth on 45 points after a 2–2 draw at Minnesota on Sunday, and Ben Olsen's side has turned a modest attack into a high place by being hard to beat. Away from home they have won five, drawn three and lost six, scoring 19 and conceding 22 in 14, with five clean sheets and four failures to score. Guilherme has 14 goals from 79 shots and Mateusz Bogusz six goals and 28 chances created, but goalkeeper Jimmy Maurer (back) is out and Agustin Resch is questionable.",
    ],
    tactical: "San Diego's projected 4-3-3 sends Ingvartsen and Dreyer at Houston's back four, with Tverskov and Pirani controlling the middle, while Houston's 4-3-3 relies on Guilherme and Bogusz to turn the few chances they create into goals. The visitors' lack of a first-choice goalkeeper is the obvious weakness, and San Diego's home games are open enough that Houston will concede, but Houston's five away clean sheets show they defend well when organised. An early San Diego goal would test Houston's replacement goalkeeper.",
    risk: "San Diego's home games are high-scoring and Houston's goalkeeper change is a real concern, so a home win ends the selection. San Diego have won only six of 14 at home, but the hosts' attack scores 2.29 per game and Houston have failed to win in four of their last five.",
    market: "The market price of **1.72** corresponds to a raw implied probability of **58.14%** (1 / 1.72). San Diego have not won at home in eight of 14 games (57%), which is almost exactly the implied figure, so the price is fair against the venue frequency and the value comes from Houston's overall standing, which is 13 points ahead of the hosts.",
    conclusion: "Houston's league position and San Diego's modest home win rate support the double chance, while the goalkeeper issue and San Diego's scoring are the main risks. The confirmed Houston goalkeeper is the detail to check before kick-off. Houston Dynamo FC or Draw (X2) at 1.72 therefore stands.",
    teamNews: `${newsIntro("Team news for San Diego FC against Houston Dynamo FC")} The kick-off is 7:30 p.m. Pacific time (10:30 p.m. Eastern).

**San Diego FC**
- **Out:** Osvald Søe (lower body).
- No suspensions were reported.

**Houston Dynamo FC**
- **Out:** Jimmy Maurer (back), the goalkeeper.
- **Questionable:** Agustin Resch (lower body).
- No suspensions were reported.

**PROJECTED San Diego FC (4-3-3):** dos Santos; Sargeant, Murphy, Duah, Verhoeven; Pirani, Tverskov, Godoy; Achouri, Ingvartsen, Dreyer.

**PROJECTED Houston Dynamo FC (4-3-3):** Bond; Ennali, Halter, Antonio Carlos, Andrade; Bouzat, Artur, Samassekou; Guilherme, Foster, Bogusz.`,
  }),

  mls({
    slug: "st-louis-city-sc-vs-vancouver-whitecaps-fc",
    home: "St. Louis City SC",
    away: "Vancouver Whitecaps FC",
    venue: "Energizer Park",
    locality: "St. Louis, Missouri",
    pick: "St. Louis City SC or Draw (1X)",
    odds: 1.61,
    access: "vip",
    teaser: "The West's top two meet in St. Louis, where the hosts have won nine of 14, while Vancouver have been less commanding on the road. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "St. Louis's home record against the West leaders' road form",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-st-louis-city-vs-vancouver-whitecaps-10-14-26-mls/",
    matchAnalysis: [
      "St. Louis City are second in the West on **50 points** and arrive after a 6–2 win over LA Galaxy on Monday, their fourth straight league win following a 3–0 win at the Red Bulls, 3–1 over Toronto and 4–2 over Minnesota. At home they have won nine, drawn three and lost two, scoring 34 and conceding 19 in 14, **2.14 points per game**, and both teams have scored in 11 of 14. Yoann Damet's side leans on Simon Becher, who has nine goals, and only Celio Pompeu (knee) is listed out, but playing on Monday leaves only two days of rest.",
      "Vancouver Whitecaps lead the West on 51 points, though the road form is less dominant than the table: six wins, four draws and three defeats in 13 away games, 26 goals scored and 16 conceded. Jesper Sørensen's side drew 1–1 at LAFC on Sunday after a 3–1 defeat at Chicago on 7 October and a 3–3 draw with D.C. United, and Brian White has 17 goals. The league report lists Thomas Müller (hamstring), who has created 52 chances, as out, and Squawka's projected eleven omits him, along with Sam Adekugbe, Jeevan Badwal, Kenji Cabrera and Belal Halbouni.",
    ],
    tactical: "St. Louis's projected 3-4-3 has Navarro and Holse in the front line, and a home side that scores 2.43 per game will test a Vancouver 4-2-3-1 built around White and Gauld. Müller's absence reduces Vancouver's creative hub, so their counters depend more on White's movement and the wide forwards. An early St. Louis goal would stretch a Vancouver team that concedes 1.23 per away game, while a Vancouver goal first would test the hosts' recovery after Monday's match.",
    risk: "The double chance fails if Vancouver win, and they have won six of 13 away games and score 2.00 per away game. St. Louis's short rest, with a match on Monday, adds fatigue as a variable, and the hosts conceded two goals in three of their last five games.",
    market: "At **1.61** the double chance carries a raw implied probability of **62.11%** (1 / 1.61). St. Louis have avoided defeat in 12 of 14 home games (**86%**), well above the implied figure, so the market is giving a margin for the rest and for Vancouver's quality. That leaves a reasonable value cushion for the short rest.",
    conclusion: "St. Louis's home form and Vancouver's missing creator give the 1X a reasoned basis, with fatigue and White's goals the main concerns. The confirmed Vancouver lineup, especially Müller, is worth checking before kick-off. On balance, St. Louis City SC or Draw (1X) at 1.61 still reads as the better side of the argument.",
    teamNews: `${newsIntro("Team news for St. Louis City SC against Vancouver Whitecaps FC")} The kick-off is 7:30 p.m. Central time (8:30 p.m. Eastern).

**St. Louis City SC**
- **Out:** Celio Pompeu (knee). The club also played on Monday, beating LA Galaxy 6–2, so rotation is possible.
- No suspensions were reported.

**Vancouver Whitecaps FC**
- **Out:** Sam Adekugbe (hamstring), Jeevan Badwal (hamstring), Kenji Cabrera (foot), Belal Halbouni (knee) and Thomas Müller (hamstring).
- No suspensions were reported.

**PROJECTED St. Louis City SC (3-4-3):** Bürki; Polvara, Baumgartl, MacNaughton; Totland, Durkin, Edelman, Wallem; Matan, Navarro, Holse.

**PROJECTED Vancouver Whitecaps FC (4-2-3-1):** Takaoka; Johnson, Priso, Blackmon, Ocampo; Larraz, Cubas; Diaby, Gauld, Sabbi; White.`,
  }),

  mls({
    slug: "toronto-fc-vs-orlando-city-sc",
    home: "Toronto FC",
    away: "Orlando City SC",
    venue: "BMO Field",
    locality: "Toronto, Ontario",
    country: "Canada",
    pick: "Orlando City SC or Draw (X2)",
    odds: 1.66,
    access: "vip",
    teaser: "Toronto have failed to win ten of 15 home games and have not kept a clean sheet at BMO Field all season, while Orlando's road defence is the league's leakiest. Full prediction, odds and analysis are available with PRIME VIP.",
    trend: "Toronto's home draws against Orlando's open road defence",
    squawkaUrl: "https://www.squawka.com/us/news/mls/match-preview-toronto-fc-vs-orlando-city-10-14-26-mls/",
    matchAnalysis: [
      "Toronto FC are 11th in the East on 32 points after a 2–1 win over CF Montréal on Saturday, which interrupted a run of three straight defeats. Robin Fraser's side has played **eight draws** in 15 home games, five wins and two defeats, scoring 31 and conceding 29, and both teams have scored in all 15 matches at BMO Field, with no clean sheet and no blank. Dániel Sallói and Joshua Sargent have seven goals each, but Nelson Palacio (thigh) and Walker Zimmerman (ankle) are out, which weakens the centre of the defence.",
      "Orlando City are seventh in the East on 37 points under interim coach Martín Perelman, with a goal difference of −15 and a 3–2 home win over Columbus on Sunday. The road split is the problem for any Orlando-backing pick: three wins, two draws and nine defeats, 25 scored and **47 conceded**, or 3.36 per game, and 12 of 14 away games have produced three or more goals. Martín Ojeda has 13 goals and 32 chances created, Antoine Griezmann and Iván Angulo support him, and Braian Ojeda and Tyrese Spicer (both foot) are out with Griffin Dorsey questionable.",
    ],
    tactical: "Toronto's projected 4-3-3 has Sallói and Sargent leading a front line with Corbanu, backed by Osorio and Coello, while Orlando's 4-4-2 pairs Griezmann with Martín Ojeda. Both defences are porous, so the game is likely to be decided by the first goal and by who handles the transition phase better. Toronto's eight home draws suggest a pattern of conceding late or equalising, and an Orlando lead would not be safe given the visitors' own defensive record.",
    risk: "The X2 depends on Toronto not winning, and their home form suggests that is likely, but Orlando's road record is the opposite: **0.79 points per away game**, with 47 goals conceded in 14. If the hosts score early and the visitors' defence collapses as it has on the road, a Toronto win is quite possible, so the pick relies on Toronto's inability to win at home rather than on Orlando's form.",
    market: "Dividing one by the **1.66** price gives a raw implied probability of **60.24%** (1 / 1.66) for the double chance. Toronto have failed to win 10 of 15 home games (**67%**), above the implied figure, while Orlando have avoided defeat in only five of 14 away games (36%). The value therefore rests on the hosts' draw-heavy home pattern, and the two splits point in different directions.",
    conclusion: "Toronto's draws at home are the supporting evidence, but Orlando's road defence is a serious contrary signal, which makes this a more qualified call than the price suggests. The centre-back pairing for Toronto and Orlando's lineup are the details to check before kick-off. That keeps Orlando City SC or Draw (X2) at 1.66 as the position.",
    teamNews: `${newsIntro("Team news for Toronto FC against Orlando City SC")}

**Toronto FC**
- **Out:** Nelson Palacio (thigh) and Walker Zimmerman (ankle).
- No suspensions were reported.

**Orlando City SC**
- **Out:** Braian Ojeda (foot) and Tyrese Spicer (foot).
- **Questionable:** Griffin Dorsey (back).
- Interim coach Martín Perelman has been in charge since March. No suspensions were reported.

**PROJECTED Toronto FC (4-3-3):** Gavran; Pereira, Gomis, Kuscevic, Laryea; Dorsch, Coello, Osorio; Sallói, Sargent, Corbanu.

**PROJECTED Orlando City SC (4-4-2):** Crépeau; Vinicius Nogueira, Jansson, Brekalo, Angulo; Sarajian, Cartagena, Atuesta, Pasalic; Griezmann, Ojeda.`,
  }),
];
