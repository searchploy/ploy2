"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      toast.error("Couldn't sign you in", { description: error.message });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_type, email_verified")
      .eq("id", data.user.id)
      .single();

    const subscriptionType = (profile as { subscription_type?: string; email_verified?: boolean } | null)?.subscription_type ?? "pro";
    const emailVerified = (profile as { subscription_type?: string; email_verified?: boolean } | null)?.email_verified ?? false;

    // If email not verified, go to verification page
    if (!emailVerified) {
      router.push("/verify-email");
      return;
    }

    // Route based on subscription type to appropriate dashboard
    router.push(subscriptionType === "consulting" ? "/dashboard/consultant" : "/dashboard/pro");
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
            <Input id="email" name="email" type="email" required placeholder="jane@company.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={loading} className="mt-2" size="lg">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-foreground hover:text-ploy-blue">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
