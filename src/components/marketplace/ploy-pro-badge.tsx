"use client";

import { Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Marks an approved listing whose owner has an active Ploy Pro subscription.
 *
 * It communicates membership and the visibility benefit that comes with it —
 * nothing about the AI employee's quality or performance, which Ploy does not
 * assess. Keep the copy away from anything that reads as an endorsement.
 */
export function PloyProBadge({ className, size = "sm" }: { className?: string; size?: "sm" | "md" }) {
  const dimensions = size === "md" ? "h-6 w-6" : "h-5 w-5";
  const icon = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            // Focusable so the tooltip is reachable by keyboard, and labelled
            // so it isn't announced as a bare star.
            role="img"
            tabIndex={0}
            aria-label="Ploy Pro member"
            onClick={(e) => e.preventDefault()}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full",
              "bg-gradient-to-br from-[#F5D680] via-[#E8A855] to-[#C98B3A]",
              "shadow-[0_0_8px_-1px_rgba(232,168,85,0.55)] ring-1 ring-[#F5D680]/40",
              "cursor-help outline-none focus-visible:ring-2 focus-visible:ring-ploy-gold",
              dimensions,
              className
            )}
          >
            <Star className={cn(icon, "fill-black/80 text-black/80")} strokeWidth={2.5} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56">
          <p className="font-semibold">Ploy Pro</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Active Ploy Pro member with increased marketplace visibility.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
