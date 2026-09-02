/**
 * PSP Prediction-First Search Intent Policy
 *
 * Organic acquisition must target predictions, betting tips, odds and match
 * analysis. Lineups, injuries, suspensions, kick-off, venue, referee and
 * weather remain useful on-page evidence/context, but must not be promoted as
 * standalone Search Intent in metadata, query expansion or SEO headings.
 */
export const predictionFirstSearchIntentPolicy = {
  primary: ["prediction", "betting", "odds", "analysis", "market"] as const,
  evidence: ["statistics", "form", "h2h", "xg", "shots", "corners", "standings"] as const,
  contextOnly: [
    "lineups",
    "teamNews",
    "injuries",
    "suspensions",
    "kickoff",
    "venue",
    "referee",
    "weather",
    "broadcast",
  ] as const,
} as const;

export const contextOnlyTodaySeoIntents = new Set([
  "lineups",
  "teamNews",
  "injuries",
] as const);

export const predictionFirstMetadataForbiddenPatterns = [
  /\b(?:probable|confirmed)?\s*lineups?\b/i,
  /\bteam[ -]?news\b/i,
  /\binjur(?:y|ies)\b/i,
  /\bsuspensions?\b/i,
  /\bkick[- ]?off(?: time)?\b/i,
  /\bvenue\b/i,
  /\bstadium\b/i,
  /\breferee\b/i,
  /\bweather\b/i,
  /\bescala(?:ção|ções)\b/i,
  /\bdesfalques?\b/i,
  /\bhorário\b/i,
  /\bestádio\b/i,
  /\balineaciones?\b/i,
  /\bbajas\b/i,
  /\bhorario\b/i,
  /\bestadio\b/i,
  /\bformazioni\b/i,
  /\bassenze\b/i,
  /\borario\b/i,
  /\bstadio\b/i,
  /\bcompositions?\b/i,
  /\babsents?\b/i,
  /\bhoraire\b/i,
  /\baufstellungen?\b/i,
  /\bausfälle\b/i,
  /\banstoßzeit\b/i,
  /\bstadion\b/i,
] as const;

export function containsContextOnlyMetadataIntent(value: string) {
  return predictionFirstMetadataForbiddenPatterns.some((pattern) => pattern.test(value));
}
