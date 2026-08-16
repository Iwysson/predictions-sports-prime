export const siteConfig = {
  name: "Predictions Sports Prime",
  shortName: "PSP",
  description:
    "Independent football predictions, betting tips and manually written match analysis for major European leagues.",
  defaultTitle: "Football Predictions & Betting Tips | Predictions Sports Prime",

  /*
   * IMPORTANT:
   * Set NEXT_PUBLIC_SITE_URL in production.
   *
   * Example:
   * NEXT_PUBLIC_SITE_URL=https://predictionssportsprime.com
   *
   * Local development can override this with http://localhost:3000.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://predictions-sports-prime.pages.dev",

  locale: "en",
  twitterCard: "summary_large_image" as const,
};

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
