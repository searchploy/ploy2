import { cn } from "@/lib/utils";

/**
 * The site's default loading indicator — see `.ring-loader` in globals.css for
 * how the mark is drawn and why it does not survive being scaled down.
 *
 * The report wizard deliberately keeps its own larger gold spinner: that
 * screen holds for several seconds with rotating status copy, and wants an
 * indicator with more presence than this one.
 */
export function RingLoader({ size = 50, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("ring-loader-container", className)}
      role="status"
      aria-label="Loading"
    >
      <div
        className="ring-loader"
        style={{ "--ring-loader-size": `${size}px` } as React.CSSProperties}
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Full-viewport version for route-level loading states. */
export function RingLoadingScreen({ size = 50 }: { size?: number }) {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-8">
      <RingLoader size={size} />
    </div>
  );
}
