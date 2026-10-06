// Tests for FREE/VIP gating of match analyses. Fake Supabase, fixture predictions, no network.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { buildContentIndex, buildPublicMatchView, isPublishableFuture } from "../src/lib/match-access.ts";
import { isVip } from "../src/lib/vip.ts";
import type { EditorialPrediction } from "../src/types/index.ts";

const endpoint: any = await import(pathToFileURL(resolve("functions/api/match-content/[slug].js")).href);

const NOW = new Date("2026-10-05T12:00:00Z");
const FUTURE = { date: "2026-10-20", time: "18:00" };

// Distinct markers so any leak is detectable in a response body.
const SECRET_VIP = "SECRET-VIP-ANALYSIS-7f3a";
const SECRET_FREE = "PUBLIC-FREE-ANALYSIS-91bc";
const SECRET_ODDS = 2.37;

const base = (home: string, away: string, extra: Partial<EditorialPrediction> = {}): EditorialPrediction => ({
  league: "premier-league",
  homeTeam: home,
  awayTeam: away,
  analysis: [`${SECRET_VIP} paragraph one for ${home}.`, "Paragraph two with more detail about the match."],
  picks: { main: `${home} to win`, publishedOdds: SECRET_ODDS },
  matchInfo: { ...FUTURE },
  published: true,
  ...extra,
});

const predictions: EditorialPrediction[] = [
  base("Alpha", "One"), // no access field: must behave as VIP
  base("Beta", "Two", { access: "vip" }),
  base("Gamma", "Three", { access: "free", analysis: [`${SECRET_FREE} open analysis.`, "Second open paragraph."] }),
  base("Delta", "Four", { access: "vip", matchInfo: { date: "2026-08-01", time: "18:00" } }), // past: not in index
];

const index = buildContentIndex(predictions, NOW);
const entryOf = (slug: string) => index.find((e) => e.slug === slug);

let failures = 0;
const check = (name: string, cond: boolean, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${extra ? " " + extra : ""}`);
  if (!cond) failures += 1;
};

// ---- Fake Supabase ----
type Row = { id: string; plan: string; subscription_status: string | null };
const profiles: Record<string, Row> = {
  free1: { id: "free1", plan: "free", subscription_status: null },
  trial1: { id: "trial1", plan: "vip", subscription_status: "trialing" },
  active1: { id: "active1", plan: "vip", subscription_status: "active" },
  canceled1: { id: "canceled1", plan: "vip", subscription_status: "canceled" },
  expired1: { id: "expired1", plan: "free", subscription_status: "expired" },
  pastdue1: { id: "pastdue1", plan: "vip", subscription_status: "past_due" },
};
const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: any, init: any = {}) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  const json = (b: any, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
  if (url.pathname === "/auth/v1/user") {
    const token = (init.headers?.Authorization ?? "").replace("Bearer ", "");
    if (!token.startsWith("tok-") || !profiles[token.slice(4)]) return json({ message: "invalid" }, 401);
    return json({ id: token.slice(4) });
  }
  if (url.pathname === "/rest/v1/profiles") {
    const id = decodeURIComponent(url.searchParams.get("id")!.replace("eq.", ""));
    const row = profiles[id];
    return json(row ? [{ plan: row.plan, subscription_status: row.subscription_status }] : []);
  }
  return json({ message: "unmocked" }, 500);
}) as typeof fetch;

const env = { SUPABASE_URL: "https://supabase.test", SUPABASE_SECRET_KEY: "svc", SUPABASE_PUBLISHABLE_KEY: "pub" };
const handler = endpoint.createMatchContentHandler(index);
const call = async (slug: string, token?: string) => {
  const res = await handler({
    request: new Request(`https://x/api/match-content/${slug}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
    params: { slug },
    env,
  });
  const text = await res.text();
  return { status: res.status, text, body: (() => { try { return JSON.parse(text); } catch { return null; } })() };
};
const leaks = (text: string) => text.includes(SECRET_VIP) || text.includes(String(SECRET_ODDS)) || text.includes("to win");

// 1) Absence of access means VIP
check("missing access field -> vip in the index", entryOf("alpha-vs-one")?.access === "vip");
check("missing access field -> vip, the field itself is never defaulted to free", !entryOf("alpha-vs-one") || entryOf("alpha-vs-one")!.access !== "free");

// 2) access vip + visitor: no premium content
let r = await call("alpha-vs-one");
check("vip + visitor (no token) -> 401, no premium text", r.status === 401 && !leaks(r.text));

// 3) access vip + FREE user: no premium content
r = await call("beta-vs-two", "tok-free1");
check("vip + FREE user -> 403, no premium text", r.status === 403 && !leaks(r.text));

// 4) access vip + VIP (trialing / active): full content
r = await call("beta-vs-two", "tok-trial1");
check("vip + VIP trialing -> 200 full content", r.status === 200 && r.body?.full?.analysis?.[0].includes(SECRET_VIP) && r.body?.full?.picks?.odds === SECRET_ODDS);
r = await call("alpha-vs-one", "tok-active1");
check("vip (absent field) + VIP active -> 200 full content", r.status === 200 && r.body?.full?.analysis?.[0].includes(SECRET_VIP));

// 5) access free: full content for visitors and FREE users
r = await call("gamma-vs-three");
check("free + visitor -> 200 full content", r.status === 200 && r.text.includes(SECRET_FREE));
r = await call("gamma-vs-three", "tok-free1");
check("free + FREE user -> 200 full content", r.status === 200 && r.text.includes(SECRET_FREE));

