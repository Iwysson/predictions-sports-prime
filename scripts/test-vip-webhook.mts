// Local validation for Whop checkout + webhook + history + VIP helper.
// Fake Supabase and fake Whop API (in-memory fetch). TEST secrets only. No network.
import { webcrypto } from "node:crypto";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { isVip } from "../src/lib/vip.ts";

const webhook: any = await import(pathToFileURL(resolve("functions/api/whop/webhook.js")).href);
const checkout: any = await import(pathToFileURL(resolve("functions/api/whop/checkout.js")).href);
const historyFn: any = await import(pathToFileURL(resolve("functions/api/history-predictions.js")).href);

const SECRET = "ws_test_only_0123456789abcdef";
const PLAN = "plan_2Hr74QO4nwjDg";
const PRODUCT = "prod_fZEStSLz7WoEW";
const ENV = {
  WHOP_WEBHOOK_SECRET: SECRET,
  WHOP_PLAN_ID: PLAN,
  WHOP_PRODUCT_ID: PRODUCT,
  WHOP_API_KEY: "whop-test-key",
  SUPABASE_URL: "https://supabase.test",
  SUPABASE_SECRET_KEY: "service-test",
  SUPABASE_PUBLISHABLE_KEY: "pub-test",
};
const U1 = "11111111-1111-4111-8111-111111111111"; // confirmed buyer
const U2 = "22222222-2222-4222-8222-222222222222"; // email NOT confirmed
const U3 = "33333333-3333-4333-8333-333333333333"; // second confirmed buyer
const GHOST = "44444444-4444-4444-8444-444444444444"; // no profile row

let failures = 0;
const check = (name: string, cond: boolean, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${extra ? " " + extra : ""}`);
  if (!cond) failures += 1;
};

type Row = { id: string; email: string; plan: string; subscription_status: string | null; whop_membership_id: string | null; current_period_end: string | null; trial_ends_at: string | null };
let profiles: Row[] = [];
let authUsers: Record<string, { email: string; email_confirmed_at: string | null }> = {};
let ledger: Record<string, any> = {};
let patches: any[] = [];
let whopCalls: any[] = [];
let whopResponse: any = null;

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: any, init: any = {}) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  const method = init.method ?? "GET";
  const json = (b: any, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
  if (url.hostname === "api.whop.com") {
    whopCalls.push({ url: url.href, auth: init.headers?.Authorization, body: JSON.parse(init.body) });
    return whopResponse ? json(whopResponse.body, whopResponse.status ?? 200) : json({ id: "cfg_1", purchase_url: "https://whop.com/checkout/x", plan: { id: PLAN, product_id: PRODUCT } });
  }
  if (url.pathname === "/rest/v1/profiles" && method === "GET") {
    let rows = profiles;
    const id = url.searchParams.get("id")?.replace("eq.", "");
    const membership = url.searchParams.get("whop_membership_id")?.replace("eq.", "");
    if (id) rows = rows.filter((p) => p.id === decodeURIComponent(id));
    if (membership) rows = rows.filter((p) => p.whop_membership_id === decodeURIComponent(membership));
    return json(rows);
  }
  if (url.pathname === "/rest/v1/profiles" && method === "PATCH") {
    const id = decodeURIComponent(url.searchParams.get("id")!.replace("eq.", ""));
    const body = JSON.parse(init.body);
    patches.push({ id, body });
    profiles = profiles.map((p) => (p.id === id ? { ...p, ...body } : p));
    return new Response(null, { status: 204 });
  }
  if (url.pathname === "/rest/v1/whop_webhook_events" && method === "POST") {
    const b = JSON.parse(init.body);
    if (!ledger[b.event_id]) ledger[b.event_id] = b;
    return new Response(null, { status: 201 });
  }
  if (url.pathname.startsWith("/auth/v1/admin/users/")) {
    const id = decodeURIComponent(url.pathname.split("/").pop()!);
    const u = authUsers[id];
    return u ? json({ id, ...u }) : json({ message: "not found" }, 404);
  }
  if (url.pathname === "/auth/v1/user") {
    const token = (init.headers?.Authorization ?? "").replace("Bearer ", "");
    if (!token.startsWith("tok-")) return json({ message: "bad" }, 401);
    const id = token.slice(4);
    const u = authUsers[id];
    return u ? json({ id, email: u.email, email_confirmed_at: u.email_confirmed_at }) : json({ message: "bad" }, 401);
  }
  return json({ message: "unmocked " + url.pathname }, 500);
}) as typeof fetch;

const sign = async (id: string, ts: number, body: string, secret = SECRET) => {
  const key = await webcrypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await webcrypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${ts}.${body}`));
  return "v1," + Buffer.from(new Uint8Array(sig)).toString("base64");
};

