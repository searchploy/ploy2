import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { BarChart3, Eye } from "lucide-react";
import Link from "next/link";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  const reportList = reports ?? [];

  // Calculate statistics
  const totalReports = reportList.length;
  const avgReadinessScore =
    reportList.length > 0
      ? (reportList.reduce((sum, r) => sum + (r.ai_readiness_score || 0), 0) / reportList.length).toFixed(1)
      : "—";
  const premiumReports = reportList.filter((r) => r.is_premium).length;

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="AI Reports"
        description="Generated reports from businesses and consultants."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="mt-2 text-3xl font-semibold">{totalReports}</p>
            </div>
            <BarChart3 className="h-5 w-5 text-ploy-gold opacity-60" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Readiness Score</p>
              <p className="mt-2 text-3xl font-semibold">{avgReadinessScore}</p>
            </div>
            <BarChart3 className="h-5 w-5 text-ploy-gold opacity-60" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Premium Reports</p>
              <p className="mt-2 text-3xl font-semibold">{premiumReports}</p>
            </div>
            <Eye className="h-5 w-5 text-ploy-gold opacity-60" />
          </div>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Readiness Score</TableHead>
                <TableHead>Automation Score</TableHead>
                <TableHead>Est. Annual Savings</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportList.length > 0 ? (
                reportList.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.business_name || "Anonymous"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          report.status === "complete"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-amber-500/20 text-amber-300"
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{report.ai_readiness_score ?? "—"}</TableCell>
                    <TableCell className="text-sm">{report.automation_score ?? "—"}</TableCell>
                    <TableCell className="text-sm">
                      {report.estimated_annual_savings
                        ? `$${(report.estimated_annual_savings / 100).toLocaleString()}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          report.is_premium
                            ? "border-ploy-gold text-ploy-gold"
                            : "border-muted-foreground text-muted-foreground"
                        }
                      >
                        {report.is_premium ? "Premium" : "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(report.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/report/${report.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No reports yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
