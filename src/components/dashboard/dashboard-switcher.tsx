"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const dashboards = [
  {
    name: "Business",
    href: "/dashboard/business",
    icon: LayoutDashboard,
    description: "For business teams",
  },
  {
    name: "Consultant",
    href: "/dashboard/consultant",
    icon: Users2,
    description: "For AI consultants",
  },
  {
    name: "Agency",
    href: "/dashboard/agency",
    icon: Building2,
    description: "For AI agencies",
  },
];

export function DashboardSwitcher() {
  const pathname = usePathname();

  // Determine current dashboard based on pathname
  const currentDashboard = dashboards.find((d) => pathname.startsWith(d.href))?.name;

  return (
    <div className="mb-8 space-y-2 border-b border-border pb-6">
      <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Dashboards
      </h3>
      <nav className="space-y-1">
        {dashboards.map((dashboard) => {
          const Icon = dashboard.icon;
          const isActive = currentDashboard === dashboard.name;

          return (
            <Link
              key={dashboard.href}
              href={dashboard.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-ploy-blue text-white shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span>{dashboard.name}</span>
                <span className="text-xs opacity-75">{dashboard.description}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
