export const SEO_RELEASE_ID = process.env.SEO_RELEASE_ID?.trim() || "seo-wave-0-2026-09-07";

export const SEO_BASELINE_DATE = process.env.SEO_BASELINE_DATE?.trim() || "2026-09-07";

export const SEO_FEATURE_FLAG_NAMES = [
  "quality-gate-v2",
  "prediction-first-v2",
  "title-engine-v2",
  "international-index-v2",
  "intent-hubs-v1",
  "league-hubs-v2",
  "results-trust-v2",
  "freshness-engine-v1",
] as const;

export type SeoFeatureFlagName = (typeof SEO_FEATURE_FLAG_NAMES)[number];

const DEFAULT_FEATURE_FLAGS: Partial<Record<SeoFeatureFlagName, boolean>> = {
  "quality-gate-v2": true,
  "prediction-first-v2": true,
  "title-engine-v2": true,
};

function enabled(value: string | undefined, fallback = false) {
  if (value === undefined || value.trim() === "") return fallback;
  return /^(?:1|true|on|yes)$/i.test(value.trim());
}

function environmentName(name: SeoFeatureFlagName) {
  return `SEO_FEATURE_${name.replace(/-/g, "_").toUpperCase()}`;
}

export const SEO_FEATURE_FLAGS = Object.freeze(
  Object.fromEntries(
    SEO_FEATURE_FLAG_NAMES.map((name) => [name, enabled(process.env[environmentName(name)], DEFAULT_FEATURE_FLAGS[name])])
  ) as Record<SeoFeatureFlagName, boolean>
);

export function isSeoFeatureEnabled(name: SeoFeatureFlagName) {
  return SEO_FEATURE_FLAGS[name];
}

export const SEO_FEATURE_FLAG_ENV = Object.freeze(
  Object.fromEntries(SEO_FEATURE_FLAG_NAMES.map((name) => [name, environmentName(name)])) as Record<
    SeoFeatureFlagName,
    string
  >
);
