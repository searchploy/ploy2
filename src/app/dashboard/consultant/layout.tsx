import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  BarChart3,
  BookOpen,
  FileText,
} from "lucide-react";
import { DashboardSidebar, type DashboardNavItem } from "@/components/dashboard/sidebar";
import { getServerUser } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard/consultant", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Clients", href: "/dashboard/consultant/clients", icon: <Users2 className="h-4 w-4" /> },
  { label: "AI Reports", href: "/dashboard/consultant/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Classroom", href: "/dashboard/consultant/classroom", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Resources", href: "/dashboard/consultant/resources", icon: <FileText className="h-4 w-4" /> },
];

export default async function ConsultantDashboardLayout({ children }: { children: React.ReactNode }) {
  const serverUser = await getServerUser();
  const isAdmin = await isAdminUser();

  // Admins can access without restrictions
  if (isAdmin) {
    if (!serverUser) redirect("/sign-in");
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar navItems={navItems} user={serverUser} roleLabel="Consultant Dashboard (Admin Access)" />
        <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
      </div>
    );
  }

  // Regular users must have:
  // 1. Email verified
  // 2. Active consulting subscription
  // 3. Correct subscription type (consulting)
  if (!serverUser) {
    redirect("/sign-in?redirect=/dashboard/consultant");
  }

  if (!serverUser.email_verified) {
    redirect("/verify-email?redirect=/dashboard/consultant");
  }

  if (serverUser.subscription_type !== "consulting") {
    redirect("/consultants");
  }

  if (serverUser.subscription_plan !== "pro") {
    redirect("/consultants");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar navItems={navItems} user={serverUser} roleLabel="Consulting Pro" />
      <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
    </div>
  );
}
