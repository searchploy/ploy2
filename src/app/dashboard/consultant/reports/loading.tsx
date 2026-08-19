import {
  LoadingRegion,
  PageHeaderSkeleton,
  TableCardSkeleton,
} from "@/components/dashboard/skeletons";

export default function Loading() {
  return (
    <LoadingRegion label="Loading AI reports">
      <PageHeaderSkeleton action />
      <TableCardSkeleton columns={3} rows={5} />
    </LoadingRegion>
  );
}
