PSP — Prediction-First Search Intent implementation
Date: 2026-09-02

OBJECTIVE
Keep lineups, squad availability, kick-off, venue, referee and weather on the page as useful supporting information, but stop treating those modules as organic-search acquisition targets.

PRIMARY SEARCH INTENT
- prediction / palpite / pronóstico / pronostico / pronostic / Prognose
- betting tips / dicas de apostas / apuestas / scommesse / conseils paris / Wett-Tipps
- odds / cuotas / quote / cotes / Quoten
- match analysis / análise / análisis / analisi / analyse / Spielanalyse
- betting-market terms when directly tied to the published pick

SUPPORTING EVIDENCE
- Statistical Core
- HOME/AWAY data
- xG/xGA
- shots/SOT
- corners
- form/H2H/standings
These remain visible and can support analysis, but are no longer injected as primary metadata intent.

CONTEXT-ONLY MODULES
- lineups / probable XI
- team news
- injuries / suspensions
- kick-off time
- venue / stadium
- referee
- weather
- broadcast information
These remain on-page but are excluded from title, meta description and secondary acquisition-query expansion.

FILES CHANGED
src/lib/prediction-first-search-intent.ts (new)
src/lib/match-search-intent.ts
src/lib/seo.ts
src/components/MatchSemanticDetails.tsx
src/components/LocalizedMatchDetails.tsx
scripts/audit-prediction-first-search-intent.mjs (new)
scripts/audit-search-intent-seo.mjs
scripts/audit-restricted-search-intent.mjs
package.json

IMPLEMENTATION NOTES
- Today/tomorrow metadata is prediction-first in EN/PT-BR/ES/IT/FR/DE.
- Old restricted profiles no longer contain lineups/teamNews/injuries as SEO intents.
- English rich-match titles no longer use Lineups/Injuries/Stats as title capabilities.
- Match semantic H2s were softened to context labels such as Team Selection Context and Squad Availability.
- Localized lineup H2s no longer concatenate both team names with 'probable lineups'.
- Structured lineup/availability data itself is untouched.
- Statistical Core content itself is untouched.
- Metadata keyword expansion no longer includes statisticalQueries.

RUN AFTER COPYING
npm run typecheck
npm run build
npm run audit:search-intent-seo
npm run audit:restricted-search-intent
npm run audit:prediction-first-search-intent
npm run audit:psp-editorial-standard

EXPECTED NEW AUDIT
Prediction-First Search Intent audit: PASS
Context-only modules excluded from metadata/query expansion
