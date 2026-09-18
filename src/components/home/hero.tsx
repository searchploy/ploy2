"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HeroEmployeeCards } from "@/components/home/hero-employee-cards";

const rise = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

/*
 * The two planes below drift apart on scroll. That is driven by a scroll
 * timeline in CSS rather than from here — see .hero-plane-back / -fore.
 */
export function Hero() {
  // A single flip, not a per-frame value, so unlike the old JS parallax there
  // is nothing here to trail the scroll. Read on mount too, so a reload
  // partway down the page does not show the cue.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Pulled up by the navbar's height so the photograph runs behind it. */}
      <section className="relative isolate -mt-20 flex min-h-[100svh] flex-col overflow-hidden">
        {/*
         * The torn edge is masked onto this static wrapper rather than the
         * plane inside it. Masking the moving element would carry the edge
         * along with the parallax instead of leaving it pinned to the bottom
         * of the section.
         */}
        <div
          aria-hidden
          className="hero-torn-edge pointer-events-none absolute inset-0 -z-20 overflow-hidden"
        >
          {/* Oversized top and bottom so the drift never pulls an edge into frame. */}
          <div className="hero-plane-back absolute inset-x-0 -top-[20%] h-[140%]">
            <div className="hero-canvas absolute inset-0" />
            <div className="hero-grain absolute inset-0" />
            <div className="hero-vignette absolute inset-0" />
          </div>
        </div>

        <div className="hero-plane-fore container relative flex flex-1 items-center px-6 pb-40 pt-28 sm:pb-44">
          <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative text-left">
              {/*
               * The hairline is the spine of the composition, so it stays
               * pinned to the badge's centre rather than the page's. 43.5px is
               * half the badge's width less half the rule's own.
               */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-[43.5px] top-1/2 -z-10 h-screen w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent"
              />

              <motion.div {...rise} transition={{ duration: 0.7, ease: "easeOut" }}>
                <Image
                  src="/ploy-mark.png"
                  alt="Ploy"
                  width={1261}
                  height={1247}
                  priority
                  className="h-[88px] w-[88px] drop-shadow-[0_0_48px_rgba(255,255,255,0.28)]"
                />
              </motion.div>

              {/*
               * One sentence broken across four lines so the emphasis lands on
               * "effective". The connecting lines stay at 400 rather than the
               * display weight — at this size a 200 is too faint to read.
               */}
              <h1 className="mt-10 flex flex-col items-start">
                <motion.span
                  {...rise}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  className="display-caps text-[0.7rem] font-normal leading-none tracking-[0.32em] text-white/50 sm:text-xs lg:text-[0.8rem]"
                >
                  Find the most
                </motion.span>
                <motion.span
                  {...rise}
                  transition={{ duration: 0.7, delay: 0.18, ease: "easeOut" }}
                  className="font-script mt-4 text-[3rem] uppercase leading-[0.95] tracking-[0.06em] text-white sm:text-6xl lg:text-[4.5rem]"
                >
                  Effective
                </motion.span>
                <motion.span
                  {...rise}
                  transition={{ duration: 0.7, delay: 0.26, ease: "easeOut" }}
                  className="display-caps mt-3 text-[1.35rem] leading-none tracking-[0.2em] text-white/95 sm:text-[2.1rem] lg:text-[2.6rem]"
                >
                  AI Employees
                </motion.span>
                <motion.span
                  {...rise}
                  transition={{ duration: 0.7, delay: 0.34, ease: "easeOut" }}
                  className="display-caps mt-5 text-[0.7rem] font-normal leading-none tracking-[0.32em] text-white/50 sm:text-xs lg:text-[0.8rem]"
                >
                  for your business
                </motion.span>
              </h1>

              <motion.p
                {...rise}
                transition={{ duration: 0.7, delay: 0.44, ease: "easeOut" }}
                className="mt-8 max-w-md text-balance text-sm leading-relaxed text-white/55"
              >
                Tell us your business problems. We&apos;ll show you which AI employees could help,
                what they could save you, and how to put them to work.
              </motion.p>

              <motion.div
                {...rise}
                transition={{ duration: 0.7, delay: 0.54, ease: "easeOut" }}
                className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5"
              >
                <Link
                  href="/report"
                  className="metal-surface metal-shine group inline-flex items-center gap-3 whitespace-nowrap px-7 py-4 text-[11px] font-bold uppercase tracking-[0.2em] shadow-md transition-[filter] duration-300"
                >
                  Generate AI Report
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href="/marketplace"
                  className="metal-border metal-shine inline-flex items-center whitespace-nowrap px-7 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ploy-gold transition-colors duration-300 hover:text-ploy-gold-light"
                >
                  Browse employees
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
              className="hidden justify-center lg:flex"
            >
              <HeroEmployeeCards />
            </motion.div>
          </div>
        </div>

        {/* Sits above the torn edge, which takes the bottom 70/110px. */}
        <button
          type="button"
          aria-label="Scroll down"
          tabIndex={scrolled ? -1 : 0}
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" })}
          className={cn(
            "absolute bottom-12 left-1/2 -translate-x-1/2 p-3 transition-opacity duration-500 sm:bottom-16",
            scrolled ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <span className="scroll-cue-bob block">
            <span className="scroll-cue-mark metal-shine block h-5 w-10" />
          </span>
        </button>
      </section>
    </>
  );
}
