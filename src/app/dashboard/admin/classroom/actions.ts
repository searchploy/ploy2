"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import { logSecurityEvent } from "@/lib/auth/security-log";
import { revalidatePath } from "next/cache";

/**
 * Server actions are callable endpoints — hiding the admin UI does not stop
 * anyone invoking these. Neither of these checked who was calling; the only
 * thing standing in the way was an RLS policy testing a JWT claim Supabase
 * never issues, which denied everyone including the real admin.
 */
async function requireAdmin(action: string, targetId?: string) {
  if (!(await isAdminUser())) {
    await logSecurityEvent({
      action,
      outcome: "denied",
      targetType: "classroom_module",
      targetId,
      detail: { reason: "not_admin" },
    });
    throw new Error("Not authorized");
  }
}

export async function deleteModuleAction(formData: FormData) {
  const id = formData.get("id") as string;
  await requireAdmin("classroom.delete", id);
  const supabase = await createClient();

  const { error } = await supabase.from("classroom_modules").delete().eq("id", id);

  if (error) {
    console.error("Error deleting module:", error);
    throw new Error("Failed to delete module");
  }

  await logSecurityEvent({ action: "classroom.delete", targetType: "classroom_module", targetId: id });
  revalidatePath("/dashboard/admin/classroom");
}

export async function saveModuleAction(
  formData: FormData,
  moduleId?: string
) {
  await requireAdmin("classroom.save", moduleId);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const sortOrder = parseInt(formData.get("sort_order") as string, 10) || 0;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const supabase = await createClient();

  if (moduleId) {
    // Update existing module
    const { error } = await supabase
      .from("classroom_modules")
      .update({
        title,
        description,
        content,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", moduleId);

    if (error) {
      console.error("Error updating module:", error);
      throw new Error("Failed to update module");
    }
  } else {
    // Create new module
    const { error } = await supabase.from("classroom_modules").insert({
      title,
      description,
      content,
      sort_order: sortOrder,
    });

    if (error) {
      console.error("Error creating module:", error);
      throw new Error("Failed to create module");
    }
  }

  await logSecurityEvent({
    action: moduleId ? "classroom.update" : "classroom.create",
    targetType: "classroom_module",
    targetId: moduleId,
  });
  revalidatePath("/dashboard/admin/classroom");
  return { success: true };
}
