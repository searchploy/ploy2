import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListingModerationTable } from "@/components/dashboard/listing-moderation-table";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";
import { getAllAgenciesForAdmin } from "@/lib/data/agencies";

export default async function AdminListingsPage() {
  const [employees, agencies] = await Promise.all([getAllEmployeesForAdmin(), getAllAgenciesForAdmin()]);
  const agencyNameById = Object.fromEntries(agencies.map((a) => [a.id, a.name]));

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Listings"
        description="Add, edit, remove, approve, reject, or feature AI employee listings."
        action={
          <Button asChild variant="gradient">
            <Link href="/dashboard/admin/listings/new">
              <Plus className="h-4 w-4" />
              Create AI employee
            </Link>
          </Button>
        }
      />
      <Card className="p-2">
        <ListingModerationTable initialEmployees={employees} agencyNameById={agencyNameById} />
      </Card>
    </div>
  );
}
