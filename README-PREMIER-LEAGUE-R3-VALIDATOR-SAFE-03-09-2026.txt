PSP — PREMIER LEAGUE ROUND 03 — VALIDATOR-SAFE SECOND PASS
Data: 03/09/2026

Este pacote corrige o primeiro upgrade sem enfraquecer o validator.

Mudanças principais:
- Statistical Core reconstruído com o split 2026/27 REAL disponível antes da Round 3:
  HOME = única partida de liga em casa do mandante;
  AWAY = única partida de liga fora do visitante.
- Nenhuma célula obrigatória usa "—".
- Nenhuma média geral/Championship foi apresentada como se fosse split Premier League HOME/AWAY.
- Shots allowed, SOT allowed e corners against foram derivados diretamente do adversário na mesma partida.
- First to score/concede, 1st-half scoring/conceding, BTTS, clean sheets e failed to score foram derivados do placar/eventos da mesma partida.
- Suspensions / eligibility agora aparece explicitamente em 10/10 análises.
- Prediction + Odds preservadas.
- Gate permanece 62 KEEP / 77 UPGRADE / 153 LEGACY-NOINDEX / 0 REMOVE.
- Nenhum validator foi relaxado.

Fontes principais do core:
- xGscore match-stat pages para 8 jogos da Week 1;
- xG Stat para Arsenal 3-0 Coventry;
- oGol para Everton 2-0 Crystal Palace;
- fontes de lineup/team news já presentes em cada prediction.

Depois de extrair na raiz:
npm run typecheck
npm run audit:adsense-content-gate
npm run build
npm run audit:adsense-quality
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo
