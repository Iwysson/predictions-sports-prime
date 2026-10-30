// Frozen-clock tests for the NHL 2026-10-18 slate (2 games): released at 00:00:00 America/New_York, never earlier.
// Run: npx tsx scripts/test-nhl-oct18-activation.mts
import { readFileSync } from 'node:fs';
import { getNhlTodayKey } from '../src/lib/nhl-day.ts';
import { SLATES, resolveNhlSlate } from '../src/data/nhl/slates.ts';
import { deferredMatchesFor, expandDeferredSlate } from '../src/data/nhl/deferred-slates.ts';
import { NHL_NEW_YORK_TIME_ZONE, isNhlSlateReleased } from '../src/lib/nhl-publication-policy.ts';
import { buildMobileNhlIndex } from '../src/lib/mobile-feed-build-nhl-nfl.ts';

const { createMatchContentHandler } = await import('../functions/api/match-content/[slug].js');
const { createNhlSlateHandler } = await import('../functions/api/nhl/slate/[day].js');

const index = JSON.parse(readFileSync('functions/_data/match-content.json', 'utf8'));
const assert = (ok: unknown, label: string) => { if (!ok) throw new Error(`FAIL ${label}`); console.log(`PASS ${label}`); };

const DAY = '2026-10-18';
const EXPECTED = [
  ['minnesota-wild-vs-columbus-blue-jackets', 'Minnesota Wild to win (including overtime and shootout)', 1.59],
  ['calgary-flames-vs-carolina-hurricanes', 'Over 5.5 total goals', 1.73],
] as const;
const SLUGS = EXPECTED.map((e) => e[0]);
const LEAK = /Minnesota|Columbus|Calgary|Carolina|Wild|Flames|1\.59|1\.73|Over 5\.5/i;

// ---- 1. Policy: the New York midnight on Oct 18 is 04:00:00Z (EDT) ----------------------------------------
const NY = { date: DAY, timezone: NHL_NEW_YORK_TIME_ZONE };
assert(isNhlSlateReleased(NY, new Date('2026-10-18T03:59:59Z')) === false, 'policy: closed at 03:59:59Z (23:59:59 EDT on Oct 17)');
assert(isNhlSlateReleased(NY, new Date('2026-10-18T04:00:00Z')) === true, 'policy: open at 04:00:00Z (00:00:00 EDT on Oct 18)');
assert(isNhlSlateReleased(NY, new Date('2026-10-18T04:00:01Z')) === true, 'policy: still open at 04:00:01Z');

// ---- 2. Registry: nothing about the slate in the client-visible registry ------------------------------------
const registered = SLATES.find((s) => s.dayKey === DAY);
assert(registered?.deferred === true && registered.publicationTimezone === 'America/New_York', 'registry: 2026-10-18 is deferred with publicationTimezone America/New_York');
assert(registered?.matches.length === 0 && registered?.multiples.length === 0, 'registry: the client-visible 2026-10-18 slate carries no matches (teams included)');
assert(!LEAK.test(JSON.stringify(registered)), 'registry: no team, market or odds text in the client-visible slate entry');
const listing = deferredMatchesFor(DAY);
assert(listing.length === 2 && SLUGS.every((s) => listing.some((m) => m.slug === s)), 'server-only listing: the 2 expected games');
assert(listing.every((m) => m.access === 'vip' && m.badge === 'PRIME VIP'), 'listing: both games are PRIME VIP');
assert(listing.every((m) => !m.pick && m.odds === undefined && !m.analysis && !/Over|Under|ML|to win|\d\.\d\d/.test(m.teaser + m.title + m.badge)), 'listing: no pick, odds, analysis or market text in any teaser');

// ---- 3. Protected index --------------------------------------------------------------------------------------
const gated = index.filter((e: { activeFromKey?: string }) => e.activeFromKey === DAY);
assert(new Set(index.map((e: { slug: string }) => e.slug)).size === index.length, 'index: every slug is unique');
assert(gated.length === 2 && gated.every((e: { releaseTimeZone?: string }) => e.releaseTimeZone === 'America/New_York'), 'index: 2 gated entries released in America/New_York');
for (const [slug, pick, odds] of EXPECTED) {
  const e = gated.find((x: { slug: string }) => x.slug === slug);
  assert(e && e.prediction.main === pick && e.prediction.odds === odds, `index: ${slug} -> ${pick} @ ${odds}`);
  assert(e.analysisAccess === 'vip' && e.predictionAccess === 'vip' && e.full.analysis[0].length > 300, `index: ${slug} is PRIME VIP with an analysis`);
}

// ---- 4. Frozen clock -----------------------------------------------------------------------------------------
const before = new Date('2026-10-18T03:59:59Z');
const at = new Date('2026-10-18T04:00:00Z');
const after = new Date('2026-10-18T04:00:01Z');

