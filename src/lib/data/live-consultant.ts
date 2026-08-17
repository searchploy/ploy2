import { createClient } from "@/lib/supabase/server";
import type { ConsultantContact, ConsultantTask, ConsultantNote, Report } from "@/lib/types/database";

export async function getConsultantContacts(profileId: string, type?: "prospect" | "client"): Promise<ConsultantContact[]> {
  const supabase = await createClient();
  let query = supabase.from("consultant_contacts").select("*").eq("profile_id", profileId).order("updated_at", { ascending: false });
  if (type) query = query.eq("type", type);
  const { data } = await query;
  return data ?? [];
}

export async function getConsultantContact(profileId: string, contactId: string): Promise<ConsultantContact | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultant_contacts")
    .select("*")
    .eq("profile_id", profileId)
    .eq("id", contactId)
    .maybeSingle();
  return data;
}

export async function getConsultantTasks(profileId: string): Promise<ConsultantTask[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultant_tasks")
    .select("*")
    .eq("profile_id", profileId)
    .order("done", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });
  return data ?? [];
}

export async function getConsultantNotes(profileId: string): Promise<(ConsultantNote & { contact: { business_name: string } | null })[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultant_notes")
    .select("*, contact:consultant_contacts(business_name)")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  return (data as (ConsultantNote & { contact: { business_name: string } | null })[] | null) ?? [];
}

export async function getConsultantReports(profileId: string): Promise<(Report & { contact: { id: string; business_name: string } | null })[]> {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("consultant_contacts")
    .select("id, business_name, report_id")
    .eq("profile_id", profileId)
    .not("report_id", "is", null);

  const reportIds = (contacts ?? []).map((c) => c.report_id).filter((id): id is string => Boolean(id));
  if (reportIds.length === 0) return [];

  const { data: reports } = await supabase.from("reports").select("*").in("id", reportIds);
  const contactByReport = new Map((contacts ?? []).map((c) => [c.report_id, { id: c.id, business_name: c.business_name }]));

  return (reports ?? []).map((r) => ({ ...r, contact: contactByReport.get(r.id) ?? null }));
}

export interface ConsultantStats {
  clients: number;
  prospects: number;
  businessesContacted: number;
  meetingsBooked: number;
  reportsGenerated: number;
  dealsClosed: number;
  revenueCents: number;
}

export async function getConsultantStats(profileId: string): Promise<ConsultantStats> {
  const supabase = await createClient();
  const [{ data: contacts }, { data: activities }] = await Promise.all([
    supabase.from("consultant_contacts").select("type, stage, deal_value_cents, report_id").eq("profile_id", profileId),
    supabase.from("consultant_activities").select("type").eq("profile_id", profileId),
  ]);

  const clients = (contacts ?? []).filter((c) => c.type === "client").length;
  const prospects = (contacts ?? []).filter((c) => c.type === "prospect").length;
  const dealsClosed = (contacts ?? []).filter((c) => c.stage === "won").length;
  const revenueCents = (contacts ?? [])
    .filter((c) => c.stage === "won")
    .reduce((sum, c) => sum + (c.deal_value_cents ?? 0), 0);
  const reportsGenerated = new Set((contacts ?? []).map((c) => c.report_id).filter(Boolean)).size;
  const businessesContacted = (activities ?? []).filter((a) => a.type === "contacted").length;
  const meetingsBooked = (activities ?? []).filter((a) => a.type === "meeting_booked").length;

  return { clients, prospects, businessesContacted, meetingsBooked, reportsGenerated, dealsClosed, revenueCents };
}
