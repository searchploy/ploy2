import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div className="container flex max-w-md flex-col justify-center py-20">
      <ForgotPasswordForm />
    </div>
  );
}
