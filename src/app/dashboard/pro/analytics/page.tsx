import { Eye, MousePointerClick, TrendingUp, Percent } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { formatCompactNumber } from "@/lib/utils";
import { DEMO_AGENCY_ID } from "@/lib/data/users";
import { getEmployeesByAgency } from "@/lib/data/employees";
import { getOrdersForAgency } from "@/lib/data/orders";
import { getMonthlySeries } from "@/lib/data/analytics";

export default async function ProAnalyticsPage() {
  const [employees, orders] = await Promise.all([
    getEmployeesByAgency(DEMO_AGENCY_ID),
    getOrdersForAgency(DEMO_AGENCY_ID),
  ]);

  const totalViews = employees.reduce((sum, e) => sum + e.view_count, 0);
  const totalPurchases = employees.reduce((sum, e) => sum + e.purchase_count, 0);
  const conversionRate = totalViews > 0 ? ((totalPurchases / totalViews) * 100).toFixed(1) : "0";
  const totalRevenue = orders.reduce((sum, o) => sum + o.agency_payout_cents, 0);
  const series = getMonthlySeries(totalRevenue || 500000);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Analytics" description="Traffic and revenue performance across your listings." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total views" value={formatCompactNumber(totalViews)} icon={Eye} />
        <StatCard label="Total purchases" value={String(totalPurchases)} icon={MousePointerClick} />
        <StatCard label="Conversion rate" value={`${conversionRate}%`} icon={Percent} />
        <StatCard label="Net revenue (6mo)" value={`$${(series.reduce((s, m) => s + m.revenue, 0) / 100).toLocaleString()}`} icon={TrendingUp} />
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Revenue over time</h2>
        <RevenueChart data={series} />
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <h2 className="font-semibold">Performance by listing</h2>
        <div className="flex flex-col divide-y divide-border">
          {employees.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">{formatCompactNumber(e.view_count)} views</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{e.purchase_count} purchases</p>
                <p className="text-xs text-muted-foreground">
                  {e.view_count > 0 ? ((e.purchase_count / e.view_count) * 100).toFixed(1) : "0"}% conversion
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
