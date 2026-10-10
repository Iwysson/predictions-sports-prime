// Google Play entitlement reconciliation tests. No network - a fake Supabase client
// records what reconcileGooglePlayEntitlement() would have written.
import assert from "node:assert/strict";
import { reconcileGooglePlayEntitlement, rowGrantsNow } from "../functions/_lib/google-play.js";

const NOW = Date.parse("2026-10-10T12:00:00.000Z");

function fakeDb(rows: any[]) {
  const patches: any[] = [];
  return {
    db: {
      async select() {
        return rows;
      },
      async patch(_operation: string, _path: string, body: any) {
        patches.push(body);
        return [body];
      },
    },
    patches,
  };
}

// --- rowGrantsNow ---
assert.equal(rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_ACTIVE" }, NOW), true, "ACTIVE grants VIP");
assert.equal(rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_IN_GRACE_PERIOD" }, NOW), true, "IN_GRACE_PERIOD grants VIP");
assert.equal(rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_ON_HOLD" }, NOW), false, "ON_HOLD does not grant VIP");
assert.equal(rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_PAUSED" }, NOW), false, "PAUSED does not grant VIP");
assert.equal(rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_EXPIRED" }, NOW), false, "EXPIRED does not grant VIP");
assert.equal(rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_PENDING" }, NOW), false, "PENDING never grants VIP");
assert.equal(rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_REVOKED" }, NOW), false, "REVOKED does not grant VIP");
assert.equal(
  rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_CANCELED", expiry_time: "2026-10-20T00:00:00Z" }, NOW),
  true,
  "canceled but not yet expired still grants VIP",
);
assert.equal(
  rowGrantsNow({ subscription_state: "SUBSCRIPTION_STATE_CANCELED", expiry_time: "2026-10-01T00:00:00Z" }, NOW),
  false,
  "canceled and expired no longer grants VIP",
);

// --- reconcileGooglePlayEntitlement ---
{
  const { db, patches } = fakeDb([{ subscription_state: "SUBSCRIPTION_STATE_ACTIVE", expiry_time: "2026-11-10T00:00:00Z", is_trial: false }]);
  const result = await reconcileGooglePlayEntitlement(db, "user-1", NOW);
  assert.equal(result.plan, "vip");
  assert.equal(result.subscription_status, "active");
  assert.equal(patches.length, 1);
  assert.equal(patches[0].billing_source, "google_play");
}

{
  const { db } = fakeDb([{ subscription_state: "SUBSCRIPTION_STATE_ACTIVE", expiry_time: "2026-11-10T00:00:00Z", is_trial: true }]);
  const result = await reconcileGooglePlayEntitlement(db, "user-1", NOW);
  assert.equal(result.subscription_status, "trialing", "trialing is_trial row reconciles to trialing status");
}

{
  const { db } = fakeDb([{ subscription_state: "SUBSCRIPTION_STATE_ON_HOLD" }]);
  const result = await reconcileGooglePlayEntitlement(db, "user-1", NOW);
  assert.equal(result.plan, "free", "ON_HOLD with no other granting row downgrades to free");
}

{
  const { db } = fakeDb([]);
  const result = await reconcileGooglePlayEntitlement(db, "user-1", NOW);
  assert.equal(result.plan, "free", "no subscription rows at all downgrades to free");
}

{
  // Duplicate verify calls (same purchase token re-processed) must not change the outcome.
  const rows = [{ subscription_state: "SUBSCRIPTION_STATE_ACTIVE", expiry_time: "2026-11-10T00:00:00Z", is_trial: false }];
  const { db, patches } = fakeDb(rows);
  await reconcileGooglePlayEntitlement(db, "user-1", NOW);
  await reconcileGooglePlayEntitlement(db, "user-1", NOW);
  assert.equal(patches.length, 2);
  assert.deepEqual(patches[0], patches[1], "repeated reconciliation of the same state is idempotent");
}

{
  // A canceled-but-active row and an expired row for the same user: the still-valid one wins.
  const rows = [
    { subscription_state: "SUBSCRIPTION_STATE_EXPIRED", expiry_time: "2026-09-01T00:00:00Z", is_trial: false },
    { subscription_state: "SUBSCRIPTION_STATE_CANCELED", expiry_time: "2026-11-01T00:00:00Z", is_trial: false },
  ];
  const { db } = fakeDb(rows);
  const result = await reconcileGooglePlayEntitlement(db, "user-1", NOW);
  assert.equal(result.plan, "vip", "an unexpired canceled row still grants VIP even alongside an expired row");
  assert.equal(result.current_period_end, "2026-11-01T00:00:00Z");
}

console.log("google-play entitlement tests passed");
