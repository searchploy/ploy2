"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/lib/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface BillingPageContentProps {
  profile: Profile | null;
  subscription: Subscription | null;
}

const PLANS = {
  free: {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Browse AI employees",
      "AI Readiness Score",
      "Limited AI reports",
      "Basic analytics",
    ],
  },
  pro: {
    name: "Ploy Pro",
    price: "$29.99",
    interval: "/month",
    description: "For growing businesses",
    features: [
      "Unlimited AI reports",
      "Department-by-department analysis",
      "Complete implementation roadmap",
      "ROI calculator",
      "Priority matrix",
      "Unlimited recommendations",
      "PDF export",
      "Saved reports",
      "Priority support",
    ],
  },
};

export function BillingPageContent({
  profile,
  subscription,
}: BillingPageContentProps) {
  if (!profile) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const currentPlan = subscription?.plan || "free";
  const isActive = subscription?.status === "active";

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">
                  {PLANS[currentPlan as keyof typeof PLANS]?.name || "Unknown"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {PLANS[currentPlan as keyof typeof PLANS]?.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {PLANS[currentPlan as keyof typeof PLANS]?.price}
                </p>
                {(PLANS[currentPlan as keyof typeof PLANS] as any)?.interval && (
                  <p className="text-sm text-muted-foreground">
                    {(PLANS[currentPlan as keyof typeof PLANS] as any)?.interval}
                  </p>
                )}
              </div>
            </div>

            {isActive && subscription?.current_period_end && (
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Your subscription renews on{" "}
                  <strong>
                    {format(
                      new Date(subscription.current_period_end),
                      "MMMM d, yyyy"
                    )}
                  </strong>
                </p>
              </div>
            )}

            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-medium mb-3">Included Features:</p>
              <div className="space-y-2">
                {PLANS[currentPlan as keyof typeof PLANS]?.features.map(
                  (feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {currentPlan === "free" && (
              <div className="border-t border-border pt-4 mt-4">
                <Button asChild className="w-full">
                  <Link href="/pricing">Upgrade to Ploy Pro</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Subscription Status */}
        {subscription && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Subscription Status</h2>
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {subscription.status
                    ? subscription.status.charAt(0).toUpperCase() +
                      subscription.status.slice(1)
                    : "Unknown"}
                </span>
              </div>

              {subscription.current_period_start && (
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Billing Period Start
                  </p>
                  <p className="text-sm font-medium">
                    {format(
                      new Date(subscription.current_period_start),
                      "MMMM d, yyyy"
                    )}
                  </p>
                </div>
              )}

              {subscription.current_period_end && (
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Billing Period End
                  </p>
                  <p className="text-sm font-medium">
                    {format(
                      new Date(subscription.current_period_end),
                      "MMMM d, yyyy"
                    )}
                  </p>
                </div>
              )}

              {isActive && (
                <div className="border-t border-border pt-4">
                  <Button variant="outline" size="sm">
                    Manage Subscription
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Billing History */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Billing History</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              No billing history available
            </p>
          </div>
        </section>

        {/* Other Plans */}
        {currentPlan === "free" && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Upgrade Options</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upgrade to Ploy Pro to unlock advanced features and
                  capabilities.
                </p>
                <Button asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
