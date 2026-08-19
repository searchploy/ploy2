import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared loading placeholders for the dashboard route segments. Each one mirrors
 * the real component it stands in for (same spacing, same grid, same column
 * count) so the page doesn't visibly reflow when the data arrives.
 */

/** Wraps a route's loading.tsx so screen readers announce the pending state. */
export function LoadingRegion({
  label,
  className = "flex flex-col gap-8",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Page title + subtitle, optionally with a top-right action button. */
export function PageHeaderSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {action && <Skeleton className="h-10 w-32 shrink-0" />}
    </div>
  );
}

/** The 4-up stat tiles on the consultant dashboard home. */
export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-14" />
            </div>
            <Skeleton className="h-5 w-5" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * A table inside a Card. `columns` sets the column count and `title` renders the
 * bordered header strip used by the "Recent Clients" card.
 */
export function TableCardSkeleton({
  columns,
  rows = 5,
  title = false,
}: {
  columns: number;
  rows?: number;
  title?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b border-border/50 p-6">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-8 w-20" />
        </div>
      )}

      <div className="flex flex-col">
        {/* Header row */}
        <div
          className="grid gap-4 border-b border-border/50 px-4 py-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 w-20 ${i === columns - 1 ? "justify-self-end" : ""}`}
            />
          ))}
        </div>

        {/* Body rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid gap-4 border-b border-border/50 px-4 py-4 last:border-b-0"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={c}
                className={
                  c === columns - 1
                    ? "h-8 w-20 justify-self-end"
                    : c === 0
                      ? "h-4 w-32 max-w-full"
                      : "h-4 w-24 max-w-full"
                }
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
