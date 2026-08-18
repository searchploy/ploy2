import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { CheckoutStatusToast } from "@/components/pricing/checkout-status-toast";

export const metadata: Metadata = {
  title: "For Agencies",
  description: "Grow your AI agency with Ploy Pro. Get premium marketplace visibility and unlimited AI reports.",
};

const freeKeyFeatures = [
  "List AI employees",
  "Basic analytics",
  "Agency profile",
];

const proKeyFeatures = [
  "Unlimited AI reports",
  "Featured listings",
  "Higher marketplace ranking",
  "Homepage placement",
  "Verified agency badge",
  "Priority review",
  "Advanced analytics",
  "Lead conversion analytics",
  "Trending placement",
  "Unlimited employee listings",
  "Priority support",
];

const testimonials = [
  {
    quote: "Ploy Pro tripled our qualified leads in just 3 months. The featured placement made all the difference.",
    author: "Jessica Wong",
    company: "AI Solutions Group",
    role: "Founder",
  },
  {
    quote: "The verified badge alone has built so much trust with our clients. Conversions are up 65%.",
    author: "Robert Martinez",
    company: "Automation Experts",
    role: "Managing Director",
  },
  {
    quote: "Advanced analytics showed us exactly which AI recommendations resonate. We've doubled our average deal size.",
    author: "Lisa Thompson",
    company: "Digital Transformation Co",
    role: "VP Sales",
  },
  {
    quote: "From struggling to get noticed to trending on Ploy. This year we grew from 2 to 5 full-time consultants.",
    author: "James Chen",
    company: "NextGen AI",
    role: "CEO",
  },
  {
    quote: "The priority review process is a game changer. Our employees get featured faster, and clients trust us more immediately.",
    author: "Amanda Foster",
    company: "Workflow AI Partners",
    role: "Operations Lead",
  },
  {
    quote: "Unlimited employee listings mean we can scale our team without worrying about marketplace limitations. Revenue is up 120%.",
    author: "Kevin Sullivan",
    company: "Enterprise AI Solutions",
    role: "President",
  },
];


export default function ForAgenciesPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={null}>
        <CheckoutStatusToast />
      </Suspense>

      <header className="relative overflow-hidden py-24">
        <div className="container flex flex-col items-center gap-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-ploy-blue">For Agencies</span>
          <h1 className="text-balance max-w-3xl text-4xl font-bold tracking-tighter sm:text-6xl">
            Grow Your AI Agency with <span className="gradient-text">Ploy Pro</span>
          </h1>
          <p className="max-w-xl text-balance text-lg text-muted-foreground">
            Get premium marketplace visibility, appear in more AI reports, and generate unlimited reports to share with your prospects.
          </p>
        </div>
      </header>

      <section className="pb-24">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-2xl font-bold tracking-tight">Why Agencies Choose Ploy Pro</h2>

            {/* Pricing Cards - Primary Focus */}
            <div className="mb-16 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Free</p>
                  <p className="font-mono text-3xl font-bold">
                    $0<span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Get started listing your AI employees and reaching businesses on Ploy.</p>

                {/* Key Features */}
                <div className="space-y-2 py-4">
                  {freeKeyFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-ploy-blue flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">Ploy takes 20% commission on sales</p>
                  </div>
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
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ploy-blue">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ploy Pro
                  </p>
                  <p className="font-mono text-3xl font-bold">
                    $29.99<span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Get premium visibility and grow faster.</p>

                {/* Key Features */}
                <div className="space-y-2 py-4">
                  {proKeyFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-ploy-blue flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">Ploy takes 10% commission on sales</p>
                  </div>
                </div>

                <UpgradeButton subscriptionType="pro" returnTo="/pricing/pro" size="lg" className="mt-auto">
                  Upgrade to Ploy Pro
                </UpgradeButton>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mt-24">
              <h2 className="mb-12 text-center text-2xl font-bold tracking-tight">Loved by Agencies Like Yours</h2>
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
