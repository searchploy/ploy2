import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/supabase/server";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
};

// Buttons across the site link straight to /sign-up?role=... without
// checking whether the visitor already has a session — "List an AI
// Employee", "Become a Consultant", and the agency free-tier CTA are all
// plain links, not client components that could check auth first. Rather
// than adding that check to every button (and every one added later), a
// signed-in visitor is bounced from here to where the button meant to send
// them, so the sign-up form itself never re-prompts someone who's already in.
const ROLE_DESTINATION: Record<string, string> = {
  agency: "/account/marketplace/listing",
  business: "/report",
  consultant: "/dashboard/consultant",
  consulting: "/dashboard/consultant",
};

// redirectTo comes straight from the query string. It has to start with a
// single "/" — a bare path, not "//evil.com" (browsers treat that as
// protocol-relative) and not an absolute "https://evil.com" — otherwise a
// crafted /sign-up?redirect= link could carry an authenticated visitor
// straight off the site.
function safeRedirect(path: string | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; redirect?: string }>;
}) {
  const { role, redirect: redirectTo } = await searchParams;
  const user = await getServerUser();

  if (user) {
    redirect(safeRedirect(redirectTo) || ROLE_DESTINATION[role ?? ""] || "/");
  }

  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
