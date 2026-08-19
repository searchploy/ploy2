"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubscriptionType } from "@/lib/types/database";

const dashboards = [
  {
    type: "pro" as const,
    name: "Ploy Pro",
    href: "/dashboard/pro",
    icon: LayoutDashboard,
    description: "For business & agencies",
  },
  {
    type: "consulting" as const,
    name: "Consulting Pro",
    href: "/dashboard/consultant",
    icon: Users2,
    description: "For AI consultants",
  },
];

/**
 * Lists only the dashboards the user actually owns, so a single-product
 * subscriber never sees a link that would just bounce them to pricing.
 * Presentation only — each dashboard re-checks entitlements server-side.
 */
export function DashboardSwitcher({ owned }: { owned: SubscriptionType[] }) {
  const pathname = usePathname();

  const available = dashboards.filter((d) => owned.includes(d.type));

  // Nothing to switch between — hide the section entirely.
  if (available.length < 2) return null;

  const currentDashboard = available.find((d) => pathname.startsWith(d.href))?.name;

  return (
    <div className="mb-8 space-y-2 border-b border-border pb-6">
      <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Dashboards
      </h3>
      <nav className="space-y-1">
        {available.map((dashboard) => {
          const Icon = dashboard.icon;
          const isActive = currentDashboard === dashboard.name;

          return (
            <Link
              key={dashboard.href}
              href={dashboard.href}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "gold-hairline gold-glow bg-ploy-gold/[0.07] text-ploy-gold [&_svg]:text-ploy-gold"
                  : "border-transparent text-muted-foreground hover:border-[color:var(--gold-line)] hover:bg-secondary/50 hover:text-foreground"
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
