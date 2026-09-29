import Link from "next/link";
import { Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProVisibilityDisclosure } from "@/components/legal/disclosures";

/**
 * Explains, on the owner's own listing page, what Ploy Pro is currently doing
 * for their listing — or would do once it's approved. Deliberately low-key:
 * a free listing is a first-class marketplace listing, and this shouldn't
 * read as though it isn't.
 */
export function ProVisibilityPanel({
  isPro,
  status,
}: {
  isPro: boolean;
  status: string;
}) {
  const isApproved = status === "published";

  if (isPro && isApproved) {
    return (
      <div className="flex flex-col gap-3">
        <Panel tone="gold" icon={<Star className="h-4 w-4 fill-ploy-gold" />} title="Ploy Pro Visibility">
          Your approved AI tool may receive enhanced marketplace placement and additional
          exposure in eligible AI reports.
        </Panel>
        <ProVisibilityDisclosure />
      </div>
    );
  }

  if (isPro) {
    return (
      <div className="flex flex-col gap-3">
        <Panel tone="gold" icon={<Star className="h-4 w-4 fill-ploy-gold" />} title="Ploy Pro Visibility">
          Your AI tool is awaiting approval. Your Ploy Pro visibility benefits will activate once
          your listing is approved.
        </Panel>
        <ProVisibilityDisclosure />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Panel
        tone="promo"
        icon={<TrendingUp className="h-4 w-4 text-ploy-gold" />}
        title="Ploy Pro visibility"
        action={
          <Button asChild size="sm">
            <Link href="/for-agencies">Learn more</Link>
          </Button>
        }
      >
        Ploy Pro listings may be placed higher in the marketplace and appear in more eligible AI
        reports. Your listing stays on the marketplace either way.
      </Panel>
      <ProVisibilityDisclosure />
    </div>
  );
}

/*
 * "promo" is the only upsell state, so it is the only one that draws the eye:
 * the travelling gold frame is reserved for the panel a non-subscriber sees.
 * It carries no `border-*` class because .metal-border supplies its own.
 */
const TONES = {
  gold: "border border-ploy-gold/25 bg-ploy-gold/5",
  muted: "border border-border bg-card",
  promo: "metal-border metal-shine bg-card",
} as const;

function Panel({
  tone,
  icon,
  title,
  children,
  action,
}: {
  tone: keyof typeof TONES;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const accented = tone !== "muted";
  return (
    <div
      className={`flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between ${TONES[tone]}`}
    >
      <div className="flex gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div>
          <p className={`text-sm font-semibold ${accented ? "text-ploy-gold" : ""}`}>{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{children}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
