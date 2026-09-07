# Pending editorial batches — validation report

Audit date: 2026-09-07 (America/Fortaleza)

This report does not change Wave 2 and does not activate Wave 3. Editor-supplied picks and odds are recorded below exactly as supplied. `BLOCKED` means no prediction file, registry entry, route, sitemap entry or indexable page was created.

## Factual-completion execution log

- UEFA official fixtures/results page (`https://www.uefa.com/uefachampionsleague/fixtures-results/`): direct read timed out without returning a document.
- EFL official Carabao Cup page (`https://www.efl.com/competitions/carabao-cup/`): HTTP 200, 159,713-byte response. The rendered source contained “Round Three” but contained zero occurrences of Bournemouth, Lincoln City, Crystal Palace, Middlesbrough, Sunderland, Hull City, Millwall, Newcastle United, Chelsea and Leeds United. It therefore did not verify any supplied pairing.
- CONMEBOL official site (`https://www.conmebol.com/`): HTTP 200, but the project has no Libertadores or Sudamericana fixture pipeline, registry, league configuration or source mapping from which these fixtures can be confirmed.
- ESPN provider endpoint already represented in the project (`https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard`): HTTP 403.
- Versioned project snapshot (`src/data/fixtures.snapshot.json`, generated 2026-09-06T23:06:46.930Z): contains all 12 missing UCL fixtures, contains none of the five supplied EFL Round 3 fixtures, and does not configure Copa Libertadores or Copa Sudamericana.
- Workspace prediction scan: none of the 12 supplied UCL slugs and none of the five EFL slugs exists. The six existing UCL predictions are different fixtures. Historical Liga Portugal files already exist for Moreirense–Benfica and Estrela da Amadora–Braga.
- Live-entry capability scan: the project can store `liveEntryProvenance` and parse a “Live Entry” result label, but it has no runtime feed or rule evaluator for minute, score, attacks, chances, box entries or live price. Consequently an objective trigger for Independiente del Valle–Flamengo cannot be operationalized from current infrastructure, and inventing a threshold would violate the supplied contract.

No source reached the minimum evidence threshold for a complete HOME/AWAY 22/22 block plus current dated projected lineups and availability. Existing domestic prediction pages were not reused as silent substitutes: several cover different opponents, dates or sample scopes, and some explicitly label overall/structural fallbacks that are prohibited for this batch.

## UEFA Champions League

The versioned fixture snapshot contains all 12 fixtures below in Matchday 1, scheduled for 2026-09-09 or 2026-09-10. None has an editorial prediction file. The fixture identity is therefore locally confirmed, but the package does not contain a complete 22/22 HOME/AWAY Statistical Core, structured metric provenance, dated projected lineups or current team news for either side. The external official-source search returned no usable documents during this audit, so these factual blocks cannot be completed without fabrication.

| Slug | Pick | Odds | Fixture | Core | Sources / lineup / team news | Status |
|---|---|---:|---|---|---|---|
| barcelona-vs-feyenoord | Barcelona -2.5 | 1.67 | Snapshot: 2026-09-09 16:45 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| stuttgart-vs-viking | Stuttgart -1.5 | 1.62 | Snapshot: 2026-09-09 16:45 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| liverpool-vs-atletico-madrid | Over 2.5 | 1.62 | Snapshot: 2026-09-09 19:00 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| paris-saint-germain-vs-slovan-bratislava | PSG -2.5 | 1.50 | Snapshot: 2026-09-09 19:00 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| napoli-vs-arsenal | X2 + Over 7.5 corners | 1.72 | Snapshot: 2026-09-09 19:00 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| sporting-cp-vs-galatasaray | Over 2.5 | 1.62 | Snapshot: 2026-09-09 19:00 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| fenerbahce-vs-roma | X2 + Over 1.5 | 1.72 | Snapshot: 2026-09-10 16:45 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| psv-eindhoven-vs-shakhtar-donetsk | PSV to win + Over 2.5 | 1.83 | Snapshot: 2026-09-10 16:45 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| como-vs-rb-leipzig | Over 2.5 | 1.60 | Snapshot: 2026-09-10 19:00 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| bayern-munich-vs-bodo-glimt | Bayern -2.5 | 1.72 | Snapshot: 2026-09-10 19:00 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| manchester-united-vs-sabah | Manchester United -2.5 | 1.88 | Snapshot: 2026-09-10 19:00 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |
| slavia-praha-vs-lens | Over 2.5 | 1.80 | Snapshot: 2026-09-10 19:00 UTC | Missing 22/22 paired split | Missing current dated evidence | BLOCKED |

## EFL Cup — Round 3

The existing readiness audit checked the official EFL competition page and the project provider snapshot. The supplied Round 3 pairings were not present. Each supplied draft had only 11/22 metrics, unverified sample types, an undated declared lineup and non-current declared team news.

