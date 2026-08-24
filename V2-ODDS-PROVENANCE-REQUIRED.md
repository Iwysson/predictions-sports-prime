# V2 Odds Provenance Resolution

Internal audit manifest. The tables below preserve the pre-resolution snapshot. On 2026-08-24, the author attested that the captured prices came from Betano and supplied genuine capture timestamps for 46 records. Those 46 records now store `bookmaker: Betano`, `provenance: author_attested`, and their supplied `capturedAt`; Braga remains a draft because the timestamp for its later 2.10 update was not recoverable.

Current resolution: 42/43 structured prices attested, 4/4 live-entry pre-match prices attested, 1/47 timestamp still required, and 46/47 records published.

The `1.65+` live-entry values are editorial targets, not captured Betano quotes.

## Pre-resolution snapshot

## Structured odds

| League | Match | Slug | Pick | Odds | Required source | Required capture timestamp | Current status |
|---|---|---|---|---:|---|---|---|
| Bundesliga | Augsburg vs Schalke 04 | `augsburg-vs-schalke` | Augsburg or Draw (1X) + Under 4.5 Goals | 1.70 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Bundesliga | Bayern München vs VfB Stuttgart | `bayern-munich-vs-stuttgart` | Bayern Munich -1.5 Asian Handicap | 1.72 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Bundesliga | Borussia Dortmund vs Hamburger SV | `dortmund-vs-hamburg` | Borussia Dortmund -1.5 Asian Handicap | 1.93 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Bundesliga | SV 07 Elversberg vs Bayer 04 Leverkusen | `elversberg-vs-leverkusen` | Bayer Leverkusen or Draw (X2) + Under 4.5 Goals | 1.57 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Bundesliga | SC Freiburg vs SV Werder Bremen | `freiburg-vs-werder-bremen` | Freiburg or Draw (1X) + Over 1.5 Goals | 1.67 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Bundesliga | 1. FC Köln vs TSG 1899 Hoffenheim | `koln-vs-hoffenheim` | TSG Hoffenheim or Draw (X2) + Over 1.5 Goals | 1.72 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Bundesliga | RB Leipzig vs Borussia Mönchengladbach | `leipzig-vs-monchengladbach` | Borussia Mönchengladbach +2 Handicap + Under 4.5 Goals | 1.93 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Bundesliga | 1. FSV Mainz 05 vs SC Paderborn 07 | `mainz-vs-paderborn` | Mainz 05 to Win | 1.72 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Bundesliga | 1. FC Union Berlin vs Eintracht Frankfurt | `union-berlin-vs-frankfurt` | Over 2.5 Goals | 1.67 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Aston Villa vs Arsenal | `aston-villa-vs-arsenal` | Over 2.5 Goals | 1.82 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Bournemouth vs Everton | `bournemouth-vs-everton` | Bournemouth or Draw (1X) + Over 1.5 Goals | 1.67 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Chelsea vs Brighton & Hove Albion | `chelsea-vs-brighton-and-hove-albion` | Chelsea to Win | 2.00 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Coventry City vs Hull City | `coventry-city-vs-hull-city` | Coventry City or Draw (1X) + Over 1.5 Goals | 1.60 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Crystal Palace vs Manchester City | `crystal-palace-vs-manchester-city` | Manchester City to Win | 1.62 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Leeds United vs Brentford | `leeds-united-vs-brentford` | Over 2.5 Goals | 1.90 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Liverpool vs Nottingham Forest | `liverpool-vs-nottingham-forest` | Liverpool to Win + Over 1.5 Goals | 1.67 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Manchester United vs Ipswich Town | `manchester-united-vs-ipswich-town` | Manchester United to Win + Over 1.5 Goals | 1.67 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Sunderland vs Fulham | `sunderland-vs-fulham` | Sunderland or Draw (1X) + Over 1.5 Goals | 1.93 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Premier League | Tottenham Hotspur vs Newcastle United | `tottenham-hotspur-vs-newcastle-united` | Over 2.5 Goals | 1.72 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | AC Milan vs Venezia | `ac-milan-vs-venezia` | AC Milan to Win + Over 1.5 Goals | 1.70 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | ACF Fiorentina vs Frosinone Calcio | `acf-fiorentina-vs-frosinone-calcio` | Over 2.5 Goals | 1.82 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | Atalanta BC vs Bologna FC 1909 | `atalanta-bc-vs-bologna-fc-1909` | Over 2.5 Goals | 1.80 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | Cagliari Calcio vs Internazionale Milano | `cagliari-calcio-vs-internazionale-milano` | Inter Milan -1.5 Asian Handicap | 2.35 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | Juventus vs Parma Calcio 1913 | `juventus-vs-parma-calcio-1913` | Juventus to Win + Juventus Over 5.5 Corners | 1.70 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | SS Lazio vs Genoa CFC | `ss-lazio-vs-genoa-cfc` | Lazio or Draw (1X) + Over 1.5 Goals | 1.72 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | SSC Napoli vs Como 1907 | `ssc-napoli-vs-como-1907` | Napoli or Draw (1X) + Over 1.5 Goals | 1.95 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | US Lecce vs AS Roma | `us-lecce-vs-as-roma` | AS Roma or Draw (X2) + Over 1.5 Goals | 1.65 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Serie A | US Sassuolo Calcio vs Torino | `us-sassuolo-calcio-vs-torino` | Sassuolo or Draw (1X) + Over 1.5 Goals | 1.78 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Eredivisie | AZ Alkmaar vs Go Ahead Eagles | `az-alkmaar-vs-go-ahead-eagles` | Go Ahead Eagles +1.5 Handicap | 1.83 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Eredivisie | Excelsior vs Sparta Rotterdam | `excelsior-vs-sparta-rotterdam` | Over 2.5 Goals | 1.60 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Eredivisie | Feyenoord Rotterdam vs ADO Den Haag | `feyenoord-rotterdam-vs-ado-den-haag` | Feyenoord -1.5 Asian Handicap | 1.57 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Eredivisie | Groningen vs Fortuna Sittard | `groningen-vs-fortuna-sittard` | FC Groningen to Win + Over 1.5 Goals | 1.62 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Eredivisie | PEC Zwolle vs NEC Nijmegen | `pec-zwolle-vs-nec-nijmegen` | NEC Nijmegen or Draw (X2) + Over 2.5 Goals | 1.78 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Eredivisie | Telstar vs Ajax Amsterdam | `telstar-vs-ajax-amsterdam` | Ajax to Win | 1.67 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Eredivisie | Utrecht vs PSV Eindhoven | `utrecht-vs-psv-eindhoven` | PSV Eindhoven or Draw (X2) + Over 2.5 Goals | 1.72 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Eredivisie | Willem II vs Heerenveen | `willem-ii-vs-heerenveen` | SC Heerenveen or Draw (X2) + Over 2.5 Goals | 2.00 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Liga Portugal | Académico de Viseu vs Porto | `academico-de-viseu-vs-porto` | FC Porto -1.5 Asian Handicap | 2.00 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Liga Portugal | Alverca vs Santa Clara | `alverca-vs-santa-clara` | Santa Clara or Draw (X2) + Under 3.5 Goals | 1.83 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Liga Portugal | Benfica vs Estoril | `benfica-vs-estoril` | Benfica -2 Asian Handicap | 1.70 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Liga Portugal | Braga vs Vitória de Guimaraes | `braga-vs-vitoria-de-guimaraes` | Vitória Guimarães +2 Handicap + Over 1.5 Goals | 2.10 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Liga Portugal | C.D. Nacional vs Estrela | `c-d-nacional-vs-estrela` | Nacional or Draw (1X) + Under 3.5 Goals | 1.85 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Liga Portugal | Rio Ave vs Sporting CP | `rio-ave-vs-sporting-cp` | Sporting CP to Win + Under 4.5 Goals | 1.80 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |
| Ligue 1 | Lille vs Paris Saint-Germain | `lille-vs-paris-saint-germain` | Paris Saint-Germain to Win | 1.72 | MISSING | MISSING | ODDS_PROVENANCE_MISSING |

