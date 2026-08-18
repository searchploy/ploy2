import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/pricing/upgrade-button";

const CheckoutStatusToast = dynamic(() => import("@/components/pricing/checkout-status-toast").then(mod => ({ default: mod.CheckoutStatusToast })));

export const metadata: Metadata = {
  title: "Business Pricing",
  description: "Generate personalized AI Workforce Reports, discover high-impact AI opportunities, and build a roadmap for implementing AI in your business.",
};

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

const testimonials = [
  {
    quote: "Ploy Pro helped us identify $2.3M in annual savings. The roadmap alone paid for itself in the first month.",
    author: "Sarah Chen",
    company: "TechFlow Inc.",
    role: "VP Operations",
  },
  {
    quote: "The AI recommendations were so specific to our workflow. We implemented three suggestions and cut processing time by 40%.",
    author: "Marcus Johnson",
    company: "Global Logistics",
    role: "Operations Director",
  },
  {
    quote: "Finally, a tool that speaks our language. The ROI projections helped convince our CFO to approve the AI initiative.",
    author: "Emily Rodriguez",
    company: "FinanceFlow Solutions",
    role: "CEO",
  },
  {
    quote: "The monthly updates keep us ahead of the curve. We went from exploring AI to leading the industry in just 6 months.",
    author: "David Park",
    company: "Innovation Labs",
    role: "Founder",
  },
  {
    quote: "We were skeptical about AI until we saw the actual numbers. The department-by-department analysis showed us exactly where to start.",
    author: "Michelle Lee",
    company: "Retail Dynamics",
    role: "Operations Head",
  },
  {
    quote: "The PDF export feature alone is worth the upgrade. We've shared reports with 30+ clients and closed 5 major deals.",
    author: "Thomas Wright",
    company: "Business Consultants LLC",
    role: "Managing Partner",
  },
];


export default function BusinessPricingPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={null}>
        <CheckoutStatusToast />
      </Suspense>

      <header className="relative overflow-hidden py-24">
        <div className="container flex flex-col items-center gap-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-ploy-blue">For Businesses</span>
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
              {/* Free */}
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
                      <Check className="h-4 w-4 text-ploy-blue flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto space-y-4">
                  <p className="text-xs text-muted-foreground">Ploy takes 20% commission on sales</p>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="/report">Start free</Link>
                  </Button>
                </div>
              </div>

              {/* Ploy Pro */}
              <div className="shadow-glow-card flex flex-col gap-4 rounded-3xl border border-transparent bg-card p-8">
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ploy-blue">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ploy Pro
                  </p>
                  <p className="font-mono text-3xl font-bold">
                    $29.99<span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Unlimited reports + complete implementation strategy.</p>

                {/* Key Features */}
                <div className="space-y-2 py-4">
                  {proKeyFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-ploy-blue flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto space-y-4">
                  <p className="text-xs text-muted-foreground">Ploy takes 10% commission on sales</p>
                  <UpgradeButton subscriptionType="pro" returnTo="/pricing" size="lg" className="w-full">
                    Upgrade to Ploy Pro
                  </UpgradeButton>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mt-24">
              <h2 className="mb-12 text-center text-2xl font-bold tracking-tight">Loved by Teams Like Yours</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {testimonials.map((testimonial, i) => (
                  <div
                    key={i}
                    className="animate-slide-right rounded-2xl border border-border bg-card p-6 opacity-0"
                    style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
                  >
                    <p className="mb-4 text-sm italic text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-xs text-ploy-blue">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
