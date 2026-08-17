import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getOrdersForBuyer } from "@/lib/data/orders";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";
import { Badge } from "@/components/ui/badge";

export default async function BusinessPurchasesPage() {
  const [orders, employees] = await Promise.all([
    getOrdersForBuyer(DEMO_BUSINESS_USER_ID),
    getAllEmployeesForAdmin(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Active AI Employees" description="AI employees currently deployed for your business." />
      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Monthly Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deployed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const employee = employees.find((e) => e.id === order.employee_id);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{employee?.name ?? "—"}</TableCell>
                  <TableCell>{employee?.department ?? "—"}</TableCell>
                  <TableCell>{formatCurrency(order.amount_cents)}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                  <TableCell className="text-right">
                    {employee && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/marketplace/${employee.slug}`}>View</Link>
                      </Button>
                    )}
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
