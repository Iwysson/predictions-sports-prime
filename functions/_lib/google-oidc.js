// Verifies a Google-signed OIDC token (RS256), as sent by a Pub/Sub push subscription
// configured with an authenticated push endpoint. See GOOGLE_PLAY_SETUP.md for how to
// configure the subscription so Google actually sends this header.
const JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

function base64urlToUint8Array(input) {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64 + "===".slice((b64.length + 3) % 4));
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function decodeJsonSegment(segment) {
  return JSON.parse(new TextDecoder().decode(base64urlToUint8Array(segment)));
}

let cachedJwks = null;
let cachedAt = 0;

async function fetchJwks() {
  if (cachedJwks && Date.now() - cachedAt < 10 * 60 * 1000) return cachedJwks;
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error(`jwks fetch ${res.status}`);
  cachedJwks = await res.json();
  cachedAt = Date.now();
  return cachedJwks;
}

// Returns the verified payload, or null if the token is missing, malformed, expired,
// wrongly audienced, not from Google, or not from the configured service account.
export async function verifyGoogleOidcToken(request, env) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerSeg, payloadSeg, signatureSeg] = parts;

  let header;
  let payload;
  try {
    header = decodeJsonSegment(headerSeg);
    payload = decodeJsonSegment(payloadSeg);
  } catch {
    return null;
  }

  if (payload.iss !== "https://accounts.google.com" && payload.iss !== "accounts.google.com") return null;
  if (!env.GOOGLE_PUBSUB_AUDIENCE || payload.aud !== env.GOOGLE_PUBSUB_AUDIENCE) return null;
  if (env.GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL && payload.email !== env.GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL) return null;
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || payload.exp < now) return null;

  const jwks = await fetchJwks();
  const jwk = jwks.keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signature = base64urlToUint8Array(signatureSeg);
  const signedData = new TextEncoder().encode(`${headerSeg}.${payloadSeg}`);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, signedData);
  return valid ? payload : null;
}
