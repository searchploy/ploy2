"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Turnstile, type TurnstileHandle } from "@/components/auth/turnstile";

/**
 * Sends a password reset link. The response is deliberately identical whether
 * or not the address has an account — telling the difference would let anyone
 * use this form to work out who has signed up.
 */
export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const captcha = useRef<TurnstileHandle | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const email = String(new FormData(e.currentTarget).get("email"));
    const supabase = createClient();

    await supabase.auth.resetPasswordForEmail(email, {
      captchaToken,
      // Where Supabase sends them after they click the link. The recovery
      // token arrives in the URL fragment and is exchanged for a session by
      // the Supabase client on that page.
      redirectTo: `${window.location.origin}/reset-password`,
    });

    // Errors are swallowed on purpose: surfacing "no such user" here would
    // turn this into an account-enumeration endpoint.
    captcha.current?.reset();
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ploy-gold/10 text-ploy-gold">
          <MailCheck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If that address has a Ploy account, we&apos;ve sent a link to reset your password. The
            link expires shortly, so use it soon.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-6 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>
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
          />
        </div>
        <Turnstile onToken={setCaptchaToken} handleRef={captcha} />

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-semibold text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
