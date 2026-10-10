// Shared helpers for functions/api/mobile/*. All data here is already public on the
// website (no protected text) - these endpoints only reshape it into Today/Tomorrow/
// Upcoming buckets for the Android app, computed fresh on every request.

export const json = (body, status = 200, cacheSeconds = 120) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status === 200 ? `public, max-age=${cacheSeconds}` : "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });

// Site convention for football/NFL "day" (see src/lib/match-feed.ts): America/Sao_Paulo (-03:00).
export function saoPauloTodayISO(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

export function addDaysISO(iso, days) {
  const d = new Date(`${iso}T00:00:00-03:00`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// NHL day convention (see src/lib/nhl-day.ts and functions/api/match-content): America/New_York.
export function nhlTodayKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

// Buckets a list of items with a `date` (YYYY-MM-DD) field into today/tomorrow/upcoming.
// Past dates are dropped. This is a date-only approximation of the website's richer
// live-fixture-state logic (src/lib/match-feed.ts) - it does not reclassify postponed or
// in-progress fixtures. Good enough for a first mobile feed; flagged as a known gap.
export function bucketByDate(items, now = new Date()) {
  const today = saoPauloTodayISO(now);
  const tomorrow = addDaysISO(today, 1);
  const out = { today: [], tomorrow: [], upcoming: [] };
  for (const item of items) {
    if (!item.date || item.date < today) continue;
    if (item.date === today) out.today.push(item);
    else if (item.date === tomorrow) out.tomorrow.push(item);
    else out.upcoming.push(item);
  }
  return out;
}

export function bucketSlatesByDayKey(slates, now = new Date()) {
  const today = nhlTodayKey(now);
  const tomorrow = addDaysISO(today, 1);
  const out = { today: [], tomorrow: [], upcoming: [] };
  for (const slate of slates) {
    if (slate.dayKey < today) continue;
    if (slate.dayKey === today) out.today.push(...slate.matches);
    else if (slate.dayKey === tomorrow) out.tomorrow.push(...slate.matches);
    else out.upcoming.push(...slate.matches);
  }
  return out;
}

export function splitTiers(items) {
  const free = items.filter((i) => i.badge === "free");
  const vip = items.filter((i) => i.badge === "best" || i.badge === "vip");
  return { free, vip };
}
