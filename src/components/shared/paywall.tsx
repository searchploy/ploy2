import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Paywall({
  title,
  description,
  features,
  ctaLabel,
  ctaHref = "/pricing",
}: {
  title: string;
  description: string;
  features?: string[];
  ctaLabel: string;
  ctaHref?: string;
}) {
  return (
    <div className="shadow-glow-card mx-auto flex w-full max-w-lg flex-col items-center gap-5 rounded-3xl border border-transparent bg-card p-8 text-center sm:p-10">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-ploy-blue">
        <Lock className="h-5 w-5" />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {features && features.length > 0 && (
        <ul className="flex w-full flex-col gap-2.5 text-left">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-ploy-blue" />
              {f}
            </li>
          ))}
        </ul>
      )}

      <Button asChild size="lg" className="mt-1 w-full">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
