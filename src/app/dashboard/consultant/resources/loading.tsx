import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingRegion, PageHeaderSkeleton } from "@/components/dashboard/skeletons";
import { getAllResources } from "@/lib/consultant-resources";

// Placeholder count tracks the real catalog so the grid doesn't jump on load.
const CARD_COUNT = getAllResources().length;

export default function Loading() {
  return (
    <LoadingRegion label="Loading resources">
      <PageHeaderSkeleton />

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <Card key={i} className="flex flex-col gap-4 p-6">
            <div className="flex items-start gap-3">
              <Skeleton className="mt-1 h-5 w-5 shrink-0" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-40 max-w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <Skeleton className="h-9 w-full" />
          </Card>
        ))}
      </div>

      <Card className="flex flex-col gap-3 p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="mt-1 h-9 w-36" />
      </Card>
    </LoadingRegion>
  );
}
