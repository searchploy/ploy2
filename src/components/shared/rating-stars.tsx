import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
  className,
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{rating > 0 ? rating.toFixed(1) : "New"}</span>
      {typeof reviewCount === "number" && reviewCount > 0 && (
        <span className="text-sm text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
