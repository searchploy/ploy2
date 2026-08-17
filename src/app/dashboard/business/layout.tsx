import {
  LayoutDashboard,
  Heart,
  CalendarClock,
  ShoppingBag,
  MessageSquare,
  Receipt,
  Settings,
} from "lucide-react";
import { DashboardSidebar, type DashboardNavItem } from "@/components/dashboard/sidebar";
import { getDemoUser, DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getServerUser } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

/**
 * In production this layout calls `getServerUser()`, verifies
 * `role === "business"` or is admin, and redirects unauthenticated visitors to
 * /sign-in. Admin users can bypass subscription requirements. Seeded with a demo
 * business user here since no live Supabase session exists in this environment.
 */
const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard/business", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Saved", href: "/dashboard/business/saved", icon: <Heart className="h-4 w-4" /> },
  { label: "Demo requests", href: "/dashboard/business/demos", icon: <CalendarClock className="h-4 w-4" /> },
  { label: "Purchases", href: "/dashboard/business/purchases", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Messages", href: "/dashboard/business/messages", icon: <MessageSquare className="h-4 w-4" /> },
  { label: "Invoices", href: "/dashboard/business/invoices", icon: <Receipt className="h-4 w-4" /> },
  { label: "Settings", href: "/dashboard/business/settings", icon: <Settings className="h-4 w-4" /> },
];

export default async function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  // Redirect to unified /dashboard/pro
  redirect("/dashboard/pro");
}
