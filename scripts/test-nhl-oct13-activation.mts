import { readFileSync } from 'node:fs';
import { getNhlTodayKey } from '../src/lib/nhl-day.ts';
import { resolveNhlSlate } from '../src/data/nhl/slates.ts';
import { buildMobileNhlIndex } from '../src/lib/mobile-feed-build-nhl-nfl.ts';

const { createMatchContentHandler } = await import('../functions/api/match-content/[slug].js');
const index = JSON.parse(readFileSync('functions/_data/match-content.json', 'utf8'));
const protectedEntries = index.filter((entry: { activeFromKey?: string }) => entry.activeFromKey === '2026-10-13');
const publicMatches = resolveNhlSlate('2026-10-13')?.matches ?? [];
const assert = (ok: unknown, label: string) => { if (!ok) throw new Error(label); console.log(`PASS ${label}`); };

assert(publicMatches.length === 16, '16 October 13 NHL fixtures');
assert(publicMatches.filter((m) => m.access === 'free').length === 2, 'two FREE NHL fixtures');
assert(publicMatches.filter((m) => m.access === 'best').length === 1, 'one BEST BET NHL fixture');
assert(publicMatches.filter((m) => m.access === 'vip').length === 13, '13 regular VIP NHL fixtures');
assert(publicMatches.filter((m) => m.access !== 'free').every((m) => m.pick === undefined && m.odds === undefined && m.analysis === undefined), 'VIP public records have no protected content');
assert(protectedEntries.length === 14, '14 protected NHL entries');

const RealDate = Date;
try {
  for (const [label, instant, expectedDay, expectedStatus] of [
    ['23:59:59 ET', '2026-10-13T03:59:59Z', '2026-10-12', 404],
    ['00:00:00 ET', '2026-10-13T04:00:00Z', '2026-10-13', 401],
    ['00:00:01 ET', '2026-10-13T04:00:01Z', '2026-10-13', 401],
  ] as const) {
    const now = new RealDate(instant);
    assert(getNhlTodayKey(now) === expectedDay, `${label} New York day`);
    assert(resolveNhlSlate(getNhlTodayKey(now))?.dayKey === expectedDay, `${label} web slate`);
    const mobile = buildMobileNhlIndex(now);
    assert(mobile.free.length + mobile.vip.length === (expectedDay === '2026-10-13' ? 16 : 3), `${label} mobile slate`);
    globalThis.Date = class extends RealDate { constructor(...args: any[]) { super(...(args.length ? args as [any] : [instant])); } } as DateConstructor;
    const handler = createMatchContentHandler(index);
    const statuses = await Promise.all(protectedEntries.map(async (entry: { slug: string }) => {
      const response = await handler({ request: new Request(`https://example.test/api/match-content/${entry.slug}`), params: { slug: entry.slug }, env: { SUPABASE_URL: 'https://supabase.test', SUPABASE_SECRET_KEY: 'sb_secret_TESTONLY', SUPABASE_PUBLISHABLE_KEY: 'pub-test' } });
      return response.status;
    }));
    assert(statuses.every((status) => status === expectedStatus), `${label} protected API status ${expectedStatus}`);
  }
} finally {
  globalThis.Date = RealDate;
}
