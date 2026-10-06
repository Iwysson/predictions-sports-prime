import type { Metadata } from "next";
import { AccountPanel } from "@/components/auth/AccountPanel";

// Account pages are functional, not search destinations: kept out of the index and sitemap.
export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Predictions Sports Prime account and VIP access.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountPanel />;
}
