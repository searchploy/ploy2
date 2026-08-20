import { Suspense } from "react";
import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Sparkles,
  Search,
  FileBarChart,
  Presentation,
  Phone,
  DollarSign,
  Zap,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { UpgradeButton } from "@/components/pricing/upgrade-button";
import { CheckoutStatusToast } from "@/components/pricing/checkout-status-toast";
import { SuccessCarousel } from "@/components/consultants/success-carousel";
import { getPrice } from "@/lib/stripe/server";

export const metadata: Metadata = {
  title: "For Consultants",
  description: "Build an AI consulting business with Ploy. Find clients, generate AI Workforce Reports, present recommendations, and get paid—all in one platform.",
};

const CONSULTANT_FEATURES = [
  {
    title: "Software",
    items: [
      "Unlimited AI Reports",
      "Unlimited Clients",
      "Complete CRM Dashboard",
      "Proposal Generator",
      "Client Pipeline",
      "Client Notes",
      "Report History",
    ],
  },
  {
    title: "Training",
    items: [
      "Complete AI Consulting Course",
      "Step-by-Step Playbooks",
      "Sales Training",
      "Discovery Call Training",
      "AI Report Walkthroughs",
    ],
  },
  {
    title: "Templates",
    items: ["Cold Email Templates", "Proposal Templates"],
  },
  {
    title: "Community & Support",
    items: ["Private Discord Community", "Weekly Live Q&A", "Priority Support"],
  },
];

const workflow = [
  { icon: Search, label: "Find Local Business" },
  { icon: Phone, label: "Book Discovery Call" },
  { icon: FileBarChart, label: "Generate AI Workforce Report" },
  { icon: Presentation, label: "Present Recommendations" },
  { icon: Zap, label: "Business Implements AI" },
  { icon: DollarSign, label: "You Get Paid" },
];

