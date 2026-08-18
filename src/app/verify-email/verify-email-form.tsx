"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { getServerUser } from "@/lib/supabase/server";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const redirectTo = searchParams.get("redirect") || "/dashboard/pro";

  useEffect(() => {
    const getEmail = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getEmail();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (resendTimer === 0 && resendLoading === false) {
      setCanResend(true);
    }
  }, [resendTimer, resendLoading]);

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      toast.error("Invalid code", { description: "Please enter a 6-digit code." });
      return;
    }

    setVerifyingCode(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: userEmail || "",
        token: verificationCode,
        type: "signup",
      });

      if (error) {
        toast.error("Invalid code", { description: error.message });
        setVerifyingCode(false);
        return;
      }

      // Mark email as verified in the profiles table
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        await supabase
          .from("profiles")
          .update({ email_verified: true, email_verified_at: new Date().toISOString() })
          .eq("id", user.id);
      }

      toast.success("Email verified!", { description: "Redirecting..." });
      setTimeout(() => {
        router.push(redirectTo);
      }, 500);
    } catch {
      toast.error("Verification failed", { description: "Please try again." });
      setVerifyingCode(false);
    }
  }

  async function handleResendCode() {
    if (!userEmail || !canResend) return;

    setResendLoading(true);
    setCanResend(false);
    setResendTimer(60);

    const supabase = createClient();
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userEmail,
      });

      if (error) {
        toast.error("Failed to resend code", { description: error.message });
        setResendLoading(false);
        setCanResend(true);
        setResendTimer(0);
        return;
      }

      toast.success("Code sent!", { description: "Check your email for a new verification code." });
    } catch (error) {
      toast.error("Error resending code", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setResendLoading(false);
      setCanResend(true);
      setResendTimer(0);
    }
  }

  return (
    <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-8 py-16">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-ploy-blue/10 p-3">
              <Mail className="h-6 w-6 text-ploy-blue" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            {userEmail ? `We sent a code to ${userEmail}` : "Enter the 6-digit code from your email"}
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
              disabled={verifyingCode}
              className="text-center text-lg tracking-widest"
            />
          </div>

          <Button type="submit" disabled={verifyingCode || verificationCode.length !== 6}>
            {verifyingCode ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="text-center text-sm text-muted-foreground">Didn&apos;t receive a code?</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={!canResend || resendLoading}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/sign-in" className="text-ploy-blue hover:underline">
            Back to sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
