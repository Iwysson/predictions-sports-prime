export const siteConfig = {
  name: "Predictions Sports Prime",
  shortName: "PSP",
  description:
    "Independent football match analysis and manually written sports predictions for major European leagues.",
  defaultTitle: "Predictions Sports Prime | Football Predictions & Match Analysis",

  /*
   * IMPORTANT:
   * Set NEXT_PUBLIC_SITE_URL in production.
   *
   * Example:
   * NEXT_PUBLIC_SITE_URL=https://predictionssportsprime.com
   *
   * Until then, local development uses localhost.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",

  locale: "en",
  twitterCard: "summary_large_image" as const,
};

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
