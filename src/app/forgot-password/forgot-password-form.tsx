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
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const captcha = useRef<TurnstileHandle | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const email = String(new FormData(e.currentTarget).get("email")).trim();
    const supabase = createClient();

    await supabase.auth.resetPasswordForEmail(email, {
      captchaToken,
      // The link lands on our route handler, which exchanges the recovery code
      // for a session cookie and only then forwards to the reset form. Sending
      // it straight at /reset-password would leave the code unexchanged.
      //
      // No query string here on purpose: Supabase matches this against its
      // Redirect URLs allow list as a glob over the entire URL, and a trailing
      // `?next=...` fails that match and falls back to the Site URL.
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    // Errors are swallowed on purpose: surfacing "no such user" here would
    // turn this into an account-enumeration endpoint.
    captcha.current?.reset();
    setLoading(false);
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ploy-gold/10 text-ploy-gold">
          <MailCheck className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{sentTo}</span>. Check your inbox and
            follow the link to create a new password.
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
        <h1 className="text-2xl font-semibold">Forgot your password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email address</Label>
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
        <Turnstile onToken={setCaptchaToken} handleRef={captcha} />

        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-semibold text-foreground hover:text-ploy-gold">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