let seq = 0;
async function send(type: string, data: any, opts: { secret?: string; badSig?: boolean; env?: any; eventId?: string } = {}) {
  const id = opts.eventId ?? `msg_${++seq}`;
  const ts = Math.floor(Date.now() / 1000);
  const body = JSON.stringify({ type, data });
  const sig = opts.badSig ? "v1,AAAA" : await sign(id, ts, body, opts.secret ?? SECRET);
  const req = new Request("https://predictions-sports-prime.com/api/whop/webhook", {
    method: "POST",
    headers: { "webhook-id": id, "webhook-timestamp": String(ts), "webhook-signature": sig },
    body,
  });
  return webhook.onRequestPost({ request: req, env: opts.env ?? ENV });
}

const reset = () => {
  profiles = [
    { id: U1, email: "buyer@example.com", plan: "free", subscription_status: null, whop_membership_id: null, current_period_end: null, trial_ends_at: null },
    { id: U2, email: "unverified@example.com", plan: "free", subscription_status: null, whop_membership_id: null, current_period_end: null, trial_ends_at: null },
    { id: U3, email: "second@example.com", plan: "free", subscription_status: null, whop_membership_id: null, current_period_end: null, trial_ends_at: null },
  ];
  authUsers = {
    [U1]: { email: "buyer@example.com", email_confirmed_at: "2026-09-01T00:00:00Z" },
    [U2]: { email: "unverified@example.com", email_confirmed_at: null },
    [U3]: { email: "second@example.com", email_confirmed_at: "2026-09-01T00:00:00Z" },
  };
  ledger = {};
  patches = [];
};
const future = new Date(Date.now() + 20 * 86400000).toISOString();
const past = new Date(Date.now() - 86400000).toISOString();
const meta = (user = U1) => ({ kind: "psp_vip", supabase_user_id: user, ref: "r" });
const membership = (extra: any = {}) => ({
  id: "mem_1",
  plan: { id: PLAN },
  product: { id: PRODUCT },
  metadata: meta(),
  ...extra,
});
const p1 = () => profiles.find((p) => p.id === U1)!;

// ---- Webhook ----
reset();
let r = await send("membership.activated", membership({ status: "trialing", trial_end: future }));
check("activated trialing -> vip trialing", r.status === 200 && p1().plan === "vip" && p1().subscription_status === "trialing" && isVip(p1()));
check("activated stores membership id", p1().whop_membership_id === "mem_1");

reset();
await send("membership.activated", membership({ status: "active" }));
check("activated active -> vip active", p1().subscription_status === "active" && isVip(p1()));

reset();
await send("payment.succeeded", membership());
check("payment.succeeded -> active", p1().plan === "vip" && p1().subscription_status === "active");

reset();
await send("membership.activated", membership({ status: "active" }));
await send("payment.failed", membership());
check("payment.failed without paid period -> past_due, no VIP", p1().subscription_status === "past_due" && !isVip(p1()));

reset();
await send("membership.activated", membership({ status: "active" }));
profiles = profiles.map((p) => (p.id === U1 ? { ...p, current_period_end: future } : p));
patches = [];
await send("payment.failed", membership());
check("payment.failed inside valid paid period keeps VIP", patches.length === 0 && isVip(p1()));

