import Link from "@/components/DocumentLink";

// Sport hubs for the English home: the main leagues and sports with a dedicated page.
// Plain links, no computed content: each destination shows its own status.
const hubs = [
  { href: "/league/brasileirao-serie-a/", title: "Brasileirão Série A", text: "Round 29: 10 matches, 7–8 October 2026." },
  { href: "/nhl/", title: "NHL", text: "Nine games on Tuesday, 6 October 2026." },
  { href: "/nfl/", title: "NFL", text: "Weekly picks, matchups and standings." },
];

export function HomeSportsHubs() {
  return (
    <section className="section section--compact" aria-label="Sports">
      <div className="container">
        <div className="section-heading section-heading--compact">
          <div>
            <span className="eyebrow">Sports</span>
            <h2>Browse by sport</h2>
          </div>
        </div>
        <div className="psp-hub-grid">
          {hubs.map((hub) => (
            <Link className="psp-hub-card" href={hub.href} key={hub.href}>
              <strong>{hub.title}</strong>
              <span>{hub.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
