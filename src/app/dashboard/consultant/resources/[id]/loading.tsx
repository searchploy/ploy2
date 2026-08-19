import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion } from "@/components/dashboard/skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading resource" className="mx-auto max-w-4xl">
      {/* Header: back link, title, intro */}
      <div className="mb-8 flex flex-col gap-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>

      {/* Table of contents */}
      <Card className="mb-8 flex flex-col gap-3 p-6">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-56 max-w-full" />
        ))}
      </Card>

      {/* Content sections */}
      <div className="flex flex-col gap-10">
        {Array.from({ length: 3 }).map((_, s) => (
          <div key={s} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
              <Skeleton className="h-7 w-64 max-w-full" />
              <Skeleton className="h-8 w-20 shrink-0" />
            </div>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, l) => (
                <Skeleton
                  key={l}
                  className="h-4"
                  style={{ width: `${[95, 88, 70, 92, 60][l]}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </LoadingRegion>
  );
}
