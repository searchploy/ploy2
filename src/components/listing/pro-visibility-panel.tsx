import Link from "next/link";
import { Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <Panel tone="gold" icon={<Star className="h-4 w-4 fill-ploy-gold" />} title="Ploy Pro Visibility">
        Your approved AI Employee receives increased marketplace placement and additional exposure in
        relevant AI reports.
      </Panel>
    );
  }

  if (isPro) {
    return (
      <Panel tone="gold" icon={<Star className="h-4 w-4 fill-ploy-gold" />} title="Ploy Pro Visibility">
        Your AI Employee is awaiting approval. Your Ploy Pro visibility benefits will activate once
        your listing is approved.
      </Panel>
    );
  }

  return (
    <Panel
      tone="muted"
      icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      title="Get more visibility with Ploy Pro"
      action={
        <Button asChild size="sm" variant="outline">
          <Link href="/pricing">See Ploy Pro</Link>
        </Button>
      }
    >
      Boost your AI Employee higher in the marketplace and increase its exposure in relevant AI
      reports. Your listing stays on the marketplace either way.
    </Panel>
  );
}

function Panel({
  tone,
  icon,
  title,
  children,
  action,
}: {
  tone: "gold" | "muted";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
        tone === "gold" ? "border-ploy-gold/25 bg-ploy-gold/5" : "border-border bg-card"
      }`}
    >
      <div className="flex gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div>
          <p className={`text-sm font-semibold ${tone === "gold" ? "text-ploy-gold" : ""}`}>{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{children}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
