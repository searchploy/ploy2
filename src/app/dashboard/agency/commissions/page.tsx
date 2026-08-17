import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Percent, Wallet, Clock3 } from "lucide-react";
import { DEMO_AGENCY_ID } from "@/lib/data/users";
import { getCommissionsForAgency } from "@/lib/data/commissions";
import { COMMISSION_PCT } from "@/lib/constants";

export default async function AgencyCommissionsPage() {
  const commissions = await getCommissionsForAgency(DEMO_AGENCY_ID);
  const totalPaidOut = commissions.filter((c) => c.status === "paid_out").reduce((s, c) => s + c.amount_cents, 0);
  const totalPending = commissions.filter((c) => c.status === "pending" || c.status === "cleared").reduce((s, c) => s + c.amount_cents, 0);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Commissions" description={`Ploy takes a flat ${COMMISSION_PCT}% commission on every completed order.`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Commission rate" value={`${COMMISSION_PCT}%`} icon={Percent} />
        <StatCard label="Paid to Ploy" value={formatCurrency(totalPaidOut)} icon={Wallet} />
        <StatCard label="Pending / clearing" value={formatCurrency(totalPending)} icon={Clock3} />
      </div>

      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.order_id}</TableCell>
                <TableCell>{formatCurrency(c.amount_cents)}</TableCell>
                <TableCell>
                  <StatusBadge status={c.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(c.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