| Slug | Pick | Odds | Exact blocker | Status |
|---|---|---:|---|---|
| bournemouth-vs-lincoln-city | Bournemouth -1.5 | 1.90 | Fixture absent; Core 11/22; HOME/AWAY provenance unverified; lineup undated; team news stale | BLOCKED |
| crystal-palace-vs-middlesbrough | Over 2.5 | 1.62 | Fixture absent; Core 11/22; HOME/AWAY provenance unverified; lineup undated; team news stale | BLOCKED |
| sunderland-vs-hull-city | Sunderland to Win | 1.70 | Fixture absent; Core 11/22; HOME/AWAY provenance unverified; lineup undated; team news stale | BLOCKED |
| millwall-vs-newcastle-united | Over 2.5 | 1.72 | Fixture absent; Core 11/22; HOME/AWAY provenance unverified; lineup undated; team news stale | BLOCKED |
| chelsea-vs-leeds-united | Chelsea to Win | 1.60 | Fixture absent; Core 11/22; HOME/AWAY provenance unverified; lineup undated; team news stale | BLOCKED |

## Previous 14-match editorial batch

| Slug | Competition | Pick | Odds | Exact blocker | Status |
|---|---|---|---:|---|---|
| nec-nijmegen-vs-excelsior | Eredivisie | NEC to Win | 1.55 | Fixture absent from verified snapshot; no paired 22/22 split or dated lineup/team-news package | BLOCKED |
| fc-twente-vs-telstar | Eredivisie | Twente to Win + Over 2.5 | 1.55 | Fixture absent from verified snapshot; no paired 22/22 split or dated lineup/team-news package | BLOCKED |
| independiente-santa-fe-vs-vasco-da-gama | Copa Sudamericana | 1X + Over 1.5 | 1.88 | Competition/fixture pipeline not configured; no verified fixture, split data, lineup or team news | BLOCKED |
| boca-juniors-vs-sao-paulo | Copa Sudamericana | Boca to Win | 1.78 | Competition/fixture pipeline not configured; no verified fixture, split data, lineup or team news | BLOCKED |
| santos-vs-atletico-mineiro | Copa Sudamericana | 1X + Over 1.5 | 1.88 | Competition/fixture pipeline not configured; no verified fixture, split data, lineup or team news | BLOCKED |
| cienciano-vs-montevideo-city-torque | Copa Sudamericana | Cienciano to Win | 1.57 | Competition/fixture pipeline not configured; no verified fixture, split data, lineup or team news | BLOCKED |
| fluminense-vs-platense | Copa Libertadores | Fluminense to Win | 1.57 | Competition/fixture pipeline not configured; no verified fixture, split data, lineup or team news | BLOCKED |
| palmeiras-vs-ldu-quito | Copa Libertadores | Palmeiras -1.5 | 1.83 | Competition/fixture pipeline not configured; no verified fixture, split data, lineup or team news | BLOCKED |
| estudiantes-vs-corinthians | Copa Libertadores | Estudiantes to Win | 2.25 | Competition/fixture pipeline not configured; no verified fixture, split data, lineup or team news | BLOCKED |
| independiente-del-valle-vs-flamengo | Copa Libertadores | Over 1.5 — IN-PLAY ENTRY | 1.47 | Competition/fixture pipeline not configured; live trigger has no editor-supplied match-state condition; no verified Core/lineup/team news | BLOCKED |
| rangers-vs-st-mirren | Scottish Premiership | St Mirren +1.5 | 1.98 | Fixture absent from verified snapshot; no paired 22/22 split or dated lineup/team-news package | BLOCKED |
| st-johnstone-vs-celtic | Scottish Premiership | Over 2.5 | 1.53 | Fixture absent from verified snapshot; no paired 22/22 split or dated lineup/team-news package | BLOCKED |
| moreirense-vs-benfica | Liga Portugal | Benfica -1.5 | 1.53 | Existing frozen route/file belongs to an earlier match with Benfica -2 @ 1.75; new fixture is unverified and canonical slug collides | BLOCKED |
| estrela-da-amadora-vs-braga | Liga Portugal | X2 + Over 1.5 | 1.63 | Existing frozen earlier-match file uses the same canonical teams; new fixture is unverified and canonical slug collides | BLOCKED |

## Publication totals

- Games reviewed: 31
- Published in this pass: 0
- Blocked: 31
- Prediction files created: 0
- Prediction files modified: 0
- Registries updated: 0
- Routes/sitemap/robots changed: 0

The two historical Liga Portugal records were read only and remain frozen. Publication can resume only when auditable fixture metadata, genuine HOME/AWAY 22/22 data, structured provenance, dated projected lineups and current availability reporting are supplied or become verifiable. The in-play pick additionally requires an explicit match-state trigger.
