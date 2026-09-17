"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroDashboardPreview } from "@/components/home/hero-dashboard-preview";

const rise = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <>
      {/* Pulled up by the navbar's height so the photograph runs behind it. */}
      <section className="relative isolate -mt-20 flex min-h-[100svh] flex-col overflow-hidden">
        <div aria-hidden className="hero-canvas absolute inset-0 -z-30" />
        <div aria-hidden className="hero-grain pointer-events-none absolute inset-0 -z-20" />
        <div aria-hidden className="hero-vignette pointer-events-none absolute inset-0 -z-10" />

        {/*
         * The hairline is the spine of the composition: it enters behind the
         * badge and runs to the torn edge, which is what ties the two halves of
         * the headline together. It fades out before the wave so it never
         * appears to be cut off by it.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[calc(100%-6rem)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent"
        />

        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-44 pt-32 text-center">
          <motion.div
            {...rise}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white text-[#0a0a0b] shadow-[0_0_70px_rgba(255,255,255,0.16)]"
          >
            <span className="text-[13px] font-extrabold uppercase leading-none tracking-[0.14em]">
              AI
            </span>
            <span className="font-script mt-1 text-[17px] leading-none">is for</span>
          </motion.div>

          <h1 className="mt-14 flex flex-col items-center">
            <motion.span
              {...rise}
              transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
              className="font-script text-[3.25rem] uppercase leading-[0.95] tracking-[0.06em] text-white sm:text-7xl lg:text-8xl"
            >
              Useful
            </motion.span>
            {/*
             * The negative inline-end margin cancels the trailing space that
             * letter-spacing adds after the final character, which would
             * otherwise push the word off centre against the hairline.
             */}
            <motion.span
              {...rise}
              transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
              className="-me-[0.2em] mt-4 text-[1.55rem] font-extralight uppercase leading-none tracking-[0.2em] text-white/95 sm:-me-[0.28em] sm:text-5xl sm:tracking-[0.28em] lg:text-[4.5rem]"
            >
              Employees
            </motion.span>
          </h1>

          <motion.p
            {...rise}
            transition={{ duration: 0.7, delay: 0.34, ease: "easeOut" }}
            className="mt-10 max-w-md text-balance text-sm leading-relaxed text-white/55"
          >
            Tell us your business problems. We&apos;ll show you which AI employees could help, what
            they could save you, and how to put them to work.
          </motion.p>

          <motion.div
            {...rise}
            transition={{ duration: 0.7, delay: 0.44, ease: "easeOut" }}
            className="mt-9 flex flex-col items-center gap-5 sm:flex-row sm:gap-8"
          >
            <Link
              href="/report"
              className="group relative inline-flex items-center gap-3 border border-white/70 px-9 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#0a0a0b]"
            >
              Generate AI Report
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/marketplace"
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-white"
            >
              Browse employees
            </Link>
          </motion.div>
        </div>

        {/*
         * Torn lower edge. The path is deliberately irregular rather than a
         * sine wave — even amplitudes read as a decorative divider, uneven ones
         * read as the photograph having been ripped away.
         */}
        <svg
          aria-hidden
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px] w-full sm:h-[110px]"
        >
          <path
            fill="#28282b"
            d="M0,78 C96,112 168,44 268,62 C368,80 410,130 520,119 C624,109 668,50 778,63 C884,76 928,128 1040,116 C1142,105 1188,46 1296,61 C1372,71 1404,93 1440,84 L1440,140 L0,140 Z"
          />
        </svg>
      </section>

      <section className="container relative px-4 pb-24">
        <HeroDashboardPreview />
      </section>
    </>
  );
}
