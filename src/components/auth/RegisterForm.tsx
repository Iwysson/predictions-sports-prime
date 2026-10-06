"use client";

import Link from "@/components/DocumentLink";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AuthCard } from "./AuthCard";

export function RegisterForm() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  // Frontend condition only: no new data is stored in the profile.
  const [notInBrazil, setNotInBrazil] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!notInBrazil) {
      setError("Please confirm that you are not located in Brazil to create an account.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login/`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    if (data.session) {
      router.push("/account/");
      return;
    }

    setConfirmationEmail(email);
    setSubmitting(false);
  }

  if (confirmationEmail) {
    return (
      <AuthCard
        title="Check your email"
        intro={`We sent a confirmation link to ${confirmationEmail}. Confirm your email, then log in.`}
      >
        <Link className="button auth-primary-action" href="/login/">
          Go to Login
        </Link>
      </AuthCard>
    );
  }

  if (!loading && isAuthenticated) {
    return (
      <AuthCard
        title="Account created"
        intro="You are already signed in on this device."
      >
        <Link className="button auth-primary-action" href="/account/">
          Go to My Account
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create account"
      intro="Register with your email. New accounts start on the free plan."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="register-email">Email</label>
        <input
          autoComplete="email"
          id="register-email"
          name="email"
          required
          type="email"
        />

        <label htmlFor="register-password">Password</label>
        <input
          autoComplete="new-password"
          id="register-password"
          minLength={6}
          name="password"
          required
          type="password"
        />

        <label htmlFor="register-password-confirmation">Confirm password</label>
        <input
          autoComplete="new-password"
          id="register-password-confirmation"
          minLength={6}
          name="confirmPassword"
          required
          type="password"
        />

        {error ? (
          <p className="auth-message auth-message--error" role="alert">
            {error}
          </p>
        ) : null}

        <label className="auth-checkbox" htmlFor="register-not-in-brazil">
          <input
            checked={notInBrazil}
            id="register-not-in-brazil"
            name="notInBrazil"
            onChange={(event) => setNotInBrazil(event.target.checked)}
            required
            type="checkbox"
          />
          <span>I confirm that I am not located in Brazil and that I am permitted to access this service under the laws applicable to me.</span>
        </label>

        <button className="button" disabled={submitting || !notInBrazil} type="submit">
          {submitting ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link href="/login/">Login</Link>
      </p>
    </AuthCard>
  );
}
