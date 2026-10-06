"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { isVip as isVipProfile } from "@/lib/vip";

export type UserPlan = "free" | "vip";

export type Profile = {
  plan: UserPlan;
  subscription_status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
};

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isVip: boolean;
  loading: boolean;
  profileError: string | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const requestVersion = useRef(0);

  const loadUser = useCallback(async (nextUser: User | null) => {
    const version = ++requestVersion.current;
    setLoading(true);
    setUser(nextUser);
    setProfileError(null);

    if (!nextUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("plan, subscription_status, trial_ends_at, current_period_end")
      .eq("id", nextUser.id)
      .maybeSingle();

    if (version !== requestVersion.current) return;

    if (error) {
      setProfile(null);
      setProfileError(error.message);
    } else {
      setProfile({
        // Only the database value can grant VIP access. Missing or unknown
        // values remain free on the client.
        plan: data?.plan === "vip" ? "vip" : "free",
        subscription_status:
          typeof data?.subscription_status === "string"
            ? data.subscription_status
            : null,
        trial_ends_at: typeof data?.trial_ends_at === "string" ? data.trial_ends_at : null,
        current_period_end:
          typeof data?.current_period_end === "string" ? data.current_period_end : null,
      });
      if (!data) {
        setProfileError("No profile row was returned for this account.");
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (active) void loadUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (active) void loadUser(session?.user ?? null);
      }
    );

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadUser]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAuthenticated: Boolean(user),
      isVip: isVipProfile(profile),
      loading,
      profileError,
      signOut,
    }),
    [loading, profile, profileError, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Ads are allowed only for a resolved, non-VIP visitor. While the session is
// loading, or outside the provider, ads stay unloaded (fail closed).
export function useAdsAllowed() {
  const context = useContext(AuthContext);
  return Boolean(context && !context.loading && !context.isVip);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
