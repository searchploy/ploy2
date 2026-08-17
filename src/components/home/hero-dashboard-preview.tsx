"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Bell, TrendingUp } from "lucide-react";

const scores = [
  { label: "AI Readiness", value: 81 },
  { label: "Automation", value: 78 },
  { label: "Growth", value: 86 },
];

const recommendations = [
  { name: "AI Sales Representative", roi: "420%" },
  { name: "AI Support Agent", roi: "380%" },
  { name: "AI Bookkeeper", roi: "290%" },
];

function ScoreRing({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" className="stroke-border" />
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-ploy-blue"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold">{value}</span>
    </div>
  );
}

export function HeroDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="shadow-glow-card mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card"
    >
      {/* Chrome bar */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-5 py-3.5 sm:px-7">
        <div className="flex items-center gap-2.5">
          <Image
            src="/6.png"
            alt="Ploy"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
          />
          <span className="text-sm font-semibold">Northwind Supply Co.</span>
          <span className="hidden rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline">
            Logistics · 42 employees
          </span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Search className="h-4 w-4" />
          <Bell className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-7">
        {/* Score cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {scores.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-secondary/20 p-4 text-center sm:flex-row sm:text-left"
            >
              <ScoreRing value={s.value} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-mono text-lg font-bold">
                  {s.value}
                  <span className="text-xs font-normal text-muted-foreground">/100</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
          {/* Savings */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-secondary/20 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Est. Annual Savings</p>
              <span className="flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-xs font-semibold text-success">
                <TrendingUp className="h-3 w-3" />
                340% ROI
              </span>
            </div>
            <p className="mt-3 font-mono text-3xl font-bold sm:text-4xl">$94,000</p>
            <div className="mt-4 flex h-10 items-end gap-1.5">
              {[40, 55, 48, 65, 60, 78, 72, 90].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-ploy-blue/20 to-ploy-blue"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl border border-border bg-secondary/20 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ploy-blue">
              Top Recommended AI Employees
            </p>
            <div className="flex flex-col gap-3">
              {recommendations.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.name}</span>
                  <span className="font-mono text-xs text-success">ROI {r.roi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
