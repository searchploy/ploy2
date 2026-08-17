import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { ListingForm } from "@/components/dashboard/listing-form";
import { getServerUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAllEmployeesForAdmin } from "@/lib/data/employees";

export default async function ProfilePage() {
  const serverUser = await getServerUser();

  // Only free tier users should access this page
  // Free tier users will have a specific role/subscription tier
  if (!serverUser) {
    redirect("/sign-in");
  }

  // Get all employees to check if this user has already created one
  const employees = await getAllEmployeesForAdmin();

  // For now, we'll use a demo employee or create logic
  // In production, this would filter by the user's ID
  // Since we're using demo data, we'll show an empty form for creating
  const userEmployee = null; // In production: employees.find(e => e.profile_id === serverUser.id)

  return (
    <div className="container max-w-2xl py-8">
      <DashboardPageHeader
        title="Your AI Employee Profile"
        description="Create or edit your AI employee listing. As a free member, you can list one AI employee on the Ploy marketplace."
      />
      <ListingForm employee={userEmployee || undefined} />
    </div>
  );
}
