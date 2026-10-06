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

import contentIndex from "../../_data/match-content.json";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });

// Mirrors src/lib/vip.ts:
// plan === "vip" && subscription_status in ["trialing", "active"].
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

      // Both parts free: public content, no session needed.
      // Otherwise the analysis and/or prediction is VIP and needs
      // a verified VIP session.
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

      // VIP content:
      // 1. Check required Supabase environment variables.
      // 2. Validate the user's access token with Supabase Auth.
      // 3. Fetch the user's profile server-side with the secret key.
      // 4. Confirm VIP + active/trialing status.

      const supabaseUrl = env.SUPABASE_URL;
      const serviceKey = env.SUPABASE_SECRET_KEY;
      const publishableKey =
        env.SUPABASE_PUBLISHABLE_KEY ??
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !serviceKey || !publishableKey) {
        console.error("Missing Supabase environment variable", {
          SUPABASE_URL: Boolean(supabaseUrl),
          SUPABASE_SECRET_KEY: Boolean(serviceKey),
          SUPABASE_PUBLISHABLE_KEY: Boolean(publishableKey),
        });

        return json({ error: "unavailable" }, 503);
      }

      const authorization =
        request.headers.get("Authorization") ?? "";

      const token = authorization.replace(/^Bearer\s+/i, "").trim();

      if (!token) {
        console.warn("VIP request without bearer token", { slug });

        return json({ error: "unauthenticated" }, 401);
      }

      // Validate the current user token.
      const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "GET",
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.ok) {
        const errorBody = await userRes.text();

        console.error("Supabase auth user lookup failed", {
          slug,
          status: userRes.status,
          statusText: userRes.statusText,
          body: errorBody.slice(0, 500),
        });

        return json({ error: "unauthenticated" }, 401);
      }

      const user = await userRes.json();

      if (!user?.id) {
        console.error("Supabase auth response missing user id", {
          slug,
        });

        return json({ error: "unauthenticated" }, 401);
      }

      // Fetch only the fields required for VIP validation.
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
        const errorBody = await profileRes.text();

        console.error("Supabase profile lookup failed", {
          slug,
          userId: user.id,
          status: profileRes.status,
          statusText: profileRes.statusText,
          body: errorBody.slice(0, 500),
        });

        return json({ error: "unavailable" }, 503);
      }

      const profiles = await profileRes.json();
      const profile = Array.isArray(profiles) ? profiles[0] : null;

      if (!profile) {
        console.warn("Supabase profile not found", {
          slug,
          userId: user.id,
        });

        return json({ error: "vip-required" }, 403);
      }

      if (!isVipRow(profile)) {
        console.warn("User is not eligible for VIP content", {
          slug,
          userId: user.id,
          plan: profile?.plan ?? null,
          subscription_status:
            profile?.subscription_status ?? null,
        });

        return json({ error: "vip-required" }, 403);
      }

      console.log("VIP access confirmed", {
        slug,
        userId: user.id,
      });

      return json(payload);
    } catch (error) {
      console.error("Unhandled match-content error", {
        message:
          error instanceof Error
            ? error.message
            : String(error),
      });

      return json({ error: "unavailable" }, 503);
    }
  };
}

export const onRequestGet = (context) =>
  createMatchContentHandler(contentIndex)(context);
