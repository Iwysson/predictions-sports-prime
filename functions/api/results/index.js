// GET /api/results/
// The public football Results history. Settled records are public on the website regardless of a prediction's
// original tier, so this needs no session. Reads the newest committed snapshots so a result appears as soon as
// the sync workflow records it, with no deploy; any upstream failure falls back to the bundled history.
import results from "../../../src/data/football-results.snapshot.json";
import pending from "../../../src/data/football-results-pending.snapshot.json";
import { mergeResultsFeed } from "../../_lib/results-feed.js";

const RAW_BASE = "https://raw.githubusercontent.com/Iwysson/predictions-sports-prime/main/src/data";

async function fetchSnapshot(fetcher, name) {
  try {
    const response = await fetcher(`${RAW_BASE}/${name}`, { cf: { cacheTtl: 120, cacheEverything: true } });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

export function createResultsHandler(fetcher = (...args) => fetch(...args)) {
  return async function handle() {
    const [upstreamResults, upstreamPending] = await Promise.all([
      fetchSnapshot(fetcher, "football-results.snapshot.json"),
      fetchSnapshot(fetcher, "football-results-pending.snapshot.json"),
    ]);
    const body = mergeResultsFeed({ results, pending }, { results: upstreamResults, pending: upstreamPending });
    return new Response(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  };
}

export const onRequestGet = createResultsHandler();
