// GET /api/match-content/:slug
// Protected full content for one match prediction.
//   access "free" -> full content for anyone (public policy).
//   access "vip"  (default when the field is absent) -> full content only for a
//                 server-verified session whose profile is VIP trialing/active.
// Every other case returns no premium text: 401 without a valid session, 403 for non-VIP.
// The index is imported here only, so premium text never reaches the static export.
import contentIndex from "../../_data/match-content.json";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "private, no-store" },
  });

// Mirrors src/lib/vip.ts: plan === "vip" && subscription_status in [trialing, active].
const isVipRow = (row) => row?.plan === "vip" && ["trialing", "active"].includes(row?.subscription_status ?? "");

// Entries from the index; a missing or unknown access value is treated as VIP.
const accessOf = (entry) => (entry?.access === "free" ? "free" : "vip");

export function createMatchContentHandler(index) {
  return async function handle({ request, params, env }) {
    const slug = String(params?.slug ?? "");
    const entry = index.find((e) => e.slug === slug);
    if (!entry) return json({ error: "not-found" }, 404);

    if (accessOf(entry) === "free") {
      return json({ access: "free", slug, full: entry.full });
    }

    // VIP content: verify the session on the server, then the profile with the service role.
    const supabaseUrl = env.SUPABASE_URL;
    const serviceKey = env.SUPABASE_SECRET_KEY;
    const publishableKey = env.SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !serviceKey || !publishableKey) return json({ error: "unavailable" }, 503);

    const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "unauthenticated" }, 401);

    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: publishableKey, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return json({ error: "unauthenticated" }, 401);
    const user = await userRes.json();
    if (!user?.id) return json({ error: "unauthenticated" }, 401);

    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=plan,subscription_status`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
    );
    if (!profileRes.ok) return json({ error: "unavailable" }, 503);
    const [profile] = await profileRes.json();

    if (!isVipRow(profile)) return json({ error: "vip-required" }, 403);
    return json({ access: "vip", slug, full: entry.full });
  };
}

export const onRequestGet = (context) => createMatchContentHandler(contentIndex)(context);
