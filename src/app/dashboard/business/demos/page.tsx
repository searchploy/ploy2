import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate } from "@/lib/utils";
import { DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getDemoRequestsForUser } from "@/lib/data/demo-requests";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";

export default async function BusinessDemosPage() {
  const [demos, employees] = await Promise.all([
    getDemoRequestsForUser(DEMO_BUSINESS_USER_ID),
    getAllEmployeesForAdmin(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Demo requests" description="Demos you've requested from agencies." />
      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demos.map((demo) => {
              const employee = employees.find((e) => e.id === demo.employee_id);
              return (
                <TableRow key={demo.id}>
                  <TableCell className="font-medium">{employee?.name ?? "—"}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{demo.message ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={demo.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(demo.created_at)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
