import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads";
import { MatchCard } from "@/components/MatchCard";
import { CompactStandings } from "@/components/CompactStandings";
import { LiveLeagueRound } from "@/components/LiveLeagueRound";
import { LiveLeagueStandings } from "@/components/LiveLeagueStandings";
import { leagues } from "@/data/leagues";
import { matches } from "@/data/matches";
import { standingsByLeague } from "@/data/standings";
import { LeagueSlug } from "@/types";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { LeagueBadge } from "@/components/LeagueBadge";
import { LeaguePageText } from "@/components/LeaguePageText";
import { toMatchPreview } from "@/lib/editorial";

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

  const title = `${league.name} Predictions, Fixtures & Table`;
  const description =
    `${league.name} football predictions, current fixtures, standings and manually written match analysis on ${siteConfig.name}.`;

  const canonical = absoluteUrl(`/league/${league.slug}/`);

  return {
    title,
    description,

    alternates: {
      canonical,
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

function isOpenDataLeague(
  slug: LeagueSlug
): slug is Exclude<LeagueSlug, "other-leagues"> {
  return slug !== "other-leagues";
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
  const standings = standingsByLeague[league.slug];

  return (
    <>
      <section className="league-title-bar">
        <div className="container league-title-inner">
          <div className="league-title-copy">
            <span className="league-title-icon league-title-icon--logo"><LeagueBadge slug={league.slug} short={league.short} /></span>
            <div>
              <span className="eyebrow">{league.country}</span>
              <h1>{league.name}</h1>
            </div>
          </div>
          <span className="league-round-label">Current Round</span>
        </div>
      </section>

      <div className="container league-top-ad">
        <AdSlot placement="league-top" />
      </div>

      <section className="section league-content-section">
        <div className="container league-layout">
          <div className="league-main-column">
            <LeaguePageText matchCount={leagueMatches.length}>
              {isOpenDataLeague(league.slug) ? (
              <LiveLeagueRound
                league={league.slug}
                manualMatches={leagueMatches}
              />
            ) : leagueMatches.length > 0 ? (
              <div className="league-match-list">
                {leagueMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <strong>No matches added yet.</strong>
                <p>
                  Add selected predictions in <code>src/data/predictions/</code>.
                </p>
              </div>
            )}
            </LeaguePageText>

            <div className="league-bottom-ad">
              <AdSlot placement="league-middle" />
            </div>
          </div>

          <aside className="league-sidebar">
            {isOpenDataLeague(league.slug) ? (
              <LiveLeagueStandings
                league={league.slug}
                fallbackRows={standings}
              />
            ) : (
              <CompactStandings
                leagueName={league.name}
                rows={standings}
              />
            )}

            <div className="league-side-ad">
              <AdSlot placement="league-sidebar" format="rectangle" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
