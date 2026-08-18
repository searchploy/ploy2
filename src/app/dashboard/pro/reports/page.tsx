import Link from "next/link";
import { FileText } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { createClient, getServerUser } from "@/lib/supabase/server";

export default async function ProReportsPage() {
  const user = await getServerUser();
  const supabase = await createClient();

  const { data: reports } = user
    ? await supabase
        .from("reports")
        .select("id, business_name, ai_readiness_score, status, created_at")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="AI Reports"
        description="Your full AI Adoption Reports — opportunities, recommended AI employees and priority recommendations."
        action={
          <Button asChild>
            <Link href="/report">Generate Report</Link>
          </Button>
        }
      />

      {reports && reports.length > 0 ? (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <Card key={report.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="truncate font-medium">{report.business_name ?? "Untitled report"}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(report.created_at)} · {report.status}
                </p>
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
    </div>
  );
}
