// POST /api/account/delete
// Google Play requires an in-app account-deletion path backed by a real server-side
// delete (see GOOGLE_PLAY_SETUP.md). Deactivating/freezing does not satisfy that policy,
// so this actually deletes the Supabase auth user; cascading foreign keys remove the
// matching profiles/google_play_subscriptions rows (see supabase/migrations).
// Does not cancel a live Google Play or Whop subscription - the caller is told so by the
// client before confirming, and billing continues until the user cancels it at the store.

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

async function handle(request, env) {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceKey = env.SUPABASE_SECRET_KEY;
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !serviceKey || !publishableKey) return json({ error: "unavailable" }, 503);

  const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return json({ error: "unauthenticated" }, 401);

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: publishableKey, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return json({ error: "unauthenticated" }, 401);
  const user = await userRes.json();
  if (!user?.id) return json({ error: "unauthenticated" }, 401);

  const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(user.id)}`, {
    method: "DELETE",
    headers: { apikey: serviceKey },
  });
  if (!deleteRes.ok && deleteRes.status !== 404) {
    console.error(JSON.stringify({ source: "account-delete", status: deleteRes.status }));
    return json({ error: "delete-failed" }, 502);
  }

  return json({ status: "deleted" });
}

export async function onRequestPost({ request, env }) {
  try {
    return await handle(request, env);
  } catch (error) {
    console.error(JSON.stringify({ source: "account-delete", operation: "unexpected", message: String(error?.message ?? error).slice(0, 200) }));
    return json({ error: "unavailable" }, 500);
  }
}
