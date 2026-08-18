import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyEmailForm } from "./verify-email-form";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
