import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <div className="container flex max-w-md flex-col justify-center py-20">
      <ResetPasswordForm />
    </div>
  );
}
