"use client";

import { cn } from "@/lib/utils";

export function ChipSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(option: string) {
    onChange(selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "select-none rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "border-ploy-gold bg-secondary text-ploy-gold"
                : "border-border bg-background text-muted-foreground hover:border-ploy-gold/50 hover:text-foreground"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
