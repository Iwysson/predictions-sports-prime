PSP — INTERNATIONAL / MOBILE HEADER FIX
Data: 03/09/2026

DIAGNÓSTICO
1. O header localizado usava className="main-nav", mas o CSS responsivo do projeto
   controla ".desktop-nav", ".menu-button" e ".mobile-nav".
   Resultado: em telas pequenas os links localizados continuavam todos na mesma linha,
   causando sobreposição/estouro horizontal.

2. O header localizado também usava "brand-mark" em vez da estrutura visual usada
   pelo header inglês ("brand-symbol" + "brand-copy"). Isso agravava o layout mobile.

3. RouteLanguageSelector estava limitado a uma lista piloto de poucas URLs.
   O seletor agora preserva corretamente Home, páginas de liga e NFL.
   Em páginas de jogo localizadas, a troca entre os cinco locales plenamente
   publicados (pt-br, es, fr, de, it) preserva o mesmo jogo.
   Para rotas sem equivalente traduzido, o fallback continua seguro para a Home
   do idioma escolhido em vez de gerar uma URL inexistente.

ARQUIVOS CORRIGIDOS
- src/components/LocalizedSiteChrome.tsx
- src/components/RouteLanguageSelector.tsx

O QUE MUDA NO MOBILE
- mesmo padrão visual do header inglês;
- logo/check correto;
- nome da marca ocultado automaticamente nas telas estreitas pelo CSS já existente;
- seletor de idioma permanece visível;
- botão hambúrguer aparece;
- menu mobile abre/fecha;
- links deixam de ficar sobrepostos;
- rotas localizadas de liga e NFL são preservadas;
- troca entre idiomas plenamente localizados em uma página de jogo preserva o jogo.

NÃO FOI NECESSÁRIO ALTERAR
- src/app/globals.css
- src/i18n/dictionaries.ts
- src/i18n/I18nProvider.tsx
- páginas SEO/hreflang/canonical

INSTALAÇÃO
Substitua os dois arquivos mantendo exatamente os caminhos acima.

VALIDAÇÃO RECOMENDADA
npm run typecheck
npm run audit:international-seo
npm run audit:prediction-first-search-intent
npm run build
