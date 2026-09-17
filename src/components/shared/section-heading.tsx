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
      {eyebrow && <span className="eyebrow-caps text-[0.7rem] text-ploy-gold">{eyebrow}</span>}
      {/*
       * Smaller than the old bold setting looks on paper, but caps plus 0.16em
       * of tracking carry roughly half again the width per character, so these
       * hold the same presence across a section without wrapping to three
       * lines.
       */}
      <h2 className="display-caps text-balance text-[1.35rem] sm:text-[1.5rem] lg:text-[2rem]">
        {title}
      </h2>
      {description && (
        <p className={cn("text-balance text-muted-foreground sm:text-lg", align === "center" ? "max-w-2xl" : "max-w-xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
