import { accessBadgeKind, accessBadgeLabel } from "@/lib/match-access";

// Public status badge. It names the tier only; it never reveals the pick, odds or analysis.
export function AccessBadge({
  item,
  className = "",
}: {
  item: { analysisAccess?: "free" | "vip"; predictionAccess?: "free" | "vip"; bestAnalysis?: boolean };
  className?: string;
}) {
  const kind = accessBadgeKind(item);
  if (!kind) return null;
  return <span className={`access-badge access-badge--${kind} ${className}`.trim()}>{accessBadgeLabel[kind]}</span>;
}
