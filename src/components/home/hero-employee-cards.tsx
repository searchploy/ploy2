"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Briefcase, Handshake, Headphones, PenTool, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * A curated slice of the marketplace rather than the whole `employees` module,
 * which carries long descriptions and cover images for every listing and would
 * ship all of it to the client for the sake of four cards. Names, departments
 * and features are copied from real published listings — nothing here is
 * invented, and no performance or earnings figures are shown.
 */
type FeaturedEmployee = {
  name: string;
  department: string;
  features: string[];
  setupDays: number;
  Icon: LucideIcon;
};

const FEATURED: FeaturedEmployee[] = [
  {
    name: "AI Sales Representative",
    department: "Sales",
    features: ["Lead qualification", "Meeting booking", "Prospect research"],
    setupDays: 2,
    Icon: Handshake,
  },
  {
    name: "AI Customer Support Specialist",
    department: "Customer Support",
    features: ["Multi-channel support", "Human-like responses", "24/7 availability"],
    setupDays: 3,
    Icon: Headphones,
  },
  {
    name: "AI Marketing Manager",
    department: "Marketing",
    features: ["Content generation", "Campaign planning", "Optimization"],
    setupDays: 1,
    Icon: PenTool,
  },
  {
    name: "AI Executive Assistant",
    department: "Administration",
    features: ["Email automation", "Meeting scheduling", "Task management"],
    setupDays: 1,
    Icon: Briefcase,
  },
];

const ROTATE_MS = 3800;

export function HeroEmployeeCards() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % FEATURED.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const employee = FEATURED[index];

  return (
    <div className="relative w-full max-w-[26rem]">
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-white/[0.06] blur-[64px]"
      />

      {/*
       * The stack owns its own positioning context so the cards behind size
       * against the front card. Measured against the column instead, their
       * `h-full` would take in the indicator row below and overhang it.
       */}
      <div className="relative">
        {/*
         * Static cards behind the live one. Cycling the deck's own order would
         * mean animating a card backwards through its siblings on every tick;
         * holding the silhouette still and swapping only the front card's
         * contents reads as the same thing and never collides.
         */}
        <div
          aria-hidden
          className="absolute inset-x-7 top-6 h-full rounded-2xl border border-ploy-gold/[0.12] bg-white/[0.02]"
        />
        <div
          aria-hidden
          className="absolute inset-x-3.5 top-3 h-full rounded-2xl border border-ploy-gold/25 bg-white/[0.03]"
        />

        {/*
         * The gold frame is drawn 1px outside this element's border box, so
         * the clipping the sliding contents need happens on the layer inside
         * rather than here — clipping overflow here would cut the frame away.
         */}
        <div className="metal-border metal-shine relative min-h-[20rem] rounded-2xl bg-white/[0.05] backdrop-blur-xl">
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={employee.name}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                    <employee.Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                    {employee.department}
                  </span>
                </div>

                <p className="mt-6 text-xl font-semibold leading-snug text-white">{employee.name}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {employee.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-white/[0.14] px-3 py-1.5 text-[11px] text-white/65"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                    Live in {employee.setupDays} {employee.setupDays === 1 ? "day" : "days"}
                  </span>
                  <span aria-hidden className="text-ploy-gold">
                    →
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Clears the deepest card behind, which sits 24px proud of the front one. */}
      <div className="mt-14 flex items-center justify-center gap-2">
        {FEATURED.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${item.name}`}
            className={cn(
              "h-[2px] transition-all duration-500",
              i === index ? "w-8 bg-white" : "w-4 bg-white/25 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
