import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Paywall } from "@/components/shared/paywall";
import { RoadmapTabs } from "@/app/report/[id]/roadmap-tabs";
import type { RoadmapItem } from "@/lib/report/scoring";

export const metadata: Metadata = { title: "Your AI Workforce Report" };

interface RecommendationRow {
  id: string;
  priority: number;
  reason: string | null;
  estimated_roi_percent: number | null;
  estimated_monthly_savings: number | null;
  employee: {
    id: string;
    name: string;
    slug: string;
    role: string;
    price_monthly: number | null;
  } | null;
}

function ScoreRing({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 text-center">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="9" className="stroke-border" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-ploy-gold"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default async function ReportResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getServerUser();

  // Reads use the caller's own client. Anonymous reports remain readable by
  // RLS so a shared link works without the service key; the ownership check
  // below is what stops one signed-in user opening another's report.
  const db = await createClient();

  const { data: report } = await db.from("reports").select("*").eq("id", id).maybeSingle();
  if (!report) notFound();

  const isOwner = Boolean(report.profile_id) && report.profile_id === profile?.id;
  const isAnonymousReport = report.profile_id === null;
  // 404 rather than 403: an unauthorised viewer shouldn't learn the id exists.
  if (!isAnonymousReport && !isOwner && profile?.role !== "admin") notFound();

  const { data: recommendations } = await db
    .from("report_recommendations")
    .select("id, priority, reason, estimated_roi_percent, estimated_monthly_savings, employee:employees(id, name, slug, role, price_monthly)")
    .eq("report_id", id)
    .order("priority", { ascending: true });

  const isPro = profile?.subscription_plan === "pro";

  const allRecs = (recommendations ?? []) as unknown as RecommendationRow[];
  const visibleRecs = isPro ? allRecs : allRecs.slice(0, 3);
  // A real fourth recommendation, rendered fading out under the paywall so the
  // report visibly continues rather than just stopping — the gate reads as
  // covering something instead of being the end of the page.
  const teaserRec = isPro ? null : (allRecs[3] ?? null);
  const lockedCount = isPro ? 0 : Math.max(allRecs.length - 3, 0);

  const roadmap30 = (report.roadmap_30_day as unknown as RoadmapItem[]) ?? [];
  const roadmap90 = (report.roadmap_90_day as unknown as RoadmapItem[]) ?? [];
  const roadmapYear = (report.roadmap_one_year as unknown as RoadmapItem[]) ?? [];

  const savings = report.estimated_annual_savings
    ? `$${Number(report.estimated_annual_savings).toLocaleString()}`
    : "—";

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-10 flex flex-col items-center gap-4 border-b border-border pb-8 text-center">
        <p className="text-sm text-muted-foreground">
          {report.business_name}
          {report.industry ? ` · ${report.industry}` : ""}
        </p>
        <h1 className="font-display text-4xl font-bold">Your AI Workforce Report</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-bg px-3.5 py-1.5 text-sm font-semibold text-success">
          <CheckCircle2 className="h-4 w-4" />
          Report Complete
        </span>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <ScoreRing value={report.ai_readiness_score ?? 0} label="AI Readiness Score" />
        <ScoreRing value={report.automation_score ?? 0} label="Automation Score" />
        <ScoreRing value={report.growth_score ?? 0} label="Growth Score" />
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-secondary/30 p-5">
          <p className="font-mono text-2xl font-bold">{savings}</p>
          <p className="mt-1 text-sm text-muted-foreground">Est. Annual Savings</p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/30 p-5">
          <p className="font-mono text-2xl font-bold">{report.estimated_hours_saved_monthly ?? 0} hrs</p>
          <p className="mt-1 text-sm text-muted-foreground">Hours Saved / Month</p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/30 p-5">
          <p className="font-mono text-2xl font-bold">{report.estimated_roi_percent ?? 0}%</p>
          <p className="mt-1 text-sm text-muted-foreground">Estimated ROI</p>
        </div>
      </div>

      {(report.biggest_bottlenecks?.length ?? 0) > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
            <span className="block h-4 w-1 rounded-full bg-ploy-gold" />
            Biggest Operational Bottlenecks
          </h2>
          <div className="flex flex-col gap-2.5">
            {report.biggest_bottlenecks!.map((b: string, i: number) => (
              <div key={i} className="flex gap-2.5 rounded-xl bg-secondary/30 p-4 text-sm">
                <TriangleAlert className="h-4 w-4 shrink-0 text-warning" />
                {b}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
          <span className="block h-4 w-1 rounded-full bg-ploy-gold" />
          Recommended AI Employees
        </h2>
        <div className="flex flex-col gap-3.5">
          {visibleRecs.map((rec) => (
            <Link
              key={rec.id}
              href={rec.employee ? `/marketplace/${rec.employee.slug}?from_report=${id}` : "/marketplace"}
              className="hover-glow-border flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ploy-gold">
                  Priority {rec.priority} · {rec.employee?.role}
                </p>
                <p className="mb-1.5 font-bold">{rec.employee?.name}</p>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
                <span className="mt-2 inline-block text-xs font-semibold text-ploy-gold">View in Marketplace →</span>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-xl font-bold text-success">{rec.estimated_roi_percent}%</p>
                <p className="text-[11px] text-muted-foreground">Est. ROI</p>
                {rec.estimated_monthly_savings != null && (
                  <p className="mt-1.5 font-mono text-sm text-muted-foreground">
                    ${Number(rec.estimated_monthly_savings).toLocaleString()}/mo
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* The gate. The teaser sits underneath a gradient that dissolves into
            the page background, and the paywall is pulled up over the tail of
            it, so the two read as one continuous "there is more below here". */}
        {!isPro && (
          <div className="relative mt-3.5">
            {teaserRec && (
              // relative so the gradient is scoped to this card, and tall
              // enough that the top edge stays legible before it dissolves.
              <div aria-hidden className="pointer-events-none relative select-none">
                <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 pb-16">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ploy-gold">
                      Priority {teaserRec.priority} · {teaserRec.employee?.role}
                    </p>
                    <p className="mb-1.5 font-bold">{teaserRec.employee?.name}</p>
                    <p className="text-sm text-muted-foreground">{teaserRec.reason}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-xl font-bold text-success">
                      {teaserRec.estimated_roi_percent}%
                    </p>
                    <p className="text-[11px] text-muted-foreground">Est. ROI</p>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-background/75 to-background" />
              </div>
            )}

            {/* Pulled up into the tail of the fade so the card emerges from the
                dissolving content rather than sitting below it. */}
            <div className={teaserRec ? "relative -mt-12" : "relative"}>
              <Paywall
                title="Unlock your full AI Report"
                description={
                  lockedCount > 0
                    ? `This is your free AI Snapshot. Upgrade to see ${lockedCount} more AI employee match${lockedCount > 1 ? "es" : ""}, your complete 30/90/1-year roadmap, department analysis, priority matrix, and agency recommendations.`
                    : "This is your free AI Snapshot. Upgrade to see your complete 30/90/1-year roadmap, department analysis, priority matrix, and agency recommendations."
                }
                features={[
                  "Complete 30/90/1-year roadmap",
                  "Unlimited AI employee recommendations",
                  "Agency recommendations",
                  "Unlimited reports & PDF export",
                ]}
                ctaLabel="Upgrade Plan for Full Report"
              />
            </div>
          </div>
        )}
      </section>

      {/* The roadmap is one of the things the paywall above is covering, so for
          a free report it isn't rendered at all — the gate already stands in
          for it. */}
      {isPro && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
            <span className="block h-4 w-1 rounded-full bg-ploy-gold" />
            Implementation Roadmap
          </h2>
          <RoadmapTabs roadmap30={roadmap30} roadmap90={roadmap90} roadmapYear={roadmapYear} />
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-3 border-t border-border pt-8">
        <Button asChild size="lg">
          <Link href="/marketplace">Browse Recommended AI Employees →</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/report">Generate New Report</Link>
        </Button>
      </div>
    </div>
  );
}
