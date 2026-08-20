"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

const paths = [
  {
    emoji: "🏢",
    title: "I Own a Business",
    description:
      "Discover how AI can transform your business with a personalized AI Workforce Report and recommendations.",
    cta: "Generate AI Report",
    href: "/sign-up?role=business",
  },
  {
    emoji: "💼",
    title: "I Want to Start an AI Consulting Business",
    description:
      "Learn how to help businesses implement AI using Ploy's platform while building your own consulting business.",
    cta: "Become a Consultant",
    href: "/sign-up?role=consultant",
  },
  {
    emoji: "🤖",
    title: "I Build AI Employees",
    description: "List your AI employees, reach new customers, and grow your agency through the Ploy marketplace.",
    cta: "List an AI Employee",
    href: "/sign-up?role=agency",
  },
];

export function WhatBringsYou() {
  return (
    <section id="get-started" className="scroll-mt-24 py-24">
      <div className="container flex flex-col gap-14">
        <SectionHeading eyebrow="Get started" title="What brings you to Ploy?" />
        <div className="grid gap-6 lg:grid-cols-3">
          {paths.map((path, i) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="hover-glow-border group flex flex-col gap-5 rounded-2xl border border-border bg-card p-9"
            >
              <span className="text-5xl">{path.emoji}</span>
              <h3 className="text-xl font-bold tracking-tight">{path.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{path.description}</p>
              <Button asChild size="lg" className="mt-2 w-full">
                <Link href={path.href}>
                  {path.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
