"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/*
 * Lifts its children against the scroll as they cross the viewport, so a
 * section separates from the fixed plane behind it instead of riding flat on
 * top of it.
 *
 * Progress is measured over the whole crossing — from the section's top
 * reaching the bottom of the viewport to its bottom reaching the top — so the
 * drift is centred: a section sits at its true position halfway through, and
 * nothing ends up permanently offset from where the layout put it.
 */
export function ParallaxSection({
  children,
  distance = 44,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [distance, -distance]
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
