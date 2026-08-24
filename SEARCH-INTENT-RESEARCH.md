# Search Intent Research

Research date: 2026-08-24  
Project: Predictions Sports Prime  
Scope: football match, prediction, betting, odds, analysis, market and temporal terminology

## Evidence policy

- Google Trends is treated as a relative research tool, not an absolute-volume source. Google states that Trends uses a normalized sample of searches and that exact search terms do not automatically include spelling variants, synonyms, singulars or plurals.
- No Google Trends CSV and no Google Search Console query/country export exists in this repository. Exact volumes, country opportunity totals, CTR opportunities and position opportunities are therefore not claimed.
- The terminology registry stores concise outcomes only. It records confidence and source category; it does not store noisy keyword dumps or expose query arrays in public HTML/JSON-LD.
- `SERP_USAGE` means the phrase was observed in current search results during this pass. `LANGUAGE_CONVENTION` means the phrasing is a normal local football convention. `SEARCH_CONSOLE` is intentionally unused until a real export is available.
- Google Trends direct Explore extraction was unavailable in the audit environment. Trends comparisons should be exported manually before any term is promoted on demand alone.

Official methodology references:

- https://support.google.com/trends/answer/4359550
- https://support.google.com/trends/answer/4355000
- https://support.google.com/trends/answer/17309543
- https://support.google.com/trends/answer/4365533

## Global findings

1. Fixture identity is the strongest match-page intent: team A + local separator + team B.
2. Prediction language differs by market: `palpite`, `pronóstico`, `pronostic`, `Tipp`, `wedtips`, `soi kèo` and `ทีเด็ดบอล` are not interchangeable literal translations.
3. Temporal modifiers are high-value only while true. Today, tomorrow and upcoming terms must come from the same exclusive lifecycle bucket used by Home.
4. Market intent becomes specific close to kickoff, but only the real editorial pick can activate Asian handicap, over/under, BTTS, corners, double chance, draw-no-bet, winner or combined-market terms.
5. Analysis, odds and statistics support click quality. They must not be advertised when the page does not contain the corresponding factual signal.
6. One canonical match page should cover related legitimate intents. Separate prediction/odds/tips doorway routes are not justified.

## Locale findings

| Locale | Prediction | Betting | Analysis | Today / Tomorrow | Primary market examples | Match format | Status |
|---|---|---|---|---|---|---|---|
| EN | prediction, football predictions | betting tips | match analysis, match preview | today / tomorrow | Asian handicap, over/under, both teams to score, corners | A vs B | VALIDATED, high |
| PT-BR | palpite, palpites de futebol | dicas de apostas | análise do jogo, prévia | hoje / amanhã | handicap asiático, mais/menos gols, ambas marcam, escanteios | A x B | VALIDATED, high |
| ES | pronóstico, pronósticos de fútbol | apuestas | análisis, previa | hoy / mañana | hándicap asiático, más/menos, ambos marcan, córners | A vs B | VALIDATED, high |
| FR | pronostic, pronostics football | conseils paris | analyse, avant-match | aujourd'hui / demain | handicap asiatique, plus/moins, les deux équipes marquent | A vs B | RESEARCHED, high |
| DE | Prognose, Fußball Prognosen | Wett-Tipps | Spielanalyse, Spielvorschau | heute / morgen | Asian Handicap, Über/Unter, beide Teams treffen | A gegen B | RESEARCHED, high |
| IT | pronostico, pronostici calcio | scommesse | analisi, anteprima | oggi / domani | handicap asiatico, under/over, gol/no gol | A vs B | RESEARCHED, high |
| NL | voorspelling, voetbal voorspellingen | wedtips | wedstrijdanalyse, voorbeschouwing | vandaag / morgen | Asian handicap, over/under, beide teams scoren | A vs B | RESEARCHED, high |
| TR | maç tahmini, futbol tahminleri | bahis ipuçları | maç analizi | bugün / yarın | Asya handikap, alt/üst, karşılıklı gol | A vs B | RESEARCHED, medium |
| ID | prediksi, prediksi bola | tips taruhan | analisis pertandingan | hari ini / besok | handicap Asia, over/under, kedua tim mencetak gol | A vs B | RESEARCHED, medium |
| VI | dự đoán bóng đá | soi kèo | phân tích, nhận định | hôm nay / ngày mai | kèo châu Á, tài/xỉu, cả hai đội ghi bàn | A vs B | RESEARCHED, medium |
| AR | توقعات المباراة | نصائح المراهنات | تحليل المباراة | اليوم / غدًا | الهانديكاب الآسيوي، أكثر/أقل، تسجيل الفريقين | A ضد B | RESEARCHED, medium |
| JA | 試合予想, サッカー予想 | ベッティング予想 | 試合分析, プレビュー | 今日 / 明日 | アジアンハンディキャップ, オーバー・アンダー, 両チーム得点 | A vs B | RESEARCHED, medium |
| KO | 경기 예측 | 베팅 팁 | 경기 분석 | 오늘 / 내일 | 아시안 핸디캡, 오버/언더, 양 팀 득점 | A vs B | NEEDS_MORE_DATA, experimental |
| TH | ทีเด็ดบอล | ทีเด็ดเดิมพัน | วิเคราะห์บอลวันนี้ | วันนี้ / พรุ่งนี้ | แฮนดิแคปเอเชีย, สูง/ต่ำ, ทั้งสองทีมทำประตู | A พบ B | RESEARCHED, medium |

Representative current SERP evidence included localized tomorrow/prediction pages from PredictZ (DE), SportyTrader (FR/IT/PT-BR), Transfermarkt (IT), WedTipper (NL), OddsFlow/Scores24 (ID), Betimate (AR), MrPredictions (JA), and Thai football-analysis surfaces. These observations validate wording, not demand volume or ranking opportunity.

## Match lifecycle

| Stage | Safe intent | Data rule |
|---|---|---|
| T-7 to T-2 | fixture + prediction + real market + upcoming/date | Published analysis only; no today/tomorrow term |
| T-1 | fixture + prediction + tomorrow + real market/odds | Must resolve to the Home Tomorrow bucket |
| Match day | fixture + prediction + today + real market/odds | Must resolve to the Home Today bucket |
| Completed | fixture + result/history | Requires factual completed status/history eligibility |
| Past but unresolved | stable fixture/date metadata only | Do not call it upcoming or historical without lifecycle evidence |

## Search Console feedback loop

The prepared record shape is implemented in `src/lib/search-performance.ts`:

`match -> locale -> query -> category -> date -> daysBeforeKickoff -> impressions -> clicks -> CTR -> averagePosition`

When a real export is supplied:

1. Validate rows and normalize locale/category.
2. Prioritize site-observed queries over inferred terms.
3. Review high-impression, good-position, low-CTR rows as CTR opportunities.
4. Review positions 4-15 as position opportunities.
5. Compare T-7, T-5, T-3, T-1 and match-day performance without changing canonicals.

## Internationalization limitation

The site has one crawlable English match URL per fixture. Locale changes are client-side and do not create distinct indexable localized URLs. Consequently:

- hreflang output remains empty;
- no same-URL fake alternates are emitted;
- the terminology/metadata engine is locale-aware for future routes;
- localized routes must exist, be indexable and be reciprocal before the hreflang registry is configured.

