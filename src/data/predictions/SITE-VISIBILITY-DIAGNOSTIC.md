# Super Lig site visibility diagnostic

Verified inside the supplied package:

- `super-lig/index.ts` imports both `./current-round` and `./round-04`.
- `super-lig/round-04/index.ts` imports and exports all nine Matchday 4 predictions.
- All nine Matchday 4 files contain `slug`, `title`, `published: true` and structured `matchInfo`.
- Therefore the missing cards/routes are not caused by the Round 04 files being absent from the Super Lig barrel.

The supplied ZIP does not contain the site-level fixture/route registry (`src/data/matches.ts` and related aggregation used by match pages). If the nine fixtures still do not render after replacing this league folder, the next check must be at that site-level registry: the fixture records must exist there with slugs matching these editorial slugs. Merely placing the editorial analysis in `src/data/predictions/super-lig/round-04` is not sufficient if route generation/listing is driven by the match registry.

Expected Round 04 slugs:
- istanbul-basaksehir-vs-galatasaray
- erzurumspor-fk-vs-konyaspor
- fenerbahce-vs-besiktas
- kasimpasa-vs-amed-sk
- corum-fk-vs-eyupspor
- kocaelispor-vs-samsunspor
- trabzonspor-vs-genclerbirligi
- goztepe-vs-gaziantep-fk
- caykur-rizespor-vs-alanyaspor
