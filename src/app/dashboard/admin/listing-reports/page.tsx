import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ListingReportsQueue } from "@/components/dashboard/listing-reports-queue";
import { createClient } from "@/lib/supabase/server";
import type { ListingReport } from "@/lib/types/database";

// Reports arrive out of band, so this must never be served from the cache.
export const dynamic = "force-dynamic";

export type ListingReportRow = ListingReport & {
  employee: { id: string; name: string; slug: string; agency_name: string | null; status: string } | null;
};

export default async function AdminListingReportsPage() {
  const supabase = await createClient();

  // RLS restricts this to admins (and to a reporter's own rows), so a
  // non-admin reaching this route sees nothing rather than everything.
  const { data } = await supabase
    .from("listing_reports")
    .select("*, employee:employees(id, name, slug, agency_name, status)")
    .order("created_at", { ascending: false });

  const reports = (data as ListingReportRow[] | null) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title="Flagged Listings"
        description="Reports submitted by marketplace visitors. A report is an allegation, not a finding — review before acting."
      />
      <ListingReportsQueue reports={reports} />
    </div>
  );
}
