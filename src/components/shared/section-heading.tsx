import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-wide text-ploy-gold">{eyebrow}</span>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tighter sm:text-5xl">{title}</h2>
      {description && (
        <p className={cn("text-balance text-muted-foreground sm:text-lg", align === "center" ? "max-w-2xl" : "max-w-xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
