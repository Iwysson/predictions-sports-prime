const canonicalSiteUrl = "https://predictions-sports-prime.com";
const localSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteConfig = {
  name: "Predictions Sports Prime",
  shortName: "PSP",
  description:
    "Football, NFL and NHL predictions, betting tips and game analysis from Predictions Sports Prime, with published odds, identified sources and a transparent results record.",
  defaultTitle: "Football, NFL & NHL Predictions | Predictions Sports Prime",

  /*
   * IMPORTANT:
   * Production metadata must always use the canonical public origin. The
   * environment override exists only for local preview development.
   *
   * Example:
   * NEXT_PUBLIC_SITE_URL=http://localhost:3000
   *
   * Local development can override this with http://localhost:3000.
   */
  url:
    process.env.NODE_ENV === "production"
      ? canonicalSiteUrl
      : localSiteUrl || canonicalSiteUrl,

  locale: "en",
  fixtureTimezone: "America/Fortaleza",
  twitterCard: "summary_large_image" as const,
};

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
