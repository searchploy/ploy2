"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Settings,
  User,
  Store,
  Zap,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface MenuSection {
  label: string;
  items: MenuItem[];
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  isDangerous?: boolean;
}

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function AccountMenu({ isOpen, onClose, userEmail }: AccountMenuProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    onClose();
  };

  const menuSections: MenuSection[] = [
    {
      label: "Profile",
      items: [
        { icon: User, label: "View Profile", href: "/account/profile" },
      ],
    },
    {
      label: "Marketplace",
      items: [
        {
          icon: Store,
          label: "My Listing",
          href: "/account/marketplace/listing",
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          icon: Settings,
          label: "Settings",
          href: "/account/settings",
        },
        {
          icon: CreditCard,
          label: "Billing & Subscription",
          href: "/account/billing",
        },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-12 w-56 rounded-lg border border-border bg-card shadow-lg overflow-hidden"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border bg-secondary/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Signed in as
            </p>
            <p className="text-sm font-medium text-foreground truncate">
              {userEmail}
            </p>
          </div>

          {/* Menu Sections */}
          {menuSections.map((section, idx) => (
            <div key={section.label}>
              {idx > 0 && <div className="h-px bg-border" />}

              <div className="px-2 py-2">
                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {section.label}
                </p>

                {section.items.map((item) => {
                  const Icon = item.icon;

                  if (item.onClick) {
                    return (
                      <button
                        key={item.label}
                        onClick={item.onClick}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-2 rounded text-sm font-medium transition-colors",
                          item.isDangerous
                            ? "text-destructive hover:bg-destructive/10"
                            : "text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href || "#"}
                      onClick={() => onClose()}
                      className={cn(
                        "flex items-center gap-2 px-2 py-2 rounded text-sm font-medium transition-colors",
                        item.isDangerous
                          ? "text-destructive hover:bg-destructive/10"
                          : "text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sign Out */}
          <div className="border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
