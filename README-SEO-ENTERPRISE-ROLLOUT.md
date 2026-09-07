# SEO Enterprise Rollout

## Objetivo e contexto

A North Star deste programa é **ORGANIC QUALIFIED CLICKS**. O objetivo não é aumentar páginas, palavras-chave ou indexação por si só, mas ampliar impressões para consultas primárias de prediction, ganhar posições nessas consultas, melhorar CTR e gerar cliques qualificados antes do kickoff.

O site passou primeiro por uma expansão de intenção para lineups, team news, kickoff, venue, weather e referee. Algumas consultas de lineups melhoraram, mas consultas de prediction perderam posição. Uma reversão prediction-first posterior ficou rígida em alguns pontos. Em paralelo, o Google AdSense classificou o site como **“Conteúdo de baixo valor”**. Duplicação, internacionalização rasa, resíduos internos em metadata, inconsistência entre dados e texto, páginas indexáveis fracas e hubs sem valor próprio são riscos transversais.

Wave 0 cria governança, baseline, observabilidade e rollback. Ela não muda titles, descriptions, robots, indexabilidade, canonical, hreflang, sitemap, hubs, resultados, conteúdo, lineups ou lógica prediction-first.

## Mapa técnico atual

| Área | Arquivos principais | Responsabilidade/dependências | Impacto SEO |
|---|---|---|---|
| Registry editorial | `src/data/predictions/**`, `src/data/predictions/index.ts`, `src/data/matches.ts` | Conteúdo fonte, validação e construção de matches publicados | Origina páginas, metadata e sitemap |
| Quality gate | `src/lib/adsense-content-quality.ts` | KEEP, UPGRADE, LEGACY-NOINDEX e REMOVE | Controla robots e entrada no sitemap |
| Match metadata | `src/lib/seo.ts`, `src/app/(en)/match/[slug]/page.tsx` | Title, description, canonical, robots e schema | Intenção e indexabilidade em inglês |
| International | `src/lib/seo-locales.ts`, `src/lib/international-seo.ts`, `src/data/localized-editorial.ts`, `src/app/[locale]/**` | Locales, conteúdo localizado, canonical e hreflang | Expansão internacional e risco de near-duplicates |
| Search intent | `src/lib/match-search-intent.ts`, `src/lib/search-intent-research.ts` | Classificação e termos por partida/locale | Mantém o foco prediction-first |
| League SEO | `src/lib/league-seo.ts`, `src/app/(en)/league/[slug]/page.tsx`, `src/app/[locale]/league/[slug]/page.tsx` | Metadata, conteúdo e schema dos hubs | Descoberta e links internos por competição |
| Results | `src/app/(en)/results/page.tsx`, `src/lib/prediction-results.ts` | Histórico e liquidação das seleções | Confiança e preservação editorial |
| Robots/sitemap | `src/app/robots.ts`, `src/app/sitemap.ts` | Descoberta, URLs indexáveis e lastModified | Fronteira de crawl/indexação |
| Structured data | `src/lib/seo.ts`, `src/lib/sports-event-schema.ts`, `src/components/JsonLd.tsx` | Article, SportsEvent, CollectionPage e breadcrumbs | Elegibilidade e consistência semântica |
| Fixtures/freshness | `scripts/sync-fixtures.mjs`, `scripts/validate-fixture-snapshot.mjs`, `src/lib/openfootball.ts`, `src/lib/fixture-state.ts`, `src/lib/match-freshness.ts` | IDs, horários, lifecycle e resultados | Segurança temporal, metadata e histórico |
| Audits | `scripts/audit-*.mjs`, `package.json` | Gates editoriais, técnicos, internacionais, dados e AdSense | Impedem regressões críticas |
| Build/deploy | `package.json`, `.github/workflows/sync-fixtures.yml`, `.github/workflows/update-nfl-standings.yml` | Build estático e atualização automática de snapshots | Publicação e integridade de dados |
| Wave 0 | `src/config/seo-enterprise.ts`, `seo-releases.json`, `scripts/create-seo-enterprise-baseline.mjs`, `scripts/audit-enterprise-seo.mjs` | Flags, release log, baseline e agregação | Governança; sem consumidor de produção nesta Wave |

## Release e feature flags

Defaults versionados:

- `SEO_RELEASE_ID=seo-wave-0-2026-09-07`
- `SEO_BASELINE_DATE=2026-09-07`
- todas as flags ficam `false` quando ausentes, vazias ou inválidas;
- apenas `1`, `true`, `on` ou `yes`, sem distinção entre maiúsculas/minúsculas, ativam uma flag.

