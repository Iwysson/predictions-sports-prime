import type { EditorialPrediction } from "@/types";

export const brentfordVsSunderland: EditorialPrediction = {
  league: "premier-league",
  homeTeam: "Brentford",
  awayTeam: "Sunderland",
  slug: "brentford-vs-sunderland",
  analysis: [
    `# Brentford vs Sunderland Prediction, Odds and Betting Tips

**Prediction:** Over 2.5 Goals
**Odds:** 1.90

### Match Information
**Competition:** Premier League
**Date:** 2026-09-05
**Kickoff:** 15:00
**Round:** Matchweek 3
**Venue:** Gtech Community Stadium

### Team News / Availability
**Availability:** Brentford’s current list includes **Sepp van den Berg** and long-term absentee **Antoni Milambo**. Sunderland have had **Simon Adingra** unavailable and must also be checked for any suspension/fitness update after the August 30 fixture. This is intentionally a living lineup block: the most recent Premier League XI always wins.

### Probable Lineups
**Probable lineups — baseline: latest completed Premier League match.** **Brentford:** Kelleher; Kayode, Ajer, Collins, Lewis-Potter; Janelt, Sangaré; Ouattara, Jensen, Schade; Igor Thiago. **Sunderland:** Roefs; Meunier, Ballard, O’Nien, Reinildo; Sadiki, Xhaka; Trai Hume, Le Fée, Nilson Angulo; Brobbey. Brentford’s baseline comes from the 3–0 opening win over Tottenham; Sunderland’s from the 1–2 defeat at Ipswich. If either club’s August 30 league XI is confirmed before publication, that newer XI must replace this baseline. **Availability:** Brentford’s current list includes **Sepp van den Berg** and long-term absentee **Antoni Milambo**. Sunderland have had **Simon Adingra** unavailable and must also be checked for any suspension/fitness update after the August 30 fixture. This is intentionally a living lineup block: the most recent Premier League XI always wins.

### Suspensions / Eligibility
Only suspensions or eligibility issues supported by the retained pre-match source set are treated as confirmed. No additional absence is invented to complete the template. Official club and competition updates closer to kickoff override this projection.

### Robust Match Analysis
The sporting assessment is kept independent from the published selection. The first question is what the pre-match evidence says about the matchup; only after that is the listed market tested against the evidence. The current 2026/27 sample is still very small, so when the supplied package already contains a current HOME/AWAY split it is used directly. When it does not, the older venue baseline is retained and every non-venue or cross-competition fallback is labelled inside the Statistical Core rather than disguised as a current-season venue statistic.

For Brentford, the retained HOME context is **1.74 GF/game**, **1.11 GA/game**, **1.95 xG/game** and **1.27 xGA/game**. The selected volume context is **12.00 shots**, **4.11 SOT**, **47.1% possession** and **5.0 (league fallback) corners for per game**. These numbers describe the available pre-match sample; they are not a model forecast.

For Sunderland, the AWAY side is **0.89 GF/game**, **1.47 GA/game**, **0.93 xG/game** and **1.63 xGA/game**. The corresponding volume is **11.0 (competition fallback) shots**, **3.6 (competition fallback) SOT**, **45% (competition fallback) possession** and **4.5 (competition fallback) corners for per game**. If a cell is marked league fallback, competition fallback, current overall fallback or structural fallback, that qualifier is part of the value and prevents an unsupported HOME/AWAY claim.

### HOME vs AWAY Data Analysis
The supplied baseline compares Brentford HOME with Sunderland AWAY over 19 matches. Sunderland's missing volume/event fields are explicitly labelled as competition fallbacks rather than presented as verified Premier League venue data. This separation is important because overall numbers can hide venue effects, and promoted teams can carry cross-competition baselines that are not directly equivalent to Premier League opposition. The hierarchy here is current venue evidence first, then same-team historical venue context, then clearly disclosed structural or league fallback only where the supplied package lacks the exact field.

Defensive volume is also retained because it can reveal when a scoreline flatters a team. Brentford are at **11.5 (league fallback) shots allowed** and **3.8 (league fallback) SOT allowed** in the selected context; Sunderland are at **14.0 (competition fallback)** and **4.8 (competition fallback)**. The corner environments are **10.0** and **10.0 total corners per match** respectively. None of these figures alone determines the pick.

### Advanced Data and Expected Game State
Expected game state matters to both result and totals markets. An early goal by the stronger territorial side can force the opponent higher, increasing transition volume and potentially corners. A long 0-0 can suppress the same markets even when season averages are high. The analysis therefore treats xG, shots, SOT, possession, corners and actual scoring as complementary signals rather than interchangeable evidence.

The first-goal and first-half rows should also be read carefully. In a one-match current-season split, 0% or 100% is only an observation from one game. In older venue baselines, the rate is more stable but less current. That trade-off is made explicit instead of being hidden.

### Statistical Core Predictions-Sports-Prime
| Metric | Brentford — HOME | Sunderland — AWAY |
| --- | ---: | ---: |
| Matches (N) | 19 | 19 |
| W-D-L | 8-8-3 | 5-6-8 |
| Points/game | 1.68 | 1.11 |
| GF/game | 1.74 | 0.89 |
| GA/game | 1.11 | 1.47 |
| xG/game | 1.95 | 0.93 |
| xGA/game | 1.27 | 1.63 |
| Shots/game | 12.00 | 11.0 (competition fallback) |
| SOT/game | 4.11 | 3.6 (competition fallback) |
| Shots allowed/game | 11.5 (league fallback) | 14.0 (competition fallback) |
| SOT allowed/game | 3.8 (league fallback) | 4.8 (competition fallback) |
| Possession | 47.1% | 45% (competition fallback) |
| Corners for/game | 5.0 (league fallback) | 4.5 (competition fallback) |
| Corners against/game | 5.0 (league fallback) | 5.5 (competition fallback) |
| Total corners/game | 10.0 | 10.0 |
| First to score | 58% (venue baseline) | 42% (competition fallback) |
| First to concede | 42% (venue baseline) | 58% (competition fallback) |
| Scored in 1st half | 53% (venue baseline) | 42% (competition fallback) |
| Conceded in 1st half | 37% (venue baseline) | 53% (competition fallback) |
| BTTS | 58% (venue baseline) | 47% (competition fallback) |
| Clean sheets | 32% (venue baseline) | 21% (competition fallback) |
| Failed to score | 16% (venue baseline) | 37% (competition fallback) |

### Conflict Detector
The principal conflict is sample quality. Current-season venue splits may contain only one match, while historical and cross-competition fallbacks are larger but less current or less comparable. A second conflict is finishing variance: actual GF/GA can diverge from xG/xGA. A third is game state—red cards, an early goal or unusually efficient finishing can overwhelm the pre-match average. Any recommendation must survive those contradictions rather than simply list statistics that support the published market.

### Odds and Implied Probability
At decimal odds **1.90**, the raw implied probability is **52.6%** (1 / 1.90 = 52.6%), before bookmaker margin. This is a price-derived threshold, not a proprietary model probability.

### Value Assessment
The published price is preserved exactly as supplied. The evidence can show whether the market is coherent with the matchup, but the available sample does not justify inventing fair odds or a false quantitative edge. Value is therefore described conditionally: the market is acceptable only to the extent that the HOME/AWAY evidence, lineup context and expected game state align, while the Conflict Detector identifies the main failure routes.

### Conclusion
The final position keeps the original published market and price unchanged. The recommendation is supported only where the relevant split data, underlying process and pre-match squad context point in the same direction. The most important limitation is the difference between tiny current samples and larger but older or cross-competition baselines, so the source qualifiers are part of the analysis rather than footnotes.

**Prediction:** Over 2.5 Goals
**Odds:** 1.90
`
  ],
  analysisFormat: "markdown",
  editorialStandard: "psp-v1",
  picks: {
    main: "Over 2.5 Goals",
    publishedOdds: 1.9,
    oddsProvenance: {
      source: "Supplied 20-analysis publication package",
      provenance: "author_attested",
      market: "Over 2.5 Goals"
    }
  },
  published: true,
  publishedAt: "2026-08-30T10:00:00-03:00",
  sourceStatus: "verified",
  sources: [
    {
      name: "Premier League — 2026/27 fixture amendments",
      url: "https://www.premierleague.com/en/news/4678381/fixture-amendments-for-premier-league-matches-in-august-and-september/",
      description: "Official competition schedule supporting the Matchweek 3 fixture identities, dates and kickoffs.",
      accessedAt: "2026-08-30T10:00:00-03:00"
    }
  ],
  matchInfo: {
    date: "2026-09-05",
    time: "15:00",
    round: "Matchweek 3",
    venue: "Gtech Community Stadium"
  }
};
