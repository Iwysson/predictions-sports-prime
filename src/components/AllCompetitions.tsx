import Link from "@/components/DocumentLink";
import { leagues } from "@/data/leagues";

// Static, always-rendered index of every competition page, so each league hub has at least one
// internal link regardless of how many fixtures are published for it today.
export function AllCompetitions() {
  return (
    <section className="section section--compact" aria-labelledby="all-competitions-title" data-all-competitions="true">
      <div className="container">
        <h2 id="all-competitions-title">All competitions</h2>
        <ul className="all-competitions">
          {leagues.map((league) => (
            <li key={league.slug}><Link href={`/league/${league.slug}/`}>{league.name} predictions</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