const env = { SUPABASE_URL: 'https://supabase.test', SUPABASE_SECRET_KEY: 'sb_secret_TESTONLY', SUPABASE_PUBLISHABLE_KEY: 'pub-test' };
const RealDate = Date;
const realFetch = globalThis.fetch;
const freezeClock = (instant: Date) => {
  globalThis.Date = class extends RealDate { constructor(...args: any[]) { super(...(args.length ? (args as [any]) : [instant.getTime()])); } static now() { return instant.getTime(); } } as DateConstructor;
};
const mockSupabase = () => {
  globalThis.fetch = (async (input: any, init: any) => {
    const url = String(input);
    const auth = String(init?.headers?.Authorization ?? '');
    if (url.endsWith('/auth/v1/user')) return auth.includes('vip-token') || auth.includes('free-token') ? new Response(JSON.stringify({ id: auth.includes('vip-token') ? 'u-vip' : 'u-free' }), { status: 200 }) : new Response('{}', { status: 401 });
    if (url.includes('/rest/v1/profiles')) return new Response(JSON.stringify(url.includes('u-vip') ? [{ plan: 'vip', subscription_status: 'active' }] : [{ plan: 'free', subscription_status: 'inactive' }]), { status: 200 });
    return new Response('{}', { status: 500 });
  }) as typeof fetch;
};
const call = (handler: ReturnType<typeof createMatchContentHandler>, slug: string, token?: string) =>
  handler({ request: new Request(`https://example.test/api/match-content/${slug}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}), params: { slug }, env });

try {
  for (const [label, instant, released] of [
    ['23:59:59 America/New_York on Oct 17 (1 second before the gate)', before, false],
    ['00:00:00 America/New_York on Oct 18 (exactly at the gate)', at, true],
    ['00:00:01 America/New_York on Oct 18 (1 second after the gate)', after, true],
  ] as const) {
    freezeClock(instant);
    mockSupabase();
    const todayKey = getNhlTodayKey(instant);
    assert(todayKey === (released ? DAY : '2026-10-17'), `${label}: NHL day key ${todayKey}`);
    const slate = resolveNhlSlate(todayKey, instant);
    // Even a client whose own clock already shows Oct 18 must be held back by the policy gate alone.
    const forced = resolveNhlSlate(DAY, instant);
    const expanded = expandDeferredSlate(forced, instant);
    const mobile = buildMobileNhlIndex(instant);
    const mobileItems = [...mobile.free, ...mobile.vip];
    const slateRes = await createNhlSlateHandler(() => instant)({ params: { day: DAY } });
    const slateBody = await slateRes.text();
    const handler = createMatchContentHandler(index);

    if (!released) {
      assert(slate?.dayKey === '2026-10-17' && forced?.dayKey === '2026-10-17', `${label}: the active slate is still 2026-10-17, even when the 10-18 key is forced`);
      assert((expanded?.matches ?? []).every((m) => !SLUGS.includes(m.slug)), `${label}: 0 Oct 18 cards in any web slate`);
      assert(expandDeferredSlate(SLATES.find((s) => s.dayKey === DAY)!, instant)?.matches.length === 0, `${label}: the deferred slate expands to 0 matches`);
      assert(mobileItems.every((m) => !SLUGS.includes(m.slug)), `${label}: mobile feed lists 0 Oct 18 entries`);
      assert(slateRes.status === 404 && !LEAK.test(slateBody), `${label}: /api/nhl/slate/${DAY} is 404 with no listing`);
      assert(!/Minnesota Wild|Calgary Flames|minnesota-wild|calgary-flames/i.test(JSON.stringify({ slate, forced, mobile })), `${label}: 0 Oct 18 teams (Wild, Flames) in the web slate or mobile feed`);
      for (const slug of SLUGS) {
        const r = await call(handler, slug);
        assert(r.status === 404 && !/Over|Under|to win|1\.\d\d/.test(JSON.stringify(await r.json())), `${label}: /api/match-content/${slug} -> 404, no prediction leak`);
        const v = await call(handler, slug, 'vip-token');
        assert(v.status === 404, `${label}: even an authenticated VIP gets 404 for ${slug} before the gate`);
      }
    } else {
      assert(slate?.dayKey === DAY && slate.deferred === true, `${label}: the active slate is 2026-10-18`);
      assert(expanded?.matches.length === 2, `${label}: 2 games loaded`);
      assert(mobileItems.length === 2 && mobileItems.every((m) => SLUGS.includes(m.slug)), `${label}: mobile feed lists the 2 games`);
      assert(mobile.vip.every((m) => m.pick === undefined && m.odds === undefined) && !/Over|Under|to win|\b[1-9]\.\d\d\b/.test(JSON.stringify({ free: mobile.free, vip: mobile.vip })), `${label}: mobile feed carries no premium pick or odds`);
      const body = JSON.parse(slateBody);
      assert(slateRes.status === 200 && body.matches.length === 2 && !/Over|Under|to win|1\.\d\d/.test(slateBody), `${label}: /api/nhl/slate/${DAY} serves 2 teasers with no pick or odds`);
      for (const [slug, pick, odds] of EXPECTED) {
        const anon = await call(handler, slug);
        assert(anon.status === 401 && !/Over|Under|to win|1\.\d\d/.test(JSON.stringify(await anon.json())), `${label}: ${slug} -> 401 for anonymous, nothing leaked`);
        const nonVip = await call(handler, slug, 'free-token');
        assert(nonVip.status === 403 && !/Over|Under|to win|1\.\d\d/.test(JSON.stringify(await nonVip.json())), `${label}: ${slug} -> 403 for a non-VIP account, nothing leaked`);
        const vip = await call(handler, slug, 'vip-token');
        const vb = await vip.json();
        assert(vip.status === 200 && vb.prediction.main === pick && vb.prediction.odds === odds, `${label}: ${slug} -> 200 for VIP (${pick} @ ${odds})`);
      }
    }
  }
  // ---- 5. Regression: the Oct 17 slate is untouched --------------------------------------------------------
  assert(index.filter((e: { activeFromKey?: string }) => e.activeFromKey === '2026-10-17').length === 14, 'regression: the 14 Oct 17 protected entries are untouched');
  assert(deferredMatchesFor('2026-10-17').length === 14, 'regression: the Oct 17 deferred listing still has 14 games');
} finally {
  globalThis.Date = RealDate;
  globalThis.fetch = realFetch;
}

console.log('ALL NHL OCT 18 GATE TESTS PASSED');
