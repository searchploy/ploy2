import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ListingForm } from "@/components/dashboard/listing-form";
import { getAllAgenciesForAdmin } from "@/lib/data/agencies";

export const metadata = { title: "Create AI employee" };

export default async function AdminNewEmployeePage() {
  const agencies = await getAllAgenciesForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Create AI employee" description="Add a new listing on behalf of an agency." />
      <ListingForm
        agencies={agencies.map((a) => ({ id: a.id, name: a.name }))}
        redirectTo="/admin/employees"
      />
    </div>
  );
}
