import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

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
