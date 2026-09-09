"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { MIN_PASSWORD_LENGTH, validatePassword } from "@/lib/auth/password";

type Status = "checking" | "ready" | "invalid" | "done";

/**
 * Second half of the reset flow. Arriving from the emailed link puts a
 * short-lived recovery session in place, which is what authorises the password
 * change — the form never takes a user id or token from the page itself, so a
 * visitor without a valid link cannot set anyone's password.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    // The callback route reports an unusable link with ?error=; older
    // implicit-flow links put it in the fragment instead.
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (query.get("error") || hash.get("error")) {
      setStatus("invalid");
      return;
    }

    const supabase = createClient();

    // Normally the callback has already set the session cookie, so getSession
    // resolves immediately. The listener covers fragment-style links, where the
    // client parses the token out of the URL a moment after mount.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setStatus("ready");
    });

    supabase.auth.getSession().then(({ data }) => {
      setStatus((current) => (current === "ready" ? current : data.session ? "ready" : "invalid"));
    });

    return () => sub.subscription.unsubscribe();
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
      // A dropped recovery session is a different problem from a rejected
      // password, and needs a fresh link rather than another attempt.
      const sessionLost = error.status === 401 || error.message.toLowerCase().includes("session");
      if (sessionLost) {
        setStatus("invalid");
        return;
      }
      toast.error("Couldn't update your password", { description: error.message });
      return;
    }

    setStatus("done");
    // The recovery session has served its purpose — drop it so the new
    // password has to be used to get back in.
    await supabase.auth.signOut();
    router.refresh();
  }

  if (status === "checking") {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <p className="text-sm text-muted-foreground">Checking your reset link...</p>
      </Card>
    );
  }

  if (status === "invalid") {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold">Reset link expired</h1>
        <p className="text-sm text-muted-foreground">
          Please request a new password reset link.
        </p>
        <Button asChild className="mt-2">
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </Card>
    );
  }

  if (status === "done") {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ploy-gold/10 text-ploy-gold">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold">Password updated</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been successfully changed.
          </p>
        </div>
        <Button asChild className="mt-2" size="lg">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-6 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Create a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a new password for your Ploy account.
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
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
          <li>At least {MIN_PASSWORD_LENGTH} characters</li>
          <li>Mix in a capital, a number or a symbol</li>
          <li>Both passwords must match</li>
        </ul>

        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
