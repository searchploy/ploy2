import {
  LayoutDashboard,
  Building2,
  Package,
  Users,
  Receipt,
  Percent,
  BarChart3,
  BookOpen,
  FileText,
} from "lucide-react";
import { redirect } from "next/navigation";
import { DashboardSidebar, type DashboardNavItem } from "@/components/dashboard/sidebar";
import { getDemoUser, DEMO_ADMIN_USER_ID } from "@/lib/data/users";
import { getServerUser } from "@/lib/supabase/server";
import { getEntitlements } from "@/lib/auth/entitlements";
const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Agencies", href: "/dashboard/admin/agencies", icon: <Building2 className="h-4 w-4" /> },
  { label: "Listings", href: "/dashboard/admin/listings", icon: <Package className="h-4 w-4" /> },
  { label: "Reports", href: "/dashboard/admin/reports", icon: <FileText className="h-4 w-4" /> },
  { label: "Users", href: "/dashboard/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Sales", href: "/dashboard/admin/sales", icon: <Receipt className="h-4 w-4" /> },
  { label: "Commissions", href: "/dashboard/admin/commissions", icon: <Percent className="h-4 w-4" /> },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Classroom", href: "/dashboard/admin/classroom", icon: <BookOpen className="h-4 w-4" /> },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const entitlements = await getEntitlements();

  // Admin-only. This runs before any page renders, so the URL cannot be
  // used to reach the admin dashboard without an admin session.
  if (!entitlements.isAdmin) {
    const serverUser = await getServerUser();
    redirect(serverUser ? "/" : "/sign-in?redirect=/dashboard/admin");
  }

  const user = (await getServerUser()) ?? (await getDemoUser(DEMO_ADMIN_USER_ID))!;

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        navItems={navItems}
        user={user}
        roleLabel="Admin dashboard"
        entitlements={entitlements}
      />
      <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
    </div>
  );
}
