// Frozen-clock tests for the NHL 2026-10-17 slate: released at 00:00:00 America/New_York, never earlier.
// Run: npx tsx scripts/test-nhl-oct17-activation.mts
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { getNhlDayStart, getNhlTodayKey } from '../src/lib/nhl-day.ts';
import { SLATES, resolveNhlSlate } from '../src/data/nhl/slates.ts';
import { deferredMatchesFor, expandDeferredSlate } from '../src/data/nhl/deferred-slates.ts';
import { NHL_NEW_YORK_TIME_ZONE, isNhlMatchDayReleased, isNhlSlateReleased } from '../src/lib/nhl-publication-policy.ts';
import { buildMobileNhlIndex } from '../src/lib/mobile-feed-build-nhl-nfl.ts';
import { hubLastModified } from '../src/lib/sitemap-data.ts';

const { createMatchContentHandler } = await import('../functions/api/match-content/[slug].js');
const { createNhlSlateHandler } = await import('../functions/api/nhl/slate/[day].js');

const index = JSON.parse(readFileSync('functions/_data/match-content.json', 'utf8'));
const assert = (ok: unknown, label: string) => { if (!ok) throw new Error(`FAIL ${label}`); console.log(`PASS ${label}`); };

const DAY = '2026-10-17';
const FREE = ['new-york-rangers', 'buffalo-sabres'];
const EXPECTED = [
  ['washington-capitals-vs-new-jersey-devils', 'vip', 'Washington Capitals to win (including overtime and shootout)', 1.89],
  ['winnipeg-jets-vs-carolina-hurricanes', 'vip', 'Over 5.5 total goals', 1.77],
  ['tampa-bay-lightning-vs-vancouver-canucks', 'vip', 'Tampa Bay Lightning to win (including overtime and shootout)', 1.32],
  ['florida-panthers-vs-seattle-kraken', 'vip', 'Florida Panthers to win (including overtime and shootout)', 1.61],
  ['chicago-blackhawks-vs-dallas-stars', 'vip', 'Over 5.5 total goals', 1.85],
  ['columbus-blue-jackets-vs-new-york-rangers', 'free', 'Over 5.5 total goals', 1.72],
  ['detroit-red-wings-vs-san-jose-sharks', 'vip', 'Detroit Red Wings to win (including overtime and shootout)', 1.81],
  ['montreal-canadiens-vs-buffalo-sabres-2026-10-17', 'free', 'Over 5.5 total goals', 1.64],
  ['philadelphia-flyers-vs-ottawa-senators', 'vip', 'Over 5.0 total goals', 1.65],
  ['toronto-maple-leafs-vs-new-york-islanders', 'vip', 'Over 5.5 total goals', 1.77],
  ['nashville-predators-vs-st-louis-blues', 'vip', 'Under 6.5 total goals', 1.6],
  ['los-angeles-kings-vs-boston-bruins', 'vip', 'Los Angeles Kings to win (including overtime and shootout)', 1.77],
  ['utah-mammoth-vs-edmonton-oilers', 'best', 'Over 5.5 total goals', 1.62],
  ['vegas-golden-knights-vs-pittsburgh-penguins', 'vip', 'Vegas Golden Knights to win (including overtime and shootout)', 1.48],
] as const;
const SLUGS = EXPECTED.map((e) => e[0]);

