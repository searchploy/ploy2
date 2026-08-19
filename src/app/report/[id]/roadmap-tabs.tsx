"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { RoadmapItem } from "@/lib/report/scoring";

export function RoadmapTabs({
  roadmap30,
  roadmap90,
  roadmapYear,
}: {
  roadmap30: RoadmapItem[];
  roadmap90: RoadmapItem[];
  roadmapYear: RoadmapItem[];
}) {
  const tabs = [
    { key: "30", label: "30 Days", items: roadmap30 },
    { key: "90", label: "90 Days", items: roadmap90 },
    { key: "year", label: "1 Year", items: roadmapYear },
  ] as const;
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("30");
  const activeTab = tabs.find((t) => t.key === active)!;

  return (
    <div>
      <div className="mb-5 flex overflow-hidden rounded-xl border border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "flex-1 py-2.5 text-sm font-semibold transition-colors",
              active === tab.key ? "bg-ploy-gold text-primary-foreground" : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {activeTab.items.map((item, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-secondary/30 p-4">
            <span className="w-16 shrink-0 font-mono text-xs font-semibold text-ploy-gold">{item.period}</span>
            <span className="text-sm leading-relaxed">{item.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
