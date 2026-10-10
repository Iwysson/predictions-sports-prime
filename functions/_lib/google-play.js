// Shared helpers for functions/api/google-play/{verify,rtdn}.js.
//
// Trust model: the app never sets VIP locally. It sends a purchaseToken to /verify
// (or Google sends an RTDN) and this module is the only place that calls Google's
// Android Publisher API (purchases.subscriptionsv2.get - the current, non-deprecated
// endpoint) and the only place that writes google_play_subscriptions/profiles.
//
// Secrets used (Cloudflare Pages env, server-only - see GOOGLE_PLAY_SETUP.md):
//   GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY   (PEM, PKCS8, \n-escaped)
//   GOOGLE_PLAY_PACKAGE_NAME

const ANDROID_PUBLISHER_SCOPE = "https://www.googleapis.com/auth/androidpublisher";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

class SupabaseError extends Error {
  constructor(operation, status) {
    super(`${operation} ${status}`);
    this.operation = operation;
    this.status = status;
  }
}

class GooglePlayError extends Error {
  constructor(operation, status, body) {
    super(`${operation} ${status}`);
    this.operation = operation;
    this.status = status;
    this.body = body;
  }
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

// Service-account JWT bearer flow (RFC 7523) - no refresh token, no user interaction.
async function getAccessToken(env) {
  const email = env.GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL;
  const pem = (env.GOOGLE_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  if (!email || !pem) throw new GooglePlayError("config", 503, "missing service account credentials");

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claim = base64url(
    new TextEncoder().encode(
      JSON.stringify({
        iss: email,
        scope: ANDROID_PUBLISHER_SCOPE,
        aud: TOKEN_URL,
        exp: now + 300,
        iat: now,
      }),
    ),
  );
  const toSign = `${header}.${claim}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(pem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(toSign));
  const assertion = `${toSign}.${base64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) throw new GooglePlayError("oauth-token", res.status, (await res.text()).slice(0, 300));
  const data = await res.json();
  return data.access_token;
}

// purchases.subscriptionsv2.get - the current API. purchases.subscriptions.get is deprecated
// and must not be used as the source of truth for new integrations.
async function getSubscriptionV2(env, accessToken, purchaseToken) {
  const packageName = env.GOOGLE_PLAY_PACKAGE_NAME;
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new GooglePlayError("subscriptionsv2.get", res.status, (await res.text()).slice(0, 300));
  return res.json();
}

// Acknowledgement uses the v3 subscriptions.acknowledge endpoint (subscriptionsv2 has no
// acknowledge of its own). subscriptionId is the base product id for the line item being acked.
async function acknowledgeSubscription(env, accessToken, subscriptionId, purchaseToken) {
  const packageName = env.GOOGLE_PLAY_PACKAGE_NAME;
  const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/subscriptions/${encodeURIComponent(subscriptionId)}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`;
  const res = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } });
  // 400 here commonly means "already acknowledged" - not fatal, just logged by the caller.
  return res.ok;
}

function supabaseClient(env) {
  const base = env.SUPABASE_URL;
  const key = env.SUPABASE_SECRET_KEY;
  const headers = { apikey: key, Accept: "application/json" };
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };
  return {
    async select(operation, path) {
      const res = await fetch(`${base}/rest/v1/${path}`, { headers });
      if (!res.ok) throw new SupabaseError(`select ${operation}`, res.status);
      return res.json();
    },
    async patch(operation, path, body) {
      const res = await fetch(`${base}/rest/v1/${path}`, {
        method: "PATCH",
        headers: { ...jsonHeaders, Prefer: "return=representation" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new SupabaseError(`patch ${operation}`, res.status);
      return res.json();
    },
    async upsert(operation, path, body, onConflict) {
      const res = await fetch(`${base}/rest/v1/${path}?on_conflict=${onConflict}`, {
        method: "POST",
        headers: { ...jsonHeaders, Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new SupabaseError(`upsert ${operation}`, res.status);
      return res.json();
    },
    async insertIgnoreDuplicate(operation, path, body) {
      const res = await fetch(`${base}/rest/v1/${path}`, {
        method: "POST",
        headers: { ...jsonHeaders, Prefer: "resolution=ignore-duplicates,return=minimal" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new SupabaseError(`insert ${operation}`, res.status);
    },
  };
}

// Grants VIP while the user is paying or Google is still trying to collect payment
// (grace period); a cancellation keeps access until the paid period actually ends.
const GRANTING_STATES = new Set([
  "SUBSCRIPTION_STATE_ACTIVE",
  "SUBSCRIPTION_STATE_IN_GRACE_PERIOD",
]);

function rowGrantsNow(row, nowMs) {
  if (GRANTING_STATES.has(row.subscription_state)) return true;
  if (row.subscription_state === "SUBSCRIPTION_STATE_CANCELED" && row.expiry_time) {
    return Date.parse(row.expiry_time) > nowMs;
  }
  return false;
}

// Single source of truth for "what should profiles say" given every Google Play
// subscription row this user has. Re-run after every verify and every RTDN so retries,
// duplicate purchases and out-of-order notifications can never leave a wrong state.
async function reconcileGooglePlayEntitlement(db, userId, nowMs = Date.now()) {
  const rows = await db.select(
    "google_play_subscriptions for user",
    `google_play_subscriptions?user_id=eq.${encodeURIComponent(userId)}&select=subscription_state,expiry_time,is_trial`,
  );
  const granting = rows.filter((row) => rowGrantsNow(row, nowMs));

  if (granting.length === 0) {
    await db.patch("profile downgrade", `profiles?id=eq.${encodeURIComponent(userId)}`, {
      plan: "free",
      subscription_status: "inactive",
    });
    return { plan: "free", subscription_status: "inactive" };
  }

  const best = granting.reduce((max, row) => {
    const a = row.expiry_time ? Date.parse(row.expiry_time) : 0;
    const b = max.expiry_time ? Date.parse(max.expiry_time) : 0;
    return a > b ? row : max;
  });

  const update = {
    plan: "vip",
    subscription_status: best.is_trial ? "trialing" : "active",
    billing_source: "google_play",
  };
  if (best.expiry_time) update.current_period_end = best.expiry_time;
  if (best.is_trial && best.expiry_time) update.trial_ends_at = best.expiry_time;

  await db.patch("profile upgrade", `profiles?id=eq.${encodeURIComponent(userId)}`, update);
  return update;
}

async function requireSupabaseUser(request, env) {
  const supabaseUrl = env.SUPABASE_URL;
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) return null;

  const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: publishableKey, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const user = await res.json();
  return user?.id ? user : null;
}

export {
  SupabaseError,
  GooglePlayError,
  getAccessToken,
  getSubscriptionV2,
  acknowledgeSubscription,
  supabaseClient,
  reconcileGooglePlayEntitlement,
  requireSupabaseUser,
  rowGrantsNow,
};
