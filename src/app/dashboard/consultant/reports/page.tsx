import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Plus } from "lucide-react";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ReportsPage() {
  const user = await getServerUser();
  const supabase = await createClient();

  if (!user) return <div>Not authenticated</div>;

  const result = await supabase
    .from("consultant_reports")
    .select("*, client:consultant_clients(business_name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const reports = (result.data as unknown[]) || [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Reports</h1>
          <p className="text-muted-foreground mt-1">Your generated AI readiness reports</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/report">
            <Plus className="h-4 w-4" />
            Generate Report
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => {
                  const r = report as Record<string, unknown>;
                  return (
                  <TableRow key={r.id as string}>
                    <TableCell className="font-medium">
                      {/* @ts-expect-error Supabase join type */}
                      {(r.client as Record<string, unknown>)?.business_name || "Unknown"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(String(r.created_at))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/report/${String(r.report_id)}`}>View Report</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <p>No reports yet</p>
                      <Button asChild size="sm">
                        <Link href="/report">Generate your first report</Link>
                      </Button>
                    </div>
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