## Live-entry price provenance

These records have no structured `picks.odds`, but their displayed pre-match and target prices still require capture evidence before they should be treated as auditable market observations.

| League | Match | Slug | Pick | Displayed price note | Required source | Required capture timestamp | Current status |
|---|---|---|---|---|---|---|---|
| Serie A | AC Monza vs Udinese Calcio | `ac-monza-vs-udinese-calcio` | Over 1.5 Goals — Live Entry | Pre-Match Odds: 1.44. Preferred Entry: 1.65+ live. Live Entry Only. Target Odds: 1.65+. | MISSING | MISSING | LIVE_PRICE_PROVENANCE_MISSING |
| Liga Portugal | Arouca vs Maritimo | `arouca-vs-maritimo` | Over 1.5 Goals — Live Entry | Pre-Match Odds: 1.44. Preferred Entry: 1.65+ live. Live Entry Only. Target Odds: 1.65+. | MISSING | MISSING | LIVE_PRICE_PROVENANCE_MISSING |
| Liga Portugal | Casa Pia vs Moreirense | `casa-pia-vs-moreirense` | Over 1.5 Goals — Live Entry | Pre-Match Odds: 1.44. Preferred Entry: 1.65+ live. Live Entry Only. Target Odds: 1.65+. | MISSING | MISSING | LIVE_PRICE_PROVENANCE_MISSING |
| Liga Portugal | Famalicao vs Gil Vicente | `famalicao-vs-gil-vicente` | Over 1.5 Goals — Live Entry | Pre-Match Odds: 1.43. Preferred Entry: 1.65+ live. Live Entry Only. Target Odds: 1.65+. | MISSING | MISSING | LIVE_PRICE_PROVENANCE_MISSING |

## User-supplied provenance contract

```json
{
  "slug": "crystal-palace-vs-manchester-city",
  "bookmaker": null,
  "odds": 1.62,
  "capturedAt": null,
  "sourceUrl": null,
  "evidenceNote": null
}
```

Required rules:

- `slug` must resolve to exactly one existing draft.
- `bookmaker` and `capturedAt` must come from genuine supplied evidence.
- `odds` must exactly equal the stored editorial odds; mismatches require review, not silent replacement.
- `sourceUrl` is optional only when a separately retained screenshot or capture artifact is identified by `evidenceNote`.
- Live-entry submissions should additionally identify whether the evidence covers the pre-match price, target price, or both.
