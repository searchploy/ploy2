"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { LoginOTPForm } from "@/components/auth/login-otp-form";

export default function SignInPage() {
  const [step, setStep] = useState<"email-password" | "otp">("email-password");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const handlePasswordVerified = (email: string) => {
    setVerifiedEmail(email);
    setStep("otp");
  };

  const handleBackToPassword = () => {
    setStep("email-password");
    setVerifiedEmail("");
  };

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold">
            {step === "email-password" ? "Welcome back" : "Verify your identity"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === "email-password"
              ? "Sign in to your Ploy account."
              : "Enter the verification code sent to your email."}
          </p>
        </div>

        {step === "email-password" ? (
          <SignInForm onPasswordVerified={handlePasswordVerified} />
        ) : (
          <LoginOTPForm email={verifiedEmail} onBack={handleBackToPassword} />
        )}
      </Card>
    </div>
  );
}
