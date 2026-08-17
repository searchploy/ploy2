"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLivePublishedEmployees } from "@/lib/data/live-marketplace";
import { generateReport, type ReportInput } from "@/lib/report/scoring";

/**
 * Scores the report deterministically, persists it (anonymous reports are
 * allowed — profile_id is null when there's no session), then redirects to
 * the results page. Recommendations are matched against the live, published
 * marketplace catalog so every "View in Marketplace" link resolves.
 */
export async function generateReportAction(input: ReportInput) {
  const catalog = await getLivePublishedEmployees();
  const scored = generateReport(input, catalog);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: report, error } = await supabase
    .from("reports")
    .insert({
      profile_id: user?.id ?? null,
      status: "complete",
      business_name: input.business_name || null,
      website: input.website || null,
      industry: input.industry || null,
      description: input.description || null,
      employee_count: input.employee_count || null,
      revenue_range: input.revenue_range || null,
      departments: input.departments,
      current_software: input.current_software,
      pain_points: input.pain_points,
      goals: input.goals,
      ai_readiness_score: scored.ai_readiness_score,
      automation_score: scored.automation_score,
      growth_score: scored.growth_score,
      estimated_annual_savings: scored.estimated_annual_savings,
      estimated_hours_saved_monthly: scored.estimated_hours_saved_monthly,
      estimated_monthly_investment: scored.estimated_monthly_investment,
      estimated_roi_percent: scored.estimated_roi_percent,
      biggest_bottlenecks: scored.biggest_bottlenecks,
      recommended_ai_stack: scored.recommendations,
      roadmap_30_day: scored.roadmap_30,
      roadmap_90_day: scored.roadmap_90,
      roadmap_one_year: scored.roadmap_year,
      is_premium: false,
    })
    .select("id")
    .single();

  if (error || !report) {
    throw new Error(error?.message ?? "Failed to save your report. Please try again.");
  }

  if (scored.recommendations.length > 0) {
    await supabase.from("report_recommendations").insert(
      scored.recommendations.map((r) => ({
        report_id: report.id,
        employee_id: r.employee_id,
        priority: r.priority,
        reason: r.reason,
        estimated_roi_percent: r.roi_percent,
        estimated_monthly_savings: r.monthly_savings,
      }))
    );
  }

  redirect(`/report/${report.id}`);
}
