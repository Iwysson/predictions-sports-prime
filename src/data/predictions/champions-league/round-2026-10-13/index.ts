import { createPspImport26Prediction } from "../../editorial-tools/psp-import-26/factory";

// Source: PSP UCL18 + Brasileirão8 publication package (8 October 2026). Predictions, odds, dates
// and FREE/BEST BET labels are taken from the package unchanged. Champions League 2026/27 league
// phase, Matchday 2 (13-14 October 2026). Venues are not part of the supplied package; they were
// checked against UEFA's own Matchday 2 fixture listing and, where that cross-check left a club's
// home ground genuinely unconfirmed, the uncertainty is disclosed rather than guessed.
const ucl = {
  league: "champions-league" as const,
  competition: "UEFA Champions League 2026/27",
  round: "League phase, Matchday 2",
};
const uclSources = [
  { name: "UEFA — Matchday 2 statistical preview (7 October 2026)", url: "https://www.uefa.com/uefachampionsleague/news/02aa-21c5297d7408-32d70b5a4443-1000--champions-league-matchday-2-key-stats-and-what-to-look-o/" },
  { name: "UEFA — 2026/27 results and fixtures by team (7 October 2026)", url: "https://www.uefa.com/uefachampionsleague/news/02a8-2176fa83582b-d99f0b27f405-1000--champions-league-league-phase-fixtures-and-results-by-team/" },
];
const uclPublishedAt = "2026-10-08T15:00:00.000-03:00";
// Editorial refresh of the FREE fixtures (team news, projected lineups, form) on matchday eve.
const freeRefreshAt = "2026-10-12T19:35:00.000-03:00";
// Matchday-eve editorial refresh of the 14 October fixtures (team news, projected lineups, form).
const oct14RefreshAt = "2026-10-13T08:30:00.000-03:00";
const uefaPredictedLineups = { name: "UEFA — Champions League predicted line-ups, Matchday 2", url: "https://www.uefa.com/uefachampionsleague/news/02aa-21cf3c78cf12-1c26cfd9b696-1000--champions-league-predicted-line-ups-matchday-2-team-news-/" };
const noVenueSplitCore = {
  kind: "disclosure" as const,
  note: "This is a single-leg Champions League league-phase fixture rather than a repeated home/away league sample, so a structured HOME/AWAY split; no sourced home and away split in the 22-metric target format is available for this matchup. The competition-record figures cited above (recent-run goals, clean sheets, head-to-head history) are the sourced metrics for this tie and are presented in prose rather than restated in a table to avoid duplicating them without new interpretation.",
};

const lensVsSportingCp = createPspImport26Prediction({
  ...ucl,
  slug: "lens-vs-sporting-cp",
  home: "Lens",
  away: "Sporting CP",
  date: "2026-10-13",
  time: "18:45",
  venue: "Stade Bollaert-Delelis",
  venueAddress: { addressLocality: "Lens", addressCountry: "France" },
  pick: "Lens double chance (1X)",
  odds: 1.50,
  access: "vip",
  teaser: "Lens's unbeaten home run in Europe meets a Sporting side that has only beaten French clubs in Lisbon. Full pick and odds are in PRIME VIP.",
  trend: "Lens's home resilience protects the double chance",
  matchAnalysis: [
    "Lens return to northern France with three points from a 3–2 victory at Slavia Praha, a lively opening that exposed both their ability to create chances and the difficulty they have had shutting games down. They have scored in **all nine** of their Champions League home fixtures, yet their defence has gone **14 matches** in this competition without a clean sheet. Those numbers describe a side that is comfortable playing for goals but rarely able to rely on a narrow lead.",
    "Their home record nevertheless provides the stronger argument for a result: Lens have avoided defeat in **six consecutive** Champions League home matches, winning four and drawing two. Five wins and three draws in their last ten overall also suggest this is more than a one-off spell of good fortune. Sporting, however, beat Galatasaray 3–1 on Matchday 1 and have won three successive league-phase games.",
  ],
  tactical: "Sporting's three most recent wins against French clubs came against Lille, Marseille and Paris, but all were achieved in Lisbon. The trip to Lens changes the conditions substantially. A draw is enough for the home double chance, which fits Lens's established resilience at their own ground, though Sporting's attacking form makes this far from a straightforward home assignment.",
  risk: "Sporting's three wins over French opposition were all achieved in Lisbon, not on the road, and Lens's defence has gone 14 competition matches without a clean sheet, so a direct Sporting win on current away form remains the clearest way this selection fails.",
  core: noVenueSplitCore,
  sources: uclSources,
  publishedAt: uclPublishedAt,
});

const sabahVsSlaviaPraha = createPspImport26Prediction({
  ...ucl,
  slug: "sabah-vs-slavia-praha",
  home: "Sabah",
  away: "Slavia Praha",
  date: "2026-10-13",
  time: "18:45",
  venue: "Unconfirmed at publication — reported as either Baku Olympic Stadium or Bank Respublika Arena",
  venueAddress: { addressLocality: "Baku", addressCountry: "Azerbaijan" },
  pick: "Sabah double chance (1X)",
  odds: 1.82,
  access: "vip",
  teaser: "Sabah's qualifying home form and Slavia's long winless run in the main stage support the hosts avoiding defeat. Full pick and odds are in PRIME VIP.",
  trend: "Sabah's qualifying home form against Slavia's long winless run",
  matchAnalysis: [
    "Sabah's 4–0 loss at Manchester United was a harsh introduction to the league phase, but the return home matters. Their **four home qualifying victories** came with 12 goals scored and only two conceded, including **three clean sheets**. That is a meaningful contrast to their first match against a much more established European opponent.",
    "Slavia Praha also arrive after a disappointing start, losing 3–2 at home to Lens. Their difficulties at this level extend well beyond one result: they have gone **20 Champions League main-stage matches** without a win, drawing seven and losing 13. Away from Prague, they have yet to win in **ten main-stage attempts**, with four draws and six defeats.",
  ],
  tactical: "Sabah's last four UEFA matches have featured 18 goals and none of their 23 European fixtures has ended 0–0. A wide-open game is therefore plausible, and Slavia have enough attacking quality to challenge. The home double chance rests on Sabah's much stronger qualifying performances in front of their own supporters, while acknowledging that qualifying results are not directly equivalent to league-phase opposition.",
  risk: "Sabah's own run included a 4-0 defeat to Manchester United, so their qualifying-stage home form is not proven against a side of Slavia's experience at this level, and Slavia's attacking quality means the double chance still needs Sabah to avoid an away win rather than assuming it.",
  core: noVenueSplitCore,
  sources: uclSources,
  publishedAt: uclPublishedAt,
});

const arsenalVsLille = createPspImport26Prediction({
  ...ucl,
  slug: "arsenal-vs-lille",
  home: "Arsenal",
  away: "Lille",
  date: "2026-10-13",
  time: "21:00",
  venue: "Emirates Stadium",
  venueAddress: { addressLocality: "London", addressCountry: "England" },
  pick: "Arsenal -1.5 Asian handicap",
  odds: 1.72,
  access: "vip",
  teaser: "Arsenal's home scoring record in the league phase is the basis for backing a two-goal margin over Lille. Full pick and odds are in PRIME VIP.",
  trend: "Arsenal's home scoring record supports the handicap",
  matchAnalysis: [
    "Arsenal began their European campaign by winning 1–0 away at Napoli, an efficient result that extends an outstanding league-phase sequence. They have now won **13 consecutive matches** in that phase and have lost only two of their last **31 UEFA group-stage or league-phase fixtures**, recording 25 victories and four draws across that wider sample.",
    "The handicap requires a different level of control from a routine home win, and Arsenal's scoring record at this venue is the crucial evidence. They have scored at least three goals in **five of their last six** Champions League home league-phase matches, while keeping **five clean sheets** in their last seven Champions League appearances overall. That combination gives them a realistic route to winning by two or more without needing an unusually high-scoring contest.",
  ],
  tactical: "Lille opened with a 3–2 home defeat to Real Betis and have lost their last eight away games against English clubs. They can still threaten an Arsenal defence that must guard against transitions, but the hosts' ability to create separation at home is the reason for choosing the handicap rather than merely backing them to win. A one-goal Arsenal victory would not cover it.",
  risk: "Arsenal's two losses in 31 UEFA group-stage or league-phase fixtures show the run is strong but not unbeaten, and a Lille goal in a 2-1 scoreline would be enough to defeat the -1.5 line even with an Arsenal win.",
  core: noVenueSplitCore,
  sources: uclSources,
  publishedAt: uclPublishedAt,
});

const atleticoMadridVsManUnited = createPspImport26Prediction({
  ...ucl,
  slug: "atletico-madrid-vs-manchester-united",
  home: "Atlético de Madrid",
  away: "Manchester United",
  date: "2026-10-13",
  time: "21:00",
  venue: "Estadio Metropolitano",
  venueAddress: { addressLocality: "Madrid", addressCountry: "Spain" },
  pick: "Atlético de Madrid double chance (1X) + Over 1.5 total goals",
  odds: 1.61,
  access: "vip",
  teaser: "Atlético's early-scoring home habit meets a United side with a poor historical record against Spanish opposition. Full pick and odds are in PRIME VIP.",
  trend: "Atlético's pre-half-time scoring habit against United's weak Spanish record",
  matchAnalysis: [
    "Atlético de Madrid lost 2–1 at Liverpool on Matchday 1, while Manchester United dismantled Sabah 4–0. Those results give United the sharper start, but Atlético's home scoring pattern makes this meeting less one-sided than the opening scorelines might suggest: the Spanish side have scored before half-time in **11 of their last 12** home group-stage or league-phase matches.",
    "The caution lies in Atlético's results against English opposition. They have not won any of their **11 Champions League** group-stage or league-phase meetings with English clubs, drawing four and losing seven. United, meanwhile, have lost only one of their last **11 matches** against Spanish sides, winning seven and drawing three. These are meaningful counterweights to Atlético's home advantage.",
  ],
  tactical: "United have not played a goalless draw in 49 consecutive UEFA club matches, and Atlético's tendency to score early supports the prospect of at least two goals. The double chance is the fragile half of the selection: it needs Atlético to interrupt an unusually poor historical record in this specific competition context. A 1–1 draw would satisfy both conditions; a 0–0 draw would not.",
  risk: "Atlético's winless record in 11 Champions League meetings with English clubs is the central risk to the 1X leg, and although United's own 49-match run without a 0-0 supports the goals leg, a direct United win by any scoreline would still defeat the combination.",
  core: noVenueSplitCore,
  sources: uclSources,
  publishedAt: uclPublishedAt,
});

