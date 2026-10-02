import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerUser } from "@/lib/supabase/server";
import { MetaViewContent } from "@/components/analytics/meta-pixel-events";

export const metadata: Metadata = {
  title: "List Your AI Tool for Free | AI Tools Marketplace",
  description:
    "Built an AI tool? List it on Ploy's AI tools marketplace for free and get it in front of businesses looking for AI solutions.",
  alternates: { canonical: "/list-your-ai-tool" },
};

const HERO_BENEFITS = [
  "Free marketplace listing",
  "Get discovered on Ploy",
  "Showcase your AI tool to potential customers",
];

export default async function ListYourAIToolPage() {
  const user = await getServerUser();

  // Determine the destination for the CTA
  const ctaHref = user ? "/account/marketplace/listing" : "/sign-up?redirect=/account/marketplace/listing";

  return (
    <div className="flex flex-col">
      <MetaViewContent contentName="List Your AI Tool landing page" />
      {/* HERO SECTION — mirrors the Meta ad so the offer reads before any scroll */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-20 sm:pb-24">
        <div className="container max-w-4xl flex flex-col items-center text-center">
          <p className="eyebrow-caps text-xs text-ploy-gold">Built an AI tool?</p>
          {/* Uppercase is applied in CSS so screen readers get normal words, not spelled-out caps. */}
          <h1 className="mt-3 text-[2.6rem] leading-[1.02] font-bold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block sm:inline">List your </span>
            <span className="block sm:inline">AI tool</span>{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ploy-gold to-ploy-gold/70">
              for free
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/75 sm:text-xl">
            Get your AI tool in front of businesses looking for AI solutions.
          </p>

          <ul className="mt-6 flex flex-col items-start gap-2.5 text-left">
            {HERO_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-base text-white">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-ploy-gold" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <Button
            asChild
            size="lg"
            variant="gradient"
            className="mt-7 h-14 w-full max-w-sm rounded-none px-10 text-base font-bold uppercase tracking-wide sm:w-auto"
          >
            <Link href={ctaHref}>
              List my AI tool
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">Free to list. No upfront cost.</p>

          <div className="metal-border mt-14 w-full max-w-2xl rounded-2xl bg-card/60 p-6 text-left backdrop-blur-sm sm:p-8">
            <span className="eyebrow-caps text-[0.7rem] text-ploy-gold">What is Ploy?</span>
            <p className="mt-3 text-lg font-medium leading-snug text-white sm:text-xl">
              Ploy is an AI tools marketplace for businesses.
            </p>
            <div className="my-5 h-px bg-gradient-to-r from-ploy-gold/50 via-border to-transparent" />
            <p className="leading-relaxed text-muted-foreground">
              List your AI employee, AI agent, automation, or AI-powered software, and showcase it
              to businesses exploring AI solutions.
            </p>
          </div>
        </div>
      </section>

      {/* WHY LIST ON PLOY */}
      <section className="py-24 sm:py-32 border-y border-border/50">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Why List on Ploy?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ploy-gold/20">
                    <CheckCircle2 className="h-6 w-6 text-ploy-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Free to List</h3>
                  <p className="text-muted-foreground">
                    Submit your AI tool without an upfront listing fee.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ploy-gold/20">
                    <CheckCircle2 className="h-6 w-6 text-ploy-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Get Discovered</h3>
                  <p className="text-muted-foreground">
                    Showcase your AI tool in Ploy&apos;s AI tools marketplace.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ploy-gold/20">
                    <CheckCircle2 className="h-6 w-6 text-ploy-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Reach Businesses</h3>
                  <p className="text-muted-foreground">
                    Put your product in front of businesses exploring ways to use AI.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-6 sm:p-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ploy-gold/20">
                    <CheckCircle2 className="h-6 w-6 text-ploy-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Build Your Presence</h3>
                  <p className="text-muted-foreground">
                    Create a dedicated marketplace listing that explains what your tool does and who it&apos;s built for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 sm:py-32">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ploy-gold/20 text-ploy-gold font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Your Account</h3>
              <p className="text-sm text-muted-foreground">
                Sign up for a free Ploy account.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ploy-gold/20 text-ploy-gold font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Submit Your AI Tool</h3>
              <p className="text-sm text-muted-foreground">
                Add your tool, company info, description, categories, and use cases.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ploy-gold/20 text-ploy-gold font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Reviewed</h3>
              <p className="text-sm text-muted-foreground">
                Ploy reviews your submission before it appears in the marketplace.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ploy-gold/20 text-ploy-gold font-bold text-lg">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Discovered</h3>
              <p className="text-sm text-muted-foreground">
                Once approved, your AI tool can appear in the Ploy marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-32 border-t border-border/50">
        <div className="container max-w-2xl">
          <div className="flex flex-col items-center text-center gap-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Ready to List Your AI Tool?
              </h2>
              <p className="text-lg text-muted-foreground">
                List it on Ploy&apos;s AI tools marketplace for free and put it in front of
                businesses looking for AI solutions.
              </p>
            </div>

            <div className="flex w-full flex-col items-center gap-3">
              <Button
                asChild
                size="lg"
                variant="gradient"
                className="h-14 w-full max-w-sm rounded-none px-10 text-base font-bold uppercase tracking-wide sm:w-auto"
              >
                <Link href={ctaHref}>
                  List my AI tool
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">Free to list. No upfront cost.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
