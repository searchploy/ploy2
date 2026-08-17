import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { AgencyModerationTable } from "@/components/dashboard/agency-moderation-table";
import { getAllAgenciesForAdmin } from "@/lib/data/agencies";

export default async function AdminAgenciesPage() {
  const agencies = await getAllAgenciesForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Agencies" description="Approve, reject, or suspend agencies applying to sell on Ploy." />
      <Card className="p-2">
        <AgencyModerationTable initialAgencies={agencies} />
      </Card>
    </div>
  );
}
