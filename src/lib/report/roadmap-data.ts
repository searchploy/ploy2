import { createHash } from "node:crypto";
import type { createClient } from "@/lib/supabase/server";
import {
  ROADMAP_ENGINE_VERSION,
  buildDetailedRoadmap,
  type DetailedRoadmap,
  type RoadmapListing,
  type RoadmapSource,
} from "@/lib/report/roadmap";

type Db = Awaited<ReturnType<typeof createClient>>;

export const ROADMAP_REPORT_COLUMNS =
  "business_name, industry, employee_count, revenue_range, departments, current_software, pain_points, goals, ai_readiness_score, estimated_hours_saved_monthly, estimated_annual_savings";

export interface RoadmapReportFields {
  business_name: string | null;
  industry: string | null;
  employee_count: string | null;
  revenue_range: string | null;
  departments: string[] | null;
  current_software: string[] | null;
  pain_points: string[] | null;
  goals: string[] | null;
  ai_readiness_score: number | null;
  estimated_hours_saved_monthly: number | null;
  estimated_annual_savings: number | string | null;
}

export interface RecommendationRef {
  employee_id: string | null;
  priority: number;
}

export type PublishedListing = RoadmapListing & { slug: string };

export interface SavedRoadmap {
  roadmap: DetailedRoadmap;
  engineVersion: number;
  sourceFingerprint: string;
  generatedAt: string;
}

const toNumber = (v: unknown) => (v == null || v === "" ? null : Number(v));

/** Published listings only: an unpublished or deleted listing drops out of the roadmap. */
export async function loadPublishedListings(db: Db, employeeIds: string[]): Promise<Map<string, PublishedListing>> {
  const ids = [...new Set(employeeIds)];
  if (ids.length === 0) return new Map();

  const { data, error } = await db
    .from("employees")
    .select(
      "id, name, slug, role, integrations, setup_time, primary_tasks, business_problems, price_monthly, category:categories(slug)"
    )
    .in("id", ids)
    .eq("status", "published");
  if (error) throw error;

  const listings = new Map<string, PublishedListing>();
  for (const row of data ?? []) {
    const category = Array.isArray(row.category) ? row.category[0] : row.category;
    listings.set(row.id, {
      id: row.id,
      name: row.name,
      slug: row.slug,
      role: row.role ?? null,
      categorySlug: category?.slug ?? null,
      integrations: row.integrations ?? [],
      setupTime: row.setup_time ?? null,
      primaryTasks: row.primary_tasks ?? [],
      businessProblems: row.business_problems ?? [],
      priceMonthly: toNumber(row.price_monthly),
    });
  }
  return listings;
}

export function toRoadmapSource(
  report: RoadmapReportFields,
  recommendations: RecommendationRef[],
  listings: Map<string, PublishedListing>
): RoadmapSource {
  return {
    businessName: report.business_name,
    industry: report.industry,
    employeeCount: report.employee_count,
    revenueRange: report.revenue_range,
    departments: report.departments ?? [],
    currentSoftware: report.current_software ?? [],
    painPoints: report.pain_points ?? [],
    goals: report.goals ?? [],
    aiReadinessScore: report.ai_readiness_score,
    hoursSavedMonthly: report.estimated_hours_saved_monthly,
    annualSavings: toNumber(report.estimated_annual_savings),
    recommendations: recommendations.flatMap((r) => {
      const listing = r.employee_id ? listings.get(r.employee_id) : undefined;
      if (!listing) return [];
      const { slug: _slug, ...rest } = listing;
      return [{ priority: r.priority, listing: rest }];
    }),
  };
}

/** Changes whenever the report inputs, the engine or a recommended listing's data change. */
export function roadmapFingerprint(source: RoadmapSource): string {
  return createHash("sha256")
    .update(JSON.stringify({ engine: ROADMAP_ENGINE_VERSION, source }))
    .digest("hex");
}

/** Authorization is re-checked inside save_report_roadmap(); this never trusts the caller. */
export async function saveRoadmap(db: Db, reportId: string, source: RoadmapSource) {
  const roadmap = buildDetailedRoadmap(source);
  const { error } = await db.rpc("save_report_roadmap", {
    p_report_id: reportId,
    p_engine_version: ROADMAP_ENGINE_VERSION,
    p_source_fingerprint: roadmapFingerprint(source),
    p_roadmap: roadmap,
  });
  return { error };
}

export function isRoadmapShape(value: unknown): value is DetailedRoadmap {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<DetailedRoadmap>;
  return (
    v.version === ROADMAP_ENGINE_VERSION &&
    Array.isArray(v.workflows) &&
    Array.isArray(v.targets) &&
    Array.isArray(v.impactByPhase) &&
    Boolean(v.thirty && v.ninety && v.year && v.governance)
  );
}

export async function loadSavedRoadmap(db: Db, reportId: string): Promise<SavedRoadmap | null> {
  const { data, error } = await db
    .from("report_roadmaps")
    .select("roadmap, engine_version, source_fingerprint, generated_at")
    .eq("report_id", reportId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    roadmap: data.roadmap as DetailedRoadmap,
    engineVersion: data.engine_version,
    sourceFingerprint: data.source_fingerprint,
    generatedAt: data.generated_at,
  };
}
