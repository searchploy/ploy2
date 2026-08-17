import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export default function AdminEmployeesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <span className="text-sm text-muted-foreground">Admin · Employees</span>
          </div>

          <Link
            href="/dashboard/admin"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Full admin dashboard
          </Link>
        </div>
      </header>

      <main className="container py-10">{children}</main>
    </div>
  );
}
