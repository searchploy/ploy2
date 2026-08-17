import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
