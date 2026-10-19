import { createPspImport26Prediction, type ImportStatisticalCore } from "../../editorial-tools/psp-import-26/factory";

// Source: external PSP publication package "NHL + UEFA Champions League, October 2026" (prepared
// 18 October 2026, odds and picks user-supplied, unchanged while merging). UEFA Champions League
// 2026/27 league phase, Matchday 3 (20 October 2026). Kickoff times (18:45/21:00 CET split) and
// venues were independently verified against UEFA's own Matchday 3 schedule, since the supplied
// package only stated the date; each venue's local kickoff is recorded in matchInfo.time with the
// city's own time zone (src/lib/match-time.ts), not a single CET value.
const ucl = {
  league: "champions-league" as const,
  competition: "UEFA Champions League 2026/27",
  round: "League phase, Matchday 3",
};
const uefaFixtureList = { name: "UEFA — 2026/27 league phase fixtures and results", url: "https://www.uefa.com/uefachampionsleague/news/02a8-2174c9e9019d-f909a77bd77a-1000--2026-27-champions-league-all-the-league-phase-fixtures-a/" };
const uclPublishedAt = "2026-10-18T21:30:00.000-03:00";

// Each side's record across only its first two 2026/27 league-phase matches (UEFA official match
// data). Not a home/away split and not a calibrated model - the same early-season-sample caveat
// every Matchday 2 import already discloses (see round-2026-10-13/index.ts noVenueSplitCore).
function twoMatchCore(
  homeLine: { wdl: string; gf: number; ga: number },
  awayLine: { wdl: string; gf: number; ga: number },
): ImportStatisticalCore {
  const perMatch = (n: number) => (n / 2).toFixed(2);
  return {
    kind: "rows",
    introLine: "Statistical coverage is partial: these are each club's first two 2026/27 Champions League league-phase matches (not a home/away split, not xG/shots/possession/corners, and not the complete 22-metric target Core; see provenance below).",
    rows: [
      ["UCL W-D-L (2 matches)", homeLine.wdl, awayLine.wdl],
      ["GF (2 matches)", String(homeLine.gf), String(awayLine.gf)],
      ["GA (2 matches)", String(homeLine.ga), String(awayLine.ga)],
      ["GF/match", perMatch(homeLine.gf), perMatch(awayLine.gf)],
      ["GA/match", perMatch(homeLine.ga), perMatch(awayLine.ga)],
    ],
    provenance: {
      season: "2026/27",
      homeSource: "UEFA official league-phase match data (Matchdays 1-2)",
      awaySource: "UEFA official league-phase match data (Matchdays 1-2)",
      homeMatches: 2,
      awayMatches: 2,
      competition: "UEFA Champions League league phase",
    },
  };
}

