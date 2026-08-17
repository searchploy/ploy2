import Link from "next/link";
import { TrendingUp, Heart, Zap, Award, ArrowUpRight } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getFavoritesForUser } from "@/lib/data/favorites";

export default async function BusinessOverviewPage() {
  const favorites = await getFavoritesForUser(DEMO_BUSINESS_USER_ID);

  // Mock data for demonstration
  const reportsGenerated = 3;
  const estimatedSavings = 125000;
  const aiReadinessScore = 78;
  const recentReports = [
    { id: "1", date: "2026-08-12", businessName: "Acme Corp", score: 82, link: "/report/1" },
    { id: "2", date: "2026-08-10", businessName: "Tech Startup Inc", score: 75, link: "/report/2" },
    { id: "3", date: "2026-08-08", businessName: "Retail Solutions", score: 88, link: "/report/3" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Welcome back"
        description="Here's your AI adoption overview"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="AI Reports Generated"
          value={String(reportsGenerated)}
          icon={TrendingUp}
        />
        <StatCard
          label="Saved AI Employees"
          value={String(favorites.length)}
          icon={Heart}
        />
        <StatCard
          label="Estimated Annual Savings"
          value={`$${(estimatedSavings / 1000).toFixed(0)}k`}
          icon={Zap}
        />
        <StatCard
          label="AI Readiness Score"
          value={`${aiReadinessScore}%`}
          icon={Award}
        />
      </div>

      {/* Recent AI Reports */}
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent AI Reports</h2>
          <Link href="/dashboard/business/ai-reports" className="flex items-center gap-1 text-sm text-ploy-blue hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="text-sm text-muted-foreground">{formatDate(report.date)}</TableCell>
                <TableCell className="font-medium">{report.businessName}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-sm font-medium">
                    {report.score}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={report.link}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Saved AI Employees */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Saved AI Employees</h2>
          <Link href="/dashboard/business/saved" className="flex items-center gap-1 text-sm text-ploy-blue hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {favorites.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.slice(0, 3).map((fav) => (
              <Card key={fav.id} className="flex flex-col gap-4 p-4 hover-glow-border">
                <div>
                  <h3 className="font-semibold">AI Employee</h3>
                  <p className="text-xs text-muted-foreground">Favorite</p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2">
                  <p className="text-xs text-muted-foreground">{new Date(fav.created_at).toLocaleDateString()}</p>
                  <Button variant="ghost" size="sm">
                    <Link href="#">View</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No saved employees yet</p>
            <Button asChild className="mt-4">
              <Link href="/marketplace">Browse marketplace</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
