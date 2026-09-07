PSP — INTERNATIONAL MOBILE FIX V2
03/09/2026

Esta versão usa os arquivos originais dos ZIPs enviados pelo usuário.

CAUSA CONFIRMADA
- O header localizado original usava .main-nav e não possuía menu mobile.
- O CSS responsivo existente controla .desktop-nav, .menu-button e .mobile-nav.
- Além disso, o breakpoint padrão de 720px é suficiente para o inglês, mas é
  estreito demais para labels traduzidos. Em janelas/tablets com ~800–900px
  o header localizado ainda podia ficar espremido.

CORREÇÃO
1. LocalizedSiteChrome.tsx:
   - passa a usar a mesma estrutura responsiva do Header inglês;
   - adiciona botão hambúrguer e mobile-nav;
   - adiciona a classe localized-site-header para regras específicas;
   - preserva links localizados.

2. RouteLanguageSelector.tsx:
   - remove a limitação da antiga lista piloto para home/liga/NFL;
   - preserva rotas válidas ao trocar idioma;
   - mantém fallback seguro para rotas sem equivalente.

3. globals.css:
   - para o header localizado, desktop-nav é ocultado já em <=980px;
   - hambúrguer aparece em <=980px;
   - em <=520px, a cópia da marca é ocultada para sobrar espaço;
   - o inglês continua com o comportamento já existente.

SUBSTITUIR
src/components/LocalizedSiteChrome.tsx
src/components/RouteLanguageSelector.tsx
src/app/globals.css

VALIDAR
npm run typecheck
npm run audit:international-seo
npm run audit:prediction-first-search-intent
npm run build

TESTE VISUAL
- 390px / 430px: símbolo + idioma + hambúrguer
- 768px / 850px: header localizado deve usar hambúrguer, sem links espremidos
- desktop >980px: navegação localizada normal