const fenerbahceVsSlaviaPraha = createPspImport26Prediction({
  ...ucl,
  slug: "fenerbahce-vs-slavia-praha",
  home: "Fenerbahce",
  away: "Slavia Praha",
  date: "2026-10-20",
  time: "19:45",
  venue: "Şükrü Saracoğlu Stadium",
  venueAddress: { addressLocality: "Istanbul", addressCountry: "Turkey" },
  pick: "Fenerbahce to Win",
  odds: 1.68,
  access: "free",
  teaser: "Fenerbahce look to respond to a heavy defeat at Aston Villa against a Slavia Praha side with its own European defensive problems. The prediction and full analysis are FREE for everyone.",
  trend: "Fenerbahce's home return against a Slavia defence that has conceded five",
  matchAnalysis: [
    "Fenerbahce return to Istanbul looking for a response after a heavy 6–0 defeat at Aston Villa. Their Champions League record stands at one goal scored and seven conceded through two rounds, so backing a home victory requires more than reputation alone. Slavia Praha have also lost both European fixtures, conceding five times, most recently in a 2–0 defeat at Sabah.",
    "Domestic form offers a counterweight: Fenerbahce beat Rizespor 3–0 in their last league outing, while Slavia followed its European setback with a goalless domestic draw. Home advantage and the visitors' defensive problems support the selection, but a 1.68 price still needs a 59.5% win rate to break even, so this stays a lean rather than a premium-confidence pick.",
  ],
  tactical: "Fenerbahce will look to use home advantage to control possession and generate more high-quality chances than they managed in Birmingham, while Slavia's away record in this league phase (zero points, two defeats) gives the hosts a defence that has conceded five times to attack. Fenerbahce's own leaky back line, however, means this is being read as a home-win lean rather than a clean-sheet expectation.",
  risk: "Fenerbahce have not won in their first two league-phase matches and their defensive response is not yet proven, so a repeat of their earlier concession rate would put the home win in doubt even with Slavia also out of form.",
  core: twoMatchCore({ wdl: "0-1-1", gf: 1, ga: 7 }, { wdl: "0-0-2", gf: 2, ga: 5 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/fenerbahce-vs-slavia-prague-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231178" }],
  publishedAt: uclPublishedAt,
});

const sabahVsDortmund = createPspImport26Prediction({
  ...ucl,
  slug: "sabah-vs-borussia-dortmund",
  home: "Sabah",
  away: "Borussia Dortmund",
  date: "2026-10-20",
  time: "20:45",
  venue: "Baku Olympic Stadium",
  venueAddress: { addressLocality: "Baku", addressCountry: "Azerbaijan" },
  pick: "Over 2.5 Total Goals",
  odds: 1.42,
  access: "vip",
  teaser: "Sabah's bounce-back home win and Dortmund's attacking need both point toward goals, but the price leaves little margin. Full pick and odds are in PRIME VIP.",
  trend: "A goals matchup undercut by a short Over 2.5 price",
  matchAnalysis: [
    "Sabah rebounded from a 4–0 loss at Manchester United to beat Slavia Praha 2–0 at home, showing both the upside and the variability in their European performances. Borussia Dortmund opened with a 3–2 win over Villarreal but were shut out 1–0 away to Bodø/Glimt. Both teams have now played one match with three or more total goals and one match that finished below that threshold.",
    "Dortmund should have opportunities against a developing Champions League defence, while Sabah's home performance against Slavia suggests the hosts can contribute to the scoreline. Neither side's two-match sample offers strong evidence this total clears at a rate close to 70.4%, the approximate break-even probability at 1.42, which is why this stays a cautious lean rather than a core selection.",
  ],
  tactical: "Sabah's home leg against Dortmund is the more open fixture of the two early kick-offs: the hosts have shown they can score at home (two against Slavia) while Dortmund's away goal return (one in two) suggests they will need to force the game rather than sit in. A low-scoring, cagey draw remains the main route for the total to miss.",
  risk: "Sabah kept a clean sheet in its latest European game and Dortmund failed to score at Bodø/Glimt, so three combined goals are far from assured at this price.",
  core: twoMatchCore({ wdl: "1-0-1", gf: 2, ga: 4 }, { wdl: "1-0-1", gf: 3, ga: 3 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/sabah-vs-borussia-dortmund-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231176" }],
  publishedAt: uclPublishedAt,
});

const portoVsPsv = createPspImport26Prediction({
  ...ucl,
  slug: "porto-vs-psv-eindhoven",
  home: "Porto",
  away: "PSV Eindhoven",
  date: "2026-10-20",
  time: "20:00",
  venue: "Estádio do Dragão",
  venueAddress: { addressLocality: "Porto", addressCountry: "Portugal" },
  pick: "Porto to Win",
  odds: 1.63,
  access: "free",
  teaser: "Porto's domestic consistency and PSV's limited European attack favour the home moneyline at the Dragão. The prediction and full analysis are FREE for everyone.",
  trend: "Porto's sharper domestic form against a blunter PSV attack",
  matchAnalysis: [
    "Porto enter this contest without a Champions League point after defeats to Manchester City (0–2) and Real Betis (2–3). Those opponents tested Porto at a high level, and the team has otherwise been considerably stronger domestically, with eight wins from eight league matches heading into this round. PSV have collected a draw and a loss in Europe, scoring just once in two outings, and their broader recent form is also weak, with three defeats across their previous four matches.",
    "At the Estádio do Dragão, Porto's home advantage, sharper domestic consistency and PSV's limited European attacking output support the home moneyline. A 1.63 price still requires a win in roughly 61.3% of cases to break even, so Porto are a reasonable side to back rather than a certainty, given their own two early European defeats.",
  ],
  tactical: "Porto will look to press PSV high and exploit a visiting side that has scored only once in Europe so far, while keeping in mind their own five goals conceded in two games. A composed, lower-event match favours the hosts, who need control rather than a shootout against a PSV team still finding its form.",
  risk: "Porto have conceded five goals in two Champions League fixtures, and PSV can stay competitive in a low-scoring game even without a strong attacking record.",
  core: twoMatchCore({ wdl: "0-0-2", gf: 2, ga: 5 }, { wdl: "0-1-1", gf: 1, ga: 2 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/porto-vs-psv-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231202" }],
  publishedAt: uclPublishedAt,
});

const liverpoolVsVillarreal = createPspImport26Prediction({
  ...ucl,
  slug: "liverpool-vs-villarreal",
  home: "Liverpool",
  away: "Villarreal",
  date: "2026-10-20",
  time: "20:00",
  venue: "Anfield",
  venueAddress: { addressLocality: "Liverpool", addressCountry: "England" },
  pick: "Liverpool to Win",
  odds: 1.48,
  access: "free",
  teaser: "Liverpool's unbeaten European start and a 4.0 goals-per-game average make this the strongest straight-win lean on the card. The prediction and full analysis are FREE for everyone.",
  trend: "Liverpool's perfect European start and attacking ceiling",
  matchAnalysis: [
    "Liverpool have won both Champions League league-phase matches, beating Atletico Madrid 2–1 at Anfield and LASK 6–3 away. Their eight goals in two games produce an early average of 4.0 scored per match, and they followed that European win with a 2–1 Premier League victory over Brentford.",
    "Villarreal are not a passive opponent: they scored five goals across matches with Borussia Dortmund and Napoli, including a 3–1 win over the Italian side, and Liverpool have conceded in both of their Champions League games. Home advantage, two straight European victories and the stronger scoring output still justify the win lean, though the 1.48 price carries a demanding 67.6% break-even probability.",
  ],
  tactical: "Liverpool's route to victory runs through their front line's volume of chances at Anfield, where they have outscored opponents 8–4 so far in Europe. Villarreal's own goals-for record (five in two games) means Liverpool's back line, which has conceded in both matches, cannot be complacent, but the hosts' attacking ceiling is the deciding factor in this lean.",
  risk: "Villarreal have scored five in two UCL games and Liverpool have conceded four, so defensive lapses could turn this into a tighter match than the price suggests.",
  core: twoMatchCore({ wdl: "2-0-0", gf: 8, ga: 4 }, { wdl: "1-0-1", gf: 5, ga: 4 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/liverpool-vs-villarreal-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231207" }],
  publishedAt: uclPublishedAt,
});

const manCityVsAek = createPspImport26Prediction({
  ...ucl,
  slug: "manchester-city-vs-aek-athens",
  home: "Manchester City",
  away: "AEK Athens",
  date: "2026-10-20",
  time: "20:00",
  venue: "Etihad Stadium",
  venueAddress: { addressLocality: "Manchester", addressCountry: "England" },
  pick: "Manchester City -2.5 Goals Handicap",
  odds: 1.75,
  access: "vip",
  teaser: "City are clear favourites, but covering a three-goal margin is a different question from simply winning. Full pick and odds are in PRIME VIP.",
  trend: "A credible City win narrative undercut by a demanding handicap line",
  matchAnalysis: [
    "Manchester City are heavy favourites on team strength and entered the week with a perfect Premier League record, but winning the game and covering a -2.5 handicap are different propositions. City beat Porto 2–0 in their first Champions League fixture, then lost 4–2 to PSG - neither result would have covered a three-goal margin.",
    "AEK Athens beat LASK 1–0 and lost 3–1 to Shakhtar Donetsk. Their defensive numbers leave room for City to create chances at home, but they have not yet conceded four in a Champions League match. A -2.5 line needs City to win by at least three goals, and the 1.75 price requires a 57.1% break-even rate - the favourite can win comfortably without the handicap cashing.",
  ],
  tactical: "City's route to covering the line depends on breaking AEK down early and avoiding the kind of stretched, transition-heavy game that let PSG in for four. AEK's best chance of keeping the margin under three is disciplined defending in the first half, mirroring their approach against Shakhtar when they conceded their heaviest margin only after chasing the game.",
  risk: "A two-goal City victory loses at -2.5 even though it would be a convincing result on its own terms, and any rotation or missing attacker adds further risk to the handicap specifically.",
  core: twoMatchCore({ wdl: "1-0-1", gf: 4, ga: 4 }, { wdl: "1-0-1", gf: 2, ga: 3 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/man-city-vs-aek-athens-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231193" }],
  publishedAt: uclPublishedAt,
});

const napoliVsBodoGlimt = createPspImport26Prediction({
  ...ucl,
  slug: "napoli-vs-bodo-glimt",
  home: "Napoli",
  away: "Bodø/Glimt",
  date: "2026-10-20",
  time: "21:00",
  venue: "Stadio Diego Armando Maradona",
  venueAddress: { addressLocality: "Naples", addressCountry: "Italy" },
  pick: "Napoli to Win",
  odds: 1.61,
  access: "vip",
  teaser: "Napoli's home advantage meets a Bodø/Glimt side that has already beaten Dortmund. Full pick and odds are in PRIME VIP.",
  trend: "A home favourite with a genuinely shaky European record",
  matchAnalysis: [
    "Napoli's home advantage is the main argument behind their 1.61 quote, but the current Champions League form is a clear concern: they have lost 1–0 to Arsenal and 3–1 to Villarreal, producing only one goal across two matches, and a weekend domestic defeat at Venezia further complicates the momentum picture.",
    "Bodø/Glimt suffered a heavy 5–0 loss at Bayern Munich but answered with an impressive 1–0 victory over Borussia Dortmund, so they should not be treated as automatic outsiders. Napoli may control more of the ball and create the better chances at home, but the 62.1% win probability implied by 1.61 is difficult to justify against their recent European results.",
  ],
  tactical: "Napoli need to generate more from open play than they have managed in either European game so far (one goal in two matches), while Bodø/Glimt's result against Dortmund shows they can hurt a settled defence on the counter. Home pressure alone has not been enough for Napoli in this competition this season, which is the core tension in this pick.",
  risk: "Bodø/Glimt have already beaten Dortmund this league phase, while Napoli are still without a win and averaging 0.5 UCL goals per game.",
  core: twoMatchCore({ wdl: "0-0-2", gf: 1, ga: 4 }, { wdl: "1-0-1", gf: 1, ga: 5 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/napoli-vs-bodo-glimt-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231205" }],
  publishedAt: uclPublishedAt,
});

const psgVsBarcelona = createPspImport26Prediction({
  ...ucl,
  slug: "psg-vs-barcelona",
  home: "Paris Saint-Germain",
  away: "Barcelona",
  date: "2026-10-20",
  time: "21:00",
  venue: "Parc des Princes",
  venueAddress: { addressLocality: "Paris", addressCountry: "France" },
  pick: "PSG or Draw (Double Chance)",
  odds: 1.57,
  access: "free",
  teaser: "Two of the competition's best attacks meet in Paris; the double chance protects against a Barcelona side unbeaten across all competitions. The prediction and full analysis are FREE for everyone.",
  trend: "Elite attacking form on both sides makes the double chance the safer angle",
  matchAnalysis: [
    "Paris Saint-Germain and Barcelona bring outstanding early Champions League attacking records into this meeting. PSG have scored ten goals in two games, including a 4–2 away win over Manchester City, while Barcelona have scored nine and conceded only two. On recent European output alone, both sides have a credible route to victory.",
    "The case for the PSG double chance rests on home advantage and proven attacking resilience against elite opposition, covering both a home win and a draw rather than relying on a PSG moneyline. Barcelona's broader form is exceptional, though, with eleven wins from eleven matches across competitions heading into this round, so at 1.57 the market still requires PSG to avoid defeat around 63.7% of the time to break even.",
  ],
  tactical: "Expect an open, transition-heavy match between two sides built to attack: PSG's home record (10 goals in two games) and Barcelona's similarly explosive away form (9 goals in two games) both point toward goals at both ends, which is exactly why the double chance - rather than an outright PSG win - is the selection built to survive that kind of game.",
  risk: "Barcelona have won both UCL games convincingly and arrive on an unbeaten run across competitions, so a direct Barcelona win remains the clearest way this selection fails.",
  core: twoMatchCore({ wdl: "2-0-0", gf: 10, ga: 3 }, { wdl: "2-0-0", gf: 9, ga: 2 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/paris-saint-germain-vs-barcelona-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231198" }],
  publishedAt: uclPublishedAt,
});

const romaVsSlovanBratislava = createPspImport26Prediction({
  ...ucl,
  slug: "roma-vs-slovan-bratislava",
  home: "Roma",
  away: "Slovan Bratislava",
  date: "2026-10-20",
  time: "21:00",
  venue: "Stadio Olimpico",
  venueAddress: { addressLocality: "Rome", addressCountry: "Italy" },
  pick: "Roma -2.0 Asian Handicap",
  odds: 1.70,
  access: "vip",
  teaser: "Slovan Bratislava's leaky European defence meets a Roma side chasing its first league-phase win. Full pick and odds are in PRIME VIP.",
  trend: "A clear quality gap, but an aggressive winning margin",
  matchAnalysis: [
    "Slovan Bratislava have conceded nine goals in two Champions League fixtures: six at PSG and three at home against Stuttgart. Their 4.5 goals conceded per game is the most vulnerable defensive record among this round's matchups. Roma, meanwhile, have scored four across meetings with Fenerbahce and Real Madrid and recently recorded a 2–0 domestic win over Genoa.",
    "The mismatch gives Roma a clear path to multiple goals, but the requested -2.0 line demands substantial separation. Roma have not won either Champions League match so far, and squad-availability reports around this round add further uncertainty to their ability to maintain pressure for ninety minutes, which keeps this an aggressive rather than a core selection at 1.70.",
  ],
  tactical: "Roma's game plan should center on exploiting Slovan's defensive line early, since the visitors have already conceded nine times in Europe and tend to concede in bunches once pressured. The risk for the -2.0 line is less about Roma failing to win and more about them settling for a comfortable one- or two-goal lead rather than pushing for a third once the game is controlled.",
  risk: "In three-way European -2.0 handicap betting, a Roma victory by exactly two goals does not return a profit on this selection, so the margin matters as much as the result.",
  core: twoMatchCore({ wdl: "0-1-1", gf: 4, ga: 5 }, { wdl: "0-0-2", gf: 1, ga: 9 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/roma-vs-slovan-bratislava-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231196" }],
  publishedAt: uclPublishedAt,
});

const stuttgartVsAtleticoMadrid = createPspImport26Prediction({
  ...ucl,
  slug: "stuttgart-vs-atletico-madrid",
  home: "Stuttgart",
  away: "Atlético de Madrid",
  date: "2026-10-20",
  time: "21:00",
  venue: "MHPArena",
  venueAddress: { addressLocality: "Stuttgart", addressCountry: "Germany" },
  pick: "Stuttgart or Draw (Double Chance)",
  odds: 1.76,
  access: "vip",
  teaser: "Stuttgart's defensively convincing European start meets an Atlético side on an improving run. Full pick and odds are in PRIME VIP.",
  trend: "Stuttgart's defensive solidity against Atlético's rising form",
  matchAnalysis: [
    "Stuttgart have made the most defensively convincing European start among this round's matchups. They beat Viking 3–1 and Slovan Bratislava 3–0, leaving them with six goals scored and just one conceded through two rounds. Atlético Madrid recovered from a 2–1 loss at Liverpool by beating Manchester United 2–0, and their recent domestic results remain strong.",
    "At home, Stuttgart can justify a double-chance approach that also covers a draw in what could be a competitive match. Their European 3.0 goals-per-game average is encouraging, but it is based on just two opponents and should not be assumed to hold up unchanged against Atlético's stronger defensive structure. The 1.76 quote translates to a 56.8% break-even probability, making this a matchup-specific lean rather than a one-sided call.",
  ],
  tactical: "Stuttgart's best path is to keep the game patient and low-event, the pattern that produced their one-conceded record in two games, while Atlético's improving form (back-to-back clean results either side of the Liverpool defeat) gives them the tools to punish a mistake. The double chance is built to survive a draw, which is a realistic outcome given both sides' current defensive discipline.",
  risk: "Stuttgart lost to Hamburg domestically at the weekend, while Atlético have put together a strong winning run, so the visitors' momentum is the clearest threat to the home selection.",
  core: twoMatchCore({ wdl: "2-0-0", gf: 6, ga: 1 }, { wdl: "1-0-1", gf: 3, ga: 2 }),
  sources: [uefaFixtureList, { name: "Pre-match form and availability — The Stats Zone", url: "https://www.thestatszone.com/stuttgart-vs-atletico-madrid-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-231200" }],
  publishedAt: uclPublishedAt,
});

export const championsLeagueRound20261020 = [
  fenerbahceVsSlaviaPraha,
  sabahVsDortmund,
  portoVsPsv,
  liverpoolVsVillarreal,
  manCityVsAek,
  napoliVsBodoGlimt,
  psgVsBarcelona,
  romaVsSlovanBratislava,
  stuttgartVsAtleticoMadrid,
];
