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
import { getEntitlements } from "@/lib/auth/entitlements";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard/consultant", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Clients", href: "/dashboard/consultant/clients", icon: <Users2 className="h-4 w-4" /> },
  { label: "AI Reports", href: "/dashboard/consultant/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Classroom", href: "/dashboard/consultant/classroom", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Resources", href: "/dashboard/consultant/resources", icon: <FileText className="h-4 w-4" /> },
];

export default async function ConsultantDashboardLayout({ children }: { children: React.ReactNode }) {
  const serverUser = await getServerUser();
  const entitlements = await getEntitlements();

  // Admins can access without restrictions
  if (entitlements.isAdmin) {
    if (!serverUser) redirect("/sign-in");
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar
          navItems={navItems}
          user={serverUser}
          roleLabel="Consultant Dashboard (Admin Access)"
          entitlements={entitlements}
        />
        <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
      </div>
    );
  }

  if (!serverUser) {
    redirect("/sign-in?redirect=/dashboard/consultant");
  }

  if (!serverUser.email_verified) {
    redirect("/verify-email?redirect=/dashboard/consultant");
  }

  // Owning Ploy Pro as well is fine — entitlements are per-product, so a
  // second purchase never revokes access to the first.
  if (!entitlements.consulting) {
    redirect("/consultants");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        navItems={navItems}
        user={serverUser}
        roleLabel="Consulting Pro"
        entitlements={entitlements}
      />
      <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
    </div>
  );
}
