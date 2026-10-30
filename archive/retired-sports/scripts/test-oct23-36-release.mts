import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ledger from '../src/data/predictions/editorial-tools/oct23-import-ledger.json';
import content from '../functions/_data/match-content.json';
import release from '../functions/_data/match-release.json';
import gated from '../functions/_data/sitemap-gated.json';
import { createMiddlewareHandler } from '../functions/_middleware.js';
import { createMatchContentHandler } from '../functions/api/match-content/[slug].js';
import { createNbaSlateHandler } from '../functions/api/nba/slate/[day].js';
import { createNhlSlateHandler } from '../functions/api/nhl/slate/[day].js';
import { buildMobileNflIndex } from '../src/lib/mobile-feed-build-nhl-nfl.ts';

const groups = [
  { date: '2026-10-22', before: '2026-10-22T03:59:59Z', after: '2026-10-22T04:00:00Z', count: 1 },
  { date: '2026-10-23', before: '2026-10-23T03:59:59Z', after: '2026-10-23T04:00:00Z', count: 22 },
  { date: '2026-10-25', before: '2026-10-25T03:59:59Z', after: '2026-10-25T04:00:00Z', count: 12 },
  { date: '2026-10-26', before: '2026-10-26T03:59:59Z', after: '2026-10-26T04:00:00Z', count: 1 },
];
for (const group of groups) {
  const rows = ledger.entries.filter(row => row.date === group.date);
  assert.equal(rows.length, group.count, `${group.date}: expected release count`);
  for (const row of rows) {
    const rule = release.find(entry => entry.slug === row.slug);
    assert.deepEqual(rule, { slug: row.slug, date: group.date, timezone: 'America/New_York' });
    const entry = content.find(item => item.slug === row.slug);
    assert.ok(entry, `${row.slug}: protected server index entry`);
    const request = new Request(`https://predictions-sports-prime.com/api/match-content/${row.slug}`);
    const context = { request, params: { slug: row.slug }, env: { SUPABASE_URL: 'https://example.invalid', SUPABASE_SECRET_KEY: 'x', SUPABASE_PUBLISHABLE_KEY: 'x' } };
    const before = await createMatchContentHandler(content, () => new Date(group.before))(context);
    assert.equal(before.status, 404, `${row.slug}: API fails closed before midnight`);
    assert.equal(before.headers.get('cache-control'), 'private, no-store');
    const after = await createMatchContentHandler(content, () => new Date(group.after))(context);
    assert.equal(after.status, row.access === 'FREE' ? 200 : 401, `${row.slug}: FREE open or VIP authentication after midnight`);
    if (row.access === 'FREE') {
      const payload = await after.json();
      assert.equal(payload.prediction.main, row.pick);
      assert.equal(payload.prediction.odds, row.odds);
    } else {
      assert.equal((await after.text()).includes(row.pick), false, `${row.slug}: VIP pick hidden`);
    }
    if (row.sport === 'FOOTBALL') {
      const route = `https://predictions-sports-prime.com/match/${row.slug}/`;
      const invoke = (now: string) => createMiddlewareHandler({ now: () => new Date(now) })({
        request: new Request(route), next: async () => new Response('page'),
      });
      const hidden = await invoke(group.before);
      assert.equal(hidden.status, 307);
      assert.equal(hidden.headers.get('location'), 'https://predictions-sports-prime.com/');
      assert.equal(hidden.headers.get('cache-control'), 'no-store');
      assert.equal((await invoke(group.after)).status, 200);
      assert.equal(gated.filter(item => item.slug === row.slug).length, 2, `${row.slug}: queued in league and upcoming sitemaps`);
    }
  }
}
const nflBefore = buildMobileNflIndex(new Date('2026-10-25T03:59:59Z'));
const nflAfter = buildMobileNflIndex(new Date('2026-10-25T04:00:00Z'));
assert.equal(nflBefore.free.length, 1, 'Oct 22 NFL game only before Oct 25 midnight');
assert.equal(nflAfter.free.length, 13, 'Sunday NFL games release at Oct 25 midnight');
assert.equal(buildMobileNflIndex(new Date('2026-10-26T04:00:00Z')).free.length, 14, 'Monday NFL game releases separately');
for (const sport of ['nba', 'nhl'] as const) {
  const handler = sport === 'nba' ? createNbaSlateHandler : createNhlSlateHandler;
  const call = (time: string) => handler(() => new Date(time))({ params: { day: '2026-10-23' } });
  assert.equal((await call('2026-10-23T03:59:59Z')).status, 404, `${sport}: listing hidden`);
  const response = await call('2026-10-23T04:00:00Z');
  assert.equal(response.status, 200, `${sport}: listing opens at New York midnight`);
  const payload = await response.json();
  assert.equal(payload.matches.length, sport === 'nba' ? 11 : 2);
  assert.equal(JSON.stringify(payload).includes('"pick"'), false, `${sport}: listing has no picks`);
}
for (const path of ['out/index.html', 'out/nfl/index.html', 'out/nba/index.html', 'out/nhl/index.html']) {
  const html = readFileSync(path, 'utf8');
  for (const row of ledger.entries.filter(row => row.access === 'PRIME VIP')) {
    assert.equal(html.includes(row.pick), false, `${path}: no early VIP pick`);
  }
}
console.log('October 22–26 release gates: PASS (36 API entries, four New York midnights, 307 football routes, FREE/VIP access, NHL/NBA listings, NFL per-day mobile feed, sitemaps).');
