PSP — Super Lig Round 4 publication fix

Root cause:
- Super Lig is configured as manualOnly.
- loadLeagueSeason() therefore reads only fixtures.snapshot.json.
- The snapshot had Super Lig Round 3 in leagues["super-lig"], while the nine Round 4 fixtures existed only in predictionIds/manualFixtures.
- As a result, surfaces driven by the league-season rounds could not see Round 4 as an actual round.

Correction:
- Added Super Lig round 4 with all 9 scheduled fixtures to:
  src/data/fixtures.snapshot.json
- Existing predictionIds and manualFixtures were preserved.
- No editorial prediction text was changed.

After replacing the file, run:
npm run typecheck
npm run build
npm run audit:psp-editorial-standard
