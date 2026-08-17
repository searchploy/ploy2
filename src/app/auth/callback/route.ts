import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Get the user's role to redirect appropriately
      const { data } = await supabase.auth.getUser();
      const userRole = data.user?.user_metadata?.role || "business";

      // Redirect based on role
      const roleBasedRedirect = userRole === "agency" ? "/for-agencies" : userRole === "consultant" ? "/consultants" : "/pricing";
      return NextResponse.redirect(new URL(roleBasedRedirect, request.url));
    }
  }

  // If there was an error, redirect to sign-in
  return NextResponse.redirect(new URL("/sign-in?error=confirmation_failed", request.url));
}
