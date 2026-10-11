import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

// Account pages are functional, not search destinations: kept out of the index and sitemap.
export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your Predictions Sports Prime account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
