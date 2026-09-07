CHAMPIONSHIP ROUND 05 — PSP EDITORIAL PACKAGE — CORRECTED
Prepared: 03/09/2026

INSTALLATION TARGET:
src/data/predictions/championship/

This corrected package includes:
- championship/index.ts
- championship/round-05/index.ts
- 12 Championship Round 05 match analysis files

IMPORTANT CORRECTION:
The previous package contained round-05, but the parent Championship registry still imported only round-04.
The corrected championship/index.ts now imports championshipRound05 and appends it to championshipPredictions.

Expected registry behavior after replacement:
- the 12 Round 05 analyses become part of championshipPredictions
- site/audits should be able to see the new games
- published prediction totals should change if the global registry consumes championshipPredictions

Do not use git add .
Run validations before commit.
