"use client";

import { motion } from "framer-motion";
import { Handshake, Headset, Briefcase, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  { icon: Handshake, name: "AI Sales Rep", category: "Sales", rating: 4.8, offset: "lg:translate-x-8" },
  { icon: Headset, name: "AI Support Agent", category: "Support", rating: 4.9, offset: "lg:-translate-x-4" },
  { icon: Briefcase, name: "AI Executive Assistant", category: "Operations", rating: 4.9, offset: "lg:translate-x-10" },
];

export function HeroShowcase() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-sm">
      {cards.map((card, i) => (
        <motion.div
          key={card.name}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.4 + i * 0.15 },
            y: {
              duration: 4.5 + i * 0.6,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 0.4 + i * 0.4,
            },
          }}
          style={{ top: i * 108 }}
          className={cn(
            "absolute left-1/2 flex w-64 -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur",
            card.offset
          )}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
            <card.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{card.name}</p>
            <p className="text-xs text-muted-foreground">{card.category}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs font-medium">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
            {card.rating}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
