"use server";

import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/supabase/server";

export async function toggleEmployeeFavorite(employeeId: string) {
  const user = await getServerUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const supabase = await createClient();

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("profile_id", user.id)
    .eq("employee_id", employeeId)
    .single();

  if (existing) {
    // Remove favorite
    await supabase
      .from("favorites")
      .delete()
      .eq("profile_id", user.id)
      .eq("employee_id", employeeId);
    return { favorited: false };
  } else {
    // Add favorite
    await supabase.from("favorites").insert({
      profile_id: user.id,
      employee_id: employeeId,
    });
    return { favorited: true };
  }
}

export async function isEmployeeFavorited(employeeId: string) {
  const user = await getServerUser();
  if (!user) {
    return false;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("profile_id", user.id)
    .eq("employee_id", employeeId)
    .single();

  return !!data;
}
