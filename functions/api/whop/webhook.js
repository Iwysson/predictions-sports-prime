// POST /api/whop/webhook
// Whop webhooks follow the Standard Webhooks scheme: HMAC-SHA256 over
// `${webhook-id}.${webhook-timestamp}.${rawBody}`, base64, sent as `v1,<sig>`.
// The secret is used exactly as Whop provides it (ws_...). Without
// WHOP_WEBHOOK_SECRET the endpoint refuses every event.
//
// Identity: the Supabase user is taken from metadata.supabase_user_id, which the
// PSP's own checkout endpoint writes. Email is never the authority. An event
// without a valid, existing, email-confirmed user id changes nothing.
//
// Supported events: membership.activated, membership.deactivated,
// payment.succeeded, payment.failed. Any other type is acknowledged and ignored.
// Field shapes beyond the documented ones are NOT assumed: if the expected shape
// is missing, the event is recorded as ignored and no access is granted.

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

function supabaseClient(env) {
  const base = env.SUPABASE_URL;
  const key = env.SUPABASE_SECRET_KEY;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  return {
    async select(path) {
      const res = await fetch(`${base}/rest/v1/${path}`, { headers });
      if (!res.ok) throw new Error(`select ${res.status}`);
      return res.json();
    },
    async patch(path, body) {
      const res = await fetch(`${base}/rest/v1/${path}`, {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`patch ${res.status}`);
    },
    async adminUser(id) {
      const res = await fetch(`${base}/auth/v1/admin/users/${encodeURIComponent(id)}`, { headers });
      if (!res.ok) return null;
      return res.json();
    },
    async recordEvent(eventId, type, outcome, payloadKeys) {
      await fetch(`${base}/rest/v1/whop_webhook_events`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify({ event_id: eventId, event_type: type, outcome, payload_keys: payloadKeys }),
      });
    },
  };
}

// Key names only, never values: lets the real payload shape be confirmed without storing personal data.
const shapeOf = (event) => {
  const keys = (o) => (o && typeof o === "object" && !Array.isArray(o) ? Object.keys(o).sort() : []);
  return [...keys(event), ...keys(event?.data).map((k) => `data.${k}`), ...keys(event?.data?.metadata).map((k) => `data.metadata.${k}`)];
};

const periodOpen = (iso, nowMs) => Boolean(iso && Date.parse(iso) > nowMs);

// Returns the change to apply, or null when the event does not change state.
// `profile` is the current row, used so a paid period is never removed early.
function planChange(type, data, profile, nowMs) {
  if (type === "membership.activated") {
    if (data.status === "trialing") return { plan: "vip", subscription_status: "trialing" };
    if (data.status === "active") return { plan: "vip", subscription_status: "active" };
    return null;
  }
  if (type === "payment.succeeded") {
    return { plan: "vip", subscription_status: "active" };
  }
  if (type === "payment.failed") {
    // A still-valid paid period keeps VIP until it ends. Otherwise the payment is past due.
    if (periodOpen(profile.current_period_end, nowMs)) return null;
    return { plan: "vip", subscription_status: "past_due" };
  }
  if (type === "membership.deactivated") {
    // VIP ends at the confirmed final period. With no confirmed end, it ends now.
    if (periodOpen(profile.current_period_end, nowMs)) return null;
    return { plan: "free", subscription_status: "expired" };
  }
  return null;
}

export async function onRequestPost({ request, env }) {
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

  if (!SUPPORTED.has(type)) {
    await db.recordEvent(eventId, type, "ignored-unsupported-type", keys);
    return reply(200, "ignored");
  }

  // Product and plan must both match this project's configuration.
  const planId = data.plan?.id ?? data.plan_id;
  const productId = data.product?.id ?? data.product_id ?? data.plan?.product_id;
  if (planId !== env.WHOP_PLAN_ID || productId !== env.WHOP_PRODUCT_ID) {
    await db.recordEvent(eventId, type, "ignored-other-product-or-plan", keys);
    return reply(200, "ignored");
  }

  // Identity from metadata only.
  const userId = data.metadata?.supabase_user_id;
  if (typeof userId !== "string" || !UUID.test(userId)) {
    await db.recordEvent(eventId, type, "ignored-no-valid-user-id", keys);
    return reply(200, "ignored");
  }
  const [profile] = await db.select(
    `profiles?id=eq.${encodeURIComponent(userId)}&select=id,plan,subscription_status,current_period_end,whop_membership_id`,
  );
  const authUser = profile ? await db.adminUser(profile.id) : null;
  if (!profile || !authUser?.email_confirmed_at) {
    await db.recordEvent(eventId, type, "ignored-unknown-or-unconfirmed-user", keys);
    return reply(200, "ignored");
  }

  // A membership belongs to one profile only.
  const membershipId = data.id ?? data.membership?.id ?? null;
  if (membershipId) {
    const [owner] = await db.select(`profiles?whop_membership_id=eq.${encodeURIComponent(membershipId)}&select=id`);
    if (owner && owner.id !== profile.id) {
      await db.recordEvent(eventId, type, "ignored-membership-linked-elsewhere", keys);
      return reply(200, "ignored");
    }
  }

  const change = planChange(type, data, profile, Date.now());
  if (!change) {
    await db.recordEvent(eventId, type, "ignored-no-state-change", keys);
    return reply(200, "ignored");
  }

  const update = { ...change };
  if (membershipId) update.whop_membership_id = membershipId;
  update.whop_plan_id = planId;
  if (data.user?.id) update.whop_user_id = data.user.id;
  if (type === "membership.activated" && data.status === "trialing" && data.trial_end) {
    const trialEnd = Date.parse(data.trial_end);
    if (!Number.isNaN(trialEnd)) update.trial_ends_at = new Date(trialEnd).toISOString();
  }

  await db.patch(`profiles?id=eq.${encodeURIComponent(profile.id)}`, update);
  await db.recordEvent(eventId, type, "applied", keys);
  return reply(200, "ok");
}
