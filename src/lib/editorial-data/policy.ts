export const EDITORIAL_DATA_FRESHNESS = Object.freeze({
  fixtureMaximumAgeDays: 30,
  statisticsMaximumAgeDays: 7,
  projectedLineupMaximumAgeHours: 72,
  teamNewsMaximumAgeHours: 72,
});

export function ageMilliseconds(timestamp: string, now = new Date()) {
  const parsed = Date.parse(timestamp);
  return Number.isFinite(parsed) ? now.valueOf() - parsed : Number.POSITIVE_INFINITY;
}

export function isFresh(timestamp: string, maximumAgeMs: number, now = new Date()) {
  const age = ageMilliseconds(timestamp, now);
  return age >= 0 && age <= maximumAgeMs;
}
