import { Building2, Package, Users, DollarSign } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { formatCurrency } from "@/lib/utils";
import { getAllAgenciesForAdmin } from "@/lib/data/agencies";
import { getAllListingsForAdmin } from "@/lib/data/live-marketplace";
import { getAllOrdersForAdmin } from "@/lib/data/orders";
import { demoUsers } from "@/lib/data/users";
import { getMonthlySeries } from "@/lib/data/analytics";

// Listing counts come from the database, so the tile has to stay dynamic.
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [agencies, employees, orders] = await Promise.all([
    getAllAgenciesForAdmin(),
    getAllListingsForAdmin(),
    getAllOrdersForAdmin(),
  ]);

  const totalCommission = orders.reduce((s, o) => s + o.commission_cents, 0);
  const pendingAgencies = agencies.filter((a) => a.status === "pending").length;
  const pendingListings = employees.filter((e) => e.status === "pending_review").length;
  const series = getMonthlySeries(totalCommission || 400000);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Overview" description="Platform-wide marketplace health." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total agencies" value={String(agencies.length)} icon={Building2} trend={pendingAgencies > 0 ? { value: `${pendingAgencies} pending review`, positive: false } : undefined} />
        <StatCard label="Total listings" value={String(employees.length)} icon={Package} trend={pendingListings > 0 ? { value: `${pendingListings} pending review`, positive: false } : undefined} />
        <StatCard label="Registered users" value={String(demoUsers.length * 40)} icon={Users} />
        <StatCard label="Commission revenue" value={formatCurrency(totalCommission)} icon={DollarSign} trend={{ value: "+12% MoM", positive: true }} />
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Commission revenue over time</h2>
        <RevenueChart data={series} />
      </Card>
    </div>
  );
}
