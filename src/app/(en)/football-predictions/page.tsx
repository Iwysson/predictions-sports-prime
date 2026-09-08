import { IntentHubPage } from "@/components/IntentHubPage";
import { intentHubMetadata } from "@/lib/intent-hubs";
export const metadata = intentHubMetadata("football-predictions");
export default function Page() { return <IntentHubPage slug="football-predictions" />; }
