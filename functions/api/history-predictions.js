// GET /api/history-predictions
// Full History Predictions data, for VIP visitors only. The JSON is imported
// here (server side) and never ships in the static bundle.
import history from "../../src/data/predictions-history/history.json";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "private, no-store" },
  });

// Mirrors src/lib/vip.ts: plan === "vip" && subscription_status in [trialing, active].
const isVipRow = (row) =>
  row?.plan === "vip" && ["trialing", "active"].includes(row?.subscription_status ?? "");

export async function onRequestGet({ request, env }) {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceKey = env.SUPABASE_SECRET_KEY;
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !serviceKey || !publishableKey) return json({ error: "unavailable" }, 503);

  const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "unauthenticated" }, 401);

  // 1) Resolve the session to a Supabase user (server-verified, not trusted from the client).
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: publishableKey, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return json({ error: "unauthenticated" }, 401);
  const user = await userRes.json();
  if (!user?.id) return json({ error: "unauthenticated" }, 401);

  // 2) Read the profile with the service role; the client cannot change it (see migration).
  const profileRes = await fetch(
    `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=plan,subscription_status`,
    { headers: { apikey: serviceKey } },
  );
  if (!profileRes.ok) return json({ error: "unavailable" }, 503);
  const [profile] = await profileRes.json();

  if (!isVipRow(profile)) return json({ error: "vip-required" }, 403);
  return json({ records: history });
}
