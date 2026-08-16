import Link from "next/link";
import { LeagueBadge } from "@/components/LeagueBadge";

type Props = {
  slug: string;
  name: string;
  country: string;
  short: string;
};

export function LeagueCard({ slug, name, country, short }: Props) {
  return (
    <Link href={`/league/${slug}`} className="league-card">
      <div className="league-symbol-wrap league-symbol-wrap--real">
        <LeagueBadge slug={slug} short={short} />
      </div>

      <div className="league-card-copy">
        <strong>{name}</strong>
        <small>{country}</small>
      </div>

      <span className="arrow">→</span>
    </Link>
  );
}
