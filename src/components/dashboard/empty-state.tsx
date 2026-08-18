import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Shown wherever a user has no data yet. Deliberately used instead of
 * placeholder numbers so nothing on the dashboard can be mistaken for
 * real activity.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 p-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ploy-blue/10 text-ploy-blue">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Button asChild size="sm" className="mt-1">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </Card>
  );
}