| Flag | Variável de ambiente | OFF (Wave 0/default) | ON (Wave futura) |
|---|---|---|---|
| quality-gate-v2 | `SEO_FEATURE_QUALITY_GATE_V2` | Gate atual | Novo gate quando implementado |
| prediction-first-v2 | `SEO_FEATURE_PREDICTION_FIRST_V2` | Lógica atual | Prediction-first v2 |
| title-engine-v2 | `SEO_FEATURE_TITLE_ENGINE_V2` | Titles atuais | Novo motor de titles |
| international-index-v2 | `SEO_FEATURE_INTERNATIONAL_INDEX_V2` | Política internacional atual | Nova política internacional |
| intent-hubs-v1 | `SEO_FEATURE_INTENT_HUBS_V1` | Sem novos hubs | Hubs de intenção v1 |
| league-hubs-v2 | `SEO_FEATURE_LEAGUE_HUBS_V2` | Hubs atuais | Hubs de liga v2 |
| results-trust-v2 | `SEO_FEATURE_RESULTS_TRUST_V2` | Results atual | Camada de confiança v2 |
| freshness-engine-v1 | `SEO_FEATURE_FRESHNESS_ENGINE_V1` | Freshness atual | Novo motor de freshness |

Nesta Wave, nenhum arquivo de produção consulta as flags. Cada Wave futura deve preservar o caminho OFF como comportamento anterior e introduzir o caminho ON no menor ponto decisório possível.

O registro versionado fica em `seo-releases.json`. Cada entrada deve conter `releaseId`, `date`, `wave`, `baseline`, `features`, `changes`, `risks`, `rollback` e `notes`.

## Baseline e auditorias

Execute:

```bash
npm run baseline:enterprise-seo
npm run audit:enterprise-seo
npm run build
```

A baseline gera `reports/seo-baseline/latest.json` e `latest.md`. Ela usa `SEO_BASELINE_DATE`, não o relógio da execução, e ordena coleções variáveis. O JSON documenta a definição das métricas. A validação de fixtures da baseline é estrutural; o agregador executa também o audit temporal de fixtures e não mascara snapshot vencido.

O agregador executa os audits de SEO, qualidade AdSense, content gate, duplicação, prediction-first, SEO técnico, internacional, structured data, integridade editorial e fixtures. Todos são executados mesmo se um falhar; ao final, qualquer falha produz exit code diferente de zero.

## Rollback e deploy

Rollback de uma Wave futura: desligue somente a variável da feature afetada e faça novo deploy. Variável ausente equivale a OFF. Não copie backups, não substitua arquivos manualmente e não faça rollback parcial de dezenas de arquivos. Se uma mudança não puder preservar o caminho OFF, ela não está pronta para rollout.

Validação mínima de deploy:

1. gerar e revisar a baseline;
2. executar `npm run audit:enterprise-seo`;
3. executar os audits editoriais obrigatórios quando houver conteúdo futuro;
4. executar `npm run typecheck` e `npm run build`;
5. comparar robots, sitemap, canonical, hreflang, titles e descriptions com a baseline anterior;
6. confirmar integridade e freshness do fixture pipeline;
7. registrar release, riscos, rollback e flags efetivamente ativadas.

Nenhuma Wave é segura com fixture pipeline inconsistente. O incidente da Copa do Brasil, no qual variantes/encoding de Atlético Mineiro produziram nove clubes em vez de oito, é o caso de referência desta exigência.

## Waves previstas

- Wave 0: governança, baseline, flags, observabilidade e rollback.
- Waves posteriores: Quality Gate 2.0, prediction-first v2, Title Engine, international index v2, intent hubs, league hubs v2, results trust v2 e freshness engine v1 — cada uma isolada por flag e medida separadamente.

Wave 1 não deve começar enquanto a baseline não estiver revisada, os warnings não estiverem classificados e a integridade de fixtures não estiver verde.

## KPIs após cada Wave

- impressions para primary prediction queries;
- queries no Top 20 e Top 10;
- CTR em Top 10;
- clicks por match antes do kickoff;
- clicks de intent hubs e league hubs;
- US impressions para soccer/picks;
- BR impressions para palpites/prognósticos;
- URLs úteis indexadas e URLs rastreadas sem impressão;
- localized near-duplicates;
- páginas sem internal linking relevante;
- páginas com metadata warnings.

Compare sempre janelas equivalentes e separe país, locale, tipo de página, liga e estado pré/pós-kickoff. Posição média global e quantidade bruta de URLs não são métricas de sucesso.

## Riscos conhecidos antes da Wave 1

- O repositório contém sinais de mojibake em dados e textos localizados; esta Wave mede e documenta, sem reescrever conteúdo.
- O snapshot de fixtures pode estar estruturalmente válido e ainda falhar freshness; ambos os estados devem ser observados.
- Alguns audits técnicos dependem de `out/` produzido pelo build e devem ser interpretados na ordem correta.
- Contagens de hreflang da baseline são estruturais, não substituem crawl do HTML publicado.
- Classificações auditadas e fallbacks automáticos precisam continuar distinguíveis para evitar expansão acidental de indexação.
