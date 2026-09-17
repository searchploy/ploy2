import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { getPrice } from "@/lib/stripe/server";

const CheckoutStatusToast = dynamic(() => import("@/components/pricing/checkout-status-toast").then(mod => ({ default: mod.CheckoutStatusToast })));

export const metadata: Metadata = {
  title: "Business Pricing",
  description: "Generate personalized AI Workforce Reports, discover high-impact AI opportunities, and build a roadmap for implementing AI in your business.",
};

// Same reason as /consultants: the Pro price comes from Stripe, so the page
// must not be frozen at build time or a price change needs a redeploy.
export const revalidate = 3600;

const freeKeyFeatures = [
  "Browse AI employees",
  "AI Readiness Score",
  "Limited AI reports",
];

const proKeyFeatures = [
  "Unlimited AI reports",
  "Department-by-department analysis",
  "Complete implementation roadmap",
  "ROI calculator",
  "Priority matrix",
  "Unlimited AI recommendations",
  "Agency recommendations",
  "Saved reports",
  "PDF export",
  "Future AI opportunities",
  "Monthly AI strategy updates",
  "Premium support",
];

// The testimonial list that sat here held invented quotes attributed to named
// people at named companies. Removed rather than reworded — see
// lib/data/testimonials.ts for where real, permissioned quotes should live.

export default async function BusinessPricingPage() {
  const proPrice = await getPrice("pro");

  return (
    <div className="flex flex-col">
      <Suspense fallback={null}>
        <CheckoutStatusToast />
      </Suspense>

      <header className="relative overflow-hidden py-24">
        <div className="container flex flex-col items-center gap-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-ploy-gold">For Businesses</span>
          <h1 className="text-balance max-w-3xl text-4xl font-bold tracking-tighter sm:text-6xl">
            Unlock Your Complete <span className="gradient-text">AI Workforce Strategy</span>
          </h1>
          <p className="max-w-xl text-balance text-lg text-muted-foreground">
            Generate personalized AI Workforce Reports, discover high-impact AI opportunities, and
            build a roadmap for implementing AI in your business.
          </p>
        </div>
      </header>

      <section className="pb-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Pricing Cards - Primary Focus */}
            <div className="mb-16 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Free</p>
                  <p className="font-mono text-3xl font-bold">
                    $0<span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Get started discovering AI opportunities for your business.</p>

                {/* Key Features */}
                <div className="space-y-2 py-4">
                  {freeKeyFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-ploy-gold flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button asChild variant="outline" size="lg" className="mt-auto">
                  <Link href="/report">Start free</Link>
                </Button>
              </div>

              <div className="shadow-glow-card flex flex-col gap-4 rounded-3xl border border-transparent bg-card p-8">
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ploy-gold">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ploy Pro
                  </p>
                  <p className="font-mono text-3xl font-bold">
                    ${proPrice?.amount.toFixed(0) ?? "29"}<span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Get premium visibility, unlimited reports, and grow faster.</p>

                {/* Key Features */}
                <div className="space-y-2 py-4">
                  {proKeyFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-ploy-gold flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <UpgradeButton subscriptionType="pro" returnTo="/pricing" size="lg" className="mt-auto">
                  Upgrade to Ploy Pro
                </UpgradeButton>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
