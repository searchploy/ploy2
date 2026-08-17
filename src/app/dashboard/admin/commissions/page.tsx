import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet, Clock3, TrendingUp } from "lucide-react";
import { getAllCommissionsForAdmin } from "@/lib/data/commissions";
import { getAllAgenciesForAdmin } from "@/lib/data/agencies";
import { COMMISSION_PCT } from "@/lib/constants";

export default async function AdminCommissionsPage() {
  const [commissions, agencies] = await Promise.all([getAllCommissionsForAdmin(), getAllAgenciesForAdmin()]);

  const paidOut = commissions.filter((c) => c.status === "paid_out").reduce((s, c) => s + c.amount_cents, 0);
  const pending = commissions.filter((c) => c.status !== "paid_out").reduce((s, c) => s + c.amount_cents, 0);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Commissions" description={`Platform-wide commission tracking at a flat ${COMMISSION_PCT}% rate.`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Realized commission" value={formatCurrency(paidOut)} icon={Wallet} />
        <StatCard label="Pending / clearing" value={formatCurrency(pending)} icon={Clock3} />
        <StatCard label="Commission rate" value={`${COMMISSION_PCT}%`} icon={TrendingUp} />
      </div>

      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agency</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((c) => {
              const agency = agencies.find((a) => a.id === c.agency_id);
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{agency?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.order_id}</TableCell>
                  <TableCell>{formatCurrency(c.amount_cents)}</TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(c.created_at)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
