import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CategoryIcon } from "@/components/shared/category-icon";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";
import { getAllOrdersForAdmin } from "@/lib/data/orders";
import { getMonthlySeries, getCategoryBreakdown } from "@/lib/data/analytics";
import { formatCompactNumber } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const [employees, orders] = await Promise.all([getAllEmployeesForAdmin(), getAllOrdersForAdmin()]);
  const totalRevenue = orders.reduce((s, o) => s + o.amount_cents, 0);
  const series = getMonthlySeries(totalRevenue || 600000);
  const breakdown = getCategoryBreakdown(employees).sort((a, b) => b.value - a.value);
  const maxBreakdown = Math.max(...breakdown.map((b) => b.value), 1);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Analytics" description="Marketplace-wide performance across all agencies." />

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Gross merchandise value</h2>
        <RevenueChart data={series} />
      </Card>

      <Card className="flex flex-col gap-5 p-6">
        <h2 className="font-semibold">Purchases by category</h2>
        <div className="flex flex-col gap-4">
          {breakdown.map((row) => (
            <div key={row.name} className="flex items-center gap-4">
              <CategoryIcon name={null} className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-muted-foreground">{formatCompactNumber(row.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-ploy-blue"
                    style={{ width: `${(row.value / maxBreakdown) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
