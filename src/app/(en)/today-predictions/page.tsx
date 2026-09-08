import { IntentHubPage } from "@/components/IntentHubPage";
import { intentHubMetadata } from "@/lib/intent-hubs";
export const metadata = intentHubMetadata("today-predictions");
export default function Page() { return <IntentHubPage slug="today-predictions" />; }
