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
  const user = await getServerUser();
  const isAdmin = await isAdminUser();

  if (!user) redirect("/sign-in?redirect=/dashboard/consultant");
  // Admin users can access consultant dashboard, others need consultant role
  if (!isAdmin && user.role !== "consultant") redirect("/");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar navItems={navItems} user={user} roleLabel="Consultant dashboard" />
      <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
    </div>
  );
}
