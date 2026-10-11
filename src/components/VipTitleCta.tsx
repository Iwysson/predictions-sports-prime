import type { ReactNode } from "react";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";

export function VipTitleCta({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <div className="vip-title-row">
      <h1 id={id}>{children}</h1>
      <VipCheckoutButton className="vip-title-cta" label="PRIME VIP • Access the Best Predictions" />
    </div>
  );
}
