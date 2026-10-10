// POST /api/whop/checkout
// DISABLED: PRIME VIP is sold exclusively through Google Play Billing in the Android
// app now (see functions/api/google-play/verify.js). No new Whop checkout is created by
// this endpoint - it is kept (rather than deleted) only so a stale client calling it gets
// an explicit, auditable "gone" response instead of a 404/silent failure. The Whop
// webhook (functions/api/whop/webhook.js) stays active: it keeps existing Whop
// subscribers' profiles.plan/subscription_status correct until their subscription
// naturally lapses or they migrate - this is unrelated to starting new purchases.

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export async function onRequestPost() {
  return json({ error: "whop-checkout-disabled", message: "PRIME VIP is now sold through the Predictions Sports Prime Android app." }, 410);
}
