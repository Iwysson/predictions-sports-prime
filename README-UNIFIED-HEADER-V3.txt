PSP — UNIFIED HEADER / INTERNATIONAL MOBILE FIX V3
Data: 03/09/2026

OBJETIVO
Eliminar a existência de dois sistemas de header diferentes.

O Header inglês que já funcionava passa a fornecer a estrutura única SiteHeader.
O cabeçalho localizado reutiliza exatamente essa mesma estrutura e comportamento:
- mesmo logo/check SVG;
- mesmo brand-copy;
- mesmo header-actions;
- mesma desktop-nav;
- mesmo RouteLanguageSelector;
- mesmo botão menu-button;
- mesma mobile-nav;
- mesmo estado de abertura/fechamento;
- mesmos breakpoints já existentes em globals.css.

ARQUIVOS
1. src/components/Header.tsx
   - adiciona SiteHeader reutilizável;
   - Header inglês passa a consumir SiteHeader.

2. src/components/LocalizedSiteChrome.tsx
   - remove implementação própria de navegação;
   - LocalizedHeader passa a consumir SiteHeader;
   - Footer localizado permanece preservado.

3. src/components/RouteLanguageSelector.tsx
   - mantém correção de preservação de rotas válidas;
   - remove a antiga lista piloto de apenas quatro caminhos.

IMPORTANTE
Não é necessário alterar globals.css nesta versão.
A intenção é que inglês e idiomas localizados obedeçam às MESMAS classes e aos
MESMOS breakpoints, eliminando divergência estrutural.

SUBSTITUA OS 3 ARQUIVOS.

VALIDAÇÃO:
npm run typecheck
npm run audit:international-seo
npm run audit:prediction-first-search-intent
npm run build

TESTE VISUAL:
- /
- /pt-br/
- /es/
- /fr/
- /de/
- /it/
- /nl/
- /tr/

Em uma largura mobile real (<720 CSS px), todos devem apresentar o mesmo padrão:
logo/check + seletor de idioma + hambúrguer.
