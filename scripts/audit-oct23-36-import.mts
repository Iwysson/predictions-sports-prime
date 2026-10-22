import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import ledger from '../src/data/predictions/editorial-tools/oct23-import-ledger.json';
import { editorialPredictions } from '../src/data/predictions/index.ts';
import nfl from '../src/data/nfl/week7-2026-protected.json';
import nba from '../src/data/nba/protected-2026-10-23.json';
import nhl from '../src/data/nhl/protected-2026-10-23.json';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const rows = ledger.entries;
assert.equal(rows.length, 36, 'package must contain exactly 36 analyses');
assert.equal(rows.filter(row => row.access === 'FREE').length, 30, 'exactly 30 FREE');
assert.equal(rows.filter(row => row.access === 'PRIME VIP').length, 6, 'exactly 6 PRIME VIP');
assert.equal(new Set(rows.map(row => `${row.sport}:${row.slug}`)).size, 36, 'unique match identity');

for (const row of rows) {
  const tier = row.access === 'FREE' ? 'free' : 'vip';
  if (row.sport === 'FOOTBALL') {
    const matches = editorialPredictions.filter(p => p.slug === row.slug);
    assert.equal(matches.length, 1, `${row.slug}: one football prediction`);
    const prediction = matches[0];
    assert.equal(prediction.homeTeam, row.home);
    assert.equal(prediction.awayTeam, row.away);
    assert.equal(prediction.matchInfo?.date, row.date);
    assert.equal(prediction.matchInfo?.releaseTimeZone, 'America/New_York');
    assert.equal(prediction.access, tier);
    assert.equal(prediction.analysisAccess, tier);
    assert.equal(prediction.predictionAccess, tier);
    assert.equal(prediction.picks.main, row.pick);
    assert.equal(prediction.picks.publishedOdds, row.odds);
    // The author's season table was merged into the single Core at the end; everything else stays as supplied.
    assert.equal(prediction.analysis.length, 1, `${row.slug}: one analysis block`);
    const [body, core = ''] = prediction.analysis[0].split(/\n\n(?=### Statistical Core Predictions-Sports-Prime\n)/);
    assert.equal(hash(body), row.bodySha256, `${row.slug}: intact author body`);
    const analysisStart = body.indexOf('## Match Analysis\n');
    assert.equal(hash(body.slice(analysisStart, body.indexOf('\n## ', analysisStart + 5))), row.matchAnalysisSha256, `${row.slug}: intact Match Analysis paragraphs`);
    assert.equal((prediction.analysis[0].match(/^#{1,6} Statistical Core\b/gm) ?? []).length, 1, `${row.slug}: exactly one Statistical Core section`);
    assert.match(core, /^### Statistical Core Predictions-Sports-Prime\n\n(?:\|[^\n]*\|\n?)+$/, `${row.slug}: Core is one table at the end`);
    assert.equal(prediction.preservedSource?.sha256, row.sha256);
    assert.equal(prediction.preservedSource?.packagePath, row.source);
    assert.equal(prediction.statisticalCoreProvenance?.home.sampleType, 'home');
    assert.equal(prediction.statisticalCoreProvenance?.away.sampleType, 'away');
    continue;
  }
  const entries = row.sport === 'NFL' ? nfl.entries : row.sport === 'NBA' ? nba.entries : nhl.entries;
  const matches = entries.filter(entry => entry.slug === row.slug);
  assert.equal(matches.length, 1, `${row.slug}: one ${row.sport} prediction`);
  const entry = matches[0];
  assert.equal(entry.analysisAccess, tier);
  assert.equal(entry.predictionAccess, tier);
  assert.equal(entry.pick, row.pick);
  assert.equal(entry.odds, row.odds);
  assert.equal(hash(entry.analysis[0]), row.sha256, `${row.slug}: intact Markdown`);
  if (row.sport === 'NFL') {
    assert.equal(entry.activeFromKey, row.date);
    assert.equal(entry.releaseTimeZone, 'America/New_York');
  } else {
    assert.equal(entries.length, row.sport === 'NBA' ? 11 : 2);
  }
}

assert.equal(nfl.entries.length, 14);
assert.equal(nba.activeFromKey, '2026-10-23');
assert.equal(nhl.activeFromKey, '2026-10-23');
assert.equal(nba.releaseTimeZone, 'America/New_York');
assert.equal(nhl.releaseTimeZone, 'America/New_York');
console.log('October 22 package import: PASS (36 intact texts, picks and odds; 30 FREE / 6 PRIME VIP; dates and New York gates).');
