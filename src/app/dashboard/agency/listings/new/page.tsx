import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ListingForm } from "@/components/dashboard/listing-form";

export default function NewListingPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Create AI employee" description="New listings are reviewed by the Ploy team before going live." />
      <ListingForm />
    </div>
  );
}
