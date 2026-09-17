"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Store, Sparkles, Users2, Building2, LayoutDashboard, User, type LucideIcon } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { AccountMenu } from "@/components/layout/account-menu";
import { NAV_LINKS, ADMIN_EMAIL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_ICONS: Record<string, LucideIcon> = {
  "/marketplace": Store,
  "/report": Sparkles,
  "/for-agencies": Building2,
  "/consultants": Users2,
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dashboardPath, setDashboardPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const supabaseRef = useRef(() => createClient());

  // The bar sits directly on the hero photograph, so it only earns a surface
  // once the photograph has scrolled out from under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current();

    // Mirrors the checks the dashboard layouts enforce server-side, so the link
    // only shows when it would actually resolve. profiles is the source of
    // truth here (same columns the layouts read), not the subscriptions table.
    const resolveDashboard = async (authUser: AuthUser | null) => {
      if (!authUser) {
        setDashboardPath(null);
        return;
      }

      if (authUser.email === ADMIN_EMAIL) {
        setDashboardPath("/dashboard/pro");
        return;
      }

      // Read the subscriptions table, not profiles.subscription_type — that
      // column holds a single value, so owning both products would hide one.
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("type")
        .eq("profile_id", authUser.id)
        .eq("status", "active")
        .eq("plan", "pro");

      const owned = new Set((subs ?? []).map((s) => s.type));

      if (owned.has("pro")) {
        setDashboardPath("/dashboard/pro");
      } else if (owned.has("consulting")) {
        setDashboardPath("/dashboard/consultant");
      } else {
        setDashboardPath(null);
      }
    };

    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      await resolveDashboard(authUser);
    };
    init();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      resolveDashboard(nextUser);
    });

    return () => authSubscription?.unsubscribe();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-500",
        scrolled
          ? "border-white/10 bg-black/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="relative flex h-20 items-center justify-center px-6">
        <Link href="/" className="absolute left-6">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-300",
                  active ? "text-white" : "text-white/50 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute right-6 hidden items-center gap-7 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <User className="h-3 w-3" />
                </span>
                {user.email?.split("@")[0]}
              </button>
              <AccountMenu
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                userEmail={user.email || ""}
                dashboardPath={dashboardPath}
              />
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50 transition-colors duration-300 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/#get-started"
                className="border-b border-white/70 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-ploy-gold hover:text-ploy-gold"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="absolute right-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-md md:hidden"
          >
            <div className="container flex flex-col gap-4 py-4">
              {NAV_LINKS.map((link) => {
                const Icon = NAV_ICONS[link.href];
                const active = pathname === link.href || pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium",
                      active ? "text-ploy-gold" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                );
              })}
              <div className={cn("flex flex-col gap-2 pt-2 border-t border-border")}>
                {user ? (
                  <>
                    {dashboardPath && (
                      <Link
                        href={dashboardPath}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-ploy-gold"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-ploy-gold"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Log in
                    </Link>
                    <Button asChild size="sm">
                      <Link href="/#get-started" onClick={() => setOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
