"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface AnimatedSectionProps {
  children: React.ReactNode;
  stagger?: boolean;
  className?: string;
}

export function AnimatedSection({ children, stagger = false, className }: AnimatedSectionProps) {
  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}
