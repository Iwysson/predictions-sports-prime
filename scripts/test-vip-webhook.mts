// Validation for the Whop webhook, checkout, history and VIP helper.
// Fake Supabase and fake Whop API (in-memory fetch). TEST secrets only. No network.
import { webcrypto } from "node:crypto";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { isVip } from "../src/lib/vip.ts";

const webhook: any = await import(pathToFileURL(resolve("functions/api/whop/webhook.js")).href);
const checkout: any = await import(pathToFileURL(resolve("functions/api/whop/checkout.js")).href);
const historyFn: any = await import(pathToFileURL(resolve("functions/api/history-predictions.js")).href);

const SECRET = "ws_test_only_0123456789abcdef";
const SB_SECRET = "sb_secret_TESTONLY_0123456789";
const PLAN = "plan_2Hr74QO4nwjDg";
const PRODUCT = "prod_fZEStSLz7WoEW";
const ENV = {
  WHOP_WEBHOOK_SECRET: SECRET,
  WHOP_PLAN_ID: PLAN,
  WHOP_PRODUCT_ID: PRODUCT,
  WHOP_API_KEY: "whop-test-key",
  SUPABASE_URL: "https://supabase.test",
  SUPABASE_SECRET_KEY: SB_SECRET,
  SUPABASE_PUBLISHABLE_KEY: "pub-test",
};
const U1 = "11111111-1111-4111-8111-111111111111"; // confirmed buyer
const U2 = "22222222-2222-4222-8222-222222222222"; // email NOT confirmed
const U3 = "33333333-3333-4333-8333-333333333333"; // second confirmed buyer
const GHOST = "44444444-4444-4444-8444-444444444444";

