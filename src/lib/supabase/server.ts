import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Profile } from "@/lib/types/database";

/**
 * Server-side Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Reads/writes the auth cookie via Next's cookies() API.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no request context —
            // safe to ignore when middleware is refreshing the session.
          }
        },
      },
    }
  );
}

/**
 * Returns the authenticated app-level user profile (public.profiles row),
 * or null if there is no active session. Used by dashboard layouts to
 * gate access and resolve role.
 *
 * Returns null (instead of throwing) when Supabase isn't configured yet,
 * so pages that call this during local preview degrade gracefully rather
 * than crashing.
 */
export async function getServerUser(): Promise<Profile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  // Supabase Auth is the source of truth for email verification. The profiles
  // column is only a mirror (kept in sync by a trigger), so never let a stale
  // `false` there lock out a user Auth already confirmed.
  return { ...profile, email_verified: Boolean(user.email_confirmed_at) };
}
