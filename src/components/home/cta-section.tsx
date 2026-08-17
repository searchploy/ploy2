import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-center text-background sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ploy-blue/30 via-transparent to-transparent" />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-balance max-w-2xl text-3xl font-bold tracking-tighter sm:text-5xl">
              Ready to hire your first AI employee?
            </h2>
            <p className="max-w-xl text-balance text-background/70">
              Browse the marketplace or list your agency&apos;s AI employees in minutes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="gradient">
                <Link href="/marketplace">
                  Browse Employees
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-background/30 bg-transparent text-background hover:bg-background/10">
                <Link href="/for-agencies">List Your Agency</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
