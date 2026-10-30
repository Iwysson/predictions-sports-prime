"use client";

import { useState } from "react";
import Link from "@/components/DocumentLink";
import { NhlHistory } from "@/components/NhlHistory";
import { NhlResultsSummary } from "@/components/NhlResultsSummary";
import { useNhlHistoryData } from "@/lib/use-nhl-history";

/**
 * Single fetch of the canonical NHL history, feeding both the compact /nhl/ track record and the
 * full, date-grouped NHL Prediction History. The full history is not mounted until the user clicks
 * "See All Results" — there is only ever one instance of it on the page, never a duplicate.
 */
export function NhlResultsSection() {
  const data = useNhlHistoryData();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <p className="nhl-history__cta">
        <strong>FOLLOW THE TRACK RECORD.</strong> See every NHL prediction, including PRIME VIP selections and BEST
        BETS, with results tracked transparently after the games finish.{" "}
        <Link href="#prime-vip-offer-title">Unlock PRIME VIP</Link>.
      </p>

      <NhlResultsSummary data={data} expanded={expanded} onToggleExpanded={() => setExpanded((v) => !v)} />

      {expanded ? <NhlHistory data={data} /> : null}
    </>
  );
}
