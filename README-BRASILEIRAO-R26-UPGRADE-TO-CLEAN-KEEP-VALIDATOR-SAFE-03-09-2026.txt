PSP — BRASILEIRÃO ROUND 26 — VALIDATOR SAFE
10 UPGRADE → CLEAN KEEP
Gate: 92/47/153/0 → 102/37/153/0
Removidos fallbacks de média da liga em Shots allowed e SOT allowed.
SOT allowed usa logs recentes de liga filtrados por venue, com N explícito.
Coritiba x Mirassol corrigido para 06/09/2026 11:00 no Couto Pereira.
Rodar:
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo
