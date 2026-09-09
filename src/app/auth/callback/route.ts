import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-client";

/**
 * Only same-origin relative paths are accepted as a post-exchange destination.
 * Anything absolute (`https://evil.com`) or protocol-relative (`//evil.com`)
 * would turn this route into an open redirect.
 */
function safeNext(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

/**
 * Generic exchange of a Supabase email link for a session cookie, with an
 * optional `?next=` destination.
 *
 * Password recovery does not come through here: a `next` query parameter has
 * to be covered by a wildcard in the Redirect URLs allow list, so that flow
 * uses the fixed path at /auth/reset-password instead. Signup does not either
 * — new accounts confirm with a 6-digit OTP.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  // Supabase reports an unusable link (expired, already consumed, tampered) by
  // redirecting here with an error rather than a code.
  const linkError = searchParams.get("error") ?? searchParams.get("error_code");

  const failure = () => {
    if (!next) return new URL("/sign-in?error=confirmation_failed", request.url);
    const url = new URL(next, request.url);
    url.searchParams.set("error", "link_invalid");
    return url;
  };

  if (linkError || !code) {
    return NextResponse.redirect(failure());
  }

  const supabase = await createRouteClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(failure());
  }

  return NextResponse.redirect(new URL(next ?? "/", request.url));
}
