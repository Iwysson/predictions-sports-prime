PSP — SÜPER LIG ROUND 04 — UPGRADE → CLEAN KEEP
Data: 03/09/2026

Escopo:
9 predictions futuras da Süper Lig Round 04.

Antes:
KEEP 33
UPGRADE 106
LEGACY-NOINDEX 153

Após aplicar este batch:
KEEP 42
UPGRADE 97
LEGACY-NOINDEX 153

Este pacote contém:
- 9 arquivos de prediction revisados em src/data/predictions/super-lig/round-04/
- src/lib/adsense-content-quality.ts atualizado para promover SOMENTE os 9 jogos aprovados
- index.ts preservado no pacote para manter a pasta completa

Regras aplicadas:
- SEO Prediction-First
- corpo Data-First
- HOME do mandante x AWAY do visitante
- Statistical Core preservado/revisado
- Rizespor x Alanyaspor: removidos fallbacks de liga; shots allowed AWAY = 12.0 e SOT allowed AWAY = 4.5, calculados dos dois jogos fora a partir de match logs públicos
- Team News e probable XI rechecados em 03/09/2026
- múltiplas fontes públicas e rastreáveis por página
- interpretação específica por partida
- tactical matchup
- game state
- Conflict Detector
- counter-signals e limitações
- conclusão esportiva independente
- Prediction + Odds originais preservadas
- escrita editorial natural
- ZERO conteúdo interno PASS/FAIL/KEEP/UPGRADE renderizado no corpo público

Validação estática do pacote:
- 9/9 com fontes rastreáveis múltiplas
- 9/9 com Statistical Core
- 9/9 com Statistical Interpretation
- 9/9 com Tactical Matchup and Game State
- 9/9 com Conflict Detector
- 9/9 com Risks and Limitations
- 9/9 sem as strings internas proibidas verificadas
- gate esperado: KEEP 42 / UPGRADE 97 / LEGACY-NOINDEX 153

Após substituir no projeto:
npm run typecheck
npm run audit:adsense-content-gate
npm run audit:adsense-quality
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo
npm run build
