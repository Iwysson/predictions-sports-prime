# RAYO VS ALAVES DIVERGENCE

Fields affected:  
`resultStatus`  
`resultSource`  
`finalScore`  

Cause: legitimate automatic post-match settlement recorded after the Phase 4 checkpoint.  
Change commit/date: `50172d01c1588460ea631caa4532b3242906e87f`, 2026-08-20 18:27:25 -03:00 (`Correct La Liga fixtures and preserve final results`).  
Legitimate settlement change: YES.  
Accidental change: NO evidence found.  
Baseline issue: NO. The baseline correctly preserves the earlier pending state and predates the settlement.  

## Timeline

| State | resultStatus | resultSource | finalScore |
|---|---|---|---|
| Original baseline (`editorial-baseline.json`) | `null` | `null` | `null` |
| Phase 4 baseline (`3bdb0b1`, 2026-08-20 11:47:01 -03:00) | `null` | `null` | `null` |
| Current, since settlement commit (`50172d0`, 2026-08-20 18:27:25 -03:00) | `green` | `automatic` | `1–1` |

The settlement commit added all three fields together and also strengthened `live-predictions.ts` so a stored completed result cannot be rolled back by a delayed provider. The official settlement implementation requires a completed fixture and a valid non-negative integer score. At 1–1, the stored market `Rayo Vallecano or Draw (1X) + Over 1.5 Goals` passes both independently evaluated legs: the home-or-draw leg and the two-total-goals leg.

## Resolution

Action taken: the Phase 4 audit now separates immutable editorial fields from post-match settlement fields. Existing settlements captured by the baseline remain strictly immutable. A prediction that was unsettled at the checkpoint may acquire a post-baseline settlement only when status, source and final score form a complete valid record; the audit reports it as `EXPECTED POST-BASELINE SETTLEMENT CHANGE`.  
Prediction content changed: NO.  
Analysis changed: NO.  
Pick changed: NO.  
Odds changed: NO.  
Historical baseline changed: NO.  

Phase 4 audit: PASS (52/52; one explicit valid post-baseline settlement).  
Phase 5 audit: PASS (13/13).  
Results audit: PASS (52 entries; 50 pending, 2 won).  
Domain migration audit: PASS (71 canonical sitemap URLs on `https://predictions-sports-prime.com`, no active old-host references).  

Final status: READY  

--------------------------------
