"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/auth/entitlements";
import {
  ROADMAP_REPORT_COLUMNS,
  loadPublishedListings,
  saveRoadmap,
  toRoadmapSource,
  type RecommendationRef,
  type RoadmapReportFields,
} from "@/lib/report/roadmap-data";

export type RoadmapActionResult = { ok: true } | { ok: false; error: string };

const GENERATION_FAILED = "Your roadmap couldn't be generated. Please try again.";

/**
 * The page's own gate doesn't reach this entry point, so authentication,
 * entitlement and ownership are all re-checked here.
 */
export async function generateRoadmapAction(reportId: string): Promise<RoadmapActionResult> {
  if (!z.string().uuid().safeParse(reportId).success) return { ok: false, error: GENERATION_FAILED };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to build your roadmap." };

  const entitlements = await getEntitlements();
  if (!entitlements.pro && !entitlements.isAdmin) {
    return { ok: false, error: "This roadmap is available with Ploy Pro." };
  }

  // Only the owner's own roadmap is written. An admin can read any report, but
  // saving one would write a row against an account they don't own.
  const { data: report } = await supabase
    .from("reports")
    .select(`profile_id, ${ROADMAP_REPORT_COLUMNS}`)
    .eq("id", reportId)
    .maybeSingle();
  if (!report || report.profile_id !== user.id) return { ok: false, error: GENERATION_FAILED };

  const { data: withinLimit } = await supabase.rpc("check_rate_limit", {
    bucket: `roadmap:${user.id}`,
    max_hits: 20,
    window_seconds: 3600,
  });
  if (withinLimit === false) {
    return { ok: false, error: "You've rebuilt this a lot just now. Please try again in a little while." };
  }

  try {
    const { data: recs, error: recsError } = await supabase
      .from("report_recommendations")
      .select("employee_id, priority")
      .eq("report_id", reportId)
      .order("priority", { ascending: true });
    if (recsError) throw recsError;

    const refs = (recs ?? []) as RecommendationRef[];
    const listings = await loadPublishedListings(
      supabase,
      refs.map((r) => r.employee_id).filter((id): id is string => Boolean(id))
    );
    const source = toRoadmapSource(report as unknown as RoadmapReportFields, refs, listings);
    const { error } = await saveRoadmap(supabase, reportId, source);
    if (error) throw error;
  } catch (error) {
    console.error("Failed to generate roadmap:", error);
    return { ok: false, error: GENERATION_FAILED };
  }

  revalidatePath(`/report/${reportId}`);
  return { ok: true };
}
