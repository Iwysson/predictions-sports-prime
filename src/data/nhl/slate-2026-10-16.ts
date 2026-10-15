import type { NhlPublicMatch } from '@/lib/nhl-slates';

// Home/away and date checked against the official NHL score API. Protected content is server-side only.
// PSP mandatory NHL publication rule (src/lib/nhl-publication-policy.ts): neither game below may become
// public before 00:00:00 on 2026-10-16 in America/Sao_Paulo. The BEST BET game stays protected after the
// gate too (PRIME VIP full content only); the FREE game shows its full prediction, odds and analysis
// once the gate is open.
export const NHL_PUBLIC_MATCHES_OCT_16: NhlPublicMatch[] = [
  {
    slug: "colorado-avalanche-vs-pittsburgh-penguins",
    title: "Colorado Avalanche × Pittsburgh Penguins",
    homeTeam: "Colorado Avalanche",
    awayTeam: "Pittsburgh Penguins",
    access: "best",
    badge: "BEST BET",
    teaser: "Colorado Avalanche host Pittsburgh Penguins on October 16. Unlock PRIME VIP for the prediction, odds and analysis.",
  },
  {
    // FREE tier, but its prediction/odds/analysis are intentionally NOT embedded here. This file is
    // imported by a client component, so anything placed in this object ships in the public JS bundle
    // the moment this changeset deploys - before the Sao Paulo gate, if the deploy happens before it.
    // The full content is served only through /api/match-content/anaheim-ducks-vs-boston-bruins (see
    // src/data/nhl/protected-2026-10-16.json), which is gated server-side by activeFromKey and fetched
    // unconditionally - no login required - by FreeMatchContent once the gate opens (src/components/MatchGate.tsx).
    slug: "anaheim-ducks-vs-boston-bruins",
    title: "Anaheim Ducks × Boston Bruins",
    homeTeam: "Anaheim Ducks",
    awayTeam: "Boston Bruins",
    access: "free",
    badge: "FREE TO VIEW",
    teaser: "Anaheim Ducks host Boston Bruins on October 16. Read the free prediction and full analysis.",
  },
];
