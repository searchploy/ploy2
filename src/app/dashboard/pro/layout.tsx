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
import { isAdminUser } from "@/lib/auth/admin";
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
  const isAdmin = await isAdminUser();

  const user = serverUser || (await getDemoUser(DEMO_BUSINESS_USER_ID))!;

  // Allow only business and agency users with Ploy Pro subscription, plus admins
  // Free tier users (consultants, other roles) should NOT have dashboard access
  if (!isAdmin && (serverUser?.role !== "business" && serverUser?.role !== "agency")) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar navItems={navItems} user={user} roleLabel="Ploy Pro" />
      <main className="flex-1 overflow-y-auto bg-secondary/20 p-8">{children}</main>
    </div>
  );
}