let failures = 0;
const check = (name: string, cond: boolean, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${extra ? " " + extra : ""}`);
  if (!cond) failures += 1;
};

type Row = { id: string; email: string; plan: string; subscription_status: string | null; whop_membership_id: string | null; current_period_end: string | null };
let profiles: Row[] = [];
let authUsers: Record<string, { email: string; email_confirmed_at: string | null }> = {};
let ledger: any[] = [];
let patches: any[] = [];
let sbCalls: Array<{ url: string; headers: Record<string, string> }> = [];
let whopCalls: any[] = [];
let whopResponse: any = null;

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: any, init: any = {}) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  const method = init.method ?? "GET";
  const headers = (init.headers ?? {}) as Record<string, string>;
  const json = (b: any, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
  if (url.hostname === "api.whop.com") {
    whopCalls.push({ url: url.href, auth: headers.Authorization, body: JSON.parse(init.body) });
    return whopResponse ? json(whopResponse.body, whopResponse.status ?? 200) : json({ id: "cfg_1", purchase_url: "https://whop.com/checkout/x", plan: { id: PLAN, product_id: PRODUCT } });
  }
  if (url.hostname === "supabase.test") {
    sbCalls.push({ url: url.href, headers });
    // The secret key must never travel as a Bearer token.
    if ((headers.Authorization ?? "").includes(SB_SECRET)) return json({ message: "secret used as bearer" }, 401);
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
  if (url.pathname === "/rest/v1/whop_webhook_events" && method === "GET") {
    const pid = url.searchParams.get("profile_id")?.replace("eq.", "");
    const since = url.searchParams.get("event_at")?.replace("gt.", "");
    const found = ledger.filter((l) => l.profile_id === decodeURIComponent(pid!) && l.outcome === "applied" && l.event_at > decodeURIComponent(since!));
    return json(found.slice(0, 1).map((l) => ({ event_id: l.event_id })));
  }
  if (url.pathname === "/rest/v1/whop_webhook_events" && method === "POST") {
    const b = JSON.parse(init.body);
    if (!ledger.some((l) => l.event_id === b.event_id && l.outcome === b.outcome)) ledger.push(b);
    return new Response(null, { status: 201 });
  }
  if (url.pathname.startsWith("/auth/v1/admin/users/")) {
    const id = decodeURIComponent(url.pathname.split("/").pop()!);
    const u = authUsers[id];
    return u ? json({ id, ...u }) : json({ message: "not found" }, 404);
  }
  if (url.pathname === "/auth/v1/user") {
    const token = (headers.Authorization ?? "").replace("Bearer ", "");
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
let clock = Date.parse("2026-10-05T12:00:00Z");
// Envelope timestamps increase with each send unless a test sets one explicitly.
async function send(type: string, data: any, opts: { secret?: string; badSig?: boolean; env?: any; eventId?: string; at?: string; ts?: number } = {}) {
  const id = opts.eventId ?? `msg_${++seq}`;
  const ts = opts.ts ?? Math.floor(Date.now() / 1000);
  const at = opts.at ?? new Date((clock += 1000)).toISOString();
  const body = JSON.stringify({ type, timestamp: at, data });
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
    { id: U1, email: "buyer@example.com", plan: "free", subscription_status: null, whop_membership_id: null, current_period_end: null },
    { id: U2, email: "unverified@example.com", plan: "free", subscription_status: null, whop_membership_id: null, current_period_end: null },
    { id: U3, email: "second@example.com", plan: "free", subscription_status: null, whop_membership_id: null, current_period_end: null },
  ];
  authUsers = {
    [U1]: { email: "buyer@example.com", email_confirmed_at: "2026-09-01T00:00:00Z" },
    [U2]: { email: "unverified@example.com", email_confirmed_at: null },
    [U3]: { email: "second@example.com", email_confirmed_at: "2026-09-01T00:00:00Z" },
  };
  ledger = [];
  patches = [];
  sbCalls = [];
};
const future = new Date(Date.now() + 20 * 86400000).toISOString();
const meta = (user = U1) => ({ kind: "psp_vip", supabase_user_id: user, ref: "r" });
const membership = (extra: any = {}) => ({ id: "mem_1", plan: { id: PLAN }, product: { id: PRODUCT }, metadata: meta(), ...extra });
const payment = (extra: any = {}) => ({ id: "pay_1", plan: { id: PLAN }, product: { id: PRODUCT }, metadata: meta(), ...extra });
const p1 = () => profiles.find((p) => p.id === U1)!;

// ---- Supabase secret key: apikey only ----
reset();
await send("membership.activated", membership({ status: "trialing" }));
const admin = sbCalls.filter((c) => c.url.includes("supabase.test"));
check("secret key: every Supabase call sends it in apikey", admin.length > 0 && admin.every((c) => c.headers.apikey === SB_SECRET));
check("secret key: never sent as Authorization Bearer", admin.every((c) => !(c.headers.Authorization ?? "").includes(SB_SECRET)));
check("secret key: webhook still applies the change (not blocked by auth)", p1().subscription_status === "trialing");

// ---- Trial / activation / membership binding ----
reset();
let r = await send("membership.activated", membership({ status: "trialing" }));
check("membership.activated trialing -> vip trialing", r.status === 200 && p1().plan === "vip" && p1().subscription_status === "trialing" && isVip(p1()));
check("membership.activated writes the membership's own id", p1().whop_membership_id === "mem_1");

reset();
await send("membership.activated", membership({ status: "active" }));
check("membership.activated active -> vip active", p1().subscription_status === "active" && isVip(p1()));
reset();
await send("membership.activated", membership({ status: "weird" }));
check("unknown status on activation changes nothing", patches.length === 0);

// ---- Payment events never write a membership id ----
reset();
await send("membership.activated", membership({ status: "active" }));
const before = p1().whop_membership_id;
await send("payment.succeeded", payment());
check("payment.succeeded does not overwrite membership id with payment id", p1().whop_membership_id === before && before === "mem_1");
check("payment.succeeded -> active", p1().subscription_status === "active" && isVip(p1()));
check("payment.succeeded patch carries no whop_membership_id", !patches.at(-1)!.body.whop_membership_id);
reset();
await send("payment.succeeded", payment());
check("payment.succeeded alone never writes a membership id", p1().whop_membership_id === null && !patches.some((pt) => "whop_membership_id" in pt.body));
reset();
await send("membership.activated", membership({ status: "active" }));
await send("payment.failed", payment({ id: "pay_failed" }));
check("payment.failed keeps the existing membership (no payment id written)", p1().whop_membership_id === "mem_1");
check("payment.failed without paid period -> past_due, no VIP", p1().subscription_status === "past_due" && !isVip(p1()));

// ---- Paid period ----
reset();
await send("membership.activated", membership({ status: "active" }));
p1().current_period_end = future;
patches = [];
await send("payment.failed", payment());
check("payment.failed inside a confirmed paid period keeps VIP", patches.length === 0 && isVip(p1()));
reset();
await send("membership.activated", membership({ status: "active" }));
p1().current_period_end = future;
patches = [];
await send("membership.deactivated", membership());
check("membership.deactivated before period end keeps VIP", patches.length === 0 && isVip(p1()));
reset();
await send("membership.activated", membership({ status: "active" }));
p1().current_period_end = new Date(Date.now() - 86400000).toISOString();
await send("membership.deactivated", membership());
check("membership.deactivated after period end -> free/expired", p1().plan === "free" && p1().subscription_status === "expired" && !isVip(p1()));
reset();
await send("membership.activated", membership({ status: "active" }));
await send("membership.deactivated", membership());
check("no stored period end -> deactivation expires (no indefinite VIP)", p1().subscription_status === "expired" && !isVip(p1()));

// Presumed fields are never persisted from the payload.
reset();
await send("membership.activated", membership({ status: "active", renewal_period_end: future, trial_end: future }));
check("payload period/trial fields are not written without a confirmed shape", p1().current_period_end === null && !patches.some((pt) => "trial_ends_at" in pt.body) && !patches.some((pt) => "current_period_end" in pt.body));

// ---- Ordering ----
reset();
await send("membership.deactivated", membership(), { at: "2026-10-05T15:00:00Z" });
check("setup: deactivation applied (expired)", p1().subscription_status === "expired");
patches = [];
await send("membership.activated", membership({ status: "active" }), { at: "2026-10-05T14:00:00Z" });
check("older activation after a newer deactivation is ignored", patches.length === 0 && p1().subscription_status === "expired" && !isVip(p1()));
reset();
await send("membership.activated", membership({ status: "active" }), { at: "2026-10-05T10:00:00Z" });
await send("membership.deactivated", membership({ }), { at: "2026-10-05T11:00:00Z" });
patches = [];
await send("payment.succeeded", payment(), { at: "2026-10-05T10:30:00Z" });
check("old payment.succeeded does not reactivate a membership deactivated later", patches.length === 0 && !isVip(p1()));
check("the stale event is recorded as ignored-stale-event", ledger.some((l) => l.outcome === "ignored-stale-event"));
reset();
await send("membership.activated", membership({ status: "active" }), { at: "2026-10-05T10:00:00Z" });
patches = [];
r = await send("payment.succeeded", payment(), { at: "not-a-date" });
check("event without a usable timestamp is not applied", r.status === 200 && patches.length === 0 && ledger.some((l) => l.outcome === "ignored-no-event-timestamp"));

// ---- Metadata, product/plan, identity ----
reset();
await send("membership.activated", { id: "mem_1", plan: { id: PLAN }, product: { id: PRODUCT }, status: "active", user: { email: "buyer@example.com" } });
check("missing metadata grants nothing (email alone never grants)", patches.length === 0 && p1().plan === "free");
reset();
await send("membership.activated", membership({ status: "active", metadata: { supabase_user_id: "not-a-uuid" } }));
check("invalid uuid -> ignored", patches.length === 0);
reset();
await send("membership.activated", membership({ status: "active", metadata: meta(GHOST) }));
check("uuid without profile -> ignored", patches.length === 0);
reset();
await send("membership.activated", membership({ status: "active", metadata: meta(U2) }));
check("unconfirmed email user -> ignored", patches.length === 0);
reset();
await send("membership.activated", membership({ status: "active", plan: { id: "plan_OTHER" } }));
await send("payment.succeeded", payment({ product: { id: "prod_OTHER" } }));
check("other plan or product ignored", patches.length === 0 && p1().plan === "free");
reset();
profiles[2].whop_membership_id = "mem_1";
await send("membership.activated", membership({ status: "active", metadata: meta(U1) }));
check("membership already owned by another profile is refused", p1().plan === "free" && patches.length === 0);

// ---- Signature / config / parsing ----
reset();
r = await send("membership.activated", membership({ status: "active" }), { badSig: true });
check("bad signature -> 401, nothing written", r.status === 401 && patches.length === 0);
r = await send("membership.activated", membership({ status: "active" }), { secret: "ws_wrong" });
check("wrong secret -> 401", r.status === 401 && patches.length === 0);
r = await send("membership.activated", membership({ status: "active" }), { env: { ...ENV, WHOP_WEBHOOK_SECRET: "" } });
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
reset();
r = await send("membership.updated", membership({ status: "active" }));
check("membership.updated is not handled", patches.length === 0);

// ---- Idempotency ----
reset();
await send("membership.activated", membership({ status: "active" }), { eventId: "msg_same", at: "2026-10-05T12:00:00Z" });
await send("membership.activated", membership({ status: "active" }), { eventId: "msg_same", at: "2026-10-05T12:00:00Z" });
check("repeat delivery of the same event: same final state", p1().subscription_status === "active" && patches.length === 2 && patches[0].body.subscription_status === patches[1].body.subscription_status);
check("ledger keeps field names only (no values)", ledger.every((row) => Array.isArray(row.payload_keys) && !JSON.stringify(row).includes("buyer@example.com")));

// ---- Checkout ----
reset();
const cReq = (token?: string, body: any = {}) => new Request("https://predictions-sports-prime.com/api/whop/checkout", {
  method: "POST",
  headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
r = await checkout.onRequestPost({ request: cReq(), env: ENV });
check("checkout: no session -> 401", r.status === 401 && whopCalls.length === 0);
whopCalls = [];
r = await checkout.onRequestPost({ request: cReq("tok-" + U1, { supabase_user_id: U3 }), env: ENV });
const out = await r.json();
const call = whopCalls[0];
check("checkout: 200 with purchase_url and session_id only", r.status === 200 && out.purchase_url === "https://whop.com/checkout/x" && Object.keys(out).sort().join(",") === "purchase_url,session_id");
check("checkout: body supabase_user_id ignored; session user used", call?.body.metadata.supabase_user_id === U1);
check("checkout: fixed plan and WHOP_API_KEY", call?.body.plan_id === PLAN && call.auth === "Bearer whop-test-key");
whopResponse = { body: { id: "cfg_x", purchase_url: "https://whop.com/x", plan: { id: "plan_OTHER", product_id: PRODUCT } } };
r = await checkout.onRequestPost({ request: cReq("tok-" + U1), env: ENV });
check("checkout: plan mismatch -> 502", r.status === 502);
whopResponse = null;

// ---- History ----
const hReq = (token?: string) => new Request("https://x/api/history-predictions", { headers: token ? { Authorization: `Bearer ${token}` } : {} });
check("history: no token -> 401", (await historyFn.onRequestGet({ request: hReq(), env: ENV })).status === 401);
reset();
profiles.push({ id: "vipU", email: "v@example.com", plan: "vip", subscription_status: "trialing", whop_membership_id: null, current_period_end: null } as any);
profiles.push({ id: "cancU", email: "c@example.com", plan: "vip", subscription_status: "canceled", whop_membership_id: null, current_period_end: null } as any);
authUsers.vipU = { email: "v@example.com", email_confirmed_at: "x" };
authUsers.cancU = { email: "c@example.com", email_confirmed_at: "x" };
let h = await historyFn.onRequestGet({ request: hReq("tok-vipU"), env: ENV });
check("history: VIP trialing -> 200 with 841 records", h.status === 200 && (await h.json()).records.length === 841);
check("history: secret sent only in apikey", sbCalls.every((c) => !(c.headers.Authorization ?? "").includes(SB_SECRET)));
h = await historyFn.onRequestGet({ request: hReq("tok-cancU"), env: ENV });
check("history: canceled -> 403", h.status === 403);

// ---- Helper ----
check("isVip: trialing and active only", isVip({ plan: "vip", subscription_status: "trialing" }) && isVip({ plan: "vip", subscription_status: "active" }));
check("isVip: canceled/expired/past_due/inactive/free false", ["canceled", "expired", "past_due", "inactive"].every((s) => !isVip({ plan: "vip", subscription_status: s })) && !isVip({ plan: "free", subscription_status: "active" }));

globalThis.fetch = realFetch;
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
