import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads";
import { LiveLeagueRounds } from "@/components/LiveLeagueRounds";
import { LiveLeagueStandings } from "@/components/LiveLeagueStandings";
import { LeagueBadge } from "@/components/LeagueBadge";
import { LeaguePageText } from "@/components/LeaguePageText";
import { LeaguePublishedAnalysis } from "@/components/LeaguePublishedAnalysis";
import { LeagueEditorialHub } from "@/components/LeagueEditorialHub";
import { fullyLocalizedMatchLocales } from "@/components/LocalizedMatchDetails";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { standingsByLeague } from "@/data/standings";
import { localizedAlternates } from "@/lib/international-seo";
import { absoluteUrl } from "@/lib/site-config";
import { toMatchPreview } from "@/lib/editorial";
import { findFixtureForPrediction, loadLeagueSeason } from "@/lib/openfootball";
import { buildCompetitionRoundSurface } from "@/lib/competition-rounds";
import { classifyFixture, isActiveFixtureState } from "@/lib/fixture-state";
import {
  indexableLocalizedHubLocaleSlugs,
  isIndexableLocalizedHubLocale,
  isSeoLocale,
  localePath,
  seoLocaleSlugs,
  seoLocales,
} from "@/lib/seo-locales";
import { isInternationalMatchExpansionEligible } from "@/lib/upcoming-match";

export const dynamicParams = false;
export function generateStaticParams() {
  return seoLocaleSlugs.flatMap((locale) =>
    leagues.map((league) => ({ locale, slug: league.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const league = leagues.find((item) => item.slug === slug);
  if (!isSeoLocale(locale) || !league) return { robots: { index: false, follow: false } };

  const copy = seoLocales[locale];
  const fullTitle = copy.leagueTitle(league.name);
  const title = fullTitle.length <= 70 ? fullTitle : fullTitle.split(" | ")[0];
  const description = copy.leagueDescription(league.name);
  const url = absoluteUrl(localePath(locale, `/league/${slug}/`));
  const indexable = isIndexableLocalizedHubLocale(locale);

  return {
    title: { absolute: title },
    description,
    alternates: indexable
      ? localizedAlternates(locale, `/league/${slug}/`, ["en", ...indexableLocalizedHubLocaleSlugs])
      : { canonical: url },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "Predictions Sports Prime",
      locale: copy.htmlLang,
    },
  };
}

export default async function LocalizedLeague({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isSeoLocale(locale)) notFound();

  const league = leagues.find((item) => item.slug === slug);
  if (!league) notFound();

  const copy = seoLocales[locale];
  const leagueMatches = matches
    .filter((match) => match.league === league.slug)
    .map(toMatchPreview);
  const publishedMatches = matches.filter(
    (match) => match.league === league.slug && match.status === "published"
  );
  const standings = standingsByLeague[league.slug];
  const fixtureRounds = await loadLeagueSeason(league.slug);
  const roundSurface = buildCompetitionRoundSurface({
    league: league.slug,
    rounds: fixtureRounds,
    publishedMatches: leagueMatches,
    now: new Date(),
  });

  const activePublishedSlugs = new Set(
    [
      ...(roundSurface.current?.matches ?? []),
      ...(roundSurface.next?.matches ?? []),
    ]
      .filter((match) => match.status === "published")
      .map((match) => match.slug)
  );

  const surfacedPublishedMatches = [...publishedMatches]
    .filter((match) => {
      if (activePublishedSlugs.has(match.slug)) return false;
      const fixture = findFixtureForPrediction(fixtureRounds, match);
      return fixture && isActiveFixtureState(classifyFixture(fixture));
    })
    .sort(
      (left, right) =>
        left.date.localeCompare(right.date) ||
        left.time.localeCompare(right.time) ||
        left.title.localeCompare(right.title)
    );

  const archivedPublishedMatches = [...publishedMatches]
    .filter((match) => {
      if (activePublishedSlugs.has(match.slug)) return false;
      const fixture = findFixtureForPrediction(fixtureRounds, match);
      return !fixture || !isActiveFixtureState(classifyFixture(fixture));
    })
    .sort(
      (left, right) =>
        (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "") ||
        left.title.localeCompare(right.title)
    )
    .slice(0, 4);

  const publishedAnalysisMatches = [
    ...surfacedPublishedMatches,
    ...archivedPublishedMatches,
  ];

  const localeSupportsExpandedMatches = fullyLocalizedMatchLocales.includes(
    locale as (typeof fullyLocalizedMatchLocales)[number]
  );
  const localizedMatchSlugs = localeSupportsExpandedMatches
    ? publishedMatches
        .filter((match) => isInternationalMatchExpansionEligible(match))
        .map((match) => match.slug)
    : [];

  return (
    <>
      <section className="league-title-bar">
        <div className="container league-title-inner">
          <div className="league-title-copy">
            <span className="league-title-icon league-title-icon--logo">
              <LeagueBadge slug={league.slug} short={league.short} />
            </span>
            <div>
              <nav className="league-breadcrumb" aria-label="Breadcrumb">
                <Link href={localePath(locale)}>{copy.today}</Link>
                <span aria-hidden="true">›</span>
                <span aria-current="page">{league.name}</span>
              </nav>
              <h1>{copy.leagueTitle(league.name).split(" | ")[0]}</h1>
            </div>
          </div>
          <span className="league-round-label">{copy.leagues}</span>
        </div>
      </section>

      <div className="container league-top-ad">
        <AdSlot placement="league-top" />
      </div>

      <div className="container">
        <p className="league-seo-intro">{copy.leagueIntro(league.name)}</p>
      </div>

      <section className="section league-content-section">
        <div className="container league-layout">
          <div className="league-main-column">
            <LeaguePageText matchCount={roundSurface.current?.matches.length ?? 0}>
              <LiveLeagueRounds
                surface={roundSurface}
                locale={locale}
                localizedMatchSlugs={localizedMatchSlugs}
              />
            </LeaguePageText>

            <LeaguePublishedAnalysis
              leagueName={league.name}
              matches={publishedAnalysisMatches}
              locale={locale}
              localizedMatchSlugs={localizedMatchSlugs}
            />

            <LeagueEditorialHub
              leagueName={league.name}
              publishedMatches={publishedMatches}
              surface={roundSurface}
              locale={locale}
              localizedMatchSlugs={localizedMatchSlugs}
            />

            <section className="section section--compact">
              <h2>{copy.methodology}</h2>
              <p>{copy.leagueMethodology}</p>
            </section>

            <div className="league-bottom-ad">
              <AdSlot placement="league-middle" />
            </div>
          </div>

          <aside className="league-sidebar">
            {league.display.showStandings ? (
              <LiveLeagueStandings
                league={league.slug}
                fallbackRows={standings}
              />
            ) : null}

            <div className="league-side-ad">
              <AdSlot placement="league-sidebar" format="rectangle" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
