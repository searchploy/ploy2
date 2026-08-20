"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { format } from "date-fns";
import { useTransition } from "react";
import { manageBillingAction } from "./actions";
import type { Database } from "@/lib/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface BillingPageContentProps {
  profile: Profile | null;
  subscriptions: Subscription[];
  prices: Record<string, { amount: number }>;
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
  consultant: {
    name: "Ploy Consulting",
    interval: "/month",
    description: "For AI consultants",
    features: [
      "Everything in Ploy Pro",
      "CRM dashboard",
      "Lead management",
      "Pipeline tracking",
      "Deal tracking",
      "Unlimited client contacts",
      "Consultation tools",
    ],
  },
};

export function BillingPageContent({
  profile,
  subscriptions,
  prices,
}: BillingPageContentProps) {
  const [isPending, startTransition] = useTransition();

  if (!profile) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const hasProSubscription = subscriptions.some(s => s.type === "pro" && s.status === "active");
  const hasConsultantSubscription = subscriptions.some(s => s.type === "consultant" && s.status === "active");
  const hasAnySubscription = subscriptions.length > 0;

  const handleManageBilling = (stripeSubscriptionId: string) => {
    startTransition(async () => {
      await manageBillingAction(stripeSubscriptionId);
    });
  };

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

        {/* Active Subscriptions */}
        {hasAnySubscription ? (
          <section>
            <h2 className="text-lg font-semibold mb-4">Active Subscriptions</h2>
            <div className="space-y-4">
              {subscriptions.map((subscription) => {
                const planType = subscription.type as keyof typeof PLANS;
                const plan = PLANS[planType];
                const price = prices[subscription.type];
                const isActive = subscription.status === "active";

                return (
                  <div key={subscription.id} className="rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">{plan?.name || "Unknown"}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan?.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">
                          ${price?.amount.toFixed(2) ?? "29.99"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {plan?.interval}
                        </p>
                      </div>
                    </div>

                    {isActive && subscription.current_period_end && (
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
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium">Included Features:</p>
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
                      <div className="space-y-2">
                        {plan?.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isActive && subscription.stripe_subscription_id && (
                      <div className="border-t border-border pt-4 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageBilling(subscription.stripe_subscription_id!)}
                          disabled={isPending}
                        >
                          {isPending ? "Loading..." : "Manage Subscription"}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Perfect for getting started
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">$0</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-sm font-medium mb-3">Included Features:</p>
                <div className="space-y-2">
                  {PLANS.free.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/pricing">Upgrade to Ploy Pro</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/consultants">Try Consulting Plan</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Upgrade Options */}
        {!hasProSubscription && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Upgrade to Ploy Pro</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get unlimited AI reports, department analysis, implementation roadmaps, and more.
                </p>
                <Button asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {!hasConsultantSubscription && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Become an AI Consultant</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Help businesses implement AI and grow your consulting business with access to our CRM dashboard.
                </p>
                <Button asChild>
                  <Link href="/consultants">Learn More</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