reset();
await send("membership.activated", membership({ status: "active" }));
profiles = profiles.map((p) => (p.id === U1 ? { ...p, current_period_end: future } : p));
patches = [];
await send("membership.deactivated", membership());
check("deactivated before period end keeps VIP", patches.length === 0 && isVip(p1()));

reset();
await send("membership.activated", membership({ status: "active" }));
profiles = profiles.map((p) => (p.id === U1 ? { ...p, current_period_end: past } : p));
await send("membership.deactivated", membership());
check("deactivated after period end -> free/expired", p1().plan === "free" && p1().subscription_status === "expired" && !isVip(p1()));

reset();
r = await send("membership.updated", membership({ status: "active" }));
check("membership.updated is not handled (ignored, no write)", r.status === 200 && patches.length === 0);

reset();
r = await send("payment.created", membership());
check("unlisted event type ignored", patches.length === 0);

reset();
r = await send("membership.activated", membership({ status: "active" }), { badSig: true });
check("bad signature -> 401, nothing written", r.status === 401 && patches.length === 0);
r = await send("membership.activated", membership({ status: "active" }), { secret: "ws_wrong" });
check("wrong secret -> 401", r.status === 401 && patches.length === 0);

reset();
await send("membership.activated", membership({ status: "active", plan: { id: "plan_OTHER" } }));
await send("membership.activated", membership({ status: "active", product: { id: "prod_OTHER" } }));
check("other plan or product ignored", patches.length === 0 && p1().plan === "free");

reset();
await send("membership.activated", { id: "mem_1", plan: { id: PLAN }, product: { id: PRODUCT }, status: "active", user: { email: "buyer@example.com" } });
check("no metadata -> ignored (email alone never grants)", patches.length === 0 && p1().plan === "free");

reset();
await send("membership.activated", membership({ status: "active", metadata: { supabase_user_id: "not-a-uuid" } }));
check("invalid uuid -> ignored", patches.length === 0);

reset();
await send("membership.activated", membership({ status: "active", metadata: meta(GHOST) }));
check("uuid without profile -> ignored", patches.length === 0);

reset();
await send("membership.activated", membership({ status: "active", metadata: meta(U2), user: { email: "unverified@example.com" } }));
check("unconfirmed email user -> ignored", patches.length === 0 && profiles.find((p) => p.id === U2)!.plan === "free");

reset();
// email in the payload belongs to U3, metadata says U1: metadata wins
await send("membership.activated", membership({ status: "active", user: { email: "second@example.com" } }));
check("metadata wins over payload email", patches.length === 1 && patches[0].id === U1 && profiles.find((p) => p.id === U3)!.plan === "free");

reset();
profiles[2].whop_membership_id = "mem_1";
await send("membership.activated", membership({ status: "active", metadata: meta(U1) }));
check("membership already owned by another profile is refused", p1().plan === "free" && patches.length === 0);

reset();
await send("membership.activated", membership({ status: "active" }), { eventId: "msg_same" });
await send("membership.activated", membership({ status: "active" }), { eventId: "msg_same" });
check("repeat delivery: same final state", p1().subscription_status === "active" && patches.length === 2 && patches[0].body.subscription_status === patches[1].body.subscription_status);
check("ledger keeps field names only (no values)", Object.values(ledger).every((row: any) => Array.isArray(row.payload_keys) && !JSON.stringify(row).includes("buyer@example.com")));

reset();
r = await send("membership.activated", membership(), { env: { ...ENV, WHOP_WEBHOOK_SECRET: "" } });
check("missing WHOP_WEBHOOK_SECRET -> 503", r.status === 503);

reset();
{
  const id = "msg_bad";
  const ts = Math.floor(Date.now() / 1000);
  const body = "{not json";
  const req = new Request("https://x/api/whop/webhook", { method: "POST", headers: { "webhook-id": id, "webhook-timestamp": String(ts), "webhook-signature": await sign(id, ts, body) }, body });
  r = await webhook.onRequestPost({ request: req, env: ENV });
  check("malformed body -> 400", r.status === 400 && patches.length === 0);
}

