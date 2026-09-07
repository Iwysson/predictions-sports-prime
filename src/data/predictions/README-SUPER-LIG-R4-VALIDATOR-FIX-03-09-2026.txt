PSP — SÜPER LIG R4 — VALIDATOR FIX
Data: 03/09/2026

Correção aplicada aos 9 jogos:
1. O validador editorial do projeto exige uma explicação explícita da fórmula bruta:
   Implied probability = 1 / decimal odds.
   Essa fórmula agora aparece de forma pública e editorialmente útil em Market Price Context.

2. O validador exige pelo menos dois fragmentos em negrito com estatísticas/percentuais.
   Cada análise agora destaca dois sinais HOME/AWAY específicos do próprio matchup.

3. Nenhum PASS/FAIL, KEEP/UPGRADE, audit, quality gate ou estado interno foi adicionado ao conteúdo público.

A classificação esperada permanece:
KEEP 42
UPGRADE 97
LEGACY-NOINDEX 153

Rode novamente:
npm run typecheck
npm run audit:adsense-content-gate
npm run audit:adsense-quality
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo
npm run build
