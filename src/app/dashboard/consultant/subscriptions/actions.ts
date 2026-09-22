"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** Dollars in the form, cents in the column. Blank stays null rather than 0. */
function toCents(value: FormDataEntryValue | null, label: string): number | null {
  const raw = (value as string | null)?.trim();
  if (!raw) return null;
  const dollars = Number(raw);
  if (!Number.isFinite(dollars) || dollars < 0) throw new Error(`That ${label} isn't valid`);
  return Math.round(dollars * 100);
}

export async function deleteSubscriptionAction(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Scoped to the caller as well as the id, so this does not rely on RLS alone.
  await supabase
    .from("consultant_client_subscriptions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/consultant/subscriptions");
  revalidatePath("/dashboard/consultant");
}

export async function saveSubscriptionAction(formData: FormData, subscriptionId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const clientId = formData.get("clientId") as string;
  const employeeName = (formData.get("employeeName") as string)?.trim();
  const vendorName = ((formData.get("vendorName") as string) || "").trim() || null;
  const vendorUrl = ((formData.get("vendorUrl") as string) || "").trim() || null;
  const status = (formData.get("status") as string) || "Active";
  const notes = ((formData.get("notes") as string) || "").trim() || null;
  const startedOn = ((formData.get("startedOn") as string) || "").trim() || null;

  if (!clientId) throw new Error("Pick a client");
  if (!employeeName) throw new Error("AI tool name is required");

  const vendorCostCents = toCents(formData.get("vendorCost"), "vendor cost");
  const setupFeeCents = toCents(formData.get("setupFee"), "setup fee");
  const monthlyFeeCents = toCents(formData.get("monthlyFee"), "monthly fee");

  // The insert policy checks this too. Doing it here as well means a bad
  // client_id fails with a readable error instead of an RLS rejection.
  const { data: client } = await supabase
    .from("consultant_clients")
    .select("id")
    .eq("id", clientId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!client) throw new Error("That client doesn't exist");

  const row = {
    client_id: clientId,
    employee_name: employeeName,
    vendor_name: vendorName,
    vendor_url: vendorUrl,
    vendor_cost_cents: vendorCostCents,
    setup_fee_cents: setupFeeCents,
    monthly_fee_cents: monthlyFeeCents,
    status,
    notes,
    started_on: startedOn,
  };

  if (subscriptionId) {
    await supabase
      .from("consultant_client_subscriptions")
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq("id", subscriptionId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("consultant_client_subscriptions")
      .insert({ ...row, user_id: user.id });
  }

  revalidatePath("/dashboard/consultant/subscriptions");
  revalidatePath("/dashboard/consultant");
  redirect("/dashboard/consultant/subscriptions");
}
