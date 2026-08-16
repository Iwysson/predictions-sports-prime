import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty-state">
        <strong>Page not found.</strong>
        <p>The match or league may not be published yet.</p>
        <Link className="button button--small" href="/">Back to Home</Link>
      </div>
    </section>
  );
}
