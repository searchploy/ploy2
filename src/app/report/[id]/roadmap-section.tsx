import { Loader2, Target, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProBoostedEmployeeIds } from "@/lib/data/live-marketplace";
import { ROADMAP_ENGINE_VERSION, buildDetailedRoadmap } from "@/lib/report/roadmap";
import {
  isRoadmapShape,
  loadPublishedListings,
  loadSavedRoadmap,
  roadmapFingerprint,
  toRoadmapSource,
  type RecommendationRef,
  type RoadmapReportFields,
} from "@/lib/report/roadmap-data";
import { DetailedRoadmapView, type RoadmapListingLinks } from "@/components/report/roadmap/detailed-roadmap";
import { GenerateRoadmapButton } from "@/components/report/roadmap/generate-roadmap-button";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-ploy-gold">
          <Target className="h-4 w-4" />
        </span>
        <div>
          <p className="label-micro">Ploy Pro</p>
          <h3 className="text-lg font-bold tracking-tight">AI Transformation Roadmap</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

export function RoadmapLoading() {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-secondary/20 p-8 text-center">
        <Loader2 className="h-5 w-5 animate-spin text-ploy-gold" />
        <p className="text-sm text-muted-foreground">Building your personalized AI roadmap…</p>
      </div>
    </Shell>
  );
}

function NotGenerated({ reportId, outdated }: { reportId: string; outdated: boolean }) {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/20 p-8 text-center">
        <p className="max-w-md text-sm text-muted-foreground">
          {outdated
            ? "Your roadmap was built with an earlier version of the planner. Rebuild it to get the current plan."
            : "Build a personalized implementation plan from this report: your recommended AI employees sequenced across 30 days, 90 days and a year, with owners, dependencies, KPIs and estimated impact."}
        </p>
        <GenerateRoadmapButton reportId={reportId} label={outdated ? "Rebuild roadmap" : "Build my roadmap"} />
      </div>
    </Shell>
  );
}

function RoadmapError({ reportId, canRetry }: { reportId: string; canRetry: boolean }) {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary/20 p-8 text-center">
        <TriangleAlert className="h-5 w-5 text-warning" />
        <p className="text-sm text-muted-foreground">Your roadmap couldn&apos;t be generated. Please try again.</p>
        {canRetry && <GenerateRoadmapButton reportId={reportId} label="Try again" variant="outline" size="sm" />}
      </div>
    </Shell>
  );
}

/**
 * Rendered only for Ploy Pro (or admin) viewers — the page checks entitlements
 * before mounting this. A saved roadmap is reused as-is; nothing is written
 * during render, so generating one is always an explicit action.
 */
export async function RoadmapSection({
  reportId,
  report,
  recommendations,
  canSave,
}: {
  reportId: string;
  report: RoadmapReportFields;
  recommendations: RecommendationRef[];
  canSave: boolean;
}) {
  try {
    const db = await createClient();
    const employeeIds = recommendations.map((r) => r.employee_id).filter((id): id is string => Boolean(id));

    const [listings, boosted, saved] = await Promise.all([
      loadPublishedListings(db, employeeIds),
      getProBoostedEmployeeIds(),
      loadSavedRoadmap(db, reportId),
    ]);

    const source = toRoadmapSource(report, recommendations, listings);
    const usable = saved && saved.engineVersion === ROADMAP_ENGINE_VERSION && isRoadmapShape(saved.roadmap);

    // The owner gets an explicit build step rather than a silent write during
    // render. Anyone else (an admin, or a Pro viewer opening an anonymous
    // report) sees a computed preview that is never persisted.
    if (!usable && canSave) return <NotGenerated reportId={reportId} outdated={Boolean(saved)} />;

    const links: RoadmapListingLinks = Object.fromEntries(
      [...listings.values()].map((l) => [l.id, { slug: l.slug, isProBoosted: boosted.has(l.id) }])
    );

    return (
      <DetailedRoadmapView
        roadmap={usable ? saved.roadmap : buildDetailedRoadmap(source)}
        reportId={reportId}
        listings={links}
        canRegenerate={canSave}
        stale={usable ? saved.sourceFingerprint !== roadmapFingerprint(source) : false}
        preview={!usable}
      />
    );
  } catch (error) {
    console.error("Roadmap section failed:", error);
    return <RoadmapError reportId={reportId} canRetry={canSave} />;
  }
}
