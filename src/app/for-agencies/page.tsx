import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { CheckoutStatusToast } from "@/components/pricing/checkout-status-toast";
import { ProVisibilityDisclosure } from "@/components/legal/disclosures";
import { getPrice } from "@/lib/stripe/server";

export const metadata: Metadata = {
  title: "For Agencies",
  description: "Grow your AI agency with Ploy Pro. Get premium marketplace visibility, featured placement, and unlimited AI reports.",
};

const freeKeyFeatures = [
  "List 1 AI tool",
  "Limited AI reports",
  "Basic analytics",
  "Agency profile",
];

const proKeyFeatures = [
  "Higher marketplace ranking",
  "Featured listings",
  "Up to 5 AI tool listings",
  "Unlimited AI reports",
  "Verified agency badge",
  "Priority review",
  "Advanced analytics",
  "Lead conversion analytics",
  "Trending placement",
  "Priority support",
];

// The testimonial list that sat here held invented quotes attributed to named
// people at named companies, several making specific outcome claims ("tripled
// our qualified leads", "conversions are up 65%"). Removed rather than
// reworded — see lib/data/testimonials.ts.

export default async function ForAgenciesPage() {
  const proPrice = await getPrice("pro");
  return (
    <div className="flex flex-col">
      <Suspense fallback={null}>
        <CheckoutStatusToast />
      </Suspense>

      <header className="relative overflow-hidden py-24">
        <div className="container flex flex-col items-center gap-6 text-center">
          <span className="eyebrow-caps text-[0.7rem] text-ploy-gold">For Agencies</span>
          <h1 className="display-caps text-balance max-w-4xl text-[1.6rem] sm:text-[1.875rem] lg:text-[2.6rem]">
            Unlock More with <span className="gradient-text">Ploy Pro</span>
          </h1>
          <p className="max-w-xl text-balance text-lg text-muted-foreground">
            List your AI tool on the marketplace, then get premium visibility, featured
            placement, and appear in more AI reports.
          </p>
        </div>
      </header>

      <section className="pb-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-2xl font-bold tracking-tight">Why Choose Ploy Pro</h2>

            {/* Pricing Cards - Primary Focus */}
            <div className="mb-16 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Free</p>
                  <p className="font-mono text-3xl font-bold">
                    $0<span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Get started listing your AI tool and reaching businesses on Ploy.</p>

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
                  <Link href="/sign-up?role=agency">
                    List for Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="shadow-glow-card flex flex-col gap-4 rounded-3xl border border-transparent bg-card p-8">
                <div>
                  <p className="mb-3 flex items-center gap-1.5 eyebrow-caps text-[0.7rem] text-ploy-gold">
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

                <UpgradeButton
                  subscriptionType="pro"
                  returnTo="/pricing"
                  size="lg"
                  variant="gradient"
                  className="mt-auto rounded-none text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  Upgrade to Ploy Pro
                </UpgradeButton>
              </div>
            </div>

            {/* Sits with the plan that markets the visibility benefits, not in
                the footer — this is where the claim is actually made. */}
            <ProVisibilityDisclosure className="mb-16" />

          </div>
        </div>
      </section>
    </div>
  );
}
