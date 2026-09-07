# Predictions-Sports-Prime — Editorial Standard v2

## 1. Scope: future only

The strict PSP editorial standard applies only to future/pre-match football predictions.

A match is `historical-frozen` when a final result is already recorded or when its scheduled kickoff has passed. Historical editorial pages are immutable and remain in their current source location as a logical archive for Prediction History. They are not migrated to `psp-v1` and are not retroactively enriched.

A published prediction with insufficient date/time to prove whether kickoff is future or historical is `unresolved-quarantine`. It is excluded from migration and from strict PSP failures until fixture metadata resolves the lifecycle. It must not be rewritten merely because its lifecycle is unknown.

The result pipeline may still finalize objective history fields such as final score and bet result. That does not authorize editorial rewriting.

## 2. Future publication structure

1. H1 — HOME vs AWAY Prediction, Odds and Betting Tips
2. Prediction + Published Odds
3. Match Information
4. Team News / Availability
5. Probable Lineups
6. Injuries / Suspensions / Doubts
7. Robust independent analysis
8. HOME-only vs AWAY-only data analysis
9. Advanced data
10. H2H only if verified
11. Tactical analysis / expected game state
12. Statistical Core Predictions-Sports-Prime
13. Conflict Detector
14. Odds + raw implied probability
15. Value assessment
16. Conclusion
17. Final Prediction + Published Odds

Round, venue and location may be supplied by the verified fixture pipeline rather than duplicated in the editorial source. Date and time remain required in the editorial source because the freeze policy depends on pre-match lifecycle detection.

## 3. Statistical Core

The Statistical Core is mandatory only for future `psp-v1` predictions. Every required HOME/AWAY cell must contain a verified value. Placeholders and fabricated values are forbidden. Extra market rows are allowed when supported.

Historical predictions are never given a new Core after kickoff. Post-match statistics must never be used to reconstruct a pre-match Core.

## 4. Rendering

The source future prediction contains one Core table. The structured match module renders it. `EditorialAnalysis` suppresses the source Core table so the visitor sees exactly one table.

## 5. Audit behavior

`npm run audit:psp-editorial-standard` audits only fixtures proven to be future/pre-match. Historical predictions are counted as `Historical frozen`; unresolved lifecycle records are counted as `Unresolved/quarantined`; both are excluded from migration failures.

`npm run audit:editorial-quality` also audits only fixtures proven to be future/pre-match. Historical and unresolved/quarantined records are skipped so the audit cannot create a retroactive cleanup queue.

For deterministic debugging, both audits accept an optional `PSP_AUDIT_NOW=<ISO timestamp>` environment variable.
