// POST /api/whop/checkout
// Creates a Whop checkout configuration bound to the authenticated Supabase user.
// The user id comes only from the validated server-side session. Nothing in the
// request body is trusted for identity; any supabase_user_id sent by the browser is ignored.
//
// Whop API: POST https://api.whop.com/api/v1/checkout_configurations
// Required permission on WHOP_API_KEY: checkout_configuration:create
// Idempotency-Key is not documented by Whop, so it is not sent. The per-attempt
// `ref` in metadata correlates each attempt instead.

const WHOP_CHECKOUT_URL = "https://api.whop.com/api/v1/checkout_configurations";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export async function onRequestPost({ request, env }) {
  const supabaseUrl = env.SUPABASE_URL;
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const whopKey = env.WHOP_API_KEY;
  const planId = env.WHOP_PLAN_ID;
  const productId = env.WHOP_PRODUCT_ID;
  if (!supabaseUrl || !publishableKey || !whopKey || !planId || !productId) {
    return json({ error: "unavailable" }, 503);
  }

  // 1) Identity from the server-validated session only.
  const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "unauthenticated" }, 401);
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: publishableKey, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return json({ error: "unauthenticated" }, 401);
  const user = await userRes.json();
  const userId = typeof user?.id === "string" ? user.id : "";
  if (!UUID.test(userId) || !user?.email_confirmed_at) return json({ error: "unauthenticated" }, 401);

  // 2) The fixed plan is the only one this endpoint can sell.
  const ref = crypto.randomUUID();
  const whopRes = await fetch(WHOP_CHECKOUT_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${whopKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "payment",
      plan_id: planId,
      redirect_url: env.WHOP_REDIRECT_URL || undefined,
      metadata: { kind: "psp_vip", supabase_user_id: userId, ref },
    }),
  });
  if (!whopRes.ok) return json({ error: "checkout-unavailable" }, 502);
  const config = await whopRes.json();

  // Refuse a configuration that does not match the expected plan, when Whop reports it.
  const returnedPlan = config?.plan?.id ?? config?.plan_id;
  if (returnedPlan && returnedPlan !== planId) return json({ error: "checkout-unavailable" }, 502);
  const returnedProduct = config?.plan?.product_id ?? config?.product_id;
  if (returnedProduct && returnedProduct !== productId) return json({ error: "checkout-unavailable" }, 502);
  if (!config?.purchase_url) return json({ error: "checkout-unavailable" }, 502);

  // Only what the browser needs.
  return json({ purchase_url: config.purchase_url, session_id: config.id ?? null });
}
