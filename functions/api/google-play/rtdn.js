// POST /api/google-play/rtdn
// Google Play Real-time Developer Notifications, delivered via a Pub/Sub push
// subscription. The notification only says "something changed" - it is never trusted
// as the state itself. Every message triggers a fresh purchases.subscriptionsv2.get
// call, and that response (not the notification type) drives the profile update.
//
// Security: requires a verified Google-signed OIDC token (see functions/_lib/google-oidc.js)
// on the push subscription. An unverifiable request is rejected before the body is even read
// for anything but idempotency bookkeeping. purchaseToken is never logged in full.

import { verifyGoogleOidcToken } from "../../_lib/google-oidc.js";
import {
  SupabaseError,
  GooglePlayError,
  getAccessToken,
  getSubscriptionV2,
  supabaseClient,
  reconcileGooglePlayEntitlement,
} from "../../_lib/google-play.js";

const reply = (status, text) => new Response(text, { status });

function maskToken(token) {
  if (typeof token !== "string" || token.length < 8) return "***";
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

async function handle(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY || !env.GOOGLE_PLAY_PACKAGE_NAME) {
    return reply(503, "rtdn not configured");
  }

  const identity = await verifyGoogleOidcToken(request, env);
  if (!identity) return reply(401, "invalid push token");

  let envelope;
  try {
    envelope = await request.json();
  } catch {
    return reply(400, "malformed body");
  }

  const messageId = envelope?.message?.messageId;
  const dataB64 = envelope?.message?.data;
  if (!messageId || !dataB64) return reply(400, "malformed pub/sub envelope");

  const db = supabaseClient(env);

  let notification;
  try {
    notification = JSON.parse(atob(dataB64));
  } catch {
    await db.insertIgnoreDuplicate("google_play_rtdn_events", "google_play_rtdn_events", {
      message_id: messageId,
      notification_type: "unparseable",
      outcome: "ignored-malformed-data",
    });
    return reply(200, "ignored");
  }

  const subNotification = notification.subscriptionNotification;
  if (!subNotification) {
    // testNotification / oneTimeProductNotification - nothing to reconcile here.
    await db.insertIgnoreDuplicate("google_play_rtdn_events", "google_play_rtdn_events", {
      message_id: messageId,
      notification_type: "non-subscription",
      outcome: "ignored-not-a-subscription-event",
    });
    return reply(200, "ignored");
  }

  const purchaseToken = subNotification.purchaseToken;
  const notificationType = String(subNotification.notificationType ?? "unknown");

  if (!purchaseToken) {
    await db.insertIgnoreDuplicate("google_play_rtdn_events", "google_play_rtdn_events", {
      message_id: messageId,
      notification_type: notificationType,
      outcome: "ignored-no-purchase-token",
    });
    return reply(200, "ignored");
  }

  const [existing] = await db.select(
    "existing purchase token",
    `google_play_subscriptions?purchase_token=eq.${encodeURIComponent(purchaseToken)}&select=user_id,product_id`,
  );

  if (!existing) {
    // A renewal/cancellation for a token this project never verified via /verify - log and
    // stop. It cannot be attributed to a Supabase user without that first /verify call.
    await db.insertIgnoreDuplicate("google_play_rtdn_events", "google_play_rtdn_events", {
      message_id: messageId,
      notification_type: notificationType,
      outcome: "ignored-unknown-purchase-token",
    });
    console.warn(JSON.stringify({ source: "google-play-rtdn", notificationType, purchaseToken: maskToken(purchaseToken) }));
    return reply(200, "ignored");
  }

  const accessToken = await getAccessToken(env);
  const subscription = await getSubscriptionV2(env, accessToken, purchaseToken);
  const lineItem = (subscription.lineItems ?? []).find((item) => item.productId === existing.product_id) ?? subscription.lineItems?.[0];

  await db.upsert(
    "google_play_subscriptions upsert",
    "google_play_subscriptions",
    {
      user_id: existing.user_id,
      package_name: env.GOOGLE_PLAY_PACKAGE_NAME,
      product_id: existing.product_id,
      base_plan_id: lineItem?.offerDetails?.basePlanId ?? null,
      purchase_token: purchaseToken,
      latest_order_id: subscription.latestOrderId ?? null,
      subscription_state: subscription.subscriptionState ?? "SUBSCRIPTION_STATE_UNSPECIFIED",
      acknowledgement_state: subscription.acknowledgementState ?? null,
      start_time: subscription.startTime ?? null,
      expiry_time: lineItem?.expiryTime ?? null,
      auto_renew_enabled: lineItem?.autoRenewingPlan?.autoRenewEnabled ?? null,
      is_trial: Boolean(lineItem?.offerDetails?.offerTags?.some((t) => /trial/i.test(t))),
      last_verified_at: new Date().toISOString(),
    },
    "purchase_token",
  );

  await reconcileGooglePlayEntitlement(db, existing.user_id);
  await db.insertIgnoreDuplicate("google_play_rtdn_events", "google_play_rtdn_events", {
    message_id: messageId,
    notification_type: notificationType,
    outcome: "applied",
  });

  return reply(200, "ok");
}

export async function onRequestPost({ request, env }) {
  try {
    return await handle(request, env);
  } catch (error) {
    if (error instanceof GooglePlayError) {
      console.error(JSON.stringify({ source: "google-play-rtdn", operation: error.operation, status: error.status }));
      return reply(502, "google play unavailable");
    }
    if (error instanceof SupabaseError) {
      console.error(JSON.stringify({ source: "google-play-rtdn", operation: error.operation, status: error.status }));
      return reply(503, "temporarily unavailable");
    }
    console.error(JSON.stringify({ source: "google-play-rtdn", operation: "unexpected", message: String(error?.message ?? error).slice(0, 200) }));
    return reply(500, "temporarily unavailable");
  }
}
