PSP — Süper Lig club identity fix

Root cause:
The fixture validator saw Amedspor and Amed SFK as different club identities.
That inflated the normalized Süper Lig club count from 18 to 19.

Corrections:
1. src/lib/openfootball.ts
   - Added alias: amedspor -> amedsk
   - Existing amedsfk -> amedsk remains.

2. src/data/predictions/super-lig/round-04/kasimpasa-vs-amed-sk.ts
   - Standardized the visible team name from Amed SK to Amedspor.
   - Kept the stable slug kasimpasa-vs-amed-sk unchanged.

3. src/data/fixtures.snapshot.json
   - Standardized Amed SFK to Amedspor in the Süper Lig Round 4 fixture.
   - Standardized the same name in manualFixtures.
   - IDs, dates, times, kickoffUtc, status and predictionIds were preserved.

Recommended validation:
npm run fixtures:validate
npm run audit:fixtures
npm run typecheck
npm run build
