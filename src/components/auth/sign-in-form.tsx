"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface SignInFormProps {
  onPasswordVerified: (email: string) => void;
  loading?: boolean;
}

export function SignInForm({ onPasswordVerified, loading = false }: SignInFormProps) {
  const [localLoading, setLocalLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const supabase = createClient();

    // Verify email and password
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Invalid email or password", { description: error.message });
      setLocalLoading(false);
      return;
    }

    if (!data.user) {
      toast.error("Sign in failed", { description: "Please try again." });
      setLocalLoading(false);
      return;
    }

    // Password verified! Now sign out and send OTP
    await supabase.auth.signOut();

    // Send OTP for login
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    setLocalLoading(false);

    if (otpError) {
      toast.error("Couldn't send verification code", { description: otpError.message });
      return;
    }

    // Success - move to OTP verification
    toast.success("Verification code sent", { description: "Check your email for the code." });
    onPasswordVerified(email);
  }

  const isLoading = loading || localLoading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="jane@company.com"
          disabled={isLoading}
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="mt-2" size="lg">
        {isLoading ? "Signing in..." : "Continue"}
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-2 text-muted-foreground">Don't have an account?</span>
        </div>
      </div>

      <Button asChild variant="outline" size="lg">
        <Link href="/sign-up">Create account</Link>
      </Button>

      <div className="text-center">
        <Link href="#" className="text-sm text-ploy-blue hover:underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
