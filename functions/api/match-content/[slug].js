// GET /api/match-content/:slug
// Protected full content for one match prediction.
//   access "free" -> full content for anyone (public policy).
//   access "vip"  (default when the field is absent) -> full content only for a
//                 server-verified session whose profile is VIP trialing/active.
// Every other case returns no premium text: 401 without a valid session, 403 for non-VIP.
// The index is imported here only, so premium text never reaches the static export.
// GET /api/match-content/:slug
// Protected full content for one match prediction.
//   access "free" -> full content for anyone (public policy).
//   access "vip"  (default when the field is absent) -> full content only for a
//                 server-verified session whose profile is VIP trialing/active.
// Every other case returns no premium text: 401 without a valid session, 403 for non-VIP.
// The index is imported here only, so premium text never reaches the static export.

// GET /api/match-content/:slug
// Protected full content for one match prediction.
//   access "free" -> full content for anyone.
//   access "vip"  -> full content only for a server-verified VIP session.
// Premium content is imported only inside the server function and never reaches
// the static export.

import contentIndex from "../../_data/match-content.json";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });

// NHL day in America/New_York (same rule as src/lib/nhl-day.ts). Compared as YYYY-MM-DD strings.
const NHL_TIME_ZONE = "America/New_York";
const nhlDayParts = new Intl.DateTimeFormat("en-US", {
  timeZone: NHL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const nhlTodayKey = (now = new Date()) => {
  const parts = Object.fromEntries(nhlDayParts.formatToParts(now).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const isVipRow = (row) =>
  row?.plan === "vip" &&
  ["trialing", "active"].includes(row?.subscription_status ?? "");

export function createMatchContentHandler(index) {
  return async function handle({ request, params, env }) {
    try {
      const slug = String(params?.slug ?? "");

      const entry = index.find((e) => e.slug === slug);

      if (!entry) {
        return json({ error: "not-found" }, 404);
      }

      // Not yet active: same answer as an unknown slug, so nothing about the future day leaks.
      if (entry.activeFromKey && nhlTodayKey() < entry.activeFromKey) {
        return json({ error: "not-found" }, 404);
      }

      const needsVip =
        entry.analysisAccess !== "free" ||
        entry.predictionAccess !== "free";

      const payload = {
        slug,
        analysisAccess: entry.analysisAccess,
        predictionAccess: entry.predictionAccess,
        full: entry.full,
        prediction: entry.prediction,
      };

      if (!needsVip) {
        return json(payload);
      }

      const supabaseUrl = env.SUPABASE_URL;
      const serviceKey = env.SUPABASE_SECRET_KEY;
      const publishableKey =
        env.SUPABASE_PUBLISHABLE_KEY ??
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !serviceKey || !publishableKey) {
        return json({ error: "unavailable" }, 503);
      }

      const token = (
        request.headers.get("Authorization") ?? ""
      )
        .replace(/^Bearer\s+/i, "")
        .trim();

      if (!token) {
        return json({ error: "unauthenticated" }, 401);
      }

      const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "GET",
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.ok) {
        return json({ error: "unauthenticated" }, 401);
      }

      const user = await userRes.json();

      if (!user?.id) {
        return json({ error: "unauthenticated" }, 401);
      }

      const profileUrl =
        `${supabaseUrl}/rest/v1/profiles` +
        `?id=eq.${encodeURIComponent(user.id)}` +
        `&select=plan,subscription_status`;

      const profileRes = await fetch(profileUrl, {
        method: "GET",
        headers: {
          apikey: serviceKey,
          Accept: "application/json",
        },
      });

      if (!profileRes.ok) {
        return json({ error: "unavailable" }, 503);
      }

      const profiles = await profileRes.json();
      const profile = Array.isArray(profiles) ? profiles[0] : null;

      if (!profile || !isVipRow(profile)) {
        return json({ error: "vip-required" }, 403);
      }

      return json(payload);
    } catch {
      return json({ error: "unavailable" }, 503);
    }
  };
}

export const onRequestGet = (context) =>
  createMatchContentHandler(contentIndex)(context);
