"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteClientAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();

  await supabase.from("consultant_clients").delete().eq("id", id);

  revalidatePath("/dashboard/consultant/clients");
}

export async function saveClientAction(
  formData: FormData,
  clientId?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const businessName = formData.get("businessName") as string;
  const industry = formData.get("industry") as string;
  const contactName = formData.get("contactName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;

  if (!businessName) throw new Error("Business name is required");

  if (clientId) {
    await supabase
      .from("consultant_clients")
      .update({
        business_name: businessName,
        industry,
        contact_name: contactName,
        email,
        phone,
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId);
  } else {
    await supabase.from("consultant_clients").insert({
      user_id: user.id,
      business_name: businessName,
      industry,
      contact_name: contactName,
      email,
      phone,
      status,
      notes,
    });
  }

  revalidatePath("/dashboard/consultant/clients");
  redirect("/dashboard/consultant/clients");
}
