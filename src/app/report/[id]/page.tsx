import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle2, Lock, TriangleAlert } from "lucide-react";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/auth/entitlements";
import { Button } from "@/components/ui/button";
import { Paywall } from "@/components/shared/paywall";
import { AiReportDisclosure, EstimatesDisclosure } from "@/components/legal/disclosures";
import { RoadmapLoading, RoadmapSection } from "@/app/report/[id]/roadmap-section";

export const metadata: Metadata = { title: "Your AI Workforce Report" };

/** How many recommended AI tools a report shows without Ploy Pro. */
const FREE_RECOMMENDATION_LIMIT = 2;

/** Shape returned by get_public_report_recommendations (no join). */
interface RawRecommendation {
  id: string;
  employee_id: string | null;
  priority: number;
  reason: string | null;
  estimated_roi_percent: number | null;
  estimated_monthly_savings: number | null;
}

interface RecommendationRow {
  id: string;
  employee_id: string | null;
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

  // Owned reports come back through the caller's own session (RLS restricts
  // them to the owner and admins). Anonymous reports are not readable as a
  // table at all — that is what let anyone list every prospect's report — so
  // they are fetched by id through get_public_report, which has no argument
  // that could return more than the one row asked for.
  const { data: ownRows } = await db.from("reports").select("*").eq("id", id).limit(1);
  let report = ownRows?.[0] ?? null;

  if (!report) {
    const { data: publicRows } = await db.rpc("get_public_report", { p_report_id: id });
    report = (publicRows as typeof ownRows | null)?.[0] ?? null;
  }
  if (!report) notFound();

  // Defence in depth: RLS and the function already scope this, but the page
  // states the rule rather than inheriting it silently.
  const isOwner = Boolean(report.profile_id) && report.profile_id === profile?.id;
  const isAnonymousReport = report.profile_id === null;
  if (!isAnonymousReport && !isOwner && profile?.role !== "admin") notFound();

  let recommendations: RecommendationRow[] | null = null;

  if (isAnonymousReport) {
    // The function returns the recommendation rows but cannot join, so the
    // employees are fetched separately. They are published catalogue listings,
    // which are public anyway — nothing private is being widened here.
    const { data: rows } = await db.rpc("get_public_report_recommendations", { p_report_id: id });
    const recs = (rows as RawRecommendation[] | null) ?? [];
    const employeeIds = recs.map((r) => r.employee_id).filter((v): v is string => Boolean(v));

    const { data: employees } = employeeIds.length
      ? await db.from("employees").select("id, name, slug, role, price_monthly").in("id", employeeIds)
      : { data: [] };

    const employeeById = new Map((employees ?? []).map((e) => [e.id, e]));
    recommendations = recs
      .sort((a, b) => a.priority - b.priority)
      .map((r) => ({
        id: r.id,
        employee_id: r.employee_id,
        priority: r.priority,
        reason: r.reason,
        estimated_roi_percent: r.estimated_roi_percent,
        estimated_monthly_savings: r.estimated_monthly_savings,
        employee: (r.employee_id ? employeeById.get(r.employee_id) : null) ?? null,
      }));
  } else {
    const { data } = await db
      .from("report_recommendations")
      .select(
        "id, employee_id, priority, reason, estimated_roi_percent, estimated_monthly_savings, employee:employees(id, name, slug, role, price_monthly)"
      )
      .eq("report_id", id)
      .order("priority", { ascending: true });
    recommendations = data as unknown as RecommendationRow[] | null;
  }

  // profiles.subscription_plan is set to "pro" by the Stripe webhook for either
  // product, so it can't tell Ploy Pro from Consulting Pro. Entitlements read
  // the subscriptions table, which is per-product and not user-writable.
  const entitlements = await getEntitlements();
  const isPro = entitlements.pro || entitlements.isAdmin;

  const allRecs = recommendations ?? [];
  const visibleRecs = isPro ? allRecs : allRecs.slice(0, FREE_RECOMMENDATION_LIMIT);
  // The next recommendation, rendered fading out under the paywall so the
  // report visibly continues rather than just stopping. Only its role and ROI
  // are used — the name and reason stay out of the HTML, since anything
  // rendered here is readable in page source regardless of the fade.
  const teaserRec = isPro ? null : (allRecs[FREE_RECOMMENDATION_LIMIT] ?? null);
  const lockedCount = isPro ? 0 : Math.max(allRecs.length - FREE_RECOMMENDATION_LIMIT, 0);

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
          <p className="mt-1 text-sm text-muted-foreground">Est. Hours Saved / Month</p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/30 p-5">
          <p className="font-mono text-2xl font-bold">{report.estimated_roi_percent ?? 0}%</p>
          <p className="mt-1 text-sm text-muted-foreground">Estimated ROI</p>
        </div>
      </div>

      <EstimatesDisclosure className="-mt-6 mb-10" />

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
          Recommended AI Tools
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

        <AiReportDisclosure className="mt-4" />

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
                    <div className="mb-2.5 h-4 w-40 rounded bg-muted-foreground/30 blur-[2px]" />
                    <div className="h-3 w-64 max-w-full rounded bg-muted-foreground/20 blur-[2px]" />
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
                    ? `This is your free AI Snapshot. Upgrade to see ${lockedCount} more AI tool match${lockedCount > 1 ? "es" : ""}, your complete 30/90/1-year roadmap, department analysis, priority matrix, and agency recommendations.`
                    : "This is your free AI Snapshot. Upgrade to see your complete 30/90/1-year roadmap, department analysis, priority matrix, and agency recommendations."
                }
                features={[
                  "Complete 30/90/1-year roadmap",
                  "Unlimited AI tool recommendations",
                  "Agency recommendations",
                  "Unlimited reports & PDF export",
                ]}
                ctaLabel="Upgrade Plan for Full Report"
              />
            </div>
          </div>
        )}
      </section>

      {/* The detailed roadmap is Ploy Pro only, and gated here on the server:
          nothing about it is rendered for a free report. */}
      {isPro ? (
        <Suspense fallback={<RoadmapLoading />}>
          <RoadmapSection
            reportId={id}
            report={report}
            recommendations={allRecs.map((r) => ({ employee_id: r.employee_id, priority: r.priority }))}
            canSave={isOwner}
          />
        </Suspense>
      ) : (
        <section className="mb-10 rounded-2xl border border-border bg-secondary/20 p-6 text-center">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-ploy-gold">
            <Lock className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-bold">AI Transformation Roadmap</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            This roadmap is available with Ploy Pro. It sequences your recommended AI tools across 30 days, 90 days
            and a year, with owners, dependencies, KPIs and estimated impact.
          </p>
        </section>
      )}

      <div className="flex flex-wrap justify-center gap-3 border-t border-border pt-8">
        <Button asChild size="lg">
          <Link href="/marketplace">Browse Recommended AI Tools →</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/report">Generate New Report</Link>
        </Button>
      </div>
    </div>
  );
}
