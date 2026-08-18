"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Store, Sparkles, Users2, Building2, LayoutDashboard, User, type LucideIcon } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { AccountMenu } from "@/components/layout/account-menu";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database";

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
  const [subscription, setSubscription] = useState<Database["public"]["Tables"]["subscriptions"]["Row"] | null>(null);
  const pathname = usePathname();
  const supabaseRef = useRef(() => createClient());

  useEffect(() => {
    const supabase = supabaseRef.current();
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        const { data: userSubscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        setSubscription(userSubscription);
      }
    };
    getUser();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data }) => setSubscription(data));
      }
    });

    return () => authSubscription?.unsubscribe();
  }, []);


  const getDashboardPath = () => {
    if (!subscription) return null;
    if (subscription.type === 'pro') return '/dashboard/pro';
    if (subscription.type === 'consulting') return '/dashboard/consultant';
    return null;
  };

  const hasPaidSubscription = subscription && (subscription.type === 'pro' || subscription.type === 'consulting');
  const dashboardPath = getDashboardPath();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-black">
      <div className="flex h-16 items-center justify-center relative px-4">
        <Link href="/" className="absolute left-4">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-secondary/50 p-1.5 md:flex">
          {NAV_LINKS.map((link) => {
            const Icon = NAV_ICONS[link.href];
            const active = pathname === link.href || pathname?.startsWith(link.href);
            return (
              <motion.div key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active ? "bg-ploy-blue text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex absolute right-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <div className="h-5 w-5 rounded-full bg-ploy-blue flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-foreground">{user.email?.split("@")[0]}</span>
              </button>
              <AccountMenu
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                userEmail={user.email || ""}
              />
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Log in
              </Link>
              <Button asChild size="sm">
                <Link href="/#get-started">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden absolute right-4"
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
            className="overflow-hidden border-t border-border md:hidden"
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
                      active ? "text-ploy-blue" : "text-muted-foreground hover:text-foreground"
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
                    {hasPaidSubscription && dashboardPath && (
                      <Link
                        href={dashboardPath}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-ploy-blue"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/account/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-ploy-blue"
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
