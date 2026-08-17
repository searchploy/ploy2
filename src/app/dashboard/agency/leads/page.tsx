import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatDate } from "@/lib/utils";
import { DEMO_AGENCY_ID } from "@/lib/data/users";
import { getDemoRequestsForAgency } from "@/lib/data/demo-requests";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";

export default async function AgencyLeadsPage() {
  const [leads, employees] = await Promise.all([
    getDemoRequestsForAgency(DEMO_AGENCY_ID),
    getAllEmployeesForAdmin(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Leads" description="Demo requests submitted through your listings." />
      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Interested in</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              const employee = employees.find((e) => e.id === lead.employee_id);
              return (
                <TableRow key={lead.id}>
                  <TableCell>
                    <p className="font-medium">{lead.full_name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </TableCell>
                  <TableCell>{lead.company_name ?? "—"}</TableCell>
                  <TableCell>{employee?.name ?? "—"}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {lead.message ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(lead.created_at)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
