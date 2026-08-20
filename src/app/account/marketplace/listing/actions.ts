"use server";

import { revalidatePath } from "next/cache";
import { createClient, getServerUser } from "@/lib/supabase/server";

export type ListingActionResult = { ok: true } | { ok: false; error: string };

/**
 * Deletes the caller's own listing. Scoped by profile_id here and again by the
 * employees_delete_own RLS policy, so a user can never delete someone else's.
 */
export async function deleteMyListing(): Promise<ListingActionResult> {
  const user = await getServerUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("employees")
    .select("id, slug")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!listing) return { ok: false, error: "You don't have a listing to delete." };

  // Dependent rows first so nothing keeps pointing at a listing that is gone.
  await supabase.from("favorites").delete().eq("employee_id", listing.id);
  await supabase.from("report_recommendations").delete().eq("employee_id", listing.id);
  await supabase.from("analytics_events").delete().eq("employee_id", listing.id);
  await supabase.from("reviews").delete().eq("employee_id", listing.id);
  await supabase.from("demo_requests").delete().eq("employee_id", listing.id);

  const { error } = await supabase.from("employees").delete().eq("id", listing.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/account/marketplace/listing");
  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${listing.slug}`);
  revalidatePath("/dashboard/admin/listings");
  return { ok: true };
}
