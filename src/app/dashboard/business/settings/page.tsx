import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { getDemoUser, DEMO_BUSINESS_USER_ID } from "@/lib/data/users";

export default async function BusinessSettingsPage() {
  const user = (await getDemoUser(DEMO_BUSINESS_USER_ID))!;

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Settings" description="Manage your account details." />
      <SettingsForm user={user} />
    </div>
  );
}
