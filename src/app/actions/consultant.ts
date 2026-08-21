"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Takes no user id: it used to accept one from the caller, which meant the
 * client chose whose row was written. The identity comes from the session.
 */
export async function markWelcomeModalSeen() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update({ has_seen_consultant_welcome: true })
    .eq("id", user.id);

  if (error) {
    console.error("Error marking welcome modal as seen:", error);
    throw error;
  }
}
