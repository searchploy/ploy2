import { createClient } from "@/lib/supabase/server";
import type { Agency, Category, Employee, Database } from "@/lib/types/database";

/**
 * Queries against the live Supabase schema (categories/employees/agencies).
 * Separate from `./employees.ts` etc., which still serve the pre-existing
 * marketplace/dashboard pages off mock data until those pages are rebuilt
 * against the live schema (marketplace-by-problem rebuild, dashboard wiring).
 * New surfaces — the homepage's problem taxonomy and the AI Report engine's
 * recommendation matching — read live data from day one via this module.
 */

export async function getLiveCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getLiveFeaturedEmployees(limit = 3): Promise<EmployeeWithCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("employees")
    .select("*, category:categories(slug, name, icon)")
    .eq("status", "published")
    .eq("featured", true)
    .order("avg_rating", { ascending: false })
    .limit(limit);
  return (data as EmployeeWithCategory[] | null) ?? [];
}

export type EmployeeWithCategory = Employee & {
  category: { slug: string; name: string; icon: string | null } | null;
  /**
   * Approved listing whose owner has an active Ploy Pro subscription. Always
   * resolved server-side from the subscriptions table — never accepted from
   * the client, and never stored on the listing row, so it switches off by
   * itself the moment a subscription lapses.
   */
  is_pro_boosted?: boolean;
};

/**
 * Ids of approved listings owned by an active Ploy Pro subscriber. One round
 * trip for the whole page — see pro_boosted_employee_ids() in migration 0016.
 */
export async function getProBoostedEmployeeIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("pro_boosted_employee_ids");
  // A boost is a bonus, not a correctness requirement: if this fails the
  // marketplace still renders, just without anyone boosted.
  if (error || !data) return new Set();
  return new Set((data as unknown as string[]) ?? []);
}

function withProBoost<T extends { id: string }>(rows: T[], boosted: Set<string>) {
  return rows.map((row) => ({ ...row, is_pro_boosted: boosted.has(row.id) }));
}

export async function getLivePublishedEmployees(): Promise<EmployeeWithCategory[]> {
  const supabase = await createClient();
  const [{ data }, boosted] = await Promise.all([
    supabase.from("employees").select("*, category:categories(slug, name, icon)").eq("status", "published"),
    getProBoostedEmployeeIds(),
  ]);
  return withProBoost((data as EmployeeWithCategory[] | null) ?? [], boosted);
}

/**
 * Every listing regardless of moderation state — admin surfaces only. RLS
 * (employees_select) still gates this: it returns everything only when
 * is_admin() is true, so a non-admin calling it sees just public + own rows.
 */
export async function getAllListingsForAdmin(): Promise<EmployeeWithCategory[]> {
  const supabase = await createClient();
  const [{ data }, boosted] = await Promise.all([
    supabase
      .from("employees")
      .select("*, category:categories(slug, name, icon)")
      .order("created_at", { ascending: false }),
    getProBoostedEmployeeIds(),
  ]);
  return withProBoost((data as EmployeeWithCategory[] | null) ?? [], boosted);
}

/**
 * A single listing for admin review — no status filter, unlike the public
 * getLiveEmployeeBySlug.
 */
export async function getListingByIdForAdmin(id: string): Promise<EmployeeWithCategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("employees")
    .select("*, category:categories(slug, name, icon)")
    .eq("id", id)
    .maybeSingle();
  return (data as EmployeeWithCategory | null) ?? null;
}

export async function getLiveEmployeeBySlug(slug: string): Promise<Employee | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("employees")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function getLiveEmployeesByIds(ids: string[]): Promise<Employee[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("employees").select("*").in("id", ids);
  return data ?? [];
}

export async function getLiveEmployeeBySlugWithCategory(slug: string): Promise<EmployeeWithCategory | null> {
  const supabase = await createClient();
  const [{ data }, boosted] = await Promise.all([
    supabase
      .from("employees")
      .select("*, category:categories(slug, name, icon)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle(),
    getProBoostedEmployeeIds(),
  ]);
  const employee = data as EmployeeWithCategory | null;
  if (!employee) return null;
  return { ...employee, is_pro_boosted: boosted.has(employee.id) };
}

export async function getLiveRelatedEmployees(employeeId: string, categoryId: string | null, limit = 3): Promise<Employee[]> {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("employees")
    .select("*")
    .eq("category_id", categoryId)
    .eq("status", "published")
    .neq("id", employeeId)
    .limit(limit);
  return data ?? [];
}

export async function getLiveAgencies(): Promise<Agency[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("agencies").select("*").order("avg_rating", { ascending: false });
  return data ?? [];
}

export async function getLiveAgencyBySlug(slug: string): Promise<Agency | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("agencies").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getLiveAgencyById(id: string): Promise<Agency | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("agencies").select("*").eq("id", id).maybeSingle();
  return data;
}

/** Employee ids recommended by a given report — used to show a "Report Match" tag in the marketplace. */
export async function getReportRecommendedEmployeeIds(reportId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("report_recommendations")
    .select("employee_id")
    .eq("report_id", reportId);
  return new Set((data ?? []).map((r) => r.employee_id).filter((id): id is string => Boolean(id)));
}

/** Get all reports with their recommendations (for admin dashboard) */
export async function getReportsWithRecommendations(): Promise<ReportWithRecommendations[]> {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("*, recommendations:report_recommendations(*)")
    .order("created_at", { ascending: false });
  return (reports as ReportWithRecommendations[] | null) ?? [];
}

export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type ReportRecommendation = Database["public"]["Tables"]["report_recommendations"]["Row"];
export type ReportWithRecommendations = Report & {
  recommendations?: ReportRecommendation[];
};
