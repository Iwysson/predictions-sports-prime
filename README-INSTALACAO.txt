PSP — NOVA LIGA ELITESERIEN — ROUND 20 — PACOTE COMPLETO PARA PUBLICAÇÃO

Cria a Eliteserien como liga própria (slug: eliteserien), manualOnly, temporada 2026.

ALTERAÇÕES ESTRUTURAIS
- src/types/index.ts: adiciona LeagueSlug "eliteserien".
- src/data/leagues.ts: cadastra Eliteserien (Norway, 16 clubes, 8 jogos/rodada, Europe/Oslo, ESPN nor.1) e inclui na lista principal.
- src/lib/match-time.ts: timezone Europe/Oslo.
- src/lib/league-seo.ts: aliases SEO da competição.
- src/data/standings.ts: fallback seguro vazio; standings podem ser carregados pelo provider ao vivo.
- scripts/audit-technical-seo.mjs: inclui Eliteserien no piloto técnico.
- src/data/predictions/index.ts: agrega as novas predictions.
- src/data/fixtures.snapshot.json: adiciona Matchday 20 com 8 fixtures e links predictionIds.

NOVA PASTA
src/data/predictions/eliteserien/round-20/
- 8 análises completas Data-First
- index.ts da rodada
- index.ts da liga

PADRÃO EDITORIAL
SEO = Prediction-First
Conteúdo = Data-First
HOME/AWAY = base estatística
Conflict Detector = neutro
Prediction + Odds = síntese, não premissa

IMPORTANTE
Valores não verificáveis no split continuam como “—” conforme o padrão PSP. Não foram inventados dados para preencher tabela.

VALIDAÇÃO APÓS COLAR OS ARQUIVOS
npm run fixtures:validate
npm run audit:fixtures
npm run audit:psp-editorial-standard
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:international-seo
npm run typecheck
npm run build
