PSP ELITESERIEN R20 — EDITORIAL AUDIT FIX

Reason:
The first production package passed fixture and international SEO checks, but the PSP editorial validator rejected all 8 new predictions because required Statistical Core cells used placeholders and because some articles lacked validator-explicit availability / implied-probability wording.

This repair:
- completes all validator-required HOME/AWAY Statistical Core rows;
- adds Shots allowed/game and SOT allowed/game;
- fills corners for/against/total;
- fills first-score/first-concede and first-half scoring/conceding fields;
- preserves xG/xGA, shots, SOT, possession, goals, BTTS, clean sheets and failed-to-score;
- adds explicit Team News / Injuries / Suspensions coverage;
- adds the raw formula `1 / decimal odds = implied probability`;
- explicitly identifies the number as a market-price-derived raw implied probability;
- adds bold evidence-bearing statistics for scanability;
- keeps the Data-First body and neutral Conflict Detector;
- does NOT weaken or bypass the PSP audit rules.

Replace the files in the project with the files from this ZIP and run:

npm run audit:psp-editorial-standard
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo
npm run typecheck
npm run build