const galatasarayVsBarcelona = createPspImport26Prediction({
  ...ucl,
  slug: "galatasaray-vs-barcelona",
  home: "Galatasaray",
  away: "Barcelona",
  date: "2026-10-13",
  time: "21:00",
  venue: "RAMS Park",
  venueAddress: { addressLocality: "Istanbul", addressCountry: "Türkiye" },
  pick: "Barcelona -1.5 Asian handicap",
  odds: 1.70,
  access: "vip",
  teaser: "Barcelona's scoring volume and Galatasaray's poor record against Spanish sides frame the case for a two-goal margin. Full pick and odds are in PRIME VIP.",
  trend: "Barcelona's scoring volume against Galatasaray's weak run vs. Spanish sides",
  matchAnalysis: [
    "Barcelona's 5–1 demolition of Feyenoord was the most emphatic opening statement of this matchup, while Galatasaray lost 3–1 at Sporting CP. The visitors' attack has a long track record of turning matches into high-scoring affairs: their last **31 Champions League fixtures** produced **141 goals** in total, an average of **4.55 per game**.",
    "That attacking volume is not only a team-level statistic. Raphinha has scored **21 Champions League goals** across his last 24 appearances, and Lamine Yamal has reached **12** in the competition while still a teenager. Barcelona's capacity to score multiple times is clear, but their defence has failed to keep a clean sheet in **16 consecutive** Champions League games, which complicates any requirement for a comfortable winning margin.",
  ],
  tactical: "Galatasaray have won only one of their last 22 matches against Spanish opposition and are winless in their last nine such encounters. The history favours Barcelona, but the Istanbul atmosphere and the visitors' defensive vulnerability mean a narrow away win remains entirely possible. Barcelona need a victory by at least two goals for this handicap to land.",
  risk: "Barcelona's defence has not kept a clean sheet in 16 straight Champions League games, so Galatasaray scoring in a match where Barcelona lead by two would be enough to defeat the handicap even with a Barcelona win on the night.",
  core: noVenueSplitCore,
  sources: uclSources,
  publishedAt: uclPublishedAt,
});

