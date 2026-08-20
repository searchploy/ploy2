"use server";

import { revalidatePath } from "next/cache";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";

export type ModerationResult = { ok: true } | { ok: false; error: string };

/**
 * Every moderation action re-checks admin status here, on the server. The
 * admin dashboard's layout guard only hides the UI; this is what actually
 * stops a normal user from calling these. The employees RLS policies are the
 * second line of defence — an owner physically cannot write status =
 * 'published', so even a bypass of this check fails at the database.
 */
async function requireAdmin(): Promise<string | null> {
  if (!(await isAdminUser())) return null;
  const user = await getServerUser();
  return user?.id ?? null;
}

function revalidateListingSurfaces(slug?: string | null) {
  revalidatePath("/dashboard/admin/listings");
  revalidatePath("/account/marketplace/listing");
  revalidatePath("/marketplace");
  if (slug) revalidatePath(`/marketplace/${slug}`);
}

export async function approveListing(id: string): Promise<ModerationResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: "Not authorized." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employees")
    .update({
      status: "published",
      is_published: true,
      rejection_reason: null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidateListingSurfaces(data?.slug);
  return { ok: true };
}

export async function rejectListing(id: string, reason?: string): Promise<ModerationResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: "Not authorized." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employees")
    .update({
      status: "rejected",
      is_published: false,
      rejection_reason: reason?.trim() || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidateListingSurfaces(data?.slug);
  return { ok: true };
}

export async function deleteListingAsAdmin(id: string): Promise<ModerationResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: "Not authorized." };

  const supabase = await createClient();

  // Dependent rows first — favorites, report recommendations and analytics all
  // point at employees, and only report_recommendations.employee_id is
  // nullable. Clearing them keeps the report itself intact while removing the
  // listing everywhere it could still surface.
  const { data: existing } = await supabase.from("employees").select("slug").eq("id", id).maybeSingle();

  await supabase.from("favorites").delete().eq("employee_id", id);
  await supabase.from("report_recommendations").delete().eq("employee_id", id);
  await supabase.from("analytics_events").delete().eq("employee_id", id);
  await supabase.from("reviews").delete().eq("employee_id", id);
  await supabase.from("demo_requests").delete().eq("employee_id", id);

  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateListingSurfaces(existing?.slug);
  return { ok: true };
}

export async function setListingFeatured(id: string, featured: boolean): Promise<ModerationResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase.from("employees").update({ featured }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateListingSurfaces();
  return { ok: true };
}
