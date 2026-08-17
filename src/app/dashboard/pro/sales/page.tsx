import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEMO_AGENCY_ID } from "@/lib/data/users";
import { getOrdersForAgency } from "@/lib/data/orders";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";

export default async function ProSalesPage() {
  const [orders, employees] = await Promise.all([
    getOrdersForAgency(DEMO_AGENCY_ID),
    getAllEmployeesForAdmin(),
  ]);

  const totalGross = orders.reduce((s, o) => s + o.amount_cents, 0);
  const totalPayout = orders.reduce((s, o) => s + o.agency_payout_cents, 0);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Sales" description="Every order placed for your AI employees." />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Gross sales</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalGross)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Net payout (after commission)</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalPayout)}</p>
        </Card>
      </div>

      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const employee = employees.find((e) => e.id === order.employee_id);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{employee?.name ?? "—"}</TableCell>
                  <TableCell>{formatCurrency(order.amount_cents)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatCurrency(order.commission_cents)}</TableCell>
                  <TableCell>{formatCurrency(order.agency_payout_cents)}</TableCell>
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
