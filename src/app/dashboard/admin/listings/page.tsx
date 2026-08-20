import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { ListingsModerationTabs } from "@/components/dashboard/listings-moderation-tabs";
import { getAllListingsForAdmin } from "@/lib/data/live-marketplace";

// Approvals have to show up the moment they happen, so never serve this from
// the build-time cache.
export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const listings = await getAllListingsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Listings"
        description="Review AI employee submissions. Only approved listings appear on the marketplace."
        action={
          <Button asChild variant="gradient">
            <Link href="/dashboard/admin/listings/new">
              <Plus className="h-4 w-4" />
              Create AI employee
            </Link>
          </Button>
        }
      />
      <ListingsModerationTabs listings={listings} />
    </div>
  );
}
