import type { ReactNode } from "react";
import { SiteContactLine } from "@/components/SiteContactLine";

export function AuthCard({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section className="section auth-page">
      <div className="container auth-container">
        <div className="auth-card">
          <header>
            <h1>{title}</h1>
            <p>{intro}</p>
            <SiteContactLine />
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
