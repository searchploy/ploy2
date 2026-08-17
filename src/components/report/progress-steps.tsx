"use client";

import { cn } from "@/lib/utils";

const STEP_LABELS = ["Business", "Team", "Problems", "Goals", "Review"];

export function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const state = step < current ? "done" : step === current ? "active" : "upcoming";
        return (
          <div key={label} className="relative flex flex-1 flex-col items-center">
            {i > 0 && (
              <span
                className={cn(
                  "absolute right-1/2 top-3 h-px w-full -translate-y-1/2",
                  state === "upcoming" && step - 1 >= current ? "bg-border" : "bg-ploy-blue"
                )}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold transition-colors",
                state === "done" && "border-ploy-blue bg-ploy-blue text-white",
                state === "active" && "border-ploy-blue bg-secondary text-ploy-blue",
                state === "upcoming" && "border-border bg-background text-muted-foreground"
              )}
            >
              {step}
            </span>
            <span
              className={cn(
                "mt-1.5 whitespace-nowrap text-[11px]",
                state === "active" ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
