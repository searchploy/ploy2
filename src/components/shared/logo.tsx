import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { icon: "h-7 w-7", wordmark: "h-4", gap: "gap-1.5" },
  md: { icon: "h-8 w-8", wordmark: "h-5", gap: "gap-2" },
  lg: { icon: "h-10 w-10", wordmark: "h-6", gap: "gap-2.5" },
} as const;

/**
 * The full lockup — O ring mark + "ploy" wordmark, side by side.
 *
 * Both assets carry a real alpha channel, so they composite directly on any
 * surface. The earlier mix-blend-mode: screen workaround is gone — it existed
 * only to knock the black field out of the old opaque exports, and it broke
 * wherever a parent formed its own stacking context.
 */
export function Logo({ size = "md", className }: { size?: keyof typeof sizeMap; className?: string }) {
  const { icon, wordmark, gap } = sizeMap[size];
  return (
    <span className={cn("flex items-center", gap, className)}>
      <Image src="/ploy-mark.png" alt="Ploy" width={1261} height={1247} className={cn(icon, "shrink-0")} />
      <Image
        src="/ploy-wordmark.png"
        alt="ploy"
        width={2016}
        height={780}
        className={cn(wordmark, "w-auto shrink-0")}
      />
    </span>
  );
}
