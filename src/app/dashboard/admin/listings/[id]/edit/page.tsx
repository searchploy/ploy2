import { notFound } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ListingForm } from "@/components/dashboard/listing-form";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";
import { getAllAgenciesForAdmin } from "@/lib/data/agencies";

export default async function AdminEditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [employees, agencies] = await Promise.all([getAllEmployeesForAdmin(), getAllAgenciesForAdmin()]);
  const employee = employees.find((e) => e.id === id);
  if (!employee) notFound();

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title={`Edit ${employee.name}`} description="Update this listing's details." />
      <ListingForm
        employee={employee}
        agencies={agencies.map((a) => ({ id: a.id, name: a.name }))}
        redirectTo="/dashboard/admin/listings"
      />
    </div>
  );
}
