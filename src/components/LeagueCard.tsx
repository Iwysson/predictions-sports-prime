import Link from "@/components/DocumentLink";
import { LeagueBadge } from "@/components/LeagueBadge";

type Props = {
  slug: string;
  name: string;
  country: string;
  short: string;
  href?: string;
  displayLabel?: string;
};

// Individual league hub pages were retired (/league/<slug>/ now 301s to /football-predictions/):
// with no `href`, the card renders as a static, informational tile - same logos, names, colors,
// grid and spacing as before, just not a link. Pass `href` (e.g. to /nhl/ or /nba/) for the sports
// that still have their own category page.
export function LeagueCard({ slug, name, country, short, href, displayLabel }: Props) {
  const content = (
    <>
      <div className="league-symbol-wrap league-symbol-wrap--real">
        <LeagueBadge slug={slug} short={short} />
      </div>

      <div className="league-card-copy">
        <strong>{displayLabel ?? `${name} predictions`}</strong>
        <small>{country}</small>
      </div>

      {href ? <span className="arrow">→</span> : null}
    </>
  );

  return href ? (
    <Link href={href} className="league-card">
      {content}
    </Link>
  ) : (
    <div className="league-card league-card--static">{content}</div>
  );
}
