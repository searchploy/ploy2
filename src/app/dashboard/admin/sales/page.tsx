import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, Percent, ShoppingCart } from "lucide-react";
import { getAllOrdersForAdmin } from "@/lib/data/orders";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";
import { getAllAgenciesForAdmin } from "@/lib/data/agencies";

export default async function AdminSalesPage() {
  const [orders, employees, agencies] = await Promise.all([
    getAllOrdersForAdmin(),
    getAllEmployeesForAdmin(),
    getAllAgenciesForAdmin(),
  ]);

  const gmv = orders.reduce((s, o) => s + o.amount_cents, 0);
  const commission = orders.reduce((s, o) => s + o.commission_cents, 0);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Sales" description="All orders placed across the marketplace." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Gross merchandise value" value={formatCurrency(gmv)} icon={ShoppingCart} />
        <StatCard label="Ploy commission" value={formatCurrency(commission)} icon={Percent} />
        <StatCard label="Total orders" value={String(orders.length)} icon={DollarSign} />
      </div>

      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const employee = employees.find((e) => e.id === order.employee_id);
              const agency = agencies.find((a) => a.id === order.agency_id);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{employee?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{agency?.name ?? "—"}</TableCell>
                  <TableCell>{formatCurrency(order.amount_cents)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
