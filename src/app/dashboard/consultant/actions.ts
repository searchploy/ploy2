"use server";

import { revalidatePath } from "next/cache";
import { createClient, getServerUser } from "@/lib/supabase/server";
import type { ContactStage, ContactType } from "@/lib/types/database";

async function requireConsultant() {
  const user = await getServerUser();
  if (!user || user.role !== "consultant") throw new Error("Not authorized");
  return user;
}

export async function addContactAction(formData: FormData) {
  const user = await requireConsultant();
  const supabase = await createClient();

  await supabase.from("consultant_contacts").insert({
    profile_id: user.id,
    type: String(formData.get("type") ?? "prospect") as ContactType,
    business_name: String(formData.get("business_name") ?? "").trim(),
    contact_name: String(formData.get("contact_name") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    source: String(formData.get("source") ?? "").trim() || null,
  });

  revalidatePath("/dashboard/consultant");
  revalidatePath("/dashboard/consultant/pipeline");
  revalidatePath("/dashboard/consultant/clients");
  revalidatePath("/dashboard/consultant/prospects");
}

export async function updateContactStageAction(contactId: string, stage: ContactStage) {
  const user = await requireConsultant();
  const supabase = await createClient();

  await supabase
    .from("consultant_contacts")
    .update({ stage })
    .eq("id", contactId)
    .eq("profile_id", user.id);

  const activityType =
    stage === "contacted" ? "contacted" : stage === "meeting_booked" ? "meeting_booked" : stage === "proposal_sent" ? "proposal_sent" : stage === "won" ? "deal_closed" : null;

  if (activityType) {
    await supabase.from("consultant_activities").insert({
      profile_id: user.id,
      contact_id: contactId,
      type: activityType,
    });
  }

  revalidatePath("/dashboard/consultant");
  revalidatePath("/dashboard/consultant/pipeline");
  revalidatePath("/dashboard/consultant/clients");
  revalidatePath("/dashboard/consultant/prospects");
}

export async function addTaskAction(formData: FormData) {
  const user = await requireConsultant();
  const supabase = await createClient();

  await supabase.from("consultant_tasks").insert({
    profile_id: user.id,
    title: String(formData.get("title") ?? "").trim(),
    due_date: String(formData.get("due_date") ?? "").trim() || null,
  });

  revalidatePath("/dashboard/consultant/tasks");
}

export async function toggleTaskAction(taskId: string, done: boolean) {
  const user = await requireConsultant();
  const supabase = await createClient();

  await supabase.from("consultant_tasks").update({ done }).eq("id", taskId).eq("profile_id", user.id);

  revalidatePath("/dashboard/consultant/tasks");
}

export async function addNoteAction(formData: FormData) {
  const user = await requireConsultant();
  const supabase = await createClient();

  const contactId = String(formData.get("contact_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!contactId || !body) return;

  await supabase.from("consultant_notes").insert({
    profile_id: user.id,
    contact_id: contactId,
    body,
  });

  revalidatePath("/dashboard/consultant/notes");
}
