// Merges the results bundled at deploy time with the newest ones committed by the sync workflow, so the public
// Results history updates without a deploy. The upstream file is data from our own repository, and it is still
// treated as untrusted: a settled record already shipped is immutable, only well-formed football records are
// accepted, and a failed or malformed fetch simply leaves the bundled history in place.
const RESULT_STATUSES = new Set(["green", "red", "push", "half-green", "half-red", "void"]);
const SETTLED_FIELDS = ["key", "league", "slug", "homeTeam", "awayTeam", "date", "predictionAccess", "prediction", "odds", "finalScore", "result", "settledAt"];
const PENDING_FIELDS = ["key", "league", "slug", "homeTeam", "awayTeam", "date", "predictionAccess", "prediction", "odds", "reason", "missing"];

const pick = (record, fields) => Object.fromEntries(fields.filter((field) => field in record).map((field) => [field, record[field]]));
const isDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const isIdentity = (record, key) =>
  record && record.key === key && typeof record.league === "string" && typeof record.slug === "string" &&
  typeof record.homeTeam === "string" && typeof record.awayTeam === "string" && isDate(record.date);

function isSettled(record, key) {
  if (!isIdentity(record, key) || !RESULT_STATUSES.has(record.result) || typeof record.prediction !== "string") return false;
  if (record.finalScore === null) return record.result === "void";
  return Number.isInteger(record.finalScore?.home) && Number.isInteger(record.finalScore?.away);
}

export function mergeResultsFeed(bundled, upstream) {
  const records = {};
  for (const [key, record] of Object.entries(upstream?.results?.records ?? {})) {
    if (isSettled(record, key)) records[key] = pick(record, SETTLED_FIELDS);
  }
  for (const [key, record] of Object.entries(bundled.results.records)) records[key] = pick(record, SETTLED_FIELDS);

  // The newest ledger wins, because a pending state is not history; anything settled leaves it.
  const upstreamPending = upstream?.pending?.records;
  const pendingSource = upstreamPending && typeof upstreamPending === "object" ? upstreamPending : bundled.pending.records;
  const pending = {};
  for (const [key, record] of Object.entries(pendingSource)) {
    if (!isIdentity(record, key) || records[key]) continue;
    pending[key] = pick(record, PENDING_FIELDS);
  }
  return { version: 1, records, pending };
}
