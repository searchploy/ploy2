import {
  LoadingRegion,
  PageHeaderSkeleton,
  TableCardSkeleton,
} from "@/components/dashboard/skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading clients">
      <PageHeaderSkeleton action />
      <TableCardSkeleton columns={5} rows={6} />
    </LoadingRegion>
  );
}
