import { matches } from "@/data/matches";
import { toMatchPreview } from "@/lib/editorial";
import { hydratePredictions } from "@/lib/live-predictions";
import type { IntentHubSlug } from "@/lib/intent-hubs";
import { IntentHubContent } from "@/components/IntentHubContent";
import { IntentHubDirectory } from "@/components/IntentHubDirectory";
import { AllCompetitions } from "@/components/AllCompetitions";
import { selectTemporalClientMatches } from "@/lib/match-feed";

export async function IntentHubPage({ slug }: { slug: IntentHubSlug }) {
  const resolved = await hydratePredictions(matches.map(toMatchPreview));
  return <>
  <IntentHubContent
    slug={slug}
    matches={selectTemporalClientMatches(resolved)}
    discovery={<IntentHubDirectory slug={slug} matches={resolved} />}
  />
  {slug === "football-predictions" ? <AllCompetitions /> : null}
  </>;
}