export default async function ConsultantsPage() {
  // Price comes from Stripe rather than the page, so it can't drift from what
  // checkout actually charges — both cards previously hardcoded "$0".
  const price = await getPrice("consulting");

  return (
    <div className="flex flex-col">
      <Suspense fallback={null}>
        <CheckoutStatusToast />
      </Suspense>

      {/* Hero */}
      <header className="relative overflow-hidden py-24">
        <div className="container flex flex-col items-center gap-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wide text-ploy-gold">For Consultants</span>
          <h1 className="text-balance max-w-3xl text-4xl font-bold tracking-tighter sm:text-6xl">
            Build an AI Consulting Business with Ploy
          </h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground">
            Everything you need to find clients, generate AI Workforce Reports, present recommendations, and help businesses implement AI—all in one platform.
          </p>
        </div>
      </header>

      {/* Success Stories Carousel */}
      <SuccessCarousel />

      {/* Pricing */}
      <section className="py-12">
        <div className="container flex flex-col gap-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Simple, Transparent Pricing</h2>
          </div>

          {/* Social Proof */}
          <div className="mx-auto w-full max-w-5xl">
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Recent Activity */}
              <div className="rounded-2xl border border-border/50 bg-secondary/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Recently Joined</p>
                <div className="space-y-2">
                  {[
                    { name: "Sarah M.", city: "Austin, TX", action: "Started AI consulting" },
                    { name: "Marcus J.", city: "Brooklyn, NY", action: "Landed first client" },
                    { name: "Alex K.", city: "Denver, CO", action: "Generated $2.3k in revenue" },
                  ].map((item, i) => (
                    <div key={i} className="text-xs">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-muted-foreground">{item.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-2xl border border-border/50 bg-secondary/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-4">By The Numbers</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-ploy-gold">42+</p>
                    <p className="text-xs text-muted-foreground">Consultants Earning</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">$285k</p>
                    <p className="text-xs text-muted-foreground">Client Revenue Generated</p>
                  </div>
                </div>
              </div>

              {/* Success Rate */}
              <div className="rounded-2xl border border-border/50 bg-secondary/30 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-4">Average Results</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-ploy-gold">$8.2k</p>
                    <p className="text-xs text-muted-foreground">Avg. First Year Revenue</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">2.1</p>
                    <p className="text-xs text-muted-foreground">Avg. Clients Per Consultant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ploy Consultant is a paid programme — there is no free tier, so
              this is a single card rather than a comparison. */}
          <div className="mx-auto w-full max-w-3xl">
            <div className="shadow-glow-card flex flex-col gap-6 rounded-3xl border border-transparent bg-card p-8 sm:p-10">
              <div>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ploy-gold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Ploy Consultant
                </p>
                <p className="font-mono text-4xl font-bold">
                  {price ? `$${price.amount}` : "—"}
                  <span className="text-base font-normal text-muted-foreground">
                    /{price?.interval === "month" ? "mo" : (price?.interval ?? "mo")}
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="text-foreground">Lock in forever.</strong> As Ploy grows, new
                  members will pay more.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Everything you need to run an AI consulting business — the software to deliver it,
                the training to sell it, and the templates to get moving in your first week.
              </p>

              <div className="grid gap-8 border-t border-border pt-6 sm:grid-cols-2">
                {CONSULTANT_FEATURES.map((group) => (
                  <div key={group.title}>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {group.title}
                    </p>
                    <div className="space-y-2">
                      {group.items.map((feature) => (
                        <div key={feature} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-ploy-gold" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <UpgradeButton subscriptionType="consulting" returnTo="/consultants" size="lg">
                Start Your Consulting Business
              </UpgradeButton>
              <p className="text-center text-xs text-muted-foreground">
                Cancel anytime from your account settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-secondary/20 py-20">
        <div className="container flex flex-col gap-12">
          <SectionHeading title="How Ploy Consulting Works" align="center" />
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-2">
            {workflow.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-5 py-5 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-ploy-gold">
                    <step.icon className="h-4.5 w-4.5" />
                  </span>
                  <p className="w-24 text-xs font-semibold leading-tight">{step.label}</p>
                </div>
                {i < workflow.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 shrink-0 rotate-90 text-muted-foreground sm:block sm:rotate-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For? */}
      <section className="py-20">
        <div className="container flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Who Is This For?</h2>
          </div>
          <div className="mx-auto grid max-w-3xl gap-3">
            {["Freelancers", "Marketing Agencies", "Sales Professionals", "Business Consultants", "College Students", "Entrepreneurs", "Anyone looking to start an AI consulting business"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-secondary/30 px-4 py-3">
                <span className="text-ploy-gold">•</span>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Ploy Consulting? */}
      <section className="border-y border-border bg-secondary/20 py-20">
        <div className="container flex flex-col gap-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Ploy Consulting?</h2>
          </div>
          <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-4 text-center">
              <div className="text-4xl">🧠</div>
              <div>
                <p className="font-semibold">Instead of learning AI...</p>
                <p className="mt-1 text-sm text-muted-foreground">Learn how to sell business outcomes.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div className="text-4xl">🛠️</div>
              <div>
                <p className="font-semibold">Instead of building AI...</p>
                <p className="mt-1 text-sm text-muted-foreground">Recommend proven AI Employees already available in the Ploy Marketplace.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div className="text-4xl">⚡</div>
              <div>
                <p className="font-semibold">Instead of starting from scratch...</p>
                <p className="mt-1 text-sm text-muted-foreground">Use Ploy&apos;s reports, templates, CRM, and consulting system.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="container py-24">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card px-8 py-16 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tighter sm:text-4xl">
            Ready to build your AI consulting business?
          </h2>
          <UpgradeButton subscriptionType="consulting" returnTo="/consultants" size="lg">
            Start Your Consulting Business
            <ArrowRight className="h-4 w-4" />
          </UpgradeButton>
        </div>
      </div>
    </div>
  );
}
