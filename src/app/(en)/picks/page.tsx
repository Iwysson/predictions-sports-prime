import { IntentHubPage } from "@/components/IntentHubPage";
import { intentHubMetadata } from "@/lib/intent-hubs";
export const metadata = intentHubMetadata("picks");
export default function Page() { return <IntentHubPage slug="picks" />; }
