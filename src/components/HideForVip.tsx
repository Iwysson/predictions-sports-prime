"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/auth/AuthProvider";

// The children are rendered on the server, so crawlers and signed-out readers get them in the initial
// HTML. A confirmed PRIME VIP member already sees the same facts inside the unlocked full analysis,
// so the public copy is removed for them instead of being shown twice.
export function HideForVip({ children }: { children: ReactNode }) {
  const { loading, isVip } = useAuth();
  if (!loading && isVip) return null;
  return <>{children}</>;
}
