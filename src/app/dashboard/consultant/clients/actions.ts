"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteClientAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Scoped to the caller as well as the id. RLS already restricts this to the
  // owner; matching on user_id here means the action does not depend on that
  // single layer holding.
  await supabase.from("consultant_clients").delete().eq("id", id).eq("user_id", user.id);

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
  const dealValue = formData.get("dealValue") as string | null;

  if (!businessName) throw new Error("Business name is required");

  // Only a closed deal carries a value. Reopening a client clears it so it
  // stops counting toward Est. Revenue.
  let dealValueCents: number | null = null;
  if (status === "Closed" && dealValue?.trim()) {
    const dollars = Number(dealValue);
    if (!Number.isFinite(dollars) || dollars < 0) throw new Error("That deal value isn't valid");
    dealValueCents = Math.round(dollars * 100);
  }

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
        deal_value_cents: dealValueCents,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId)
      // Ownership enforced here too, not only by RLS.
      .eq("user_id", user.id);
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
      deal_value_cents: dealValueCents,
    });
  }

  revalidatePath("/dashboard/consultant/clients");
  redirect("/dashboard/consultant/clients");
}
