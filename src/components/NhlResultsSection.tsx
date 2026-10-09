"use client";

import { NhlHistory } from "@/components/NhlHistory";
import { NhlResultsSummary } from "@/components/NhlResultsSummary";
import { useNhlHistoryData } from "@/lib/use-nhl-history";

/** Single fetch of the canonical NHL history, feeding both the compact /nhl/ summary and the full history. */
export function NhlResultsSection() {
  const data = useNhlHistoryData();
  return (
    <>
      <NhlResultsSummary data={data} />
      <NhlHistory data={data} />
    </>
  );
}
