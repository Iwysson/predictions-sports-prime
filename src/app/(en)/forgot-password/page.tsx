import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

// Account pages are functional, not search destinations: kept out of the index and sitemap.
export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset the password for your Predictions Sports Prime account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
