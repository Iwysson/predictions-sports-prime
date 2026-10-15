import { readFileSync } from 'node:fs';
import { getNhlTodayKey } from '../src/lib/nhl-day.ts';
import { resolveNhlSlate } from '../src/data/nhl/slates.ts';
import { isNhlMatchDayReleased } from '../src/lib/nhl-publication-policy.ts';
import { buildMobileNhlIndex } from '../src/lib/mobile-feed-build-nhl-nfl.ts';

const { createMatchContentHandler } = await import('../functions/api/match-content/[slug].js');
const index = JSON.parse(readFileSync('functions/_data/match-content.json', 'utf8'));
const protectedEntries = index.filter((entry: { activeFromKey?: string }) => entry.activeFromKey === '2026-10-16');
const assert = (ok: unknown, label: string) => { if (!ok) throw new Error(label); console.log(`PASS ${label}`); };

assert(protectedEntries.length === 2, '2 gated NHL entries for 2026-10-16 (Colorado BEST BET + Anaheim FREE)');
const anaheimEntry = protectedEntries.find((e: { slug: string }) => e.slug === 'anaheim-ducks-vs-boston-bruins');
assert(anaheimEntry?.analysisAccess === 'free' && anaheimEntry?.predictionAccess === 'free', 'Anaheim entry is FREE tier in the protected index (no login required once released)');

// The PSP mandatory NHL rule: nothing public before 00:00:00 America/Sao_Paulo on the match date.
assert(isNhlMatchDayReleased('2026-10-16', new Date('2026-10-16T02:59:59Z')) === false, 'Sao Paulo gate closed at 02:59:59 UTC (23:59:59 BRT Oct 15)');
assert(isNhlMatchDayReleased('2026-10-16', new Date('2026-10-16T03:00:00Z')) === true, 'Sao Paulo gate open at 03:00:00 UTC (00:00:00 BRT Oct 16)');

const RealDate = Date;
try {
  for (const [label, instant, expectedDay, publicCount, freeCount, bestCount, protectedStatus] of [
    ['23:59:59 ET on Oct 15 (before the Oct 16 slate and before the Sao Paulo gate)', '2026-10-16T03:59:59Z', '2026-10-15', 11, 2, 1, 404],
    ['00:00:00 ET on Oct 16 (after the Sao Paulo gate, which opened an hour earlier)', '2026-10-16T04:00:00Z', '2026-10-16', 2, 1, 1, 401],
  ] as const) {
    const now = new RealDate(instant);
    assert(getNhlTodayKey(now) === expectedDay, `${label}: New York day`);
    const slate = resolveNhlSlate(getNhlTodayKey(now), now);
    assert(slate?.dayKey === expectedDay, `${label}: active web slate day`);
    assert((slate?.matches.length ?? 0) === publicCount, `${label}: ${publicCount} public NHL fixtures listed`);
    assert((slate?.matches ?? []).filter((m) => m.access === 'free').length === freeCount, `${label}: ${freeCount} FREE NHL fixtures`);
    assert((slate?.matches ?? []).filter((m) => m.access === 'best').length === bestCount, `${label}: ${bestCount} BEST BET NHL fixtures`);
    if (expectedDay === '2026-10-16') {
      const colorado = slate?.matches.find((m) => m.slug === 'colorado-avalanche-vs-pittsburgh-penguins');
      assert(colorado !== undefined, 'Colorado Avalanche vs Pittsburgh Penguins is listed once released');
      assert(colorado?.pick === undefined && colorado?.odds === undefined && colorado?.analysis === undefined, 'Colorado public record carries no prediction, odds or analysis (anti-spoiler)');
      const anaheim = slate?.matches.find((m) => m.slug === 'anaheim-ducks-vs-boston-bruins');
      assert(anaheim !== undefined && anaheim.access === 'free', 'Anaheim Ducks vs Boston Bruins is listed as FREE once released');
      assert(anaheim?.pick === undefined && anaheim?.odds === undefined && anaheim?.analysis === undefined, 'Anaheim public record carries no inline prediction, odds or analysis (fetched from the protected endpoint instead, never bundled client-side)');
    } else {
      assert((slate?.matches ?? []).every((m) => m.slug !== 'colorado-avalanche-vs-pittsburgh-penguins' && m.slug !== 'anaheim-ducks-vs-boston-bruins'), `${label}: neither Oct 16 fixture appears publicly before release`);
    }
    const mobile = buildMobileNhlIndex(now);
    assert(mobile.free.length + mobile.vip.length === publicCount, `${label}: mobile feed matches the web slate count`);
    assert(mobile.free.every((m) => m.slug !== 'colorado-avalanche-vs-pittsburgh-penguins' && m.slug !== 'anaheim-ducks-vs-boston-bruins') || expectedDay === '2026-10-16', `${label}: mobile feed does not leak the Oct 16 fixtures early`);

    globalThis.Date = class extends RealDate { constructor(...args: any[]) { super(...(args.length ? args as [any] : [instant])); } } as DateConstructor;
    const handler = createMatchContentHandler(index);
    const response = await handler({
      request: new Request('https://example.test/api/match-content/colorado-avalanche-vs-pittsburgh-penguins'),
      params: { slug: 'colorado-avalanche-vs-pittsburgh-penguins' },
      env: { SUPABASE_URL: 'https://supabase.test', SUPABASE_SECRET_KEY: 'sb_secret_TESTONLY', SUPABASE_PUBLISHABLE_KEY: 'pub-test' },
    });
    assert(response.status === protectedStatus, `${label}: unauthenticated /api/match-content/colorado-avalanche-vs-pittsburgh-penguins status ${protectedStatus} (${protectedStatus === 404 ? 'not yet released' : 'released, VIP required'})`);
    const body = await response.json();
    assert(JSON.stringify(body).toLowerCase().includes('1.56') === false, `${label}: Colorado odds (1.56) never appear in the unauthenticated response body`);
    assert(JSON.stringify(body).toLowerCase().includes('to win') === false, `${label}: Colorado pick text never appears in the unauthenticated response body`);

    // Anaheim is FREE: before the gate it is 404 (same as unreleased), after the gate it is 200 with the
    // full prediction and odds, and crucially with NO authentication at all.
    const anaheimResponse = await handler({
      request: new Request('https://example.test/api/match-content/anaheim-ducks-vs-boston-bruins'),
      params: { slug: 'anaheim-ducks-vs-boston-bruins' },
      env: { SUPABASE_URL: 'https://supabase.test', SUPABASE_SECRET_KEY: 'sb_secret_TESTONLY', SUPABASE_PUBLISHABLE_KEY: 'pub-test' },
    });
    const anaheimExpectedStatus = expectedDay === '2026-10-16' ? 200 : 404;
    assert(anaheimResponse.status === anaheimExpectedStatus, `${label}: unauthenticated /api/match-content/anaheim-ducks-vs-boston-bruins status ${anaheimExpectedStatus} (no login header sent)`);
    if (anaheimExpectedStatus === 200) {
      const anaheimBody = await anaheimResponse.json();
      assert(anaheimBody.prediction?.main === 'Anaheim Ducks to Win' && anaheimBody.prediction?.odds === 1.88, `${label}: Anaheim FREE prediction and odds are served without authentication once released`);
    }
  }
} finally {
  globalThis.Date = RealDate;
}

console.log('ALL NHL OCT 16 GATE TESTS PASSED');
