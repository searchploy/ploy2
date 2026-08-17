"use server";

import { createClient } from "@/lib/supabase/server";

export async function markWelcomeModalSeen(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ has_seen_consultant_welcome: true })
    .eq("id", userId);

  if (error) {
    console.error("Error marking welcome modal as seen:", error);
    throw error;
  }
}
