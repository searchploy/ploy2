import Link from "next/link";
import { Package, Eye, Users2, Star, ArrowUpRight } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEMO_AGENCY_ID } from "@/lib/data/users";
import { getEmployeesByAgency } from "@/lib/data/employees";
import { getDemoRequestsForAgency } from "@/lib/data/demo-requests";

export default async function AgencyOverviewPage() {
  const [employees, demoRequests] = await Promise.all([
    getEmployeesByAgency(DEMO_AGENCY_ID),
    getDemoRequestsForAgency(DEMO_AGENCY_ID),
  ]);

  const published = employees.filter((e) => e.status === "published");
  const avgRating = published.length > 0 ? published.reduce((s, e) => s + e.avg_rating, 0) / published.length : 0;

  // Mock data for views (would come from analytics in production)
  const totalListingViews = 1240;
  const demoRequestCount = demoRequests.length;

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Overview"
        description="How your AI Employees are performing."
        action={
          <Button asChild variant="gradient">
            <Link href="/dashboard/agency/listings/new">Create AI employee</Link>
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total AI Employees"
          value={String(published.length)}
          icon={Package}
        />
        <StatCard
          label="Total Listing Views"
          value={String(totalListingViews)}
          icon={Eye}
        />
        <StatCard
          label="Demo Requests"
          value={String(demoRequestCount)}
          icon={Users2}
        />
        <StatCard
          label="Average Rating"
          value={avgRating > 0 ? avgRating.toFixed(1) : "—"}
          icon={Star}
        />
      </div>

      {/* My AI Employees Table */}
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">My AI Employees</h2>
          <Link href="/dashboard/agency/listings" className="flex items-center gap-1 text-sm text-ploy-blue hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {published.slice(0, 5).map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>
                  <StatusBadge status={employee.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{employee.department || "—"}</TableCell>
                <TableCell className="text-sm">{Math.floor(Math.random() * 500) + 100}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/agency/listings/${employee.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Plan Limits / Upgrade Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">Current Plan: Free</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Maximum 3 AI Employees</li>
            <li>✓ Basic Analytics</li>
            <li>✗ Featured Listing</li>
            <li>✗ Higher Ranking</li>
          </ul>
        </Card>
        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-semibold">Upgrade to Pro</h3>
          <p className="text-sm text-muted-foreground">Unlock unlimited listings, advanced analytics, and featured placement.</p>
          <Button asChild className="mt-auto">
            <Link href="/for-agencies">View pricing</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
