import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerUser } from "@/lib/supabase/server";
import { MetaViewContent } from "@/components/analytics/meta-pixel-events";

export const metadata: Metadata = {
  title: "List Your AI Tool for Free",
  description:
    "List your AI tool on Ploy for free and showcase your product to businesses exploring AI solutions.",
};

export default async function ListYourAIToolPage() {
  const user = await getServerUser();

  // Determine the destination for the CTA
  const ctaHref = user ? "/account/marketplace/listing" : "/sign-up?redirect=/account/marketplace/listing";

  return (
    <div className="flex flex-col">
      <MetaViewContent contentName="List Your AI Tool landing page" />
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container max-w-4xl flex flex-col items-center text-center gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              List Your AI Tool
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ploy-gold to-ploy-gold/70">
                For Free
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Put your AI tool in front of businesses looking for AI solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="rounded-none">
              <Link href={ctaHref}>
                LIST NOW
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Free to list. No upfront cost.
            </p>
          </div>

          <div className="metal-border mt-6 w-full max-w-2xl rounded-2xl bg-card/60 p-6 text-left backdrop-blur-sm sm:p-8">
            <span className="eyebrow-caps text-[0.7rem] text-ploy-gold">Who it&apos;s for</span>
            <p className="mt-3 text-lg font-medium leading-snug text-white sm:text-xl">
              Have you built an AI employee, AI agent, automation, software product, or other
              AI-powered solution for businesses?
            </p>
            <div className="my-5 h-px bg-gradient-to-r from-ploy-gold/50 via-border to-transparent" />
            <p className="leading-relaxed text-muted-foreground">
              Ploy gives AI companies a place to showcase their tools to businesses actively
              exploring AI solutions.
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
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-8">
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
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-8">
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
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-8">
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
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-8">
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
                Join the Ploy marketplace and get discovered by businesses looking for AI solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="rounded-none">
                <Link href={ctaHref}>
                  LIST NOW
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Free to list.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
