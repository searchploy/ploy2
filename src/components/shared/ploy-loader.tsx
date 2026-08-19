import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Concentric ripple loader with the Ploy mark at its centre.
 *
 * The five `.box` children are required and order-dependent — the stylesheet
 * addresses them by :nth-child to set each ring's inset, rim opacity and
 * animation delay, which is what produces the outward stagger.
 */
export function PloyLoader({ size = 250, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("loader", className)}
      style={{ "--size": `${size}px` } as React.CSSProperties}
      role="status"
      aria-label="Loading"
    >
      {/*
        The five boxes must be the first five children: the stylesheet targets
        them with .box:nth-child(1..5), which counts every sibling, not just
        boxes. Anything inserted above them shifts the whole ramp by one and
        leaves the innermost ring unstyled.
      */}
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="logo" aria-hidden>
        <Image src="/ploy-mark.png" alt="" width={1261} height={1247} priority />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Full-viewport version for route-level loading states. */
export function PloyLoadingScreen({ size = 250 }: { size?: number }) {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-8">
      <PloyLoader size={size} />
    </div>
  );
}
