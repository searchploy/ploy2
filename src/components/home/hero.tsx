"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGradient } from "@/components/shared/animated-gradient";
import { HeroDashboardPreview } from "@/components/home/hero-dashboard-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-32 pt-24 sm:pt-32">
      <AnimatedGradient />

      <div className="container flex flex-col items-center gap-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-balance max-w-5xl text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl"
        >
          Find the perfect AI employees for your business
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-balance max-w-2xl text-lg text-muted-foreground"
        >
          Tell us your business problems. We&apos;ll show you exactly which AI employees to hire,
          how much they&apos;ll save you, and a roadmap to make it happen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-4 pt-2 sm:flex-row"
        >
          <Button asChild size="lg" className="h-14 px-9 text-base [&_svg]:size-5">
            <Link href="/report">
              Generate AI Report
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Link
            href="/marketplace"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            or browse AI employees →
          </Link>
        </motion.div>

        <p className="text-xs text-muted-foreground">Free report · No credit card · Results in 2 minutes</p>
      </div>

      {/* Light beam between the CTA and the dashboard preview, echoing the glow-card look */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[26rem] -z-10 h-[24rem] w-[42rem] -translate-x-1/2 rounded-full bg-ploy-gold/[0.06] blur-[120px] sm:top-[30rem]"
      />

      <div className="container relative mt-16 px-4 sm:mt-20">
        <HeroDashboardPreview />
      </div>
    </section>
  );
}
