"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/logo";
import { DashboardSwitcher } from "@/components/dashboard/dashboard-switcher";
import { cn, initials } from "@/lib/utils";
import type { Entitlements } from "@/lib/auth/entitlements";

/** Structural shape both the mock `User` and real `Profile` types satisfy. */
export interface DashboardSidebarUser {
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export interface DashboardNavItem {
  label: string;
  href: string;
  /**
   * A rendered icon element (e.g. `<LayoutDashboard className="h-4 w-4" />`),
   * not a bare component reference — this crosses a Server → Client
   * Component boundary (layouts are Server Components, this sidebar is a
   * Client Component), and only serializable elements survive that
   * boundary, not raw function/forwardRef values.
   */
  icon: React.ReactNode;
}

export function DashboardSidebar({
  navItems,
  user,
  roleLabel,
  entitlements,
}: {
  navItems: DashboardNavItem[];
  user: DashboardSidebarUser;
  roleLabel: string;
  entitlements: Entitlements;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        <DashboardSwitcher owned={entitlements.owned} />
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{roleLabel}</p>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 border-t border-border p-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name ?? ""} />
          <AvatarFallback>{initials(user.full_name ?? user.email ?? "U")}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.full_name ?? "—"}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email ?? ""}</p>
        </div>
        <Link href="/" className="text-muted-foreground hover:text-foreground" title="Sign out">
          <LogOut className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
