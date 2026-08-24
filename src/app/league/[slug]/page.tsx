import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads";
import { JsonLd } from "@/components/JsonLd";
import { LiveLeagueRounds } from "@/components/LiveLeagueRounds";
import { LiveLeagueStandings } from "@/components/LiveLeagueStandings";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { standingsByLeague } from "@/data/standings";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { LeagueBadge } from "@/components/LeagueBadge";
import { LeaguePageText } from "@/components/LeaguePageText";
import { LeaguePublishedAnalysis } from "@/components/LeaguePublishedAnalysis";
import { toMatchPreview } from "@/lib/editorial";
import { loadLeagueSeason } from "@/lib/openfootball";
import { buildCompetitionRoundSurface } from "@/lib/competition-rounds";
import {
  leagueBreadcrumbJsonLd,
  leagueCanonicalPath,
  leagueCollectionJsonLd,
  leagueIntro,
  isLeagueIndexable,
  leagueSeoDescription,
  leagueSeoTitle,
} from "@/lib/league-seo";

export const dynamicParams = false;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const league = leagues.find((item) => item.slug === slug);

  if (!league) {
    return {
      title: "League not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = leagueSeoTitle(league);
  const description = leagueSeoDescription(league);
  const canonical = absoluteUrl(leagueCanonicalPath(league));
  const publishedMatchCount = matches.filter(
    (match) => match.league === league.slug && match.status === "published"
  ).length;

  return {
    title: {
      absolute: title,
    },
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: isLeagueIndexable(publishedMatchCount),
      follow: true,
    },

    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl("/og-default.png"),
          width: 1200,
          height: 630,
          alt: `${league.name} - ${siteConfig.name}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-default.png")],
    },
  };
}

export function generateStaticParams() {
  return leagues.map((league) => ({
    slug: league.slug,
  }));
}

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const league = leagues.find((item) => item.slug === slug);

  if (!league) {
    notFound();
  }

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
  const archivedPublishedMatches = [...publishedMatches]
    .filter((match) => !activePublishedSlugs.has(match.slug))
    .sort((left, right) =>
      (right.publishedAt ?? "").localeCompare(left.publishedAt ?? "") ||
      left.title.localeCompare(right.title)
    )
    .slice(0, 4);

  return (
    <>
      <JsonLd data={leagueCollectionJsonLd(league, publishedMatches)} />
      <JsonLd data={leagueBreadcrumbJsonLd(league)} />

      <section className="league-title-bar">
        <div className="container league-title-inner">
          <div className="league-title-copy">
            <span className="league-title-icon league-title-icon--logo"><LeagueBadge slug={league.slug} short={league.short} /></span>
            <div>
              <nav className="league-breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true">›</span>
                <span aria-current="page">{league.name}</span>
              </nav>
              <h1>{league.name} Predictions &amp; Betting Tips</h1>
            </div>
          </div>
          <span className="league-round-label">Current Round</span>
        </div>
      </section>

      <div className="container league-top-ad">
        <AdSlot placement="league-top" />
      </div>

      <div className="container">
        <p className="league-seo-intro">
          {leagueIntro(league, publishedMatches.length)}
        </p>
      </div>

      <section className="section league-content-section">
        <div className="container league-layout">
          <div className="league-main-column">
            <LeaguePageText matchCount={roundSurface.current?.matches.length ?? 0}>
              <LiveLeagueRounds surface={roundSurface} />
            </LeaguePageText>

            <LeaguePublishedAnalysis
              leagueName={league.name}
              matches={archivedPublishedMatches}
            />

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
