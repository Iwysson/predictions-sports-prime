// POST /api/whop/webhook
// Whop webhooks follow the Standard Webhooks scheme: HMAC-SHA256 over
// `${webhook-id}.${webhook-timestamp}.${rawBody}`, base64, sent as `v1,<sig>`.
// The raw body is used for the signature; it is never re-serialised before verification.
// The secret is used exactly as Whop provides it (ws_...).
//
// Identity: profile id from metadata.supabase_user_id, validated as UUID and checked
// against an existing profile and an email-confirmed auth user. Email is never used.
//
// Membership binding: only membership.* events can set whop_membership_id, from the
// membership's own id. Payment events never write a membership id, because in payment
// payloads `data.id` is the payment id.
//
// Ordering: the envelope `timestamp` (documented by Whop) orders events per profile.
// An event older than an applied event for the same profile is ignored.
//
// Fail closed: a payload whose shape is not confirmed grants nothing. Unknown fields
// are not assumed; the ledger stores field NAMES so the real shape can be checked.

const TOLERANCE_SECONDS = 300;
const SUPPORTED = new Set(["membership.activated", "membership.deactivated", "payment.succeeded", "payment.failed"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const reply = (status, text) => new Response(text, { status });

async function hmacBase64(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifySignature(request, body, secret) {
  const id = request.headers.get("webhook-id");
  const timestamp = request.headers.get("webhook-timestamp");
  const signatureHeader = request.headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return { ok: false, status: 400 };
  if (!/^\d+$/.test(timestamp) || Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) {
    return { ok: false, status: 400 };
  }
  const expected = await hmacBase64(secret, `${id}.${timestamp}.${body}`);
  const valid = signatureHeader.split(" ").some((part) => {
    const [version, signature] = part.split(",");
    return version === "v1" && Boolean(signature) && constantTimeEqual(signature, expected);
  });
  return valid ? { ok: true, id } : { ok: false, status: 401 };
}

// Administrative calls use the secret key in the apikey header only.
// Authorization: Bearer is never used with sb_secret_ (it is not a JWT).
class SupabaseError extends Error {
  constructor(operation, status) {
    super(`${operation} ${status}`);
    this.operation = operation;
    this.status = status;
  }
}

// Logs operation, HTTP status and the Supabase error body. Never logs keys, headers or secrets.
async function failure(operation, res) {
  let body = "";
  try {
    body = (await res.text()).slice(0, 500);
  } catch {
    body = "";
  }
  console.error(JSON.stringify({ source: "whop-webhook", operation, status: res.status, supabaseBody: body }));
  return new SupabaseError(operation, res.status);
}

function supabaseClient(env) {
  const base = env.SUPABASE_URL;
  const key = env.SUPABASE_SECRET_KEY;
  const headers = { apikey: key, Accept: "application/json" };
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };
  return {
    async select(operation, path) {
      const res = await fetch(`${base}/rest/v1/${path}`, { headers });
      if (!res.ok) throw await failure(`select ${operation}`, res);
      return res.json();
    },
    async patch(operation, path, body) {
      const res = await fetch(`${base}/rest/v1/${path}`, {
        method: "PATCH",
        headers: { ...jsonHeaders, Prefer: "return=minimal" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw await failure(`patch ${operation}`, res);
    },
    async adminUser(id) {
      const res = await fetch(`${base}/auth/v1/admin/users/${encodeURIComponent(id)}`, { headers });
      if (res.status === 404) return null;
      if (!res.ok) throw await failure("auth admin user", res);
      return res.json();
    },
    // Only columns that exist: event_id, event_type, outcome, payload_keys, profile_id, event_at.
    async recordEvent(eventId, type, outcome, payloadKeys, extra = {}) {
      const res = await fetch(`${base}/rest/v1/whop_webhook_events`, {
        method: "POST",
        headers: { ...jsonHeaders, Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify({
          event_id: eventId,
          event_type: type,
          outcome,
          payload_keys: payloadKeys,
          profile_id: extra.profileId ?? null,
          event_at: extra.eventAt ?? null,
        }),
      });
      if (!res.ok) await failure("insert whop_webhook_events", res);
    },
  };
}

// Field NAMES only, never values: lets the real payload shape be confirmed without storing personal data.
const shapeOf = (event) => {
  const keys = (o) => (o && typeof o === "object" && !Array.isArray(o) ? Object.keys(o).sort() : []);
  return [
    ...keys(event),
    ...keys(event?.data).map((k) => `data.${k}`),
    ...keys(event?.data?.metadata).map((k) => `data.metadata.${k}`),
  ];
};

const isoOrNull = (value) => {
  if (typeof value !== "string") return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
};

// Returns the change to apply, or null when no state change is confirmed.
// `profile` is the current row. A paid period is respected only when its end is stored.
function planChange(type, data, profile, nowMs) {
  const periodOpen = Boolean(profile.current_period_end && Date.parse(profile.current_period_end) > nowMs);
  if (type === "membership.activated") {
    // The status values are the ones Whop sends for trial and paid starts. Anything else changes nothing.
    if (data.status === "trialing") return { plan: "vip", subscription_status: "trialing" };
    if (data.status === "active") return { plan: "vip", subscription_status: "active" };
    return null;
  }
  if (type === "payment.succeeded") {
    return { plan: "vip", subscription_status: "active" };
  }
  if (type === "payment.failed") {
    if (periodOpen) return null;
    return { plan: "vip", subscription_status: "past_due" };
  }
  if (type === "membership.deactivated") {
    if (periodOpen) return null;
    return { plan: "free", subscription_status: "expired" };
  }
  return null;
}

async function handle(request, env) {
  const secret = env.WHOP_WEBHOOK_SECRET;
  if (!secret || !env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY || !env.WHOP_PLAN_ID || !env.WHOP_PRODUCT_ID) {
    return reply(503, "webhook not configured");
  }

  const body = await request.text();
  const signature = await verifySignature(request, body, secret);
  if (!signature.ok) return reply(signature.status, "invalid signature");

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return reply(400, "malformed body");
  }
  const type = String(event?.type ?? "");
  const data = event?.data ?? {};
  const db = supabaseClient(env);
  const eventId = signature.id;
  const keys = shapeOf(event);
  const eventAt = isoOrNull(event?.timestamp);

  if (!SUPPORTED.has(type)) {
    await db.recordEvent(eventId, type, "ignored-unsupported-type", keys);
    return reply(200, "ignored");
  }

  // Product and plan must both match this project's configuration.
  const planId = data.plan?.id ?? data.plan_id;
  const productId = data.product?.id ?? data.product_id ?? data.plan?.product_id;
  if (planId !== env.WHOP_PLAN_ID || productId !== env.WHOP_PRODUCT_ID) {
    await db.recordEvent(eventId, type, "ignored-other-product-or-plan", keys, { eventAt });
    return reply(200, "ignored");
  }

  // Identity from metadata only. Without it, nothing is granted.
  const userId = data.metadata?.supabase_user_id;
  if (typeof userId !== "string" || !UUID.test(userId)) {
    await db.recordEvent(eventId, type, "ignored-unmapped-no-valid-user-id", keys, { eventAt });
    return reply(200, "ignored");
  }
  const [profile] = await db.select(
    "profile by id",
    `profiles?id=eq.${encodeURIComponent(userId)}&select=id,plan,subscription_status,current_period_end,whop_membership_id`,
  );
  const authUser = profile ? await db.adminUser(profile.id) : null;
  if (!profile || !authUser?.email_confirmed_at) {
    await db.recordEvent(eventId, type, "ignored-unknown-or-unconfirmed-user", keys, { eventAt });
    return reply(200, "ignored");
  }

  // Without a trustworthy timestamp, ordering cannot be proven: nothing is applied.
  if (!eventAt) {
    await db.recordEvent(eventId, type, "ignored-no-event-timestamp", keys, { profileId: profile.id });
    return reply(200, "ignored");
  }

  // Out-of-order protection: a newer applied event for this profile wins.
  const newer = await db.select(
    "newer applied event",
    `whop_webhook_events?profile_id=eq.${encodeURIComponent(profile.id)}&outcome=eq.applied&event_at=gt.${encodeURIComponent(eventAt)}&select=event_id&limit=1`,
  );
  if (newer.length) {
    await db.recordEvent(eventId, type, "ignored-stale-event", keys, { profileId: profile.id, eventAt });
    return reply(200, "ignored");
  }

  const change = planChange(type, data, profile, Date.now());
  if (!change) {
    await db.recordEvent(eventId, type, "ignored-no-confirmed-state-change", keys, { profileId: profile.id, eventAt });
    return reply(200, "ignored");
  }

  const update = { ...change, whop_plan_id: planId };

  // Period fields come from the membership payload only; payment payloads carry no membership dates.
  if (type === "membership.activated") {
    const whopUserId = data.user?.id ?? data.user_id;
    if (typeof whopUserId === "string" && whopUserId) update.whop_user_id = whopUserId;
    const periodEnd = isoOrNull(data.renewal_period_end);
    if (periodEnd) {
      update.current_period_end = periodEnd;
      if (change.subscription_status === "trialing") update.trial_ends_at = periodEnd;
    }
  }

  // Membership binding: membership.* events only, from the membership's own id.
  // Payment events never write whop_membership_id (their data.id is the payment id).
  if (type.startsWith("membership.")) {
    const membershipId = typeof data.id === "string" ? data.id : null;
    if (!membershipId) {
      await db.recordEvent(eventId, type, "ignored-membership-id-missing", keys, { profileId: profile.id, eventAt });
      return reply(200, "ignored");
    }
    const [owner] = await db.select("membership owner", `profiles?whop_membership_id=eq.${encodeURIComponent(membershipId)}&select=id`);
    if (owner && owner.id !== profile.id) {
      await db.recordEvent(eventId, type, "ignored-membership-linked-elsewhere", keys, { profileId: profile.id, eventAt });
      return reply(200, "ignored");
    }
    update.whop_membership_id = membershipId;
  }

  await db.patch("profile update", `profiles?id=eq.${encodeURIComponent(profile.id)}`, update);
  await db.recordEvent(eventId, type, "applied", keys, { profileId: profile.id, eventAt });
  return reply(200, "ok");
}

export async function onRequestPost({ request, env }) {
  try {
    return await handle(request, env);
  } catch (error) {
    // Supabase failures are already logged with operation/status/body by failure().
    if (!(error instanceof SupabaseError)) {
      console.error(JSON.stringify({ source: "whop-webhook", operation: "unexpected", message: String(error?.message ?? error).slice(0, 200) }));
    }
    return reply(500, "temporarily unavailable");
  }
}