// ---- Checkout ----
reset();
const cReq = (token?: string, body: any = {}) => new Request("https://predictions-sports-prime.com/api/whop/checkout", {
  method: "POST",
  headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
r = await checkout.onRequestPost({ request: cReq(), env: ENV });
check("checkout: no session -> 401", r.status === 401 && whopCalls.length === 0);
r = await checkout.onRequestPost({ request: cReq("tok-" + U2), env: ENV });
check("checkout: unconfirmed email -> 401", r.status === 401);

whopCalls = [];
r = await checkout.onRequestPost({ request: cReq("tok-" + U1, { supabase_user_id: U3 }), env: ENV });
const out = await r.json();
const call = whopCalls[0];
check("checkout: 200 with purchase_url", r.status === 200 && out.purchase_url === "https://whop.com/checkout/x");
check("checkout: returns only purchase_url and session_id", Object.keys(out).sort().join(",") === "purchase_url,session_id");
check("checkout: body supabase_user_id is ignored (session user used)", call?.body.metadata.supabase_user_id === U1 && call.body.metadata.kind === "psp_vip");
check("checkout: uses fixed plan id and WHOP_API_KEY", call?.body.plan_id === PLAN && call.auth === "Bearer whop-test-key" && call.url === "https://api.whop.com/api/v1/checkout_configurations");
check("checkout: ref is a fresh uuid per attempt", typeof call?.body.metadata.ref === "string" && call.body.metadata.ref.length === 36);

whopResponse = { body: { id: "cfg_x", purchase_url: "https://whop.com/x", plan: { id: "plan_OTHER", product_id: PRODUCT } } };
r = await checkout.onRequestPost({ request: cReq("tok-" + U1), env: ENV });
check("checkout: plan mismatch in Whop response -> 502", r.status === 502);
whopResponse = { body: { id: "cfg_y", purchase_url: "https://whop.com/y", plan: { id: PLAN, product_id: "prod_OTHER" } } };
r = await checkout.onRequestPost({ request: cReq("tok-" + U1), env: ENV });
check("checkout: product mismatch -> 502", r.status === 502);
whopResponse = null;

// ---- History ----
const hReq = (token?: string) => new Request("https://x/api/history-predictions", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
check("history: no token -> 401", (await historyFn.onRequestGet({ request: hReq(), env: ENV })).status === 401);
profiles.push({ id: "vipU", email: "v@example.com", plan: "vip", subscription_status: "trialing", whop_membership_id: null, current_period_end: null, trial_ends_at: null });
profiles.push({ id: "cancU", email: "c@example.com", plan: "vip", subscription_status: "canceled", whop_membership_id: null, current_period_end: null, trial_ends_at: null });
authUsers.vipU = { email: "v@example.com", email_confirmed_at: "x" };
authUsers.cancU = { email: "c@example.com", email_confirmed_at: "x" };
let h = await historyFn.onRequestGet({ request: hReq("tok-vipU"), env: ENV });
check("history: VIP trialing -> 200 with 841 records", h.status === 200 && (await h.json()).records.length === 841);
h = await historyFn.onRequestGet({ request: hReq("tok-cancU"), env: ENV });
check("history: canceled -> 403", h.status === 403);

// ---- Helper ----
check("isVip: trialing", isVip({ plan: "vip", subscription_status: "trialing" }));
check("isVip: active", isVip({ plan: "vip", subscription_status: "active" }));
check("isVip: canceled/expired/past_due/inactive false", ["canceled", "expired", "past_due", "inactive"].every((s) => !isVip({ plan: "vip", subscription_status: s })));
check("isVip: free plan false", !isVip({ plan: "free", subscription_status: "active" }));

globalThis.fetch = realFetch;
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
