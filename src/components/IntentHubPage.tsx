import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import type { IntentHubSlug } from "@/lib/intent-hubs";
import { IntentHubContent } from "@/components/IntentHubContent";
import { IntentHubDirectory } from "@/components/IntentHubDirectory";
import { selectTemporalClientMatches } from "@/lib/match-feed";
import { isDateReleased } from "@/lib/match-release";
import footballResults from "@/data/football-results.snapshot.json";
import { latestResults, type FootballResultsDataset } from "@/lib/football-results";

export async function IntentHubPage({ slug }: { slug: IntentHubSlug }) {
  const resolved = (await hydratePredictions(matches.map(toMatchPreview))).filter((match) => isDateReleased(match.date, undefined, match.releaseTimeZone));
  return (
    <IntentHubContent
      slug={slug}
      matches={selectTemporalClientMatches(resolved)}
      discovery={<IntentHubDirectory slug={slug} matches={resolved} />}
      results={slug === "football-predictions" ? latestResults(footballResults as FootballResultsDataset, 10) : []}
    />
  );
}
