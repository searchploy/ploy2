import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, "default" | "secondary" | "outline" | "blue" | "success" | "warning" | "destructive"> = {
  draft: "outline",
  pending_review: "warning",
  pending: "warning",
  published: "success",
  approved: "success",
  paid: "success",
  completed: "success",
  cleared: "success",
  paid_out: "success",
  rejected: "destructive",
  suspended: "destructive",
  cancelled: "destructive",
  refunded: "destructive",
  archived: "secondary",
  fulfilling: "blue",
  contacted: "blue",
  scheduled: "blue",
  new: "blue",
  declined: "destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusStyles[status] ?? "outline"} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