// 6) slug not found -> 404
r = await call("no-such-match");
check("unknown slug -> 404", r.status === 404);
r = await call("delta-vs-four", "tok-trial1");
check("past prediction (not publishable) -> 404", r.status === 404);

// 7) invalid token never unlocks VIP
r = await call("beta-vs-two", "tok-ghost");
check("invalid token -> 401, no premium text", r.status === 401 && !leaks(r.text));
r = await call("beta-vs-two", "garbage");
check("malformed token -> 401, no premium text", r.status === 401 && !leaks(r.text));

// 8) expired / canceled / past_due never unlock VIP
for (const who of ["canceled1", "expired1", "pastdue1"]) {
  r = await call("beta-vs-two", `tok-${who}`);
  check(`${who} -> 403, no premium text`, r.status === 403 && !leaks(r.text));
}

// Helper rule
check("isVip false for canceled/expired/past_due", ["canceled", "expired", "past_due"].every((s) => !isVip({ plan: "vip", subscription_status: s })));

// 9) Public view and index never leak VIP text into the public surface
const vipPublic = buildPublicMatchView(predictions[0]);
check("public view of a VIP prediction has no analysis, odds or pick", !JSON.stringify(vipPublic).includes(SECRET_VIP) && !JSON.stringify(vipPublic).includes("to win") && !JSON.stringify(vipPublic).includes(String(SECRET_ODDS)));
check("public view exposes the access tier", vipPublic.access === "vip" && buildPublicMatchView(predictions[2]).access === "free");
check("publishability requires a recorded future kickoff", !isPublishableFuture(predictions[3], NOW) && isPublishableFuture(predictions[0], NOW));

// 10) Static-export guard: pages and components never import the protected index.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const walk = (d: string, out: string[] = []) => {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
const pageAndClient = [...walk("src")].filter((f) => /\.(ts|tsx)$/.test(f));
const importers = pageAndClient.filter((f) => readFileSync(f, "utf8").includes("_data/match-content"));
check("no page or client module imports the protected index", importers.length === 0, importers.join(",") || "");

// ---- Leak test: synthetic VIP prediction with unique markers. Test-only, never added to real data. ----
const { buildMatchPageModel } = await import("../src/lib/match-page-model.ts");
const M_ANALYSIS = "PSP_PREMIUM_SECRET_ANALYSIS_TEST";
const M_PICK = "PSP_PREMIUM_SECRET_PICK_TEST";
const M_ODDS = "PSP_PREMIUM_SECRET_ODDS_TEST";
const ODDS_NUM = 8.8888;
const synthetic: EditorialPrediction = {
  league: "premier-league",
  homeTeam: "Leak Home",
  awayTeam: "Leak Away",
  analysis: [`${M_ANALYSIS} first paragraph.`, `${M_ANALYSIS} second paragraph.`],
  picks: { main: `${M_PICK} to win`, publishedOdds: ODDS_NUM },
  comment: `${M_ODDS} premium note`,
  matchInfo: { date: "2026-10-20", time: "18:00", venue: "Public Ground" },
  published: true,
  access: "vip",
};
const MARKERS = [M_ANALYSIS, M_PICK, M_ODDS, String(ODDS_NUM)];
const leaked = (text: string) => MARKERS.some((m) => text.includes(m));
const leakIndex = buildContentIndex([synthetic], NOW);
const leakSlug = leakIndex[0].slug;
const leakHandler = endpoint.createMatchContentHandler(leakIndex);

for (const locale of ["en", "pt-br"]) {
  const model = buildMatchPageModel(synthetic, locale, NOW)!;
  const { full, gate, ...publicPart } = model;
  check(`[${locale}] public part (view, JSON-LD, labels) has no premium marker`, !leaked(JSON.stringify(publicPart)));
  check(`[${locale}] JSON-LD has no premium marker`, !leaked(JSON.stringify(model.jsonLd)));
  check(`[${locale}] MatchGate props are only the slug`, JSON.stringify(gate) === JSON.stringify({ slug: leakSlug }));
  check(`[${locale}] static model carries no full content for VIP`, full === null);
}

{
  const ld: any = buildMatchPageModel(synthetic, "en", NOW)!.jsonLd;
  check("JSON-LD is built from public fields (not empty)", ld["@type"] === "SportsEvent" && ld.name === "Leak Home vs Leak Away" && ld.startDate === "2026-10-20T17:00:00.000Z" && ld.location?.name === "Public Ground" && ld.homeTeam?.name === "Leak Home" && ld.awayTeam?.name === "Leak Away" && ld.superEvent?.name === "Premier League");
  check("JSON-LD has no pick, odds or prediction keys", !("offers" in ld) && !("prediction" in ld) && !("odds" in ld) && !JSON.stringify(ld).includes("to win"));
}
const leakCall = async (token?: string) => {
  const res = await leakHandler({
    request: new Request(`https://x/api/match-content/${leakSlug}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
    params: { slug: leakSlug },
    env,
  });
  return { status: res.status, text: await res.text() };
};
const denied = [
  ["visitor", undefined, 401],
  ["FREE user", "tok-free1", 403],
  ["invalid token", "tok-nobody", 401],
  ["canceled", "tok-canceled1", 403],
] as const;
for (const [who, token, status] of denied) {
  const r = await leakCall(token);
  check(`leak: ${who} -> ${status}, no premium marker in payload`, r.status === status && !leaked(r.text));
}
for (const [who, token] of [["VIP trialing", "tok-trial1"], ["VIP active", "tok-active1"]] as const) {
  const r = await leakCall(token);
  check(`leak: ${who} -> 200 with all markers (authorised only)`, r.status === 200 && MARKERS.every((m) => r.text.includes(m)));
}

globalThis.fetch = realFetch;
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
