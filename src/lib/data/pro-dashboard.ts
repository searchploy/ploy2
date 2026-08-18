import { createClient, getServerUser } from "@/lib/supabase/server";

/**
 * Everything the Ploy Pro dashboard renders, read from the live tables for the
 * signed-in user. Nothing here is mocked — if a value is absent the dashboard
 * shows an empty state rather than a placeholder number.
 *
 * Deliberately NOT included: marketplace views, referral clicks and placement
 * rank. `analytics_events` exists in the schema but nothing writes to it, and
 * there is no ranking logic, so those numbers cannot be reported honestly yet.
 */

export interface RecentReport {
  id: string;
  business_name: string | null;
  ai_readiness_score: number | null;
  status: string;
  created_at: string;
}

export interface SavedEmployee {
  favoriteId: string;
  id: string;
  name: string;
  slug: string;
  role: string;
  tagline: string | null;
  agency_name: string | null;
}

export interface MyListing {
  id: string;
  name: string;
  slug: string;
  role: string;
  tagline: string | null;
  status: string;
  is_published: boolean | null;
  thumbnail_url: string | null;
}

export interface ProDashboardData {
  reportCount: number;
  recentReports: RecentReport[];
  /** Readiness from the most recent completed report, or null if none. */
  latestReadiness: number | null;
  savedCount: number;
  savedEmployees: SavedEmployee[];
  listing: MyListing | null;
}

const EMPTY: ProDashboardData = {
  reportCount: 0,
  recentReports: [],
  latestReadiness: null,
  savedCount: 0,
  savedEmployees: [],
  listing: null,
};

export async function getProDashboardData(): Promise<ProDashboardData> {
  const user = await getServerUser();
  if (!user) return EMPTY;

  const supabase = await createClient();

  const [reportsRes, favoritesRes, listingRes] = await Promise.all([
    supabase
      .from("reports")
      .select("id, business_name, ai_readiness_score, status, created_at", { count: "exact" })
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("favorites")
      .select("id, created_at, employee:employees(id, name, slug, role, tagline, agency_name)", {
        count: "exact",
      })
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("employees")
      .select("id, name, slug, role, tagline, status, is_published, thumbnail_url")
      .eq("profile_id", user.id)
      .maybeSingle(),
  ]);

  const recentReports = (reportsRes.data ?? []) as RecentReport[];

  // Supabase types the embedded relation as an array; it is a single row here.
  const savedEmployees = (favoritesRes.data ?? []).flatMap((row) => {
    const employee = row.employee as unknown as Omit<SavedEmployee, "favoriteId"> | null;
    return employee ? [{ ...employee, favoriteId: row.id }] : [];
  });

  return {
    reportCount: reportsRes.count ?? recentReports.length,
    recentReports,
    latestReadiness: recentReports.find((r) => r.ai_readiness_score !== null)?.ai_readiness_score ?? null,
    savedCount: favoritesRes.count ?? savedEmployees.length,
    savedEmployees,
    listing: (listingRes.data as MyListing | null) ?? null,
  };
}
