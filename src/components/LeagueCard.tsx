import Link from "next/link";
import { LeagueBadge } from "@/components/LeagueBadge";

type Props = {
  slug: string;
  name: string;
  country: string;
  short: string;
  href?: string;
};

export function LeagueCard({ slug, name, country, short, href }: Props) {
  return (
    <Link href={href ?? `/league/${slug}/`} className="league-card">
      <div className="league-symbol-wrap league-symbol-wrap--real">
        <LeagueBadge slug={slug} short={short} />
      </div>

      <div className="league-card-copy">
        <strong>{name} predictions</strong>
        <small>{country}</small>
      </div>

      <span className="arrow">→</span>
    </Link>
  );
}
