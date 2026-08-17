import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paywall } from "@/components/shared/paywall";
import { ListingsTable } from "@/components/dashboard/listings-table";
import { DEMO_AGENCY_ID } from "@/lib/data/users";
import { getEmployeesByAgency } from "@/lib/data/employees";

export default async function ProListingsPage() {
  const employees = await getEmployeesByAgency(DEMO_AGENCY_ID);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Listings"
        description="Manage the AI employees your agency has listed on Ploy."
        action={
          <Button asChild variant="gradient">
            <Link href="/dashboard/pro/listings/new">
              <Plus className="h-4 w-4" />
              Create AI employee
            </Link>
          </Button>
        }
      />
      <Card className="p-2">
        <ListingsTable initialEmployees={employees} />
      </Card>

      <Paywall
        title="Boost your listings"
        description="Move your AI employees to the top of search results and category pages so more businesses see them first."
        features={["Priority placement in search & categories", "Featured badge on listings", "Boosted placement in AI Report matches"]}
        ctaLabel="Upgrade Plan to Boost Listings"
        ctaHref="/for-agencies"
      />
    </div>
  );
}
