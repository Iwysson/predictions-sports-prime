/**
 * Scope of a set of settled results: how many there are and the match-date range they cover.
 * Dates are the stored ISO match dates (YYYY-MM-DD); nothing is inferred or extended.
 */
export function resultsScope(records: { date: string }[]) {
  const dates = records.map((record) => record.date).filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)).sort();
  return { count: records.length, firstDate: dates[0] ?? null, lastDate: dates[dates.length - 1] ?? null };
}

/** Human date for a stored ISO date, for example "7 October 2026". UTC-safe, no locale-dependent day shifts. */
export function formatScopeDate(isoDate: string) {
  const time = Date.parse(`${isoDate}T12:00:00Z`);
  return Number.isNaN(time) ? isoDate : new Date(time).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** Period label such as "7 October 2026 to 11 October 2026", built only from the dates present in the results. */
export function resultsScopeLabel(scope: ReturnType<typeof resultsScope>) {
  if (!scope.firstDate || !scope.lastDate) return null;
  return scope.firstDate === scope.lastDate
    ? formatScopeDate(scope.firstDate)
    : `${formatScopeDate(scope.firstDate)} to ${formatScopeDate(scope.lastDate)}`;
}
