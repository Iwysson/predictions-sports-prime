# Scottish Premiership — PSP migration package

## Scope
- League: Scottish Premiership
- Migration window: current/future fixtures as of 2026-09-02
- Historical matches: preserved byte-for-byte and not migrated

## Changed future/pre-match files
- `celtic-vs-aberdeen.ts` — 1264 words; Core sections: 1; mandatory rows missing: 0; placeholders: NO; psp-v1: YES
- `dundee-vs-st-johnstone.ts` — 1270 words; Core sections: 1; mandatory rows missing: 0; placeholders: NO; psp-v1: YES
- `falkirk-vs-rangers.ts` — 1256 words; Core sections: 1; mandatory rows missing: 0; placeholders: NO; psp-v1: YES
- `kilmarnock-vs-st-mirren.ts` — 1284 words; Core sections: 1; mandatory rows missing: 0; placeholders: NO; psp-v1: YES
- `motherwell-vs-dundee-united.ts` — 1267 words; Core sections: 1; mandatory rows missing: 0; placeholders: NO; psp-v1: YES
- `hibernian-vs-hearts.ts` — 1278 words; Core sections: 1; mandatory rows missing: 0; placeholders: NO; psp-v1: YES

## Frozen historical files (SHA-256 unchanged)
- `aberdeen-vs-rangers.ts` — `a097a9318bcc2b012e735c824e8b501cc444109f31ed9255e62c710966ed59bb`
- `celtic-vs-falkirk.ts` — `4d43571dbc46dcab4ce8bb18da2d0d9bef6d4f4e2ec075995b1a12ad747e3453`
- `dundee-vs-hibernian.ts` — `3201748c60d274e546621846165af96224741eb6a78b43bd0e1894b7ad56cee5`
- `hearts-vs-st-johnstone.ts` — `d1e632fc8a7df5be0ccb5f5d7ddf53a9f0840d1c63ed921aae3ca324a6cbea1f`
- `kilmarnock-vs-dundee-united.ts` — `c0123806c56a20902900886eb7c7b070c8b78a509f610d82f5fbc6babf987118`
- `st-mirren-vs-motherwell.ts` — `05e183598f9b7165ffb19ced12b0a3ec80d8357b746b05267fec33a9d4c32d8a`

## Preservation rules
Prediction and published odds were kept unchanged for every migrated fixture. No historical editorial file was rewritten. Team news and probable lineups were refreshed for the six eligible fixtures. Statistical Core uses HOME split for the host and AWAY split for the visitor, with every mandatory metric populated and no placeholder values.