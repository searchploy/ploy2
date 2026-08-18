"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Building2, Briefcase, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { OTPInput } from "@/components/auth/otp-input";
import type { UserRole } from "@/lib/types/database";

// Map signup selection to user role
// business/agency users select "pro" → store as business role
// consultant users select "consulting" → store as consultant role
const roleFromParam = (value: string | null): UserRole =>
  value === "consulting" || value === "consultant" ? "consultant" : "business";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<UserRole>(roleFromParam(searchParams.get("role")));
  const [loading, setLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState("");
  const redirectTo = searchParams.get("redirect");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const fullName = String(formData.get("full_name"));
    const companyName = String(formData.get("company_name") ?? "");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, company_name: companyName },
        emailRedirectTo: undefined,
      },
    });

    setLoading(false);

    if (error) {
      toast.error("Couldn't create your account", { description: error.message });
      return;
    }

    setSignUpEmail(email);
    setShowCodeModal(true);
    toast.success("Account created", { description: "Check your email for the 6-digit code." });
  }

  async function handleVerifyCode() {
    if (verificationCode.length !== 6) {
      toast.error("Invalid code", { description: "Please enter a 6-digit code." });
      return;
    }

    setVerifyingCode(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: signUpEmail,
        token: verificationCode,
        type: "signup",
      });

      if (error) {
        toast.error("Invalid code", { description: error.message });
        setVerifyingCode(false);
        return;
      }

      // profiles.email_verified is mirrored from auth by a DB trigger — it is
      // deliberately not writable from the client.

      setShowCodeModal(false);
      setVerificationCode("");
      toast.success("Email confirmed!", { description: "Signing you in..." });

      setTimeout(() => {
        const destination = redirectTo || (role === "consultant" ? "/consultants" : "/pricing");
        router.push(destination);
      }, 500);
    } catch {
      toast.error("Verification failed", { description: "Please try again." });
      setVerifyingCode(false);
    }
  }

  return (
    <>
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-8 py-16">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-sm text-muted-foreground">Hire AI employees or list your agency&apos;s on Ploy.</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setRole("business")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-3.5 text-sm transition-colors",
                role === "business" ? "border-primary bg-secondary" : "border-border hover:bg-accent"
              )}
            >
              <Building2 className="h-5 w-5" />
              <span className="font-medium">Business/Agency</span>
              <span className="text-xs text-muted-foreground">Ploy Pro</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("consultant")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-3.5 text-sm transition-colors",
                role === "consultant" ? "border-primary bg-secondary" : "border-border hover:bg-accent"
              )}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Consultant</span>
              <span className="text-xs text-muted-foreground">Consulting Pro</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" required placeholder="Jane Cooper" />
            </div>
            {role !== "consultant" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="company_name">{role === "agency" ? "Agency name" : "Company name"}</Label>
                <Input id="company_name" name="company_name" required placeholder="Acme, Inc." />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@company.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
            </div>
            <Button type="submit" disabled={loading} className="mt-2" size="lg">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-foreground hover:text-ploy-blue">
              Sign in
            </Link>
          </p>
        </Card>
      </div>

      {/* Email Verification Code Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              We sent a 6-digit code to {signUpEmail}. Enter it below to confirm your email.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label className="text-center">6-digit code</Label>
              <OTPInput
                value={verificationCode}
                onChange={setVerificationCode}
                onComplete={handleVerifyCode}
                disabled={verifyingCode}
              />
            </div>

            <Button
              onClick={handleVerifyCode}
              disabled={verifyingCode || verificationCode.length !== 6}
              className="w-full"
              size="lg"
            >
              {verifyingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify code"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
