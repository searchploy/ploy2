"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteModuleAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();

  const { error } = await supabase.from("classroom_modules").delete().eq("id", id);

  if (error) {
    console.error("Error deleting module:", error);
    throw new Error("Failed to delete module");
  }

  revalidatePath("/dashboard/admin/classroom");
}

export async function saveModuleAction(
  formData: FormData,
  moduleId?: string
) {
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

  revalidatePath("/dashboard/admin/classroom");
  return { success: true };
}
