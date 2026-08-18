"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/auth/otp-input";
import { createClient } from "@/lib/supabase/client";

interface LoginOTPFormProps {
  email: string;
  onBack: () => void;
  loading?: boolean;
}

export function LoginOTPForm({ email, onBack, loading: externalLoading = false }: LoginOTPFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpError, setOtpError] = useState(false);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (resendTimer === 0 && resendLoading === false) {
      setCanResend(true);
    }
  }, [resendTimer, resendLoading]);

  const handleVerifyCode = async (code: string) => {
    if (code.length !== 6) return;

    setVerifyingCode(true);
    setOtpError(false);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (error) {
        toast.error("Invalid code", { description: error.message });
        setOtpError(true);
        setVerifyingCode(false);
        return;
      }

      // Verify session was established
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication failed", { description: "Please try again." });
        setVerifyingCode(false);
        return;
      }

      // Get user profile to determine dashboard
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_type")
        .eq("id", user.id)
        .single();

      const subscriptionType = (profile as { subscription_type?: string } | null)?.subscription_type ?? "pro";

      toast.success("Welcome back!", { description: "Redirecting to dashboard..." });

      setTimeout(() => {
        router.push(subscriptionType === "consulting" ? "/dashboard/consultant" : "/dashboard/pro");
      }, 500);
    } catch (error) {
      toast.error("Verification failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setOtpError(true);
      setVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setCanResend(false);
    setResendTimer(60);
    setOtpError(false);
    setOtp("");

    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        toast.error("Failed to resend code", { description: error.message });
        setResendLoading(false);
        setCanResend(true);
        setResendTimer(0);
        return;
      }

      toast.success("Code sent!", { description: "Check your email for a new verification code." });
      setResendLoading(false);
    } catch (error) {
      toast.error("Error resending code", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setResendLoading(false);
      setCanResend(true);
      setResendTimer(0);
    }
  };

  // Mask email for privacy
  const maskEmail = (emailAddress: string) => {
    const [localPart, domain] = emailAddress.split("@");
    if (localPart.length <= 2) {
      return `${localPart}***@${domain}`;
    }
    return `${localPart.slice(0, 2)}***@${domain}`;
  };

  const isLoading = externalLoading || verifyingCode;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <div className="mb-2 flex justify-center">
          <div className="rounded-full bg-ploy-blue/10 p-3">
            <Mail className="h-6 w-6 text-ploy-blue" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold">Enter verification code</h2>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to {maskEmail(email)}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex flex-col gap-2">
        <Label className="text-center text-sm font-medium">Verification Code</Label>
        <OTPInput
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setOtpError(false);
          }}
          onComplete={handleVerifyCode}
          disabled={isLoading}
          error={otpError}
          autoFocus
        />
        {otpError && (
          <p className="text-center text-sm text-destructive">Invalid code. Please try again.</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        onClick={() => handleVerifyCode(otp)}
        disabled={isLoading || otp.length !== 6}
        className="w-full"
        size="lg"
      >
        {verifyingCode ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Code"
        )}
      </Button>

      {/* Resend Code */}
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <p className="text-center text-sm text-muted-foreground">Didn&apos;t receive a code?</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleResendCode}
          disabled={!canResend || resendLoading || isLoading}
          className="w-full"
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
        </Button>
      </div>

      {/* Back Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        disabled={isLoading}
        className="w-full text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to sign in
      </Button>
    </div>
  );
}
