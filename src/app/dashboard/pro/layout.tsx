import {
  LayoutDashboard,
  Heart,
  Layers,
  BarChart3,
  TrendingUp,
  Users,
  Receipt,
  MessageSquare,
  Settings,
} from "lucide-react";
import { DashboardSidebar, type DashboardNavItem } from "@/components/dashboard/sidebar";
import { getDemoUser, DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getServerUser } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/auth/entitlements";
import { redirect } from "next/navigation";

const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/pro", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Listings", href: "/dashboard/pro/listings", icon: <Layers className="h-4 w-4" /> },
  { label: "Saved", href: "/dashboard/pro/saved", icon: <Heart className="h-4 w-4" /> },
  { label: "Analytics", href: "/dashboard/pro/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Sales", href: "/dashboard/pro/sales", icon: <TrendingUp className="h-4 w-4" /> },
  { label: "Leads", href: "/dashboard/pro/leads", icon: <Users className="h-4 w-4" /> },
  { label: "Invoices", href: "/dashboard/pro/invoices", icon: <Receipt className="h-4 w-4" /> },
  { label: "Messages", href: "/dashboard/pro/messages", icon: <MessageSquare className="h-4 w-4" /> },
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
        <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
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
      <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
    </div>
  );
}
