import { formatCurrency } from "@/lib/utils";
import type { PricingModel } from "@/lib/types/mock";

const periodLabel: Record<PricingModel, string> = {
  monthly: "/mo",
  annual: "/yr",
  one_time: " one-time",
  custom: "",
};

export function PriceBadge({ cents, model }: { cents: number; model: PricingModel }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-semibold">
        {model === "custom" && cents === 0 ? "Custom pricing" : formatCurrency(cents)}
      </span>
      {!(model === "custom" && cents === 0) && (
        <span className="text-sm text-muted-foreground">{periodLabel[model]}</span>
      )}
    </div>
  );
}
