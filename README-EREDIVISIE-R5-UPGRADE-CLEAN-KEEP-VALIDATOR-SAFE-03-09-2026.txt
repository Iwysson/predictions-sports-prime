PSP — EREDIVISIE ROUND 05 — CLEAN KEEP / PSP-V1
Date: 03/09/2026

Scope
- 9 match-analysis files normalized to the established PSP editorial structure.
- Existing analysis, picks, odds, lineups, availability and source material preserved.
- Editorial headings normalized for consistency:
  Match Context
  HOME/AWAY Analysis
  Statistical Interpretation and Tactical Game State
  Statistical Core Predictions-Sports-Prime
  Conflict Detector
  Market Price Context
  Value Assessment
  Sources / Statistical Provenance
  Conclusion
- Statistical provenance now explicitly distinguishes venue-specific observations from broader current-season / league-baseline / prior-season context already present in the supplied analysis.
- 8 audited Eredivisie R5 slugs moved from UPGRADE to KEEP.
- Telstar vs SC Cambuur was already KEEP and remains KEEP.

Expected AdSense audited snapshot after replacement
KEEP: 110
UPGRADE: 29
LEGACY-NOINDEX: 153
REMOVE: 0
Automatic fallback decisions: 0

Files to replace
src/data/predictions/eredivisie/round-05/ado-den-haag-vs-fortuna-sittard.ts
src/data/predictions/eredivisie/round-05/ajax-vs-psv-eindhoven.ts
src/data/predictions/eredivisie/round-05/fc-groningen-vs-fc-twente.ts
src/data/predictions/eredivisie/round-05/fc-utrecht-vs-go-ahead-eagles.ts
src/data/predictions/eredivisie/round-05/nec-nijmegen-vs-feyenoord.ts
src/data/predictions/eredivisie/round-05/sc-heerenveen-vs-az-alkmaar.ts
src/data/predictions/eredivisie/round-05/sparta-rotterdam-vs-pec-zwolle.ts
src/data/predictions/eredivisie/round-05/telstar-vs-sc-cambuur.ts
src/data/predictions/eredivisie/round-05/willem-ii-vs-excelsior.ts
src/lib/adsense-content-quality.ts
scripts/audit-adsense-content-gate.mjs

Recommended validation after applying
npm run typecheck
npm run audit:psp-editorial-standard
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo

Do not use git add . because unrelated untracked README/report files are present in the working tree.