// The instant at which America/New_York shows the given wall clock. Probes the two possible offsets and keeps
// the one the IANA zone itself agrees with (the same technique as getNhlDayStart); no fixed offset is assumed.
const nyFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: NHL_NEW_YORK_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
const nyWallClock = (instant: Date) => {
  const p = Object.fromEntries(nyFormatter.formatToParts(instant).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
};
const nyInstant = (wall: string) => {
  for (const offsetHours of [4, 5]) {
    const candidate = new Date(Date.parse(`${wall}Z`) + offsetHours * 3_600_000);
    if (nyWallClock(candidate) === wall) return candidate;
  }
  throw new Error(`no New York instant for ${wall}`);
};

// ---- 1. The policy helper: IANA zone, DST-safe, fail-closed ------------------------------------------------
const NY = { date: DAY, timezone: NHL_NEW_YORK_TIME_ZONE };
assert(isNhlSlateReleased(NY, new Date('2026-10-17T03:59:59Z')) === false, 'policy: closed at 03:59:59Z (23:59:59 EDT on Oct 16)');
assert(isNhlSlateReleased(NY, new Date('2026-10-17T04:00:00Z')) === true, 'policy: open at 04:00:00Z (00:00:00 EDT on Oct 17)');
assert(isNhlSlateReleased(NY, new Date('2026-10-17T04:00:01Z')) === true, 'policy: still open at 04:00:01Z');
// EST: the clocks went back on 2026-11-01, so New York midnight on 2026-11-02 is 05:00Z, not 04:00Z.
assert(isNhlSlateReleased({ date: '2026-11-02', timezone: NHL_NEW_YORK_TIME_ZONE }, new Date('2026-11-02T04:59:59Z')) === false, 'policy: EST closed at 04:59:59Z (23:59:59 EST)');
assert(isNhlSlateReleased({ date: '2026-11-02', timezone: NHL_NEW_YORK_TIME_ZONE }, new Date('2026-11-02T05:00:00Z')) === true, 'policy: EST open at 05:00:00Z (00:00:00 EST)');
// Spring forward 2027-03-14: midnight on the 14th is still EST (05:00Z), midnight on the 15th is EDT (04:00Z).
assert(isNhlSlateReleased({ date: '2027-03-14', timezone: NHL_NEW_YORK_TIME_ZONE }, new Date('2027-03-14T04:59:59Z')) === false, 'policy: closed at 04:59:59Z on the spring-forward day (EST)');
assert(isNhlSlateReleased({ date: '2027-03-14', timezone: NHL_NEW_YORK_TIME_ZONE }, new Date('2027-03-14T05:00:00Z')) === true, 'policy: open at 05:00:00Z on the spring-forward day (EST)');
assert(isNhlSlateReleased({ date: '2027-03-15', timezone: NHL_NEW_YORK_TIME_ZONE }, new Date('2027-03-15T03:59:59Z')) === false, 'policy: closed at 03:59:59Z the day after spring-forward (EDT)');
assert(isNhlSlateReleased({ date: '2027-03-15', timezone: NHL_NEW_YORK_TIME_ZONE }, new Date('2027-03-15T04:00:00Z')) === true, 'policy: open at 04:00:00Z the day after spring-forward (EDT)');
assert(isNhlSlateReleased({ date: DAY, timezone: 'Not/AZone' }, new Date('2030-01-01T00:00:00Z')) === false, 'policy: an unknown time zone fails closed');
assert(isNhlSlateReleased({ date: 'oct-17', timezone: NHL_NEW_YORK_TIME_ZONE }, new Date('2030-01-01T00:00:00Z')) === false, 'policy: a malformed date fails closed');
assert(isNhlMatchDayReleased('2026-10-16', new Date('2026-10-16T02:59:59Z')) === false && isNhlMatchDayReleased('2026-10-16', new Date('2026-10-16T03:00:00Z')) === true, 'regression: older slates keep the America/Sao_Paulo rule');
assert(nyWallClock(nyInstant('2026-10-16T23:59:59')) === '2026-10-16T23:59:59' && nyInstant('2026-10-17T00:00:00').toISOString() === '2026-10-17T04:00:00.000Z', 'helper: New York midnight on Oct 17 is 04:00:00Z (EDT), derived from the zone');

// ---- 2. Registry shape: nothing about the slate in the client-visible registry ------------------------------
const registered = SLATES.find((s) => s.dayKey === DAY);
assert(registered?.deferred === true && registered.publicationTimezone === 'America/New_York', 'registry: 2026-10-17 is deferred with publicationTimezone America/New_York');
assert(registered?.matches.length === 0 && registered?.multiples.length === 0, 'registry: the client-visible 2026-10-17 slate carries no matches (teams included)');
assert(!JSON.stringify(registered).match(/Over|Under|ML|to win|1\.\d\d/), 'registry: no market or odds text in the client-visible slate entry');
assert(deferredMatchesFor(DAY).length === 14, 'server-only listing: 14 games');

// No client-reachable module may import the server-only listing.
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(p) ? [p] : []; });
const importers = walk('src').filter((f) => /froms+['"][^'"]*(?:deferred-slates?|protected-2026-10-17)/.test(readFileSync(f, 'utf8'))).map((f) => f.replace(/\\/g, '/'));
assert(importers.every((f) => f === 'src/lib/mobile-feed-build-nhl-nfl.ts' || f === 'src/data/nhl/deferred-slates.ts'), `no client module imports the deferred listing or the protected file (importers: ${importers.join(', ')})`);
const mobileImporters = walk('src').filter((f) => /froms+['"][^'"]*mobile-feed-build-nhl-nfl/.test(readFileSync(f, 'utf8'))).map((f) => f.replace(/\\/g, '/'));
assert(mobileImporters.length === 0, 'the mobile feed builder (which imports the deferred listing) is not imported by any src module');

// ---- 3. Protected index -------------------------------------------------------------------------------------
const gated = index.filter((e: { activeFromKey?: string }) => e.activeFromKey === DAY);
assert(new Set(index.map((e: { slug: string }) => e.slug)).size === index.length, 'index: every slug is unique (a repeated pairing like Montreal vs Buffalo must not shadow an earlier day)');
assert(gated.length === 14, 'index: 14 gated entries for 2026-10-17');
assert(gated.every((e: { releaseTimeZone?: string }) => e.releaseTimeZone === 'America/New_York'), 'index: every entry is released in America/New_York');
for (const [slug, tier, pick, odds] of EXPECTED) {
  const e = gated.find((x: { slug: string }) => x.slug === slug);
  const wantFree = tier === 'free';
  assert(e && e.prediction.main === pick && e.prediction.odds === odds, `index: ${slug} -> ${pick} @ ${odds}`);
  assert((e.analysisAccess === 'free' && e.predictionAccess === 'free') === wantFree, `index: ${slug} tier ${tier}`);
}
assert(gated.filter((e: { analysisAccess: string }) => e.analysisAccess === 'free').length === 2, 'index: exactly 2 FREE');
const listing = deferredMatchesFor(DAY);
assert(listing.filter((m) => m.access === 'free').length === 2 && listing.filter((m) => m.access === 'best').length === 1 && listing.filter((m) => m.access === 'vip').length === 11, 'listing: 2 FREE, 1 BEST BET, 11 premium/default');
assert(listing.filter((m) => m.access === 'free').every((m) => FREE.some((t) => m.slug.includes(t))), 'listing: the FREE games are Buffalo @ Montreal and Rangers @ Columbus');
assert(listing.find((m) => m.access === 'best')?.slug === 'utah-mammoth-vs-edmonton-oilers', 'listing: BEST BET is Edmonton @ Utah');
assert(listing.every((m) => !m.pick && m.odds === undefined && !m.analysis && !/Over|Under|ML|to win|\d\.\d\d/.test(m.teaser + m.title + m.badge)), 'listing: no pick, odds, analysis or market text in any teaser');
assert(SLUGS.every((s) => listing.some((m) => m.slug === s)), 'listing: contains exactly the 14 expected games');
// The PASS / REJECT readings are preserved verbatim inside the protected analyses.
const text = (slug: string) => gated.find((e: { slug: string }) => e.slug === slug).full.analysis.join('\n');
assert(text('chicago-blackhawks-vs-dallas-stars').includes('**Verdict:** PASS.') && text('philadelphia-flyers-vs-ottawa-senators').includes('**Verdict:** PASS.'), 'content: Dallas @ Chicago and Ottawa @ Philadelphia stay PASS');
assert(text('los-angeles-kings-vs-boston-bruins').includes('**Verdict:** REJECT KINGS ML.'), 'content: Boston @ Los Angeles stays REJECT');

// ---- 4. Frozen clock --------------------------------------------------------------------------------------
const before = nyInstant('2026-10-16T23:59:59');
const at = nyInstant('2026-10-17T00:00:00');
const after = nyInstant('2026-10-17T00:00:01');
assert(before.toISOString() === '2026-10-17T03:59:59.000Z' && at.toISOString() === '2026-10-17T04:00:00.000Z' && after.toISOString() === '2026-10-17T04:00:01.000Z', 'frozen instants resolve to 03:59:59Z / 04:00:00Z / 04:00:01Z');

const env = { SUPABASE_URL: 'https://supabase.test', SUPABASE_SECRET_KEY: 'sb_secret_TESTONLY', SUPABASE_PUBLISHABLE_KEY: 'pub-test' };
const RealDate = Date;
const realFetch = globalThis.fetch;
const freezeClock = (instant: Date) => {
  globalThis.Date = class extends RealDate { constructor(...args: any[]) { super(...(args.length ? (args as [any]) : [instant.getTime()])); } static now() { return instant.getTime(); } } as DateConstructor;
};
// Stand-in for Supabase: bearer "vip-token" is a VIP, "free-token" is a signed-in non-VIP user.
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
    ['23:59:59 America/New_York on Oct 16 (1 second before the gate)', before, false],
    ['00:00:00 America/New_York on Oct 17 (exactly at the gate)', at, true],
    ['00:00:01 America/New_York on Oct 17 (1 second after the gate)', after, true],
  ] as const) {
    freezeClock(instant);
    mockSupabase();
    const todayKey = getNhlTodayKey(instant);
    assert(todayKey === (released ? DAY : '2026-10-16'), `${label}: NHL day key ${todayKey}`);
    const slate = resolveNhlSlate(todayKey, instant);
    // Even if a client's own clock (and so its day key) were already on Oct 17, the policy gate alone must hold the slate back.
    const forced = resolveNhlSlate(DAY, instant);
    const expanded = expandDeferredSlate(forced, instant);
    const mobile = buildMobileNhlIndex(instant);
    const mobileItems = [...mobile.free, ...mobile.vip];
    const slateRes = await createNhlSlateHandler(() => instant)({ params: { day: DAY } });
    const slateBody = await slateRes.text();
    const handler = createMatchContentHandler(index);
    const hub = hubLastModified(instant)['/nhl/'];

    if (!released) {
      assert(slate?.dayKey === '2026-10-16' && forced?.dayKey === '2026-10-16', `${label}: the active slate is still 2026-10-16, even when the 10-17 key is forced`);
      assert((expanded?.matches ?? []).every((m) => !SLUGS.includes(m.slug)), `${label}: 0 Oct 17 cards in any web slate`);
      assert(expandDeferredSlate(SLATES.find((s) => s.dayKey === DAY)!, instant)?.matches.length === 0, `${label}: the deferred slate expands to 0 matches`);
      assert(mobileItems.length === 2 && mobileItems.every((m) => !SLUGS.includes(m.slug)), `${label}: mobile feed lists 0 Oct 17 entries`);
      assert(slateRes.status === 404 && !/edmonton|utah|buffalo|rangers/i.test(slateBody), `${label}: /api/nhl/slate/${DAY} is 404 with no listing`);
      assert(new RealDate(String(hub)).toISOString() === getNhlDayStart('2026-10-16')!.toISOString(), `${label}: /nhl/ sitemap lastmod does not move to Oct 17`);
      assert(!/edmonton|utah|buffalo|montreal|columbus|1\.62|1\.64|1\.72/i.test(JSON.stringify({ mobile, slate, forced })), `${label}: 0 Oct 17 teams/odds in web slate, mobile feed or JSON-LD source data`);
      for (const slug of SLUGS) {
        const r = await call(handler, slug);
        const b = JSON.stringify(await r.json());
        assert(r.status === 404 && !/Over|Under|to win|1\.\d\d/.test(b), `${label}: /api/match-content/${slug} -> 404, no prediction leak`);
      }
      const vipAttempt = await call(handler, 'utah-mammoth-vs-edmonton-oilers', 'vip-token');
      assert(vipAttempt.status === 404, `${label}: even an authenticated VIP gets 404 before the gate (best bet)`);
    } else {
      assert(slate?.dayKey === DAY && slate.deferred === true, `${label}: the active slate is 2026-10-17`);
      assert(expanded?.matches.length === 14, `${label}: 14 games loaded`);
      assert(expanded!.matches.filter((m) => m.access === 'free').length === 2 && expanded!.matches.filter((m) => m.access === 'best').length === 1 && expanded!.matches.filter((m) => m.access === 'vip').length === 11, `${label}: 2 FREE / 1 BEST BET / 11 premium`);
      assert(mobileItems.length === 14 && mobile.free.length === 2 && mobile.vip.length === 12, `${label}: mobile feed lists 14 (2 free, 1 best + 11 premium)`);
      assert(mobile.vip.every((m) => m.pick === undefined && m.odds === undefined) && !/Over|Under|to win|\b[1-9]\.\d\d\b/.test(JSON.stringify({ free: mobile.free, vip: mobile.vip })), `${label}: mobile feed carries no premium pick or odds`);
      const body = JSON.parse(slateBody);
      assert(slateRes.status === 200 && body.matches.length === 14 && !/Over|Under|to win|1\.\d\d/.test(slateBody), `${label}: /api/nhl/slate/${DAY} serves 14 teasers with no pick or odds`);
      assert(new RealDate(String(hub)).toISOString() === getNhlDayStart(DAY)!.toISOString(), `${label}: /nhl/ sitemap lastmod moves to Oct 17`);
      for (const [slug, tier, pick, odds] of EXPECTED) {
        const anon = await call(handler, slug);
        if (tier === 'free') {
          const b = await anon.json();
          assert(anon.status === 200 && b.prediction.main === pick && b.prediction.odds === odds && b.full.analysis[0].length > 200, `${label}: FREE ${slug} -> 200 without login (${pick} @ ${odds})`);
        } else {
          const b = JSON.stringify(await anon.json());
          assert(anon.status === 401 && !/Over|Under|to win|1\.\d\d/.test(b), `${label}: ${tier === 'best' ? 'BEST BET' : 'premium'} ${slug} -> 401 for anonymous, nothing leaked`);
          const nonVip = await call(handler, slug, 'free-token');
          assert(nonVip.status === 403 && !/Over|Under|to win|1\.\d\d/.test(JSON.stringify(await nonVip.json())), `${label}: ${slug} -> 403 for a non-VIP account, nothing leaked`);
          const vip = await call(handler, slug, 'vip-token');
          const vb = await vip.json();
          assert(vip.status === 200 && vb.prediction.main === pick && vb.prediction.odds === odds, `${label}: ${slug} -> 200 for VIP (${pick} @ ${odds})`);
        }
      }
    }
  }

  // ---- 5. Regression: every earlier slate still switches exactly at its own midnight -----------------------
  freezeClock(at);
  const earlier = SLATES.filter((s) => !s.deferred);
  for (const [i, s] of earlier.entries()) {
    const start = getNhlDayStart(s.dayKey)!;
    const justBefore = new RealDate(start.getTime() - 1000);
    assert(resolveNhlSlate(getNhlTodayKey(start), start)?.dayKey === s.dayKey, `regression: slate ${s.dayKey} active at its New York midnight`);
    if (i > 0) assert(resolveNhlSlate(getNhlTodayKey(justBefore), justBefore)?.dayKey === earlier[i - 1].dayKey, `regression: slate ${earlier[i - 1].dayKey} active one second before ${s.dayKey}`);
  }
  assert(earlier.find((s) => s.dayKey === '2026-10-16')!.matches.length === 2, 'regression: the 2026-10-16 slate still lists its 2 games');
  assert(index.filter((e: { activeFromKey?: string }) => e.activeFromKey === '2026-10-16').length === 2, 'regression: the 2026-10-16 protected entries are untouched');
} finally {
  globalThis.Date = RealDate;
  globalThis.fetch = realFetch;
}

console.log('ALL NHL OCT 17 GATE TESTS PASSED');
