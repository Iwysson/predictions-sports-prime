PSP — LA LIGA ROUND 04 — UPGRADE → CLEAN KEEP
Data: 03/09/2026

Escopo:
10 predictions futuras da La Liga Round 04.

Antes:
KEEP 42
UPGRADE 97
LEGACY-NOINDEX 153

Após aplicar este batch:
KEEP 52
UPGRADE 87
LEGACY-NOINDEX 153
REMOVE 0

Conteúdo do pacote:
- 10 predictions revisadas em src/data/predictions/la-liga/round-04/
- index.ts preservado
- src/lib/adsense-content-quality.ts atualizado para promover somente estes 10 jogos
- scripts/audit-adsense-content-gate.mjs com snapshot oficial atualizado para 52/87/153/0

Regras aplicadas:
- SEO Prediction-First
- corpo Data-First
- HOME do mandante x AWAY do visitante
- Statistical Core preservado como base factual
- probable XI / lesões / suspensões revisadas com fontes públicas atuais
- interpretação específica por partida
- Tactical Matchup + Game State
- Conflict Detector + counter-signals reais
- Risks and Limitations
- fórmula explícita Implied probability = 1 / decimal odds
- pelo menos dois dados HOME/AWAY em negrito por análise
- conclusão esportiva independente
- Prediction + Odds originais preservadas
- múltiplas URLs públicas rastreáveis por página
- ZERO conteúdo interno PASS/FAIL/KEEP/UPGRADE no corpo público

Validação estática:
- 10/10 com Statistical Core
- 10/10 com Statistical Interpretation
- 10/10 com Tactical Matchup and Game State
- 10/10 com Conflict Detector
- 10/10 com fórmula de implied probability
- 10/10 com >=2 evidências numéricas em negrito
- 10/10 sem os padrões internos/boilerplate proibidos verificados
- gate esperado: KEEP 52 / UPGRADE 87 / LEGACY-NOINDEX 153 / REMOVE 0

Após substituir na raiz do projeto, rodar:
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo
