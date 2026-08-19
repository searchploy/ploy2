import Link from "next/link";
import {
  FileText,
  Heart,
  Gauge,
  Store,
  ArrowUpRight,
  Sparkles,
  Plus,
  Search,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getServerUser } from "@/lib/supabase/server";
import { getProDashboardData } from "@/lib/data/pro-dashboard";

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {href && linkLabel && (
        <Link href={href} className="flex items-center gap-1 text-sm text-ploy-gold hover:underline">
          {linkLabel} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

export default async function ProOverviewPage() {
  const [user, data] = await Promise.all([getServerUser(), getProDashboardData()]);

  const firstName = user?.full_name?.split(" ")[0] ?? "there";
  const { reportCount, recentReports, latestReadiness, savedCount, savedEmployees, listing } = data;
  const isPublished = listing?.status === "published" || listing?.is_published === true;

  return (
    <div className="flex flex-col gap-10">
      <DashboardPageHeader
        title={`Welcome back, ${firstName}`}
        description="Your Ploy AI adoption and marketplace overview"
      />

      {/* Summary — only metrics backed by real data */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Reports Generated" value={String(reportCount)} icon={FileText} />
        <StatCard label="Saved AI Employees" value={String(savedCount)} icon={Heart} />
        <StatCard
          label="AI Readiness"
          value={latestReadiness !== null ? String(latestReadiness) : "—"}
          icon={Gauge}
        />
      </div>

      {/* 1. AI Reports */}
      <section>
        <SectionHeader
          title="Your AI Reports"
          href={reportCount > 0 ? "/dashboard/pro/reports" : undefined}
          linkLabel={reportCount > 0 ? "View all" : undefined}
        />
        {recentReports.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentReports.slice(0, 3).map((report) => (
              <Card
                key={report.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{report.business_name ?? "Untitled report"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(report.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {report.ai_readiness_score !== null && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">AI Readiness</p>
                      <p className="font-mono font-semibold">{report.ai_readiness_score}</p>
                    </div>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/report/${report.id}`}>View Report</Link>
                  </Button>
                </div>
              </Card>
            ))}
            <p className="px-1 text-xs text-muted-foreground">
              Ploy Pro unlocks the full AI Adoption Report — opportunities, recommended AI employees,
              potential impact and priority recommendations.
            </p>
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No reports yet"
            description="Generate your first AI adoption report to see where AI can help your business."
            actionLabel="Generate Report"
            actionHref="/report"
          />
        )}
      </section>

      {/* 2. Saved AI Employees */}
      <section>
        <SectionHeader title="Saved AI Employees" href="/marketplace" linkLabel="View marketplace" />
        {savedEmployees.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedEmployees.map((employee) => (
              <Card key={employee.favoriteId} className="hover-glow-border flex flex-col gap-3 p-5">
                <div className="min-w-0">
                  <p className="truncate font-medium">{employee.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {employee.agency_name ?? employee.role}
                  </p>
                </div>
                {employee.tagline && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{employee.tagline}</p>
                )}
                <Button asChild variant="outline" size="sm" className="mt-auto">
                  <Link href={`/marketplace/${employee.slug}`}>View</Link>
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="You haven't saved any AI employees yet"
            description="Browse the marketplace and save the AI employees you want to research."
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
          />
        )}
      </section>

      {/* 3. My AI Employee — one listing per user */}
      <section>
        <SectionHeader title={listing ? "My AI Employee" : "List Your AI Employee"} />
        {listing ? (
          <Card className="flex flex-col gap-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">{listing.name}</p>
                <p className="text-sm text-muted-foreground">{listing.role}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={
                      isPublished
                        ? "rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400"
                        : "rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-400"
                    }
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-ploy-gold/10 px-2.5 py-1 text-xs font-medium text-ploy-gold">
                    <Sparkles className="h-3 w-3" />
                    Enhanced placement active
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {isPublished && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/marketplace/${listing.slug}`}>View Listing</Link>
                  </Button>
                )}
                <Button asChild size="sm">
                  <Link href="/account/marketplace/listing">Edit Listing</Link>
                </Button>
              </div>
            </div>

            {/* Marketplace performance — no tracking backend yet, so no numbers */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium">Marketplace Performance</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Marketplace views and referral clicks aren&apos;t being recorded yet, so there are no
                figures to show. Your listing receives priority placement over standard listings
                while your Ploy Pro subscription is active.
              </p>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={Store}
            title="You haven't listed an AI employee yet"
            description="Get discovered by businesses looking for AI solutions — and get higher marketplace placement with Ploy Pro."
            actionLabel="List AI Employee"
            actionHref="/account/marketplace/listing/create"
          />
        )}
      </section>

      {/* 4. Quick actions — only what's relevant to this user */}
      <section>
        <SectionHeader title="Quick Actions" />
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/report">
              <Plus className="h-4 w-4" />
              Generate AI Report
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/marketplace">
              <Search className="h-4 w-4" />
              Browse AI Employees
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href={
                listing ? "/account/marketplace/listing" : "/account/marketplace/listing/create"
              }
            >
              <Store className="h-4 w-4" />
              {listing ? "Edit My AI Employee" : "List AI Employee"}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
