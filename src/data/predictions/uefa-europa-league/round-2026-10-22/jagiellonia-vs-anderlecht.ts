import type { EditorialPrediction } from '@/types';

const uefa = 'https://www.uefa.com/uefaeuropaleague/news/02a8-2174cafa5bb6-82bbc20c9b92-1000--2026-27-europa-league-all-the-league-phase-fixtures-and-re/';
const lineups = 'https://dugout.starting11.com/predicted-lineups/uel-2026-27/gameweek-3';

export const prediction: EditorialPrediction = {
  league: 'uefa-europa-league',
  homeTeam: 'Jagiellonia',
  awayTeam: 'Anderlecht',
  slug: 'jagiellonia-vs-anderlecht',
  title: 'Jagiellonia vs Anderlecht Prediction, Odds and Betting Tips',
  seoTitle: 'Jagiellonia vs Anderlecht Prediction, Odds and Betting Tips',
  access: 'free', analysisAccess: 'free', predictionAccess: 'free',
  editorialStandard: 'psp-v1', analysisFormat: 'markdown', analysisLanguage: 'en',
  analysis: [`# Jagiellonia vs Anderlecht Prediction, Odds and Betting Tips

**Prediction:** Jagiellonia or Draw (1X)

**Odds:** 1.68

## Match information

**Competition:** UEFA Europa League 2026/27 — League Phase, Matchday 3

**Date:** Thursday, October 22, 2026

**Kick-off:** 21:00 on UEFA's published fixture clock; check the local conversion

**Round:** League Phase, Matchday 3

**Venue:** Unavailable from the checked official fixture list

**Sources:** [UEFA fixtures and results](${uefa}) · [Starting11 projected lineups](${lineups})

## Team news and probable lineups

Starting11's October 22 tracker supplies complete projected elevens for both sides, but neither is an official team sheet. The checked UEFA fixture list does not provide an injury or suspension bulletin for this pairing. No absence is treated as confirmed from the lineup projection alone; the elevens and availability should be checked again before kick-off.

- **PROJECTED Jagiellonia (4-3-3):** Abramowicz; Stojinović, Vital, Kobayashi, Wdowik; Sow, Romanczuk, Klynge; Jóźwiak, Imaz, Szmyt.
- **PROJECTED Anderlecht (4-2-3-1):** Coosemans; Barry, Omobamidele, Pétrot, Reabciuk; Stroeykens, Aasgaard; Winkler, Ambros, Degreef; Cvetković.

## Match analysis

Jagiellonia have split their first two league-phase fixtures: they lost **2-1 away to Olympiacos** before winning **3-1 at home against Ararat-Armenia**. Anderlecht lost **2-1 at home to Lyon** and then **1-0 away to Dinamo Zagreb**. The Polish side therefore have the better early results, and their only home match in this phase ended in a two-goal victory. Those are real results, but a single home match and a single Anderlecht away match are far too little evidence to establish a reliable venue advantage.

The 1X selection covers a Jagiellonia win or draw in regulation time. Anderlecht have yet to take a point in this phase, but the narrow defeat in Zagreb shows why the away side cannot be dismissed as unable to compete. Jagiellonia conceded in both matches, including at home, so an Anderlecht goal is plausible even if the home side avoids defeat. The editorial lean is toward the hosts protecting at least a point, with confidence limited by the small sample and by the absence of an independently verified squad bulletin.

## Tactical outlook

The projected **4-3-3** places Imaz centrally in Jagiellonia's front line with Jóźwiak and Szmyt around him, while the projected **4-2-3-1** gives Anderlecht Cvetković a focal role ahead of three attacking midfielders. Jagiellonia can try to use the width of their front three to pull the visitor's back four across, but losing the ball high would leave space for Anderlecht's line of three to move behind the first press. A narrow away lead is the clearest tactical route to defeating 1X, because it would force Jagiellonia to chase the game against a compact block. These shapes remain projected and must be checked against the official team sheets.

### Statistical Core Predictions-Sports-Prime

The figures below come from [UEFA's first two 2026/27 league-phase results](${uefa}). The venue rows are **one-match samples**: Jagiellonia's home match against Ararat-Armenia and Anderlecht's away match against Dinamo Zagreb. Advanced xG, xGA, shots, shots on target, possession and corners were unavailable in the checked source set and are not estimated.

| Metric | Jagiellonia HOME | Anderlecht AWAY |
|---|---:|---:|
| Matches (N) | 1 | 1 |
| W-D-L | 1-0-0 | 0-0-1 |
| Points/game | 3.00 | 0.00 |
| GF/game | 3.00 | 0.00 |
| GA/game | 1.00 | 1.00 |
| Clean sheets | 0/1 | 0/1 |
| Failed to score | 0/1 | 1/1 |

## Market assessment and conclusion

The published **1.68** price implies a raw implied probability of **59.52%** (1 / 1.68), before margin. Jagiellonia's 1/1 home win and Anderlecht's 0/1 away result are historical frequencies, not a forecast that 1X will land above that threshold. The editorial judgment favors home or draw because Jagiellonia won their one home match while Anderlecht have lost both overall, but the sample is too small to claim a proven value edge. An Anderlecht response after two defeats, helped by Jagiellonia's concession in both games, is the principal risk.

**Prediction:** Jagiellonia or Draw (1X)

**Odds:** 1.68`],
  picks: { main: 'Jagiellonia or Draw (1X)', publishedOdds: 1.68,
    oddsProvenance: { source: 'Publisher instruction, 22 October 2026', provenance: 'author_attested', market: 'Jagiellonia or Draw (1X)' } },
  matchInfo: { date: '2026-10-22', time: '21:00', round: 'League Phase, Matchday 3', releaseTimeZone: 'America/New_York' },
  published: true, publishedAt: '2026-10-22T06:00:00-03:00', updatedAt: '2026-10-22T06:00:00-03:00',
  sourceStatus: 'partial',
  sources: [
    { name: 'UEFA — 2026/27 fixtures and results', url: uefa },
    { name: 'Starting11 — Matchday 3 projected lineups', url: lineups },
  ],
  teaser: 'Jagiellonia host Anderlecht on October 22. Read the free 1X prediction, odds and full analysis.',
  statisticalCoreSamples: [
    { sampleType: 'home', source: 'UEFA — 2026/27 fixtures and results', sourceUrl: uefa, season: '2026/27', scope: 'Europa League league phase Matchdays 1–2, Jagiellonia home', matches: 1 },
    { sampleType: 'away', source: 'UEFA — 2026/27 fixtures and results', sourceUrl: uefa, season: '2026/27', scope: 'Europa League league phase Matchdays 1–2, Anderlecht away', matches: 1 },
  ],
};
