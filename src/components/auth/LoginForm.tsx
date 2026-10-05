"use client";

import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AuthCard } from "./AuthCard";

export function LoginForm() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    router.push("/account/");
  }

  if (!loading && isAuthenticated) {
    return (
      <AuthCard
        title="You are signed in"
        intro="Your session is active on this device."
      >
        <Link className="button auth-primary-action" href="/account/">
          Go to My Account
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Login"
      intro="Sign in with the email and password linked to your account."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          autoComplete="email"
          id="login-email"
          name="email"
          required
          type="email"
        />

        <label htmlFor="login-password">Password</label>
        <input
          autoComplete="current-password"
          id="login-password"
          name="password"
          required
          type="password"
        />

        {error ? (
          <p className="auth-message auth-message--error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="button" disabled={submitting} type="submit">
          {submitting ? "Signing in…" : "Login"}
        </button>
      </form>

      <p className="auth-switch">
        No account yet? <Link href="/register/">Create one</Link>
      </p>
    </AuthCard>
  );
}
