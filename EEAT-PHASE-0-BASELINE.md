# EEAT Phase 0 — Editorial Baseline

**Created:** 2026-08-20  
**Status:** PASS

## Protected state

| Item | Count |
|---|---:|
| Published predictions | 52 |
| Draft predictions | 72 |
| Baseline entries | 52 |
| Main picks protected | 52 |
| Published odds protected | 51 |
| `publishedAt` protected | 52 |
| Existing `updatedAt` | 0 |
| Existing result statuses | 1 |
| Existing final scores | 1 |
| Analysis hashes | 52 |

The baseline reflects the repository state immediately before Phase 1. It includes the already recorded Atlético Madrid vs Málaga result and final score.

## Files and commands

- Manifest: `editorial-baseline.json`
- State collector/hash implementation: `scripts/editorial-baseline-lib.mjs`
- Manifest generator: `scripts/create-editorial-baseline.mjs`
- Comparator: `scripts/audit-editorial-baseline.mjs`
- Create command: `npm.cmd run baseline:create`
- Comparison command: `npm.cmd run audit:baseline`

The manifest is intentionally committed as an audit reference. The audit command never rewrites it.

## Deterministic analysis hash

Each TypeScript prediction is decoded into its ordered `analysis` string array. The hash input is:

```text
JSON.stringify(decoded analysis string array)
```

That exact UTF-8 byte sequence is hashed with SHA-256. This makes the hash independent of TypeScript indentation and line endings while remaining sensitive to paragraph text, punctuation, order, count, and paragraph boundaries. Entries and source files are sorted deterministically.

Manifest declaration:

```text
sha256(JSON.stringify(decoded analysis string array), UTF-8)
```

## Comparison behavior

The default audit fails on changes to:

- published/draft counts;
- slug set;
- league and `published` state;
- main pick and odds;
- `publishedAt`;
- existing result status/source and final score;
- `updatedAt`;
- analysis hash.

It compares prediction data only, so shared template, component, style, metadata and structured-data changes do not create false editorial divergences.

Future authorized editorial work can use `--allow-analysis-changes` and/or `--allow-updated-at-changes` to report those changes as notices while all immutable/protected fields remain strict. The baseline is not an editorial lock and must not be silently regenerated to conceal a divergence.

## Initial validation

```text
Editorial baseline written: 52 published, 72 drafts.
Editorial baseline audit: PASS (52/52 entries; all protected fields preserved).
Analysis hashes preserved: 52/52.
```

Phase 0 passed. Phase 1 was therefore permitted to begin.
