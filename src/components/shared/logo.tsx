import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { icon: "h-7 w-7", gap: "gap-1.5" },
  md: { icon: "h-8 w-8", gap: "gap-2" },
  lg: { icon: "h-10 w-10", gap: "gap-2.5" },
} as const;

/** The full lockup — O ring mark + "ploy" wordmark, side by side. */
export function Logo({ size = "md", className }: { size?: keyof typeof sizeMap; className?: string }) {
  const { icon, gap } = sizeMap[size];
  return (
    <span className={cn("flex items-center", gap, className)}>
      <Image
        src="/6.png"
        alt="Ploy"
        width={32}
        height={32}
        className={cn(icon, "shrink-0")}
        style={{ mixBlendMode: "screen" }}
      />
      <Image
        src="/Bullr (2) (1).png"
        alt="ploy"
        width={60}
        height={24}
        className="h-auto shrink-0"
        style={{ width: size === "sm" ? "auto" : size === "md" ? "auto" : "auto", mixBlendMode: "screen" }}
      />
    </span>
  );
}
