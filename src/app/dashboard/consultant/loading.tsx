import {
  LoadingRegion,
  PageHeaderSkeleton,
  StatGridSkeleton,
  TableCardSkeleton,
} from "@/components/dashboard/skeletons";

// Also the fallback for any consultant route without its own loading.tsx.
export default function Loading() {
  return (
    <LoadingRegion label="Loading dashboard">
      <PageHeaderSkeleton />
      <StatGridSkeleton />
      <TableCardSkeleton columns={5} rows={5} title />
    </LoadingRegion>
  );
}