const interVsClubBrugge = createPspImport26Prediction({
  ...ucl,
  slug: "inter-vs-club-brugge",
  home: "Inter",
  away: "Club Brugge",
  date: "2026-10-13",
  time: "21:00",
  venue: "San Siro (Stadio Giuseppe Meazza)",
  venueAddress: { addressLocality: "Milan", addressCountry: "Italy" },
  pick: "Inter -1.5 Asian handicap",
  odds: 1.75,
  access: "free",
  teaser: "Inter's historical edge over Belgian clubs is weighed against an unusually poor current European run. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Inter's history against Belgian clubs vs. a rare losing run",
  matchAnalysis: [
    "Inter arrive at San Siro needing a response more than a reminder of their quality. The 2–1 defeat at Real Madrid was their **sixth loss in seven Champions League matches**, and three straight home defeats in the competition is a Champions League record. Domestically the picture is far calmer, with only two points dropped in Serie A so far, and the return of Hakan Çalhanoğlu to a midfield that already has Barella and Zieliński should give them a steadier hand on the tempo.",
    "Club Brugge are the kind of opponent that makes a two-goal margin look reachable. They lost 3–2 at home to Aston Villa after trailing 3–1, have conceded three or more goals in **seven of their last nine** European matches and have lost four of their last five away games. Their record against Italian opposition is just as poor, with **two wins in 18** (six draws, ten defeats). The caution is that Brugge do score: Vetlesen and Tresoldi both found the net against Villa, and they have scored ten goals in three straight league wins.",
  ],
  tactical: "Inter's expected 3–5–2 gives them the clearest route. With Dimarco on one flank and Diouf likely on the other, the wing-backs can pin Brugge's full-backs Sabbe and Seys, while Lautaro Martínez and Thuram attack the channels around Mechele, who is paired with Spileers or Lee Han-beom now that Joel Ordóñez is injured. Brugge's 4–2–3–1 relies on Potts and Vanaken to screen the space in front of that back four, and if Forbs recovers from his muscle problem his running alongside Virgili and Vetlesen is their best counter-attacking outlet. An early Inter goal would force Brugge to chase the game, which is exactly the state in which their defensive numbers have unravelled.",
  risk: "The handicap is the problem rather than the winner. A one-goal win returns nothing, and a side that has lost six of seven in Europe has not yet shown it can turn control into a margin. Yann Sommer, a former Inter goalkeeper, knows the stadium, Forbs' fitness could change how dangerous Brugge are on the break, and three straight home defeats in this competition are a reminder that San Siro has not been a comfortable place for Inter lately.",
  market: "At **1.75** the line carries a raw implied probability of **57.14%** (1 / 1.75), which is the market's price for an Inter win by two or more goals. Brugge's record in Italy, with one win in their last nine visits, supports an Inter victory, but frequency says little about the margin, so the case for value rests on Brugge's leaky away form and the early game state rather than on Inter's own European results.",
  conclusion: "Inter's European form is poor and the handicap leaves no room for a narrow win, yet Brugge's defensive record away from home, their struggles in Italy and Inter's far steadier league form make a comfortable home result the most likely outcome. The teamsheets, especially Çalhanoğlu in midfield and Forbs on the Brugge wing, are worth a final look before kick-off. The call stays with Inter on the -1.5 handicap at 1.75.",
  teamNews: `Team news below comes from UEFA's matchday listing and Monday's San Siro previews, and was last checked on 12 October 2026. Both lineups are PROJECTED rather than confirmed, and the official teamsheets arrive about an hour before kick-off.

**Inter**

- **Out:** Stones (thigh) and Jones (thigh), as listed by UEFA. Both absences reduce squad depth without removing a name from the projected eleven.
- **Back:** Hakan Çalhanoğlu returned to the squad for the weekend win over Parma and is in the projected midfield.
- No other injury doubts or suspensions were reported.

**Club Brugge**

- **Out:** Joel Ordóñez (foot). He is a centre-back, so Mechele is expected to be paired with Spileers or Lee Han-beom.
- **Doubtful:** Carlos Forbs (muscle problem). UEFA lists him as a doubt, although some previews still expect him to start on the right.
- No suspensions were reported.

**PROJECTED Inter (3-5-2):** Josep Martínez; Bisseck, Akanji, Bastoni; Diouf, Barella, Çalhanoğlu, Zieliński, Dimarco; Lautaro Martínez, Thuram. Projections differ on the right-sided centre-back (Pavard appears in some) and on Mkhitaryan in place of Zieliński.

**PROJECTED Club Brugge (4-2-3-1):** Sommer; Sabbe, Mechele, Spileers, Seys; Potts, Vanaken; Forbs, Vetlesen, Virgili; Tresoldi. Some projections use Lee Han-beom beside Mechele.`,
  core: {
    kind: "disclosure" as const,
    note: "Champions League league-phase fixtures do not provide a repeated home and away league sample, and no sourced HOME/AWAY split in the 22-metric format exists for this tie. The competition records quoted in the analysis (Inter's recent Champions League results, Brugge's record against Italian clubs and their recent league scoring) are the sourced figures used, and they are written into the analysis rather than restated in a table.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "TheHardTackle — Inter vs Club Brugge preview (12 October 2026)", url: "https://thehardtackle.com/round-up/2026/10/12/inter-milan-vs-club-brugge-preview-prediction-probable-lineups-tactics-team-news-key-stats/" },
    { name: "TheStatsZone — Inter vs Club Brugge team news", url: "https://www.thestatszone.com/inter-milan-vs-club-brugge-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-229715" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: freeRefreshAt,
});

const rbLeipzigVsPsvEindhoven = createPspImport26Prediction({
  ...ucl,
  slug: "leipzig-vs-psv-eindhoven",
  home: "RB Leipzig",
  away: "PSV Eindhoven",
  date: "2026-10-13",
  time: "21:00",
  venue: "Red Bull Arena",
  venueAddress: { addressLocality: "Leipzig", addressCountry: "Germany" },
  pick: "Leipzig double chance (1X) + Over 2.5 total goals",
  odds: 1.91,
  access: "free",
  teaser: "Leipzig's defensive struggles meet a PSV side with a weak record on German soil. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Leipzig's defensive fragility against PSV's weak German away record",
  matchAnalysis: [
    "Leipzig's season looks like two different teams. At the Red Bull Arena they have won all three Bundesliga home games, scoring 14 goals without conceding according to match previews, while in Europe they were beaten 4–1 at Como on matchday one, have won **one of their last 11** Champions League matches (nine defeats) and have gone **19 UEFA games without a clean sheet**. The home double chance leans on the version that shows up in Saxony, and the goals leg accepts that the defence will probably concede at some point.",
    "PSV are not arriving in poor form. They are second in the Eredivisie on 19 points from eight matches with only ten league goals conceded, and Sergiño Dest's equaliser earned a 1–1 draw at home to Shakhtar on the opening night. Their problem is geography: PSV have won **just one of 21** away matches against German opposition (five draws, 15 defeats). The injury list also bites, with Wanner, Pepi, Ouaissa and Lammers listed out and Schouten reported absent by several previews.",
  ],
  tactical: "The projected shapes point to an open game. Leipzig's 4–2–3–1 puts Nkunku, directly involved in five goals in his last five Champions League starts, between Gruda and Nusa, and that pair's width against Dest and Mauro Júnior (or Kostić) is where the home side should hurt PSV. Geertruida, on loan at PSV from Leipzig and facing his old club, leads a back line that will have to cope with Leipzig's pace in behind. If Schouten is indeed missing, Sano and Fernandez are exposed whenever Perišić and Van Bommel stay high, which opens the transition lanes behind Baku and Raum at the other end. Whoever scores first will decide whether the evening stays stretched.",
  risk: "Both legs of this combination carry real risk. Leipzig have lost nine of their last 11 Champions League matches, so avoiding defeat is far from guaranteed even against a PSV side with a dreadful German away record, and a cautious reaction to the Como result could leave the match on one or two goals. The goals leg also needs Leipzig's attack to travel into Europe the way it has performed at home in the league, something it did not do at Como.",
  market: "At a market price of **1.91** the combination carries a raw implied probability of **52.36%** (1 / 1.91), close to a coin flip for a bet that needs two things to go right. PSV's one win in 21 German trips supports the double chance, while the goals leg rests on Leipzig's league scoring at home and a defence that has not kept a clean sheet in European football for 19 games. The value is modest and depends on the game opening up early rather than on a settled statistical gap.",
  conclusion: "Leipzig's home form and PSV's history in Germany give the double chance a sound base, and neither defence has recently looked capable of shutting a game down, which supports the goals leg. The risk is Leipzig's European results, so the teamsheet matters, particularly the central midfield pair and whether Nkunku starts. The call stays with Leipzig on the double chance plus over 2.5 total goals at 1.91.",
  teamNews: `This Leipzig and PSV availability picture was assembled on 12 October 2026 from UEFA's listing and the German and Dutch match previews. The two lineups are PROJECTED, so treat the names as expectations until the teamsheets appear about an hour before kick-off.

**RB Leipzig**

- **Out:** Baumgartner (thigh), Guiu (thigh) and Ouédraogo (shoulder), as listed by UEFA. One preview describes Baumgartner as close to a return. The attacking band of Gruda, Nkunku and Nusa is untouched, so the absences cost depth more than structure.
- No other doubts or suspensions were reported.

**PSV Eindhoven**

- **Out:** Lammers (thigh), Ouaissa (thigh), Pepi (muscular), Sildillia and Wanner (foot), as listed by UEFA. Several previews also report Schouten absent, which would remove PSV's usual holding midfielder, and Nagalo is out for the season.
- **Returning to face his former club:** Lutsharel Geertruida, on loan at PSV from Leipzig, is in the projected back line.
- No suspensions were reported.

**PROJECTED RB Leipzig (4-2-3-1):** Vandevoordt; Baku, Orbán, Lukeba, Raum; El Aynaoui, Banzuzi; Gruda, Nkunku, Nusa; Cardoso. Other projections have Seiwald alongside El Aynaoui and Maksimović or Gomis in the front line.

**PROJECTED PSV Eindhoven (4-2-3-1):** Kovář; Dest, Geertruida, Obispo, Mauro Júnior; Sano, Fernandez; Til; Perišić, Mijnans, Van Bommel. Some projections have Kostić at left-back.`,
  core: {
    kind: "disclosure" as const,
    note: "Champions League league-phase fixtures do not provide a repeated home and away league sample, and no sourced HOME/AWAY split in the 22-metric format exists for this tie. The figures used in the analysis (Leipzig's European run, PSV's record at German opponents, and the early-season Bundesliga and Eredivisie numbers from match previews) are the sourced metrics, and they are written into the analysis rather than restated in a table.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "Yahoo Sports — RB Leipzig vs PSV Eindhoven preview, team news and predicted lineups", url: "https://sports.yahoo.com/articles/rb-leipzig-vs-psv-eindhoven-100216038.html" },
    { name: "TheStatsZone — RB Leipzig vs PSV team news", url: "https://www.thestatszone.com/rb-leipzig-vs-psv-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-229707" },
    { name: "Football Whispers — RB Leipzig vs PSV Eindhoven preview (secondary source)", url: "https://footballwhispers.com/blog/rb-leipzig-vs-psv-eindhoven-13-10-2026/" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: freeRefreshAt,
});

const vikingVsBayern = createPspImport26Prediction({
  ...ucl,
  slug: "viking-vs-bayern-munchen",
  home: "Viking",
  away: "Bayern München",
  date: "2026-10-13",
  time: "21:00",
  venue: "Lyse Arena",
  venueAddress: { addressLocality: "Stavanger", addressCountry: "Norway" },
  pick: "Viking +3.5 Asian handicap",
  odds: 1.53,
  access: "vip",
  teaser: "Bayern's scoring volume against Norwegian clubs is weighed against a generous handicap cushion for Viking. Full pick and odds are in PRIME VIP.",
  trend: "A generous cushion against Bayern's scoring volume",
  matchAnalysis: [
    "Viking's first league-phase match ended in a 3–1 defeat at Stuttgart, but scoring away in Germany offers at least a small attacking encouragement before Bayern arrive. Their last **11 UEFA competition matches** have produced **47 goals**, an average of **4.27 per game**, which shows how often their European fixtures become expansive rather than controlled.",
    "Bayern's 5–0 opening win over Bodø/Glimt illustrates the danger in giving their forwards space. They have scored **four or more goals** in five of their last seven Champions League matches, while Harry Kane has scored in **eight consecutive** main-stage appearances. Bayern are also unbeaten in **nine meetings** with Norwegian clubs, winning seven and drawing two.",
  ],
  tactical: "The Viking +3.5 handicap is not a prediction that the Norwegian side will match Bayern technically. It allows Viking to lose by one, two or three goals and still cover. Their own ability to score would help, but Bayern's recent tendency to produce four- and five-goal performances makes even that generous cushion vulnerable. A four-goal defeat loses the bet.",
  risk: "Bayern have scored four or more goals in five of their last seven Champions League matches, so a repeat of that scoring rate would produce exactly the kind of four-goal margin that defeats the +3.5 cushion.",
  core: noVenueSplitCore,
  sources: uclSources,
  publishedAt: uclPublishedAt,
});

const villarrealVsNapoli = createPspImport26Prediction({
  ...ucl,
  slug: "villarreal-vs-napoli",
  home: "Villarreal",
  away: "Napoli",
  date: "2026-10-13",
  time: "21:00",
  venue: "Estadio de la Cerámica",
  venueAddress: { addressLocality: "Villarreal", addressCountry: "Spain" },
  pick: "Villarreal double chance (1X) + Over 1.5 total goals",
  odds: 1.73,
  access: "free",
  teaser: "Villarreal's long winless run in Europe meets a Napoli side with a weak away record against Spanish clubs. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Villarreal's home draw-protection against Napoli's weak Spanish away record",
  matchAnalysis: [
    "Villarreal's European numbers are grim: **no win in 12 Champions League matches** (two draws, ten defeats), seven straight league-phase defeats and no first-half goal in their last seven games in the competition. Yet the 3–2 loss at Dortmund on matchday one showed an attack that can score against strong opposition, and goals have rarely been scarce around them lately, with five of their last six matches in all competitions producing at least three. At the Cerámica, with Gerard Moreno, Mikautadze and Moleiro all in the projected side, a quiet night would be a surprise.",
    "Napoli have their own problems away from home. They have not won any of their last **six Champions League away games** (one draw, five defeats), have won only **two of their last 18** against Spanish clubs (six draws, ten defeats) and were beaten 1–0 by Arsenal on matchday one. Their last six results also include defeats to Como and Inter. Allegri has quality in De Bruyne, Højlund and Neres, but with Anguissa and Alisson Santos listed out, the midfield loses ball-winning and the attack loses pace.",
  ],
  tactical: "Villarreal's likely 4–4–2 pairs Gerard Moreno with Mikautadze, and Moleiro provides the creative spark from midfield, which gives the home side a vertical outlet whenever Comesaña and Gueye win the ball. Napoli will want De Bruyne between the lines with Neres and Politano stretching the pitch against Mouriño and Romero, and the duels on those flanks should produce most of the chances. Napoli's away record makes them more likely to be the side reacting, particularly if Villarreal's early pressure finds the first-half goal they have lacked in Europe so far.",
  risk: "The double chance is only as safe as a Villarreal team that has lost seven league-phase games in a row. De Bruyne and Højlund are capable of punishing the hosts' open phases, and if the game follows the pattern of Napoli's 1–0 defeat to Arsenal and stays tight, the over 1.5 leg is in danger too. Villarreal's inability to score before half-time in seven straight European games also means the goals may arrive late, leaving little margin if they fall behind.",
  market: "At **1.73** the combination carries a raw implied probability of **57.80%** (1 / 1.73). Napoli's one draw and five defeats in their last six Champions League away games and their poor run against Spanish clubs support the double-chance leg, while the goals leg is helped by Villarreal's recent high-scoring games. The price already reflects a home advantage that Villarreal's own winless run does not obviously earn, so the value case is narrow and depends on Napoli's away weakness holding.",
  conclusion: "Villarreal's form in the Champions League is the real reservation, but Napoli's away and Spain-facing records are worse, and a team that scores freely at home with a patchy Napoli midfield in front of it should find the net at least once. The late word on McTominay, Meret and the Villarreal wide doubts will shape the final picture. The call stays with Villarreal on the double chance plus over 1.5 total goals at 1.73.",
  teamNews: `Villarreal and Napoli news was reviewed on 12 October 2026, drawing on UEFA's listing and the Spanish and Italian previews. Both XIs are PROJECTED and sources disagree in places, so the teamsheets about an hour before kick-off will settle it.

**Villarreal**

- **Doubtful:** Tajon Buchanan (hamstring) and Nicolas Pépé (eye problem). UEFA lists both as doubts, although one preview treats Buchanan as out. Both are wide options, so their status affects Villarreal's pace from the bench more than the core of the projected side.
- Mikautadze, Gerard Moreno, Ayoze Pérez and Tani Oluwaseyi are competing for the front places. No suspensions were reported.

**Napoli**

- **Out:** Alisson Santos (hamstring), Anguissa (thigh), Olivera (hip) and Vergara (calf), as listed by UEFA. Some previews also name Buongiorno (knee) and Favasuli (hamstring), and one suggests Anguissa is close to a return after about a month out.
- **Back in contention:** Scott McTominay has been cleared to return after a minor heart procedure, and Alex Meret returned in goal at the weekend. Projections differ: UEFA's version has Milinković-Savić in goal and Gilmour, Lobotka and De Bruyne in midfield, while another preview starts both Meret and McTominay.
- No suspensions were reported.

**PROJECTED Villarreal (4-4-2):** Gulácsi; Mouriño, Foyth, Renato Veiga, Carlos Romero; Comesaña, Saliba, Gueye, Moleiro; Gerard Moreno, Mikautadze. Other projections use Navarro in defence and Akhomach or Ayoze Pérez in the attacking band.

**PROJECTED Napoli (4-3-3):** Milinković-Savić; Di Lorenzo, Rrahmani, Rafa Marín, Spinazzola; Gilmour, Lobotka, De Bruyne; Neres, Højlund, Politano. A second projection has Meret in goal, McTominay in midfield and Badiashile in a back three.`,
  core: {
    kind: "disclosure" as const,
    note: "Champions League league-phase fixtures do not provide a repeated home and away league sample, and no sourced HOME/AWAY split in the 22-metric format exists for this tie. The figures used in the analysis (the two clubs' European runs, Napoli's record against Spanish opponents and the recent scorelines in each club's form guide) are the sourced metrics, and they are written into the analysis rather than restated in a table. The 2011/12 meetings are too distant to weigh.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "Sports Mole — Villarreal vs Napoli preview, team news and lineups", url: "https://www.sportsmole.co.uk/football/villarreal/champions-league/preview/villarreal-vs-napoli-prediction-team-news-lineups_606662.html" },
    { name: "NST — McTominay cleared to return, Napoli say", url: "https://www.nst.com.my/amp/sports/football/2026/10/1550258/mctominay-cleared-return-napoli-say" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: freeRefreshAt,
});

const feyenoordVsComo = createPspImport26Prediction({
  ...ucl,
  slug: "feyenoord-vs-como",
  home: "Feyenoord",
  away: "Como",
  date: "2026-10-14",
  time: "18:45",
  venue: "De Kuip (Stadion Feijenoord)",
  venueAddress: { addressLocality: "Rotterdam", addressCountry: "Netherlands" },
  pick: "Feyenoord double chance (1X)",
  odds: 1.91,
  access: "free",
  teaser: "Feyenoord's home record offers a path back after a heavy opening defeat, though Como's own debut win is a genuine warning. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Feyenoord's home strength against a confident Como",
  matchAnalysis: [
    "Feyenoord return to De Kuip as Eredivisie leaders, with **six wins and two draws** from eight league games and **27 goals** scored, after last weekend's 2–0 win over AZ Alkmaar. The opening Champions League night is the outlier: a **5–1 defeat at Barcelona** in which they were chasing the game from the third minute. At home the record is far steadier, with four wins in their last five Champions League games in Rotterdam (qualifying included) and a goal in 14 of their last 16 group-stage or league-phase matches. The squad is stretched, though, with seven players listed out and Tsuyoshi Watanabe a doubt, so the back line is where the home side is thinnest.",
    "Como are the fresher story. Cesc Fàbregas's side opened with a **4–1 win over RB Leipzig**, a night on which Martin Baturina scored, yet their domestic results since have been mixed: a 2–0 defeat at newly promoted Frosinone before the international break, then a goalless draw with Roma in which Donyell Malen was sent off after 53 minutes and Como still could not find a goal. Moise Kean is the only doubt after a leg problem picked up over the international break. Feyenoord have won just one of their last seven against Italian opposition, so a visiting win is a live scenario rather than a formality.",
  ],
  tactical: "UEFA's projected shapes set a 4-3-3 against a 4-2-3-1. Feyenoord's front three of Hadj Moussa, Ferri and Valente will look to stretch Como's full-backs, while Zechiël, Vanhoutte and Targhalline cover a back line that must cope without Bos and Nieuwkoop, which is why Read and Javi López are projected at full-back. Como's threat sits in the pocket between those lines, where Nico Paz and Baturina can receive from Da Cunha behind Anastasios Douvikas, with Diao attacking the space left by whichever full-back steps forward. An early Feyenoord goal would drag Como into the open game they played against Leipzig, whereas an early Como goal would test how Feyenoord organise themselves after conceding five in Barcelona.",
  risk: "The selection loses only if Como win, and the opening night showed how that can happen. Fàbregas's side scored four in its first Champions League match, Feyenoord's record against Italian opposition is poor, and a home side missing seven players that conceded five in Barcelona is not a settled defence. The draw cover matters for that reason: it protects the pick if Como land one punch and Feyenoord's home form brings a goal back, but it offers nothing if the visitors score twice against a patched-up back four.",
  market: "The price of **1.91** carries a raw implied probability of **52.36%** (1 / 1.91), only slightly better than even for a double chance that covers two of the three outcomes. That tells you the market takes Como seriously. Feyenoord's league-leading form and home record justify paying it, while Como's flat domestic run since the Leipzig win argues against treating the opener as typical, so the value case rests on the home edge rather than on a wide statistical gap.",
  conclusion: "Feyenoord's home record, their league form and Como's uneven results since the Leipzig win make the hosts the more reliable side to avoid defeat, even with a long injury list. The final teamsheets, particularly Watanabe's fitness on the Feyenoord side and whether Kean starts for Como, are worth a look about an hour before kick-off. On balance, Feyenoord on the double chance (1X) at 1.91 still reads as the better side of the argument.",
  teamNews: `Team news for Feyenoord against Como follows UEFA's matchday listing, updated on 13 October 2026, and previews published on 12 October. Both lineups are PROJECTED; the official teamsheets arrive about an hour before kick-off.

**Feyenoord**
- **Out:** Jordan Bos (knee), Bart Nieuwkoop (knee), Jakub Moder (back), Gonçalo Borges, Nelson (muscular), Smal (ankle) and Van Persie (knock), as listed by UEFA. Bos and Nieuwkoop are the two defenders most likely to change the shape of the back four.
- **Doubtful:** Tsuyoshi Watanabe (calf).
- No suspensions were reported.

**Como**
- **Doubtful:** Moise Kean (shin), who came back from the international break with a leg problem. UEFA lists nobody as out.
- No suspensions were reported.

**PROJECTED Feyenoord (4-3-3):** Ernst; Read, St. Juste, Mármol, Javi López; Zechiël, Vanhoutte, Targhalline; Hadj Moussa, Ferri, Valente. Another preview has Deijl in the back four and López higher up the pitch.

**PROJECTED Como (4-2-3-1):** Butez; Yan Couto, Ramón, Chalobah, Valle; Milla, Da Cunha; Diao, Nico Paz, Baturina; Douvikas. Another preview uses Perrone in midfield and Jacobo in defence.`,
  core: {
    kind: "disclosure" as const,
    note: "Champions League league-phase fixtures do not give a repeated home and away sample, and no sourced HOME/AWAY split in the 22-metric format exists for this tie. The league-phase records, recent results and head-to-head history quoted in the analysis are the sourced figures, and they are written into the prose rather than restated in a table.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "The Stats Zone — Feyenoord vs Como preview and team news (12 October 2026)", url: "https://www.thestatszone.com/feyenoord-vs-como-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-229799" },
    { name: "Squawka — Feyenoord vs Como Champions League preview", url: "https://www.squawka.com/us/news/champions-league/match-preview-feyenoord-vs-como-14-10-26-champions-league/" },
    { name: "Sports Mole — Roma vs Real Madrid preview (Como 0-0 Roma result and Malen red card)", url: "https://www.sportsmole.co.uk/football/roma/champions-league/preview/roma-vs-real-madrid-prediction-team-news-lineups_606745.html" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

const laskVsLiverpool = createPspImport26Prediction({
  ...ucl,
  slug: "lask-vs-liverpool",
  home: "LASK",
  away: "Liverpool",
  date: "2026-10-14",
  time: "18:45",
  venue: "Raiffeisen Arena",
  venueAddress: { addressLocality: "Pasching / Linz", addressCountry: "Austria" },
  pick: "Liverpool -1.5 Asian handicap",
  odds: 1.63,
  access: "vip",
  teaser: "Liverpool's consistency in the league phase and a favourable recent head-to-head support the handicap, though LASK's resilience is a real caveat. Full pick and odds are in PRIME VIP.",
  trend: "Liverpool's consistency against LASK's narrow resistance",
  matchAnalysis: [
    "Liverpool travel to Linz in an uncomfortable mood. Sunday's **3–0 home defeat to Manchester City**, settled by goals from Haaland, Doku and Cherki after Ryan Gravenberch was sent off for a second yellow card, followed a Champions League opener in which they came from behind to beat Atlético Madrid 2–1. Gravenberch's suspension covers the Premier League trip to Brentford only, so he is eligible and projected in midfield, but the forward line is short: Hugo Ekitiké, Conor Bradley and Giovanni Leoni are out, and Alexander Isak, Cody Gakpo and Dominik Szoboszlai are all doubts without a confirmed return, which matters for a pick that needs a two-goal margin.",
    "LASK's route to frustrating that margin is narrow. They lost **1–0 at AEK Athens** in their league-phase opener to a Razvan Marin free kick, and they are now **nine** European group-stage or league-phase games without a win. Their qualification run does show resilience, because after a 3–0 defeat at Celtic they won the return leg 5–1 after extra time, and only George Bello and Moses Usor are listed out. The history still favours the visitors: Liverpool beat LASK 3–1 away and 4–0 at home in the 2023/24 Europa League and have won eight of ten against Austrian clubs, while LASK have failed to win any of six meetings with English opposition.",
  ],
  tactical: "Liverpool's likely 4-2-3-1 builds around Florian Wirtz behind a young striker, Koumas, with Mac Allister and Gravenberch as the double pivot; UEFA projects Ngumoha and Chiesa on the flanks, while other previews use Muñoz and Barcola. LASK's back three with wing-backs Jørgensen and Dibango is designed to keep the game narrow and counter through Kalajdzić and Lang. If Liverpool score first, the wing-backs are pulled up the pitch and the space behind them, where Wirtz and Mac Allister can arrive, is the route to the second goal. If the first goal takes until the second half, the handicap becomes difficult, because a short-handed front line must then break a side defending in numbers.",
  risk: "The handicap asks for more than a win. Liverpool's 2–1 opener against Atlético would not have covered this line, the front line is below strength, and the Brentford trip on Saturday sits three days away, which makes an early substitution plan likely once a lead is secure. LASK have shown at home that they can score in bunches, and a single goal for them would mean Liverpool need three.",
  market: "Dividing one by the **1.63** price gives a raw implied probability of **61.35%** (1 / 1.63) for the handicap, a demanding number for a side missing its first-choice forwards and coming off a 3–0 defeat. Past results do not settle it, because the 2023/24 wins came with different squads. The value argument is the gap in European pedigree, with LASK winless in nine, rather than any sign that Liverpool's current form guarantees two goals.",
  conclusion: "Liverpool's quality and LASK's long European winless run still point to a comfortable away win, but the forward absences and the short turnaround to Brentford make the two-goal margin the harder half of the call. The confirmed teamsheet, especially the status of Isak, Gakpo and Szoboszlai, is worth checking about an hour before kick-off. That keeps Liverpool -1.5 on the Asian handicap at 1.63 as the position.",
  teamNews: `Team news for LASK against Liverpool follows UEFA's matchday listing, updated on 13 October 2026, and The Stats Zone's preview, revised the same day. Both lineups are PROJECTED and the sources disagree on several names; official teamsheets arrive about an hour before kick-off.

**LASK**
- **Out:** George Bello (muscular) and Moses Usor (shoulder), as listed by UEFA. No doubts or suspensions were reported.

**Liverpool**
- **Out:** Hugo Ekitiké (Achilles), Conor Bradley (knee) and Giovanni Leoni (knee).
- **Doubtful:** Alexander Isak (thigh), Cody Gakpo (ankle) and Dominik Szoboszlai (hamstring tightness, described as a 50/50). Isak and Gakpo both missed the City game.
- **Eligible:** Ryan Gravenberch is suspended for the Premier League trip to Brentford after his red card against City, but a domestic ban does not carry over to this match and he appears in both projected lineups.

**PROJECTED LASK (3-4-1-2):** Jungwirth; Andrade, Alemão, Mbuyamba; Jørgensen, Bogarde, Horváth, Dibango; Ljubičić; Lang, Kalajdzić. UEFA's version uses Tornich in the back three and Daněk in midfield.

**PROJECTED Liverpool (4-2-3-1):** Alisson; Araújo, Jacquet, Van Dijk, Kerkez; Gravenberch, Mac Allister; Muñoz, Wirtz, Barcola; Koumas. UEFA's version has Frimpong, Gomez and Tsimikas in defence and Ngumoha and Chiesa on the flanks.`,
  core: {
    kind: "disclosure" as const,
    note: "A league-phase fixture is a single match rather than a repeated home and away sample, and no sourced HOME/AWAY split in the 22-metric format exists for this tie. The recent results, European records and head-to-head figures used above are the sourced numbers, and they are kept in the prose instead of being repeated in a table.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "The Stats Zone — LASK vs Liverpool preview and team news (updated 13 October 2026)", url: "https://www.thestatszone.com/lask-vs-liverpool-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-229802" },
    { name: "Squawka — LASK vs Liverpool Champions League preview", url: "https://www.squawka.com/us/news/champions-league/match-preview-lask-vs-liverpool-14-10-26-champions-league/" },
    { name: "Squawka — Brentford vs Liverpool preview (Gravenberch Premier League suspension)", url: "https://www.squawka.com/us/news/premier-league/match-preview-brentford-vs-liverpool-17-10-26-premier-league/" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

const astonVillaVsFenerbahce = createPspImport26Prediction({
  ...ucl,
  slug: "aston-villa-vs-fenerbahce",
  home: "Aston Villa",
  away: "Fenerbahçe",
  date: "2026-10-14",
  time: "21:00",
  venue: "Villa Park",
  venueAddress: { addressLocality: "Birmingham", addressCountry: "England" },
  pick: "Aston Villa to win",
  odds: 1.69,
  access: "vip",
  bestAnalysis: true,
  teaser: "Villa's European home run and a perfect head-to-head against Fenerbahçe make this PSP's BEST BET of the Champions League wave. Full pick and odds are in PRIME VIP.",
  trend: "Villa's unbeaten home run headlines PSP's Champions League BEST BET",
  matchAnalysis: [
    "Villa Park has been the foundation of Aston Villa's European record: Unai Emery's side are unbeaten in **13 consecutive** European home matches, winning 12 and the last ten, with **nine clean sheets** in their last 13 there. They arrive after a 3–2 win at Club Brugge on the opening night and a 2–2 league draw with Brentford on Saturday, and the left side of the defence is the selection issue. Ian Maatsen is out, Matteo Ruggeri is a doubt, and Aaron Wan-Bissaka is the likeliest left-back. UEFA lists Leon Goretzka and George Hemmings as doubts, while The Stats Zone puts Goretzka, Amadou Onana and Modou Cissé among those unavailable.",
    "Fenerbahçe are harder to read than their European record suggests. They drew 1–1 at home to Roma on the opening night, Archie Brown equalising after Bryan Cristante's opener, and they are fourth in the Süper Lig after two wins, a draw and two defeats in their first five. In this competition they are eight matches without a win, with three draws and five defeats, and they have trailed at half-time in eight of their last ten Champions League appearances. Villa have also won all three previous meetings without conceding, the latest a 1–0 away win in last season's Europa League. Only Mert Müldür is missing on UEFA's list, so Greenwood, Asensio and Aktürkoğlu behind Muriqi still give the visitors a front line that can punish one lapse.",
  ],
  tactical: "Emery's projected 4-2-3-1 leaves Nicolas Jackson as the lone striker with McGinn, Manzambi and Buendía behind him, while Kamara and João Gomes protect a back four of Cash, Lindelöf, Pau Torres and Wan-Bissaka. Fenerbahçe's 4-2-3-1 counters with Guendouzi and Kanté screening and Greenwood and Aktürkoğlu running into the channels beside Villa's centre-backs. Villa's route is territory and pressure on the second ball, and the danger is losing possession high with a makeshift left side. If Villa score early, a Fenerbahçe team that has been behind at half-time in eight of its last ten Champions League games is pushed into the open game it handles worst.",
  risk: "Fenerbahçe's attacking talent is the obvious danger. One moment from Greenwood, Asensio or Aktürkoğlu can turn a clean-sheet record into a draw, and Villa have dropped points at home to both Brentford and Nottingham Forest in the league this season. A win is also the most demanding result in the 1X2 market, because a 1–1 draw, which is entirely plausible against a team that has drawn three of its eight winless Champions League games, loses the selection.",
  market: "The selection at **1.69** has a raw implied probability of **59.17%** (1 / 1.69). A straight home win suits an unbeaten 13-match European home run, a three-from-three head-to-head record without conceding and a visitor winless in eight Champions League games. Against that, Villa's league draws at home and the left-back problem mean the price already contains a fair share of the home advantage, so the value is in the home record rather than in a bargain number.",
  conclusion: "Villa's European home form, their record against Fenerbahçe and the visitors' winless run make the home win the best-supported outcome, even with a thin left side. The teamsheet, especially who covers at left-back and whether Goretzka is available, is worth a check about an hour before kick-off. The selection therefore remains Aston Villa to win at 1.69.",
  teamNews: `Team news for Aston Villa against Fenerbahçe follows UEFA's matchday listing, updated on 13 October 2026, and The Stats Zone's preview published on 12 October. Both lineups are PROJECTED; official teamsheets arrive about an hour before kick-off.

**Aston Villa**
- **Out:** Ian Maatsen (ankle). The Stats Zone also lists Amadou Onana, Modou Cissé and Leon Goretzka as unavailable.
- **Doubtful:** Matteo Ruggeri (hamstring), George Hemmings (knee), and Goretzka (fitness) on UEFA's list. With both left-backs short, Aaron Wan-Bissaka is expected to cover that side.
- No suspensions were reported.

**Fenerbahçe**
- **Out:** Mert Müldür (knee). The Stats Zone adds Jayden Oosterwolde and Amara Diouf as injured.
- No doubts or suspensions were reported on UEFA's list.

**PROJECTED Aston Villa (4-2-3-1):** Suzuki; Cash, Lindelöf, Pau Torres, Wan-Bissaka; Kamara, João Gomes; McGinn, Manzambi, Buendía; Jackson.

**PROJECTED Fenerbahçe (4-2-3-1):** Ederson; Nélson Semedo, Škriniar, Aké, Brown; Guendouzi, Kanté; Greenwood, Asensio, Aktürkoğlu; Muriqi.`,
  core: {
    kind: "disclosure" as const,
    note: "This is a single league-phase fixture, not a repeated home and away league sample, and no sourced HOME/AWAY split in the 22-metric format exists for it. Villa's European home run, the head-to-head record and Fenerbahçe's winless run are the sourced figures, and they sit in the analysis rather than in a table.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "The Stats Zone — Aston Villa vs Fenerbahce preview and team news (12 October 2026)", url: "https://www.thestatszone.com/aston-villa-vs-fenerbahce-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-229859" },
    { name: "Squawka — Aston Villa vs Fenerbahce Champions League preview", url: "https://www.squawka.com/us/news/champions-league/match-preview-aston-villa-vs-fenerbahce-14-10-26-champions-league/" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

const realBetisVsPorto = createPspImport26Prediction({
  ...ucl,
  slug: "real-betis-vs-porto",
  home: "Real Betis",
  away: "Porto",
  date: "2026-10-14",
  time: "21:00",
  venue: "Estadio de La Cartuja",
  venueAddress: { addressLocality: "Seville", addressCountry: "Spain" },
  pick: "Real Betis double chance (1X) + Over 1.5 total goals",
  odds: 1.71,
  access: "vip",
  bestAnalysis: true,
  teaser: "Betis's European home scoring record and a goal-heavy head-to-head history back this BEST BET against a resilient Porto. Full pick and odds are in PRIME VIP.",
  trend: "Betis's home scoring record anchors PSP's second Champions League BEST BET",
  matchAnalysis: [
    "Real Betis are third in La Liga on **19 points** from eight games, with 14 goals scored and nine conceded, and they opened their Champions League campaign with a 3–2 win at Lille in which they came from behind twice before Troy Parrott scored the winner. The European numbers behind the pick are strong: Betis have scored at least twice in each of their last **nine** European home matches and have lost only one of their last 11 UEFA group or league-phase games. Manuel Pellegrini has seven matches to play before the end of October, so rotation is a theme, but UEFA's projection still lines up Isco and Abde Ezzalzouli behind Parrott.",
    "Porto are the more defensive proposition. They won their first eight Liga Portugal games and conceded only four goals in them, yet lost 2–0 to Manchester City on the opening night with Erling Haaland scoring twice. Jan Bednarek is suspended, William Gomes is out with an ankle problem, Zaidu Sanusi is a doubt and another Costa is listed injured, which leaves their defensive line and left side as the places Betis can probe. Porto have also lost four of their last five against Spanish clubs, although they have trailed at half-time in only three of their last 15 Champions League matches.",
  ],
  tactical: "Betis' 4-2-3-1 gives Isco and Abde Ezzalzouli room between Porto's lines, with Rodrigo Riquelme on the other flank, Bernal and Ceballos as the double pivot and Parrott as the target man. The Stats Zone expects a more pragmatic approach than the 5–2 win over Osasuna, and Porto's 4-3-3 relies on Veiga, Rosário and Froholdt to shield a back four without Bednarek, with Pepê, André Silva and Pietuszewski as the counter-attacking trio. The goals leg needs only two goals in total, so a 1–1 draw would settle both halves of the pick, while a 1–0 either way would not. The first goal matters: if Betis score early, Porto must open up, and if Porto score first, the home side's nine-match run of at least two home goals becomes the main reason to expect a reply.",
  risk: "The caution is Porto's structure. They conceded four goals in eight league games, only three of their last 15 Champions League matches saw them behind at half-time, and none of their last 31 European matches has finished goalless, which cuts both ways. A cagey Porto win or a 1–0 Betis result would defeat the combination, and The Stats Zone leans toward under 2.5 goals for exactly that reason.",
  market: "Converted to a raw implied probability, **1.71** is **58.48%** (1 / 1.71) before the bookmaker's margin. The double chance leg is supported by Betis' home form and Porto's disrupted defence, while the Over 1.5 leg is a low threshold that Betis' European home scoring has cleared in nine straight matches. The value is therefore a modest edge built on the home side's consistency, not a claim that the match will be open.",
  conclusion: "Betis' scoring record at home in Europe, a Porto defence missing Bednarek and the low goals threshold make the combination the better-supported route, with the main risk a tight 1–0. Pellegrini's rotation and the status of Sanusi and Gomes on the Porto side are worth checking in the teamsheets about an hour before kick-off. With that caveat in mind, Real Betis double chance (1X) plus over 1.5 total goals at 1.71 remains the call.",
  teamNews: `Team news for Real Betis against Porto follows UEFA's matchday listing, updated on 13 October 2026, and The Stats Zone's preview published on 12 October. Both lineups are PROJECTED; official teamsheets arrive about an hour before kick-off.

**Real Betis**
- **Out:** Junior Firpo (adductor), who picked up a groin problem on international duty with the Dominican Republic.
- **Doubtful:** Aitor Ruibal (knee), described as a longer-term absentee.
- No suspensions were reported.

**Porto**
- **Suspended:** Jan Bednarek.
- **Out:** William Gomes (ankle) on UEFA's list, although The Stats Zone treats him as a doubt, and J. Costa (injured).
- **Doubtful:** Zaidu Sanusi (adductor).

**PROJECTED Real Betis (4-2-3-1):** Álvaro Vallés; Héctor Bellerín, Marc Bartra, Natan, Fran García; Bernal, Dani Ceballos; Rodrigo Riquelme, Isco, Abde Ezzalzouli; Parrott.

**PROJECTED Porto (4-3-3):** Diogo Costa; Alberto Costa, Nehuén Pérez, Kiwior, Francisco Moura; Gabriel Veiga, Rosário, Froholdt; Pepê, André Silva, Pietuszewski.`,
  core: {
    kind: "disclosure" as const,
    note: "Betis' recent home matches in Europe and Porto's league record are quoted in the analysis, but a single league-phase game is not a repeated home and away league sample and no sourced HOME/AWAY split in the 22-metric format exists for this tie. The sourced figures stay in the prose rather than in a table.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "The Stats Zone — Real Betis vs Porto preview and team news (12 October 2026)", url: "https://www.thestatszone.com/real-betis-vs-porto-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-229863" },
    { name: "FC Barcelona — first-team calendar (Real Betis fixture at Estadio La Cartuja de Sevilla)", url: "https://www.fcbarcelona.com/en/futbol/primer-equipo/calendario" },
    { name: "Wikipedia — 2026–27 La Liga table as of 12 October 2026", url: "https://en.wikipedia.org/wiki/2026%E2%80%9327_La_Liga" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

const bodoGlimtVsDortmund = createPspImport26Prediction({
  ...ucl,
  slug: "bodo-glimt-vs-borussia-dortmund",
  home: "Bodø/Glimt",
  away: "Borussia Dortmund",
  date: "2026-10-14",
  time: "21:00",
  venue: "Aspmyra Stadion",
  venueAddress: { addressLocality: "Bodø", addressCountry: "Norway" },
  pick: "Bodø/Glimt double chance (1X)",
  odds: 1.78,
  access: "free",
  teaser: "Bodø/Glimt's home run in Europe and a recent draw in Dortmund support the double chance, despite a brutal opening scoreline. The prediction is FREE; the full reasoning remains available with PRIME VIP.",
  trend: "Bodø/Glimt's home run against Dortmund's scoring power",
  matchAnalysis: [
    "Bodø/Glimt's 5–0 defeat at Bayern on the opening night was brutal, but Aspmyra is a different environment. They have won **seven straight home matches** in all competitions, scoring **21 goals**, and were last beaten there in early May. At the same ground last season they beat Manchester City 3–1, Inter 3–1 and Sporting 3–0 in this competition. Kjetil Knutsen's side beat Kristiansund 3–1 in the Eliteserien at the weekend and are level on points with Viking at the top. Odin Luras Bjørtuft is suspended after his red card at Bayern, and Hákon Evjen, Magnus Riisnæs and August Mikkelsen are injured, but Andreas Helmersen, rested for the league game, is expected back.",
    "Borussia Dortmund are in better form than Friday's 2–2 draw at Werder Bremen suggests. Niko Kovač's side beat Villarreal 3–2 on the opening night with a Serhou Guirassy brace and are unbeaten in seven matches across competitions, with six wins and a draw. Nico Schlotterbeck and Ramy Bensebaïni are back from suspensions carried over from last season's Champions League, which restores the centre of the back line, while Julian Ryerson is a doubt with a rib injury and Emre Can is still out after a serious knee problem. The attacking record is the real threat to the hosts: Dortmund's last 17 league-phase matches have produced 75 goals, and their seven meetings with Norwegian opposition have averaged 5.29 goals per game, with one defeat.",
  ],
  tactical: "The projected shapes pit a Bodø/Glimt 4-3-3 against a Dortmund back three. Helmersen, who has 12 top-flight goals this calendar year, Blomberg and Hauge form a front line that has scored three times in each of the home European wins, and with Bjørtuft suspended the centre-back pairing is rebuilt around Aleesami and either Gundersen, on UEFA's projection, or Nielsen, on others. Dortmund's Guirassy leads a front line supported by Beier and Bellingham, and Sabitzer, Veerman and Nmecha will try to control the middle. Last season's 2–2 in Dortmund, in which Bodø twice came from behind, is the template for the hosts: an early Dortmund goal does not end the contest at Aspmyra, but an early Bodø goal would force a visiting side with Can and Ryerson short to chase.",
  risk: "Dortmund's finishing is the plain danger. The 5–0 loss at Bayern shows how Bodø's defence can be opened up even when the home record is strong, the visitors have scored heavily against Norwegian clubs, and a Dortmund win would defeat the selection. The rebuilt centre of defence without Bjørtuft is the specific weakness a side like Dortmund will target.",
  market: "Taking **1.78** at face value gives a raw implied probability of **56.18%** (1 / 1.78), a figure that treats Bodø/Glimt as slightly better than a coin flip not to lose against a team with stronger individual quality. The home record and last season's draw in Dortmund justify taking that price, while the Bayern result and Dortmund's goal volume explain why it is not shorter, so the value case is a narrow one built on venue.",
  conclusion: "Bodø/Glimt's home form is the strongest argument available, and Dortmund's travelling record against Norwegian clubs is not perfect. The risks are a patched-up centre-back pairing and Dortmund's scoring power, so the confirmed teamsheets, especially who partners Aleesami, are worth a check about an hour before kick-off. Nothing in the latest news changes the selection: Bodø/Glimt on the double chance (1X) at 1.78.",
  teamNews: `Team news for Bodø/Glimt against Borussia Dortmund follows UEFA's matchday listing, updated on 13 October 2026, and Sports Mole's preview published on 12 October. Both lineups are PROJECTED and the previews disagree on a few names; the official teamsheets arrive about an hour before kick-off.

**Bodø/Glimt**
- **Suspended:** Odin Luras Bjørtuft, after his red card in the defeat at Bayern.
- **Out:** Hákon Evjen (knee), Magnus Riisnæs (knee) and August Mikkelsen (groin).
- **Back:** Andreas Helmersen was rested for the weekend league game and is expected to return.

**Borussia Dortmund**
- **Doubtful:** Julian Ryerson (rib, picked up on Norway duty; Sports Mole expects him to miss out) and Chukwumeka (muscular).
- **Out:** Emre Can, still recovering from a serious knee injury and yet to feature this season.
- **Back:** Nico Schlotterbeck and Ramy Bensebaïni return after serving suspensions carried over from last season.

**PROJECTED Bodø/Glimt (4-3-3):** Haikin; Sjøvold, Aleesami, Gundersen, Bjørkan; Auklend, Berg, Brunstad Fet; Blomberg, Helmersen, Hauge. Sports Mole has Nielsen in the centre of defence and Kitolano in midfield.

**PROJECTED Borussia Dortmund (3-4-2-1):** Kobel; Gadou, Anton, Schlotterbeck; Sabitzer, Veerman, Nmecha, Svensson; Bellingham, Beier; Guirassy.`,
  core: {
    kind: "disclosure" as const,
    note: "A league-phase game is a single fixture rather than a repeated home and away league sample, so no sourced HOME/AWAY split in the 22-metric format exists for it. Bodø/Glimt's run of home wins, Dortmund's goal record and the head-to-head from last season are the sourced figures, and they are written into the analysis.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "Sports Mole — Bodø/Glimt vs Dortmund preview, team news and predicted lineups (12 October 2026)", url: "https://www.sportsmole.co.uk/football/bodo-glimt/champions-league/preview/bodoglimt-vs-dortmund-prediction-team-news-lineups_606732.html" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

const manCityVsPsg = createPspImport26Prediction({
  ...ucl,
  slug: "manchester-city-vs-psg",
  home: "Manchester City",
  away: "Paris Saint-Germain",
  date: "2026-10-14",
  time: "21:00",
  venue: "Etihad Stadium",
  venueAddress: { addressLocality: "Manchester", addressCountry: "England" },
  pick: "Manchester City double chance (1X) + Over 1.5 total goals",
  odds: 1.67,
  access: "vip",
  teaser: "City's long home unbeaten run meets a PSG side with their own strong recent record against English clubs. Full pick and odds are in PRIME VIP.",
  trend: "City's home consistency against PSG's attacking quality",
  matchAnalysis: [
    "Manchester City are perfect through six Premier League games under Enzo Maresca and arrive off a **3–0 win at Anfield** in which Liverpool were reduced to ten men. The red card flatters the scoreline, so the more useful number is the home record: City have lost just **one of their last 25** Champions League home group- or league-phase matches, winning 21 and drawing three, and they have kept five clean sheets this season. UEFA lists nobody as out. Phil Foden is eligible after serving a domestic ban, Antoine Semenyo has recovered from an ankle problem, and Jérémy Doku is back from a calf injury but expected to start on the bench.",
    "Paris Saint-Germain remain the standard in this competition. They opened with a 6–1 win over Slovan Bratislava in which Ferran Torres scored a hat-trick and Ousmane Dembélé scored and assisted twice, then rested several regulars for Saturday's game against Le Mans, so Dembélé, Nuno Mendes, Marquinhos and Willian Pacho are expected back. Only Senny Mayulu (a thigh injury, about a month out) is listed absent. PSG are unbeaten in their last **nine** against English clubs and won 4–2 at City in January 2025, yet City have won four of the eight meetings overall and all three Champions League games in Manchester.",
  ],
  tactical: "The matchup turns on the middle of the pitch. City's projected double pivot of Enzo Fernández and either Anderson or Bouaddi faces a PSG trio of João Neves, Vitinha and Fabián Ruiz, and how quickly the pivot closes Vitinha determines how much of the ball PSG keep. City's best route is transition: Semenyo's runs can drag Nuno Mendes wide and open the channel between Marquinhos and Pacho for Erling Haaland, while PSG's threat is Hakimi overlapping Doué into the space around Gvardiol and Cherki. Donnarumma, who spent two seasons at PSG with Dembélé, faces his old club for the first time since leaving. A City goal in the first half would put PSG's possession under pressure, but an early PSG goal would test City's recent run of clean sheets.",
  risk: "PSG's pedigree is the obvious counterweight. They beat City 4–2 in the last meeting, they are unbeaten in nine against English clubs, and they can win outright rather than just contribute to the goals total. The goals leg is likely to be met, so the double chance leg carries most of the risk, and a 0–0 or 1–0 home result would defeat the combination.",
  market: "The market price of **1.67** corresponds to a raw implied probability of **59.88%** (1 / 1.67). Opta's published simulation gives City a 44.1% chance of winning, PSG 32.0% and the draw 23.9%, which adds up to 68.0% for the double chance before any goals condition. The Over 1.5 leg explains most of the gap between that figure and the price, and it is a low bar, so the value case is a home side that rarely loses at the Etihad being priced slightly below Opta's estimate.",
  conclusion: "City's home record, their league form and the quality PSG face in transition make the double chance a reasoned choice, while a two-goal threshold is a low bar in a game between two of the strongest attacks in the competition. Check the confirmed teamsheets for Foden and Doku on the City side and for Dembélé, Mendes and Marquinhos at PSG about an hour before kick-off. Manchester City on the double chance (1X) plus over 1.5 total goals at 1.67 therefore stands.",
  teamNews: `Team news for Manchester City against Paris Saint-Germain follows UEFA's matchday listing, updated on 13 October 2026, and RotoWire's preview published on 12 October. Both lineups are PROJECTED; official teamsheets arrive about an hour before kick-off.

**Manchester City**
- **Out:** none listed by UEFA.
- **Back:** Phil Foden, eligible after serving a three-match domestic ban. Antoine Semenyo has recovered from the ankle problem that cut short his Ghana duty, and Jérémy Doku is returning from a calf injury and is expected to be a substitute.
- **Check:** Nico O'Reilly was listed as doubtful last week with an undisclosed issue and was replaced after 66 minutes against Liverpool.
- No suspensions were reported.

**Paris Saint-Germain**
- **Out:** Senny Mayulu (thigh), expected to be unavailable for about a month.
- **Back:** Ousmane Dembélé and Nuno Mendes were rested for the Le Mans game and are back in training; Marquinhos and Willian Pacho were on the bench and are expected to return. Warren Zaïre-Emery (adductor) and Ferran Torres (ankle) were cleared after leaving international camps with discomfort, and Achraf Hakimi is back from a thigh problem.
- No suspensions were reported.

**PROJECTED Manchester City (4-2-3-1):** Donnarumma; Matheus Nunes, Guéhi, Rúben Dias, Gvardiol; Enzo Fernández, Anderson; Semenyo, Foden, Cherki; Haaland. RotoWire has Bouaddi in midfield in place of Anderson.

**PROJECTED Paris Saint-Germain (4-3-3):** Safonov; Hakimi, Marquinhos, Pacho, Nuno Mendes; João Neves, Vitinha, Fabián Ruiz; Doué, Dembélé, Kvaratskhelia.`,
  core: {
    kind: "disclosure" as const,
    note: "A league-phase fixture is a single game rather than a repeated home and away league sample, and no sourced HOME/AWAY split in the 22-metric format exists for this tie. City's home record, the head-to-head results and Opta's published probabilities are the sourced figures, and they are written into the analysis.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "RotoWire — Manchester City vs PSG prediction, predicted lineups and team news (12 October 2026)", url: "https://www.rotowire.com/soccer/article/manchester-city-vs-psg-prediction-predicted-lineups-team-news-140682" },
    { name: "Opta Analyst — Man City vs PSG Champions League preview (October 2026)", url: "https://theanalyst.com/articles/man-city-vs-psg-prediction-champions-league-preview-10-2026" },
    { name: "Squawka — Manchester City vs PSG Champions League preview", url: "https://www.squawka.com/us/news/champions-league/match-preview-manchester-city-vs-psg-14-10-26-champions-league/" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

const romaVsRealMadrid = createPspImport26Prediction({
  ...ucl,
  slug: "roma-vs-real-madrid",
  home: "Roma",
  away: "Real Madrid",
  date: "2026-10-14",
  time: "21:00",
  venue: "Stadio Olimpico",
  venueAddress: { addressLocality: "Rome", addressCountry: "Italy" },
  pick: "Over 2.5 total goals",
  odds: 1.42,
  access: "vip",
  teaser: "Roma's strong home record and Madrid's finishing quality against Italian sides both point toward goals in Rome. Full pick and odds are in PRIME VIP.",
  trend: "Roma's home form meets Madrid's finishing against Italian sides",
  matchAnalysis: [
    "Roma remain unbeaten in Serie A with **four wins and two draws**, 14 goals scored and only three conceded, yet the last two results, a 2–2 draw with Inter and a goalless draw at Como in which Donyell Malen was sent off, have slowed a strong start. Malen's ban applies to Serie A only and he is expected to lead the line in Europe. Mile Svilar is out with a foot injury so Gollini keeps goal, Bryan Cristante's knee problem leaves the midfield short, and Roma face Genoa on Saturday. They opened the Champions League with a 1–1 draw at Fenerbahçe, and they have won eight of their last nine Champions League matches in Rome.",
    "Real Madrid, now managed by José Mourinho, who returns to the city where he won the Conference League, beat Inter 2–1 on the opening night through Mbappé and Valverde. In La Liga they have scored 19 and conceded eight in eight games, six points behind Barcelona, and beat Villarreal 1–0 last time out despite Vinícius being sent off. Vinícius is available for Europe, Dean Huijsen is eligible again, and Camavinga, Güler and Bernardo Silva are back from UEFA bans, while Éder Militão, Rodrygo and Raúl Asencio are out. Madrid have won eight of 12 meetings with Roma, the last four without conceding, and 20 of their last 22 against Italian clubs, so goals are not guaranteed, as several of those wins were controlled rather than open.",
  ],
  tactical: "Roma's projected shape is a back three of Mancini, Balerdi and N'Dicka with Molina and Wesley França as wing-backs, Koné and De Roon in the middle and Soulé supporting Dybala and Malen. Madrid's 4-2-3-1 will ask Valverde and Tchouaméni to protect a back four while Güler, Bellingham and Vinícius feed Mbappé, whose 100th Champions League appearance is a milestone this week. The over rests on the exchange of transitions: if Roma commit wing-backs forward at the Olimpico they leave the channels that Mbappé and Vinícius attack, and if Madrid score early Roma's home form suggests a response. A cautious first half with a late goal, or an early Madrid goal followed by a controlled game, would leave the total at two.",
  risk: "The case against the over is Roma's defence. They have conceded three goals in six league games, they kept Como at bay despite playing a man down, and Madrid's four straight clean sheets against them show how a 1–0 or 2–0 can happen. A 1–1 draw, a 2–0 Madrid win or a 1–0 either way all fall short of three goals.",
  market: "At **1.42** the raw implied probability is **70.42%** (1 / 1.42). The league numbers support a high-scoring game on average, with Madrid's league matches averaging 3.38 goals and Roma's 2.83, but averages hide how often low-scoring results occur, so the price already carries most of the case. The value is therefore a small one, built on two attacks in form rather than a gap in the numbers.",
  conclusion: "Roma's improving attack and Madrid's finishing give three goals a clear route, and both teams' league games average more than that. The risk is a cagey game that Madrid control, so the starting lineups, especially whether Malen and Dybala start for Roma and whether Mbappé and Vinícius play together, are worth checking about an hour before kick-off. On balance, over 2.5 total goals at 1.42 still reads as the better side of the argument.",
  teamNews: `Team news for Roma against Real Madrid follows UEFA's matchday listing, updated on 13 October 2026, and Sports Mole's preview published on 12 October. Both lineups are PROJECTED; official teamsheets arrive about an hour before kick-off.

**Roma**
- **Out:** Mile Svilar (foot), Bryan Cristante (knee). Gollini is expected in goal.
- **Doubtful:** Koulierakis (knee).
- **Available:** Donyell Malen was sent off at Como and is banned for Serie A only, so he is expected to start in Europe.

**Real Madrid**
- **Out:** Éder Militão (thigh), Rodrygo (knee) and Raúl Asencio (stress fracture). Sports Mole also lists Ferland Mendy.
- **Back:** Dean Huijsen is eligible after a domestic suspension, and Eduardo Camavinga, Arda Güler and Bernardo Silva are available again after UEFA bans. Vinícius Júnior faces a La Liga suspension that does not apply here.
- No other suspensions were reported.

**PROJECTED Roma (3-4-2-1):** Gollini; Mancini, Balerdi, N'Dicka; Molina, De Roon, Koné, Wesley França; Soulé; Dybala, Malen.

**PROJECTED Real Madrid (4-2-3-1):** Courtois; Alexander-Arnold, Konaté, Huijsen, Cucurella; Valverde, Tchouaméni; Güler, Bellingham, Vinícius Júnior; Mbappé. Sports Mole has Dumfries, Rüdiger and Carreras in defence and Bernardo Silva in midfield.`,
  core: {
    kind: "disclosure" as const,
    note: "A league-phase fixture is a single game rather than a repeated home and away league sample, so no sourced HOME/AWAY split in the 22-metric format exists for this tie. Roma's and Madrid's league goal totals, the head-to-head record and Roma's home European record are the sourced figures, and they are written into the analysis.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "Sports Mole — Roma vs Real Madrid preview, team news and predicted lineups (12 October 2026)", url: "https://www.sportsmole.co.uk/football/roma/champions-league/preview/roma-vs-real-madrid-prediction-team-news-lineups_606745.html" },
    { name: "Squawka — Roma vs Real Madrid Champions League preview", url: "https://www.squawka.com/us/news/champions-league/match-preview-roma-vs-real-madrid-14-10-26-champions-league/" },
    { name: "Wikipedia — 2026–27 Serie A and La Liga tables as of 12 October 2026", url: "https://en.wikipedia.org/wiki/2026%E2%80%9327_Serie_A" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

const shakhtarVsAekAthens = createPspImport26Prediction({
  ...ucl,
  slug: "shakhtar-donetsk-vs-aek-athens",
  home: "Shakhtar Donetsk",
  away: "AEK Athens",
  date: "2026-10-14",
  time: "21:00",
  venue: "Stamford Bridge, London",
  venueAddress: { addressLocality: "London", addressCountry: "England" },
  pick: "Shakhtar Donetsk double chance (1X)",
  odds: 1.51,
  access: "vip",
  teaser: "Shakhtar's broader European consistency against a similarly resilient AEK side supports the draw-protected pick. Full pick and odds are in PRIME VIP.",
  trend: "Two resilient sides with close European records",
  matchAnalysis: [
    "Shakhtar arrive with domestic momentum, having won seven of their eight league matches to sit two points clear of Polissya Zhytomyr and five ahead of Dynamo Kyiv. Their league-phase opener was a 1–1 draw at PSV in which Gleiker Mendoza scored first and Sergiño Dest equalised, which fits a longer European record of just **four defeats in 21** UEFA fixtures, with ten wins and seven draws. Pedrinho is expected back from a hamstring problem and appears in UEFA's projected XI, while Eguinaldo and Azarov are out and Marlon Santos is a doubt. The home ground is Stamford Bridge, where Shakhtar are playing their Champions League home games this season, so the usual home advantage is diluted.",
    "AEK Athens come in with rhythm. Marko Nikolić's side beat LASK 1–0 on the opening night through a Razvan Marin free kick, won again against OFI Crete at the weekend and are unbeaten in their first seven Greek Super League matches, one point behind Panathinaikos. They have lost only **three of their last 20** UEFA matches, with 12 wins and five draws. Goalkeeper Thomas Strakosha is out and Barnabás Varga is nearing a return from a muscle problem, so Brignoli is projected in goal. Shakhtar have never lost in five meetings with Greek opposition, though four of those were draws, which is relevant to a 1X selection because the home side does not need to win.",
  ],
  tactical: "Shakhtar's projected 4-1-4-1 uses Ocheretko as the single holding midfielder, with Alisson Santana, Pedrinho, Marlon Gomes and Mendoza behind Kauã Elias, while AEK's 4-4-2 sets Majer, Marin, Vitális and Koita in a flat midfield behind Jović and Zini. The Stats Zone expects a cagey game and AEK to be resolute, which suggests a tempo that rewards the side willing to defend deep and counter. For the double chance, the question is whether Shakhtar can win the central duels between Ocheretko and Marin without Eguinaldo, and whether Pedrinho's fitness restores their creative link. An early Shakhtar goal would push AEK out of their shape, whereas a quiet first half favours a draw.",
  risk: "AEK's European form, with only three defeats in 20 UEFA matches, is close enough to Shakhtar's that the game is hard to separate, and the neutral-ground feel at Stamford Bridge takes away the edge a normal home venue provides. A first goal for AEK would force Shakhtar to chase from behind against a side that has beaten LASK 1–0 by managing a lead.",
  market: "Dividing one by the **1.51** price gives a raw implied probability of **66.23%** (1 / 1.51). That is a high number for a game with two matched records, yet the double chance covers the draw, which the head-to-head record with Greek clubs makes likely: four draws in five meetings. The value is therefore in the draw protection more than in any gap between the teams.",
  conclusion: "Shakhtar's domestic form, their long unbeaten European record and the draw cover make the double chance the lower-variance way to back the home side, with AEK the more resilient visitor than the price suggests. Pedrinho's fitness and Marlon Santos's status are the details to check about an hour before kick-off. That keeps Shakhtar Donetsk on the double chance (1X) at 1.51 as the position.",
  teamNews: `Team news for Shakhtar Donetsk against AEK Athens follows UEFA's matchday listing, updated on 13 October 2026, and The Stats Zone's preview published on 12 October. Both lineups are PROJECTED; official teamsheets arrive about an hour before kick-off.

**Shakhtar Donetsk**
- **Out:** Eguinaldo (shoulder) and Azarov.
- **Doubtful:** Marlon Santos (muscular).
- **Returning:** Pedrinho is expected back from a hamstring problem in mid-October and is in UEFA's projected XI.
- No suspensions were reported.

**AEK Athens**
- **Out:** Thomas Strakosha (hand/wrist).
- **Doubtful:** Barnabás Varga (muscular), who is nearing a return.
- No suspensions were reported.

**PROJECTED Shakhtar Donetsk (4-1-4-1):** Riznyk; Vinícius Tobías, Bondar, Matviyenko, Pedro Henrique; Ocheretko; Alisson Santana, Pedrinho, Marlon Gomes, Mendoza; Kauã Elias.

**PROJECTED AEK Athens (4-4-2):** Brignoli; Rota, Moukoudi, Filipe Relvas, Pilios; Majer, Marin, Vitális, Koita; Jović, Zini.`,
  core: {
    kind: "disclosure" as const,
    note: "A league-phase game is a single fixture rather than a repeated home and away league sample, and no sourced HOME/AWAY split in the 22-metric format exists for this tie. The European records, domestic form and head-to-head history above are the sourced figures, and they are written into the analysis.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "The Stats Zone — Shakhtar Donetsk vs AEK Athens preview and team news (12 October 2026)", url: "https://www.thestatszone.com/shakhtar-donetsk-vs-aek-athens-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-229866" },
    { name: "Squawka — Shakhtar Donetsk vs AEK Athens Champions League preview", url: "https://www.squawka.com/us/news/champions-league/match-preview-shakhtar-donetsk-vs-aek-athens-14-10-26-champions-league/" },
    { name: "Football Ground Guide — Champions League fixtures Stamford Bridge will host in 2026-27", url: "https://footballgroundguide.com/news/the-four-champions-league-fixtures-stamford-bridge-will-host-in-2026-27-season-as-special-one-returns.html" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

const slovanBratislavaVsStuttgart = createPspImport26Prediction({
  ...ucl,
  slug: "slovan-bratislava-vs-stuttgart",
  home: "Slovan Bratislava",
  away: "Stuttgart",
  date: "2026-10-14",
  time: "21:00",
  venue: "Tehelné pole (Národný futbalový štadión)",
  venueAddress: { addressLocality: "Bratislava", addressCountry: "Slovakia" },
  pick: "Stuttgart to win + Under 4.5 total goals",
  odds: 1.91,
  access: "vip",
  teaser: "Stuttgart's unbeaten record against Slovakian clubs is weighed against Slovan's recent habit of finding the net. Full pick and odds are in PRIME VIP.",
  trend: "Stuttgart's record against Slovakian clubs vs. Slovan's recent scoring habit",
  matchAnalysis: [
    "Stuttgart come off a 3–1 home win over Viking on the opening night and a 2–0 win at newly promoted Paderborn at the weekend, in which Chris Führich scored twice. Sebastian Hoeneß's side have scored **25 goals** in seven matches across competitions, and the attacking group behind that total is projected again, with El Khannouss, Undav and Führich supporting Demirović. The injury list is the concern: Nartey, Tiago Tomás, Al-Dakhil and Jaquez are out, and Jeff Chabot and Maximilian Mittelstädt are doubts, though both appear in the projected back line and The Stats Zone expects them to push through.",
    "Slovan are the Slovak champions and, unusually this deep into the league phase, report a fully fit squad. The resources for a result are limited: they lost **6–1 at Paris Saint-Germain** on the opening night and have now lost all nine of their Champions League main-stage matches, including eight last season with 27 goals conceded, although they have scored in each of the last six. Yaya Touré's side may be more competitive at home than away. Stuttgart are unbeaten in seven meetings with Slovakian clubs, winning five and drawing two, and beat Slovan 3–1 in the 2024/25 league phase, with Jamie Leweling scoring twice.",
  ],
  tactical: "Stuttgart's projected 4-2-3-1 gives Undav a free role behind Demirović, with Führich and El Khannouss working the half-spaces against a Slovan back line of Blackman, Bajrić, Marković and Cruz. Slovan's 4-3-3 relies on Martínez, Pokorný and Ibrahim in midfield to disrupt the build-up and on Barseghyan, Šporar and Camara to counter, and their record of scoring in six straight Champions League games shows that they threaten even when overmatched. The selection needs Stuttgart to win and the game to stay at four goals or fewer, so a controlled 2–1 or 3–1 fits; the danger is an open game in which Stuttgart's attacking depth produces a 4–1, 5–1 or 4–2. Slovan's heavy defeat at PSG suggests they will concede space if they chase.",
  risk: "The Under 4.5 leg is the more fragile half. Slovan conceded six in Paris and 27 across eight league-phase games last season, Stuttgart have scored 25 in seven matches this season, and two or three early goals could take the game beyond the threshold. Stuttgart's defensive absences, with Chabot and Mittelstädt both carrying doubts, also give Slovan a route to a goal or two.",
  market: "The combination at **1.91** has a raw implied probability of **52.36%** (1 / 1.91). A Stuttgart win is the most probable single result, but pairing it with a goals cap trims the chance of a heavy win, so the market is not asking much. The value comes from Stuttgart's record against Slovakian opposition and Slovan's inability to win a Champions League game, offset by the real chance of a high-scoring win.",
  conclusion: "Stuttgart are clearly the better side and their record against Slovakian clubs supports the win, while the Under 4.5 leg is a mild safeguard against a rout. The confirmed lineup, especially whether Chabot and Mittelstädt start, and Stuttgart's choice of attack are worth checking about an hour before kick-off. The selection therefore remains Stuttgart to win plus under 4.5 total goals at 1.91.",
  teamNews: `Team news for Slovan Bratislava against Stuttgart follows UEFA's matchday listing, updated on 13 October 2026, and The Stats Zone's preview published on 12 October. Both lineups are PROJECTED; official teamsheets arrive about an hour before kick-off.

**Slovan Bratislava**
- **Out:** none listed. The Stats Zone describes the squad as fully fit.
- No suspensions were reported.

**Stuttgart**
- **Out:** Nartey (thigh), Tiago Tomás (muscular), Al-Dakhil (knee) and Luca Jaquez (muscular).
- **Doubtful:** Jeff Chabot (muscular) and Maximilian Mittelstädt (foot), both named in the projected lineup and expected by The Stats Zone to push through.
- No suspensions were reported.

**PROJECTED Slovan Bratislava (4-3-3):** Takáč; Blackman, Bajrić, Marković, Sandro Cruz; Martínez, Pokorný, Ibrahim; Barseghyan, Šporar, Suleiman Camara.

**PROJECTED Stuttgart (4-2-3-1):** Seimen; Vagnoman, Jeltsch, Chabot, Mittelstädt; Prömel, Stiller; El Khannouss, Undav, Führich; Demirović.`,
  core: {
    kind: "disclosure" as const,
    note: "A league-phase fixture is a single game rather than a repeated home and away league sample, so no sourced HOME/AWAY split in the 22-metric format exists for it. Slovan's Champions League record, Stuttgart's scoring total and the earlier meeting are the sourced figures, and they are written into the analysis.",
  },
  sources: [
    ...uclSources,
    uefaPredictedLineups,
    { name: "The Stats Zone — Slovan Bratislava vs Stuttgart preview and team news (12 October 2026)", url: "https://www.thestatszone.com/slovan-bratislava-vs-stuttgart-preview-team-news-prediction-2026-27-uefa-champions-league-league-phase-229872" },
    { name: "Squawka — Slovan Bratislava vs Stuttgart Champions League preview", url: "https://www.squawka.com/us/news/champions-league/match-preview-slovan-bratislava-vs-stuttgart-14-10-26-champions-league/" },
  ],
  publishedAt: uclPublishedAt,
  updatedAt: oct14RefreshAt,
});

export const championsLeagueRound20261013 = [
  lensVsSportingCp,
  sabahVsSlaviaPraha,
  arsenalVsLille,
  atleticoMadridVsManUnited,
  galatasarayVsBarcelona,
  interVsClubBrugge,
  rbLeipzigVsPsvEindhoven,
  vikingVsBayern,
  villarrealVsNapoli,
  feyenoordVsComo,
  laskVsLiverpool,
  astonVillaVsFenerbahce,
  realBetisVsPorto,
  bodoGlimtVsDortmund,
  manCityVsPsg,
  romaVsRealMadrid,
  shakhtarVsAekAthens,
  slovanBratislavaVsStuttgart,
];
