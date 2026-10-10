import type { Metadata } from "next";
import { AccountPanel } from "@/components/auth/AccountPanel";

// Required by Google Play policy: a web URL where an account-deletion request can be
// made, reachable even without the app installed. Deliberately not linked from site
// navigation (kept discreet, per the request that created it) - it reuses the exact
// same AccountPanel as /account/, so deleting from here requires signing in first,
// exactly like the Android app's own Delete Account screen does.
export const metadata: Metadata = {
  title: "Delete Account",
  description: "Request deletion of your Predictions Sports Prime account and data.",
  robots: { index: false, follow: false },
};

export default function DeleteAccountPage() {
  return <AccountPanel />;
}
