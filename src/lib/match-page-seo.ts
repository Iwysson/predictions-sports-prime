import type { Metadata } from "next";
import { leaguesBySlug } from "@/data/leagues";
import { formatMatchDate } from "@/lib/match-access";
import type { MatchPageModel } from "@/lib/match-page-model";
import { localePath, seoLocales, type SeoLocale } from "@/lib/seo-locales";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import type { EditorialPrediction } from "@/types";

/**
 * Metadata for /match/[slug]/ (and the localized template). Everything here is public: the title, the
 * description and the Open Graph / Twitter tags are built from the teams, the competition, the kick-off
 * and the public teaser. They never contain the prediction, the odds or any premium analysis.
 *
 * Open Graph and Twitter are emitted per page on purpose: Next.js does not inherit them field by field
 * from the layout, and a page that omits them would publish the homepage's og:url / og:title.
 */

const DESCRIPTION_LIMIT = 158;

function clip(text: string, limit = DESCRIPTION_LIMIT) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[\s,;:.-]+$/, "")}…`;
}

export function matchMetaDescription(prediction: EditorialPrediction, model: MatchPageModel, locale: SeoLocale) {
  const view = model.view;
  const teaser = (view.teaser ?? "").trim();
  if (locale !== "en") return clip(teaser || view.heading);
  const league = leaguesBySlug[prediction.league]?.name ?? "the competition";
  const when = view.date ? `${formatMatchDate(view.date)}${view.time ? `, ${view.time} local time` : ""}` : null;
  const context = when ? `${league}, ${when}.` : `${league}.`;
  if (teaser.length >= 110) return clip(teaser);
  const lead = teaser || `${view.homeTeam} vs ${view.awayTeam} prediction and match analysis.`;
  return clip(`${lead.replace(/\s*$/, "")} ${context}`);
}

export function buildMatchPageMetadata({
  prediction,
  model,
  slug,
  locale,
  indexable,
}: {
  prediction: EditorialPrediction;
  model: MatchPageModel;
  slug: string;
  locale: SeoLocale;
  indexable: boolean;
}): Metadata {
  const canonical = absoluteUrl(localePath(locale, `/match/${slug}/`));
  // The page title keeps the full editorial phrase when it fits a search result; with long club names it falls
  // back to the shorter "Prediction & Odds" form. The H1 is unaffected.
  const title = model.seoTitle.length <= 70 ? model.seoTitle : `${prediction.homeTeam} vs ${prediction.awayTeam} Prediction & Odds`;
  const description = matchMetaDescription(prediction, model, locale);
  const league = leaguesBySlug[prediction.league]?.name ?? prediction.league;
  const image = {
    url: absoluteUrl("/og-default.png"),
    width: 1200,
    height: 630,
    alt: `${prediction.homeTeam} vs ${prediction.awayTeam} - ${league} - ${siteConfig.name}`,
  };
  return {
    // The title already names both teams and the market intent, so it carries no brand suffix.
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      ...(locale !== "en" ? { locale: seoLocales[locale].htmlLang } : {}),
      ...(prediction.publishedAt ? { publishedTime: prediction.publishedAt } : {}),
      ...(prediction.updatedAt ? { modifiedTime: prediction.updatedAt } : {}),
      section: league,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

/** Same-league fixtures, plus the soonest fixtures of other competitions, so a page never ends without next steps. */
export function relatedMatchEntries<T extends EditorialPrediction>(
  current: EditorialPrediction,
  currentSlug: string,
  pool: readonly T[],
  slugOf: (prediction: EditorialPrediction) => string,
  limits = { sameLeague: 4, other: 3 },
) {
  const others = pool.filter((item) => slugOf(item) !== currentSlug);
  const sameLeague = others.filter((item) => item.league === current.league);
  const rest = others
    .filter((item) => item.league !== current.league)
    .sort((left, right) => `${left.matchInfo?.date ?? ""}${left.matchInfo?.time ?? ""}`.localeCompare(`${right.matchInfo?.date ?? ""}${right.matchInfo?.time ?? ""}`));
  return { sameLeague: sameLeague.slice(0, limits.sameLeague), other: rest.slice(0, limits.other) };
}
