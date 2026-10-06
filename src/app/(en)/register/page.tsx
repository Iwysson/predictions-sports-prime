import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

// Account pages are functional, not search destinations: kept out of the index and sitemap.
export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Predictions Sports Prime account.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
