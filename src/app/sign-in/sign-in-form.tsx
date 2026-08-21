"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/constants";

/**
 * Returning users sign in with email + password only. No OTP — the 6-digit code
 * is exclusively for confirming a brand-new account at signup. Destination is a
 * convenience redirect; every dashboard re-checks authorization server-side.
 */
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const redirectTo = searchParams.get("redirect");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setLoading(false);
      toast.error("Invalid email or password", {
        description: "Check your details and try again.",
      });
      return;
    }

    // Auth is the source of truth for verification. Only a brand-new, never
    // confirmed account should ever see the verification screen.
    if (!data.user.email_confirmed_at) {
      router.push("/verify-email");
      return;
    }

    if (data.user.email === ADMIN_EMAIL) {
      router.push(redirectTo || "/dashboard/pro");
      return;
    }

    // Entitlements come from the subscriptions table — a user can own both
    // products, which profiles.subscription_type cannot represent.
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("type")
      .eq("profile_id", data.user.id)
      .eq("status", "active")
      .eq("plan", "pro");

    const owned = new Set((subs ?? []).map((s) => s.type));

    if (owned.has("pro")) {
      router.push(redirectTo || "/dashboard/pro");
    } else if (owned.has("consulting")) {
      router.push(redirectTo || "/dashboard/consultant");
    } else {
      router.push("/pricing");
    }
  }

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your Ploy account.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="jane@company.com"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2" size="lg">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-foreground hover:text-ploy-gold">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
