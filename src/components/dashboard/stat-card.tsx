import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ploy-blue/10 text-ploy-blue">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {trend && (
        <div className={cn("flex items-center gap-1 text-xs font-medium", trend.positive ? "text-emerald-600" : "text-red-600")}>
          {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend.value}
        </div>
      )}
    </Card>
  );
}
