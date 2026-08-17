import {
  LayoutDashboard,
  Package,
  BarChart3,
  Users2,
  DollarSign,
  Building2,
  Receipt,
  Percent,
} from "lucide-react";
import { DashboardSidebar, type DashboardNavItem } from "@/components/dashboard/sidebar";
import { getDemoUser, DEMO_AGENCY_USER_ID } from "@/lib/data/users";
import { getServerUser } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

/**
 * In production this layout calls `getServerUser()` from
 * `src/lib/supabase/server.ts`, verifies `role === "agency"` or is admin, and redirects
 * unauthenticated/unauthorized visitors to /sign-in. Admin users can bypass subscription
 * requirements. It's seeded with a demo agency user here since no live Supabase session
 * exists in this environment.
 */
const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/agency", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Listings", href: "/dashboard/agency/listings", icon: <Package className="h-4 w-4" /> },
  { label: "Analytics", href: "/dashboard/agency/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Leads", href: "/dashboard/agency/leads", icon: <Users2 className="h-4 w-4" /> },
  { label: "Pricing", href: "/dashboard/agency/pricing", icon: <DollarSign className="h-4 w-4" /> },
  { label: "Sales", href: "/dashboard/agency/sales", icon: <Receipt className="h-4 w-4" /> },
  { label: "Commissions", href: "/dashboard/agency/commissions", icon: <Percent className="h-4 w-4" /> },
  { label: "Profile", href: "/dashboard/agency/profile", icon: <Building2 className="h-4 w-4" /> },
];

export default async function AgencyDashboardLayout({ children }: { children: React.ReactNode }) {
  // Redirect to unified /dashboard/pro
  redirect("/dashboard/pro");
}
