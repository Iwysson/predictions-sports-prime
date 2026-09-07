# PSP — League badges final patch

Arquivos adicionados:
- public/league-badges/copa-libertadores.png
- public/league-badges/copa-sudamericana.png
- src/data/leagues.ts (registro dos dois novos assets)

O ZIP também inclui os 16 badges já fornecidos, totalizando 18 competições.

Observação:
Os dois novos PNGs são badges locais estilizados para o slot pequeno do frontend,
com identificação LIB/SUD. O `sourceUrl` do registry aponta para a identidade
CONMEBOL correspondente no Wikimedia Commons.

Após extrair na raiz do projeto:
1. npm run typecheck
2. npm run build
3. npm run audit:enterprise-seo
4. reinicie npm run dev para conferir o frontend.
