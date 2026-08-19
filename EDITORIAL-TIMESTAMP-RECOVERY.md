# Editorial Timestamp Recovery

Publication timestamps were recovered from the earliest Git commit in which each current prediction file contains `published: true`. Git author timestamps were normalized to UTC. Match dates and build time were not used.

- Recovered publishedAt: 52
- Recovered updatedAt: 0
- Still unresolved: 0

No `updatedAt` values were inferred: later file changes found during review were fixture metadata or non-editorial changes, not reliably significant editorial revisions.

## Sources

| Commit | Author timestamp (UTC) | Subject | Predictions |
|---|---|---|---:|
| `9bdd3c7` | 2026-08-18T21:31:21.000Z | content: publish latest predictions | 15 |
| `925ec96` | 2026-08-16T20:43:04.000Z | Fix fixture dates and published prediction matching | 1 |
| `900ea73` | 2026-08-16T20:27:43.000Z | Publish Deportivo La Coruna vs Elche prediction | 1 |
| `fcfb0cb` | 2026-08-17T14:51:30.000Z | Add Ligue 1 and publish Marseille vs Strasbourg | 10 |
| `890400e` | 2026-08-17T10:03:49.000Z | Publish Casa Pia vs Benfica prediction | 1 |
| `5848a01` | 2026-08-18T13:58:44.000Z | content: publish new Ligue 1 predictions | 14 |
| `0152929` | 2026-08-16T17:59:07.000Z | Publish Arsenal vs Coventry prediction | 1 |
| `f51403d` | 2026-08-16T19:07:21.000Z | Publish Premier League round 1 predictions | 9 |
