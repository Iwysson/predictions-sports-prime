# Retomada da validação dos links — 19/09/2026

A etapa interrompida na captura foi concluída: revisão das cinco alterações de navegação, acompanhamento do build já em execução e auditorias sobre a exportação final.

Os links da home, das rodadas de ligas e das análises relacionadas usam a tradução somente quando existe editorial localizado completo. Nos demais casos, apontam para a página original em inglês. Nenhum arquivo de previsão foi alterado nesta retomada.

## Resultados

| Verificação | Resultado |
| --- | --- |
| Typecheck | PASS, código de saída 0 |
| Build anterior | Processo encerrado; `.next/export-detail.json` confirmou `success: true` e destino `out` |
| Integridade de produção | PASS, 874 arquivos HTML |
| Links internos quebrados | 0 |
| Páginas de partidas órfãs | 0 |
| Partidas futuras com descoberta fraca | 0 |
| Autolinks em relacionados / vazamento de rascunhos | 0 / 0 |
| Dados estruturados | PASS, 0 erros críticos e 0 avisos |
| Integridade das previsões | Código de saída 0; avisos de datas e proveniência de odds ausentes |
| Qualidade editorial | 123 futuras verificadas: 79 boas, 44 com avisos, 0 críticas; 521 históricas e 23 não resolvidas excluídas |
| Conteúdo de publicação | FAIL: 312 ocorrências de repetição, incluindo notas de cobertura estatística, informações de competição e escalações |
| SEO geral | FAIL: inclui conteúdo futuro abaixo do limite do auditor e páginas ausentes do sitemap |
| SEO internacional | FAIL: inclui páginas indexáveis e destinos hreflang ausentes do sitemap |
| `git diff --check` | PASS |

## Pendências identificadas

O sitemap implementado em `src/app/sitemap.ts` retorna páginas estáticas e homes localizadas; não inclui as páginas de partidas nem os hubs de ligas que os auditores esperam encontrar. A exportação confirma essa diferença.

As 312 ocorrências de repetição precisam de classificação editorial: o auditor inclui notas estruturais e dados factuais repetidos entre jogos. O número não representa 312 páginas distintas nem comprova que todas as ocorrências sejam duplicação editorial indevida.

As correções de navegação estão validadas. O conjunto completo de auditorias ainda não está aprovado. Não houve deploy, envio ao AdSense ou alteração de previsões históricas nesta retomada.

O comando `audit:psp-editorial-standard` não existe no `package.json` desta cópia. Não houve migração nem alteração de previsão futura nesta etapa.
