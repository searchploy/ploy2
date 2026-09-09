import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-client";

/**
 * Landing point for the password reset email.
 *
 * Supabase glob-matches `redirectTo` against its Redirect URLs allow list over
 * the *whole* URL, query string included, so this deliberately takes no query
 * parameters — `/auth/callback?next=/reset-password` fails that match and gets
 * silently swapped for the Site URL, dropping the user on the homepage with a
 * code nothing consumes. Allow-list this exact path instead.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  // Supabase reports an unusable link (expired, already consumed, tampered) by
  // redirecting here with an error rather than a code.
  const linkError = searchParams.get("error") ?? searchParams.get("error_code");

  const target = new URL("/reset-password", request.url);

  if (linkError || !code) {
    target.searchParams.set("error", "link_invalid");
    return NextResponse.redirect(target);
  }

  const supabase = await createRouteClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    target.searchParams.set("error", "link_invalid");
  }

  return NextResponse.redirect(target);
}
