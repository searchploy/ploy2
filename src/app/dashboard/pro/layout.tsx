import {
  LayoutDashboard,
  Heart,
  FileText,
  Store,
  Sparkles,
  Settings,
} from "lucide-react";
import { DashboardSidebar, type DashboardNavItem } from "@/components/dashboard/sidebar";
import { getDemoUser, DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getServerUser } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/auth/entitlements";
import { redirect } from "next/navigation";

// Ploy is a discovery/referral marketplace — it does not process AI employee
// purchases — so Sales, Invoices, Leads and Messages have been removed.
const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/pro", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "AI Reports", href: "/dashboard/pro/reports", icon: <FileText className="h-4 w-4" /> },
  { label: "Marketplace", href: "/marketplace", icon: <Store className="h-4 w-4" /> },
  { label: "Saved AI Employees", href: "/dashboard/pro/saved", icon: <Heart className="h-4 w-4" /> },
  { label: "My AI Employee", href: "/account/marketplace/listing", icon: <Sparkles className="h-4 w-4" /> },
  { label: "Settings", href: "/dashboard/pro/settings", icon: <Settings className="h-4 w-4" /> },
];

export default async function ProDashboardLayout({ children }: { children: React.ReactNode }) {
  const serverUser = await getServerUser();
  const entitlements = await getEntitlements();

  // Admins can access without restrictions
  if (entitlements.isAdmin) {
    const user = serverUser || (await getDemoUser(DEMO_BUSINESS_USER_ID))!;
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar
          navItems={navItems}
          user={user}
          roleLabel="Ploy Pro (Admin Access)"
          entitlements={entitlements}
        />
        <main className="surface-dashboard flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    );
  }

  if (!serverUser) {
    redirect("/sign-in?redirect=/dashboard/pro");
  }

  if (!serverUser.email_verified) {
    redirect("/verify-email?redirect=/dashboard/pro");
  }

  // Owning Consulting Pro as well is fine — entitlements are per-product, so
  // a second purchase never revokes access to the first.
  if (!entitlements.pro) {
    redirect("/pricing");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        navItems={navItems}
        user={serverUser}
        roleLabel="Ploy Pro"
        entitlements={entitlements}
      />
      <main className="surface-dashboard flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
