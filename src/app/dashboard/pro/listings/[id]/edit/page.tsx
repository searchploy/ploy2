import { notFound } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ListingForm } from "@/components/dashboard/listing-form";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employees = await getAllEmployeesForAdmin();
  const employee = employees.find((e) => e.id === id);
  if (!employee) notFound();

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title={`Edit ${employee.name}`} description="Update this listing's details." />
      <ListingForm employee={employee} />
    </div>
  );
}
