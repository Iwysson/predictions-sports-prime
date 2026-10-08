import type { ReactNode } from "react";
import Link from "@/components/DocumentLink";

export function VipTitleCta({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div className="vip-title-row">
      <h1 id={id}>{children}</h1>
      <Link className="vip-title-cta" href="/login/">
        <span>PRIME VIP</span>
        <span aria-hidden="true">•</span>
        <span>Access the Best Predictions</span>
      </Link>
    </div>
  );
}
