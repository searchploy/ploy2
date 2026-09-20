import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The site's default loading indicator — a hairline ring orbiting the Ploy
 * mark. See `.ring-loader` in globals.css for how the ring is drawn and why it
 * does not survive being scaled down.
 *
 * `logo` is off for small instances: below roughly 64px the mark is too small
 * to resolve and reads as a smudge inside the ring.
 *
 * The report wizard deliberately keeps its own gold spinner: that screen holds
 * for five seconds under rotating status copy and wants a heavier indicator.
 */
export function RingLoader({
  size = 140,
  logo = true,
  className,
}: {
  size?: number;
  logo?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("ring-loader-container", className)}
      style={{ "--ring-loader-size": `${size}px` } as React.CSSProperties}
      role="status"
      aria-label="Loading"
    >
      <div className="ring-loader" />
      {logo && (
        <div className="ring-loader-logo" aria-hidden>
          <Image src="/ploy-mark.png" alt="" width={1261} height={1247} priority />
        </div>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Full-viewport version for route-level loading states. */
export function RingLoadingScreen({ size = 140 }: { size?: number }) {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-8">
      <RingLoader size={size} />
    </div>
  );
}
