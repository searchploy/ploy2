"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HeroEmployeeCards } from "@/components/home/hero-employee-cards";
import { HeroDashboardPreview } from "@/components/home/hero-dashboard-preview";
import { ParallaxSection } from "@/components/shared/parallax-section";

const rise = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  /*
   * Parallax between the photograph and what sits on it. Tracked from the hero
   * meeting the top of the viewport to it leaving: the backdrop drifts down
   * against the scroll while the content pulls up with it, so the two planes
   * visibly separate as the section passes rather than moving as one.
   */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 180]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -140]);

  return (
    <>
      {/* Pulled up by the navbar's height so the photograph runs behind it. */}
      <section
        ref={heroRef}
        className="relative isolate -mt-20 flex min-h-[100svh] flex-col overflow-hidden"
      >
        {/* Oversized top and bottom so the drift never pulls an edge into frame. */}
        <motion.div
          aria-hidden
          style={{ y: backdropY }}
          className="absolute inset-x-0 -top-[20%] -z-20 h-[140%]"
        >
          <div className="hero-canvas absolute inset-0" />
          <div className="hero-grain pointer-events-none absolute inset-0" />
          <div className="hero-vignette pointer-events-none absolute inset-0" />
        </motion.div>

        <motion.div
          style={{ y: contentY }}
          className="container relative flex flex-1 items-center px-6 pb-40 pt-28 sm:pb-44"
        >
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
               * "useful". The connecting lines stay at 400 rather than the
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
                  Useful
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
        </motion.div>

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

      {/* Travels further than the sections below it — it sits closest to the
          hero, so it carries that separation on into the page. */}
      <ParallaxSection distance={60}>
        <section className="container relative px-4 pb-24">
          <HeroDashboardPreview />
        </section>
      </ParallaxSection>
    </>
  );
}
