// POST /api/google-play/verify
// Called by the Android app right after Google Play returns a purchase. The client is never
// trusted to grant itself VIP - this Function re-derives identity from the Supabase bearer
// token, then asks Google (not the client) what the purchase actually is before writing
// anything. Idempotent: the same purchaseToken verified N times produces one ledger row
// and one consistent profile state.

import {
  SupabaseError,
  GooglePlayError,
  getAccessToken,
  getSubscriptionV2,
  acknowledgeSubscription,
  supabaseClient,
  reconcileGooglePlayEntitlement,
  requireSupabaseUser,
} from "../../_lib/google-play.js";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

async function handle(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY || !env.GOOGLE_PLAY_PACKAGE_NAME) {
    return json({ error: "unavailable" }, 503);
  }

  const user = await requireSupabaseUser(request, env);
  if (!user) return json({ error: "unauthenticated" }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "malformed-body" }, 400);
  }
  const purchaseToken = typeof body?.purchaseToken === "string" ? body.purchaseToken : null;
  const productId = typeof body?.productId === "string" ? body.productId : null;
  if (!purchaseToken || !productId) {
    return json({ error: "missing-fields" }, 400);
  }
  // packageName is never trusted from the client - this project has exactly one package.
  const packageName = env.GOOGLE_PLAY_PACKAGE_NAME;

  const db = supabaseClient(env);

  // A purchase token already recorded for a different Supabase user must never be re-assigned.
  const [existing] = await db.select(
    "existing purchase token",
    `google_play_subscriptions?purchase_token=eq.${encodeURIComponent(purchaseToken)}&select=user_id`,
  );
  if (existing && existing.user_id !== user.id) {
    return json({ error: "token-owned-by-another-user" }, 403);
  }

  const accessToken = await getAccessToken(env);
  const subscription = await getSubscriptionV2(env, accessToken, purchaseToken);

  const lineItems = Array.isArray(subscription.lineItems) ? subscription.lineItems : [];
  const matchingLineItem = lineItems.find((item) => item.productId === productId);
  if (!matchingLineItem) {
    return json({ error: "product-mismatch" }, 400);
  }

  const subscriptionState = subscription.subscriptionState ?? "SUBSCRIPTION_STATE_UNSPECIFIED";
  const acknowledgementState = subscription.acknowledgementState ?? null;
  const expiryTime = matchingLineItem.expiryTime ?? null;
  const basePlanId = matchingLineItem.offerDetails?.basePlanId ?? null;
  // Google's subscriptionsv2 identifies a free-trial offer by its offer tags
  // (configured in Play Console on the base plan's offer - see GOOGLE_PLAY_SETUP.md).
  const effectiveIsTrial = Boolean(matchingLineItem.offerDetails?.offerTags?.some((t) => /trial/i.test(t)));
  const autoRenewEnabled = matchingLineItem.autoRenewingPlan?.autoRenewEnabled ?? null;

  // PENDING never grants VIP - this row is still recorded, but reconcile() below will not
  // treat it as granting until Google reports ACTIVE/IN_GRACE_PERIOD.
  const row = {
    user_id: user.id,
    package_name: packageName,
    product_id: productId,
    base_plan_id: basePlanId,
    purchase_token: purchaseToken,
    latest_order_id: subscription.latestOrderId ?? null,
    subscription_state: subscriptionState,
    acknowledgement_state: acknowledgementState,
    start_time: subscription.startTime ?? null,
    expiry_time: expiryTime,
    auto_renew_enabled: autoRenewEnabled,
    is_trial: effectiveIsTrial,
    last_verified_at: new Date().toISOString(),
  };

  await db.upsert("google_play_subscriptions upsert", "google_play_subscriptions", row, "purchase_token");

  // Acknowledge a brand-new purchase once it is actually persisted, so a crash before this
  // point just means the client calls /verify again - it never leaves an un-acked purchase
  // past Google's refund window silently.
  if (acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING" && subscriptionState !== "SUBSCRIPTION_STATE_PENDING") {
    await acknowledgeSubscription(env, accessToken, productId, purchaseToken).catch(() => false);
  }

  const entitlement = await reconcileGooglePlayEntitlement(db, user.id);

  return json({
    status: "verified",
    subscriptionState,
    isVip: entitlement.plan === "vip",
    subscriptionStatus: entitlement.subscription_status,
    currentPeriodEnd: entitlement.current_period_end ?? expiryTime ?? null,
  });
}

export async function onRequestPost({ request, env }) {
  try {
    return await handle(request, env);
  } catch (error) {
    if (error instanceof GooglePlayError) {
      console.error(JSON.stringify({ source: "google-play-verify", operation: error.operation, status: error.status }));
      return json({ error: "google-play-unavailable" }, 502);
    }
    if (error instanceof SupabaseError) {
      console.error(JSON.stringify({ source: "google-play-verify", operation: error.operation, status: error.status }));
      return json({ error: "unavailable" }, 503);
    }
    console.error(JSON.stringify({ source: "google-play-verify", operation: "unexpected", message: String(error?.message ?? error).slice(0, 200) }));
    return json({ error: "unavailable" }, 500);
  }
}
