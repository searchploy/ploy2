import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { AgencyProfileForm } from "@/components/dashboard/agency-profile-form";
import { getAllAgenciesForAdmin } from "@/lib/data/agencies";
import { DEMO_AGENCY_ID } from "@/lib/data/users";

export default async function AgencyProfilePage() {
  const agencies = await getAllAgenciesForAdmin();
  const agency = agencies.find((a) => a.id === DEMO_AGENCY_ID)!;

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Agency profile" description="This information is shown on your public agency page." />
      <AgencyProfileForm agency={agency} />
    </div>
  );
}
