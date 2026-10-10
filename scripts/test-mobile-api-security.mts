// Live-style API security tests for the Android app's server endpoints, run directly
// against the Cloudflare Function handlers (no network - Supabase and Google Play are
// mocked) since nothing from this session is actually deployed. This is a code-level
// integration test, not a substitute for the real post-deploy check described in
// GOOGLE_PLAY_SETUP.md: do not call these endpoints "PASS in production" from this file
// alone.
import assert from "node:assert/strict";
import { createMatchContentHandler } from "../functions/api/match-content/[slug].js";
import feed from "../functions/_data/mobile/football.json" with { type: "json" };

let failures = 0;
const check = (name: string, cond: boolean) => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}`);
  if (!cond) failures += 1;
};

const SUPABASE_URL = "https://supabase.test";
const ENV = { SUPABASE_URL, SUPABASE_SECRET_KEY: "sb_secret_test", SUPABASE_PUBLISHABLE_KEY: "pub_test" };

type ProfileRow = { id: string; plan: string; subscription_status: string | null };
let profiles: ProfileRow[] = [
  { id: "free-user", plan: "free", subscription_status: "inactive" },
  { id: "vip-user", plan: "vip", subscription_status: "active" },
];

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: any, init: any = {}) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  const headers = (init.headers ?? {}) as Record<string, string>;
  const json = (b: any, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
  if (url.pathname === "/auth/v1/user") {
    const token = (headers.Authorization ?? "").replace("Bearer ", "");
    const id = ({ "tok-free": "free-user", "tok-vip": "vip-user" } as Record<string, string>)[token];
    return id ? json({ id }) : json({ message: "bad" }, 401);
  }
  if (url.pathname === "/rest/v1/profiles") {
    const id = decodeURIComponent(url.searchParams.get("id")!.replace("eq.", ""));
    const row = profiles.find((p) => p.id === id);
    return json(row ? [row] : []);
  }
  return json({ message: "unmocked " + url.pathname }, 500);
}) as typeof fetch;

// ---- /api/match-content/:slug ----
const index = [
  { slug: "free-match", analysisAccess: "free", predictionAccess: "free", full: { analysis: ["public"], sources: [], comment: null, picks: { main: "Free pick", odds: 1.5 } }, prediction: { main: "Free pick", odds: 1.5 } },
  { slug: "vip-match", analysisAccess: "vip", predictionAccess: "vip", full: { analysis: ["secret analysis"], sources: [], comment: null, picks: { main: "VIP pick", odds: 2.1 } }, prediction: { main: "VIP pick", odds: 2.1 } },
];
const handler = createMatchContentHandler(index as any);
const req = (slug: string, token?: string) =>
  handler({
    request: new Request(`https://x/api/match-content/${slug}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
    params: { slug },
    env: ENV,
  } as any);

{
  const r = await req("vip-match");
  check("UNAUTHENTICATED: VIP endpoint -> 401, no content", r.status === 401 && !(await r.clone().json()).full);
}
{
  const r = await req("vip-match", "tok-free");
  const body = await r.clone().json();
  check("FREE USER: VIP prediction payload -> 403, no content", r.status === 403 && !body.full);
}
{
  const r = await req("vip-match", "tok-vip");
  const body = await r.clone().json();
  check("VIP USER: VIP prediction payload -> 200, content allowed", r.status === 200 && body.full?.picks?.main === "VIP pick");
}
{
  const r = await req("free-match");
  const body = await r.clone().json();
  check("FREE-tier match is public with no auth at all", r.status === 200 && body.full?.picks?.main === "Free pick");
}
{
  const r = await req("free-match", "tok-free");
  check("A logged-in free user is never asked to re-authenticate for free content", r.status === 200);
}

// ---- Mobile feed payloads never carry protected content for BEST BET/PRIME VIP ----
{
  const protectedEntries = [...feed.vip.today, ...feed.vip.tomorrow, ...feed.vip.upcoming];
  check(
    "mobile football feed: no BEST BET/PRIME VIP entry carries a pick or odds",
    protectedEntries.every((m: any) => m.pick === undefined && m.odds === undefined),
  );
  const freeEntries = [...feed.free.today, ...feed.free.tomorrow, ...feed.free.upcoming];
  check(
    "mobile football feed: every FREE entry is tagged 'free'",
    freeEntries.every((m: any) => m.badge === "free"),
  );
}

globalThis.fetch = realFetch;

if (failures > 0) {
  console.error(`${failures} security check(s) failed`);
  process.exit(1);
}
console.log("mobile API security tests passed");
