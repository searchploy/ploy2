"use server";

import { revalidatePath } from "next/cache";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import { logSecurityEvent } from "@/lib/auth/security-log";
import type { Database } from "@/lib/types/database";

type ReportStatus = Database["public"]["Enums"]["listing_report_status"];

export type ReportModerationResult = { ok: true } | { ok: false; error: string };

/**
 * Same pattern as listing moderation: admin status is re-checked here rather
 * than inherited from the dashboard layout, and the listing_reports RLS
 * policies are the second line of defence — only is_admin() may update a row.
 */
async function requireAdmin(action: string, targetId?: string): Promise<string | null> {
  if (!(await isAdminUser())) {
    await logSecurityEvent({
      action,
      outcome: "denied",
      targetType: "listing_report",
      targetId,
      detail: { reason: "not_admin" },
    });
    return null;
  }
  const user = await getServerUser();
  return user?.id ?? null;
}

export async function updateListingReport(
  id: string,
  status: ReportStatus,
  adminNotes?: string
): Promise<ReportModerationResult> {
  const adminId = await requireAdmin("listing_report.update", id);
  if (!adminId) return { ok: false, error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("listing_reports")
    .update({
      status,
      admin_notes: adminNotes?.trim() || null,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  // The status itself is the useful signal — the note may contain details
  // about a business that don't belong in a security log.
  await logSecurityEvent({
    action: "listing_report.update",
    targetType: "listing_report",
    targetId: id,
    detail: { status },
  });

  revalidatePath("/dashboard/admin/listing-reports");
  return { ok: true };
}
