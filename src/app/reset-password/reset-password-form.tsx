"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { MIN_PASSWORD_LENGTH, validatePassword } from "@/lib/auth/password";

/**
 * Second half of the reset flow. Arriving from the emailed link puts a
 * short-lived recovery session in place, which is what authorises the password
 * change — the form never takes a user id or token from the page itself, so a
 * visitor without a valid link cannot set anyone's password.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    // The client picks the recovery token out of the URL fragment on load.
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const confirm = String(form.get("confirm"));

    const problem = validatePassword(password);
    if (problem) {
      toast.error("Choose a stronger password", { description: problem });
      return;
    }
    if (password !== confirm) {
      toast.error("Those passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error("Couldn't update your password", {
        description: "Your reset link may have expired. Request a new one.",
      });
      return;
    }

    toast.success("Password updated. You're signed in.");
    router.push("/");
    router.refresh();
  }

  if (ready === false) {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold">This link isn&apos;t valid</h1>
        <p className="text-sm text-muted-foreground">
          Password reset links expire after a short time. Request a fresh one and try again.
        </p>
        <Button asChild className="mt-2">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-6 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a password you don&apos;t use anywhere else.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" disabled={loading || ready === null}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
