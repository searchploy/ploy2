import { Download } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getOrdersForBuyer } from "@/lib/data/orders";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";

export default async function BusinessInvoicesPage() {
  const [orders, employees] = await Promise.all([
    getOrdersForBuyer(DEMO_BUSINESS_USER_ID),
    getAllEmployeesForAdmin(),
  ]);
  const invoiced = orders.filter((o) => o.status === "paid" || o.status === "completed" || o.status === "fulfilling");

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Invoices" description="Billing history for your AI employee purchases." />
      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiced.map((order) => {
              const employee = employees.find((e) => e.id === order.employee_id);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    INV-{order.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium">{employee?.name ?? "—"}</TableCell>
                  <TableCell>{formatCurrency(order.amount_cents)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
