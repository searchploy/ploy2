"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/*
 * The page's back plane. Fixed rather than in flow, so it holds still while
 * everything above it scrolls — that difference is most of the depth, and the
 * slow drift on top of it only keeps the plane from reading as a flat backing
 * board.
 *
 * The range is deliberately long: mapped over a short scroll it would arrive at
 * its end position within the first section and sit static for the rest of the
 * page.
 */
export function PageBackdrop() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 4000], [0, reduceMotion ? 0 : 160]);

  return (
    <motion.div
      aria-hidden
      style={{ y }}
      className="pointer-events-none fixed inset-x-0 -top-[10%] -z-10 h-[130%]"
    >
      <div className="page-canvas absolute inset-0" />
      <div className="hero-grain absolute inset-0" />
    </motion.div>
  );
}
