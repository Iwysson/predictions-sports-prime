# EEAT Phase 4B — Batch 2

## Checkpoint

- Scope frozen: 10 high-risk predictions.
- Fully researched/migrated: 10.
- Sources added: 25 (7 primary/official; 18 statistical or archival providers).
- Manual review required: 4 (`moreirense-vs-benfica`, `estoril-vs-rio-ave`, `sc-cambuur-vs-feyenoord`, `go-ahead-eagles-vs-ado-den-haag`).
- Picks, odds, `publishedAt`, results, final scores and `updatedAt`: preserved 10/10.
- Analyses changed/substantive/`updatedAt` recommended: 10/10.
- Remaining source migrations: 36.
- TypeScript, build, SEO, fixtures, results, sources and `git diff --check`: PASS.
- Original baseline comparison: exactly 16 documented analysis-hash divergences (Batch 1 + Batch 2), with no protected-field divergence.

## Individual change log and citation matrix

| Slug | Risk | Original hash | New hash | Verified claim clusters → sources | Removed/corrected, derived and discrepancy notes | Manual review | Status |
|---|---|---|---|---|---|---|---|
| `moreirense-vs-benfica` | HIGH | `3ce2ec28c0a7ce5d569326178393ba1dfb1847a01895b323411526cbfea971be` | `e0a41b80b69b49cba332d1a9d3d3e03613b0f69b587abdffffdc26b7a1292168` | Final records → RSSSF; prior 0-4 → World Soccer Data | Removed unsupported percentages/H2H detail; corrected -2 settlement; derived goal differences and 57.1%. Margin support weaker than side support. | YES | MIGRATED — PARTIAL SUPPORT / MANUAL REVIEW |
| `paris-saint-germain-vs-rennes` | HIGH | `e413ebe4934a82414d67ca04f81f4ea8918c449e7a70d00b13b25aac4b684f43` | `8a5ce8ee224cdc8d9c7989dbc57be7c0a01caad67eb292f003ca3449fd5c1085` | Final records, venue splits and H2H → World Soccer Data team pages | Removed unsourced xG/shot/percentage clusters; retained derived venue averages and 49.5%. | NO | MIGRATED — VERIFIED SOURCES |
| `le-havre-vs-monaco` | HIGH | `867cea81d9392de07daaeadb46b507ade68a8b0e74109dac25b584d150d4574e` | `17d83678ae771e541821d7a2b568dc8646f238909116e0cbb4947a9ae8597327` | Final overall/venue goal records → World Soccer Data | Removed unsupported over rates and granular H2H; derived 3.35/3.41/2.24 and 62.5%. | NO | MIGRATED — VERIFIED SOURCES |
| `sc-heerenveen-vs-pec-zwolle` | HIGH | `55862d322eb4cda8fef435842dc57d02d84de6223b95da9585bb5275c304291a` | `5c50dfed623a323afc97aef2e874215a6a494e1f5264479127347e5f938e3f2e` | Final home/away records and goals → World Soccer Data | Removed unsupported percentage clusters; clarified both combined-market conditions; derived 14/17 unbeaten, averages and 56.2%. | NO | MIGRATED — VERIFIED SOURCES |
| `estrela-da-amadora-vs-sc-braga` | HIGH | `390ef37ddd52bfcd89af0af6034422fd78759c7e3dd4ff0bf4d4696acbeb1602` | `55b5af877198d694e2adbcc6a6d5227398c6652f627acb8ee399e39f434b60ca` | Final venue totals and two H2H scores → World Soccer Data | Removed unsupported over/BTTS/league percentages; derived averages and 53.2%. | NO | MIGRATED — VERIFIED SOURCES |
| `sporting-cp-vs-fc-alverca` | HIGH | `4a2800e26aa33217ff77d20250531622072a8c038ce3a5eed8882302a7f9ad5f` | `9fbf37e6a6087232063d3edf1198f6088d24db8ca74b01c5ff4436bf743def6a` | Final Sporting home and Alverca away records → World Soccer Data | Removed unsupported squad/H2H claims; derived home average and 57.1%; isolated margin risk. | NO | MIGRATED — VERIFIED SOURCES |
| `estoril-vs-rio-ave` | HIGH | `f5da3cd139bf33a497e8ab2c816ffdaec701d85079bdeeea7d2809caaff2f946` | `e1b031fe106c052c1bff8fe8805aa6baa4f52e94a4d96e58d357535f98970372` | Final venue records and H2H → World Soccer Data | Removed unsupported under percentages; verified H2H conflicts with pick; derived averages and 56.2%. SOURCE DISCREPANCY resolved by retaining counterevidence, not favourable cherry-picking. | YES | MIGRATED — PARTIAL SUPPORT / MANUAL REVIEW |
| `gil-vicente-vs-casa-pia` | HIGH | `ca64d58379af5661adb520b5ca3c663f9ccf7faced3b6f988dfa1f5dfdf4c33f` | `14a63edf08c861475fef2faa98962f71fcb188ca6fe367d2ec3477a587672767` | H2H → Liga Portugal; final records → Liga Portugal/RSSSF | Removed unsupported goal-market percentages; corrected standings; derived point gap and 59.9%. | NO | MIGRATED — VERIFIED SOURCES |
| `sc-cambuur-vs-feyenoord` | HIGH | `21cf4ad9b2190b8b250514e8863eb11a7f81a3bfbb11d1acb49c2666eb67a62f` | `63a8bef3e74d986eef287c5f461a5123be34fd815e8414a322479302d298b3a6` | Feyenoord record → World Soccer Data; promotion/opening context → Eredivisie | Removed unsupported player and long H2H claims; derived road average and 54.9%. Two-goal margin remains weakly supported. | YES | MIGRATED — PARTIAL SUPPORT / MANUAL REVIEW |
| `go-ahead-eagles-vs-ado-den-haag` | HIGH | `91bc440f692fab25700f791e3c3cc53beb2f405af8867132e51970c13d117461` | `3e65076f8e1a509168cecc4593e20e7625fddcd856610fd2c028a5aef35c48a7` | Go Ahead final record → World Soccer Data; ADO promotion and first two rounds → Eredivisie | Removed unsupported squad/manager performance claims; corrected pre-match table context; derived 58.8%. Small current-season sample. | YES | MIGRATED — PARTIAL SUPPORT / MANUAL REVIEW |

Editorial opinions retained in every page are explicitly framed as market interpretation. No `updatedAt` was applied, odds provenance was not invented, and no page outside the frozen scope changed during this batch.
