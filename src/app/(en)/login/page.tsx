import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { BrazilAccessRestriction } from "@/components/BrazilAccessRestriction";

// Account pages are functional, not search destinations: kept out of the index and sitemap.
export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Predictions Sports Prime account.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <BrazilAccessRestriction variant="login" />
      <LoginForm />
    </>
  );
}
