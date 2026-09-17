"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateListingReport } from "@/app/dashboard/admin/listing-reports/actions";
import { LISTING_REPORT_REASONS } from "@/lib/legal/constants";
import type { ListingReportRow } from "@/app/dashboard/admin/listing-reports/page";
import type { Database } from "@/lib/types/database";

type ReportStatus = Database["public"]["Enums"]["listing_report_status"];

const REASON_LABEL = Object.fromEntries(
  LISTING_REPORT_REASONS.map((r) => [r.value, r.label])
) as Record<string, string>;

const STATUS_UI: Record<ReportStatus, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-ploy-gold/15 text-ploy-gold" },
  under_review: { label: "Under review", className: "bg-blue-500/15 text-blue-300" },
  resolved: { label: "Resolved", className: "bg-green-500/15 text-green-400" },
  dismissed: { label: "Dismissed", className: "bg-secondary text-muted-foreground" },
};

/**
 * Row and Panel live at module scope rather than inside ListingReportsQueue.
 * Declaring them in the component body makes React treat them as a new
 * component type on every render, which remounts them and drops their state.
 */
function Row({
  report,
  isPending,
  onReview,
}: {
  report: ListingReportRow;
  isPending: boolean;
  onReview: (report: ListingReportRow) => void;
}) {
  const status = STATUS_UI[report.status];
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-medium">
          {report.employee?.name ?? "Listing removed"}
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {REASON_LABEL[report.reason] ?? report.reason}
          {report.employee?.agency_name ? ` · ${report.employee.agency_name}` : ""}
        </p>
        {report.detail && (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground/80">{report.detail}</p>
        )}
      </div>

      <div className="hidden w-28 shrink-0 text-sm text-muted-foreground md:block">
        {new Date(report.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </div>

      <div className="flex shrink-0 gap-2">
        {report.employee && report.employee.status === "published" && (
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/marketplace/${report.employee.slug}`} target="_blank">
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
        <Button size="sm" variant="outline" disabled={isPending} onClick={() => onReview(report)}>
          Review
        </Button>
      </div>
    </div>
  );
}

function Panel({
  items,
  empty,
  isPending,
  onReview,
}: {
  items: ListingReportRow[];
  empty: string;
  isPending: boolean;
  onReview: (report: ListingReportRow) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border py-16 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {items.map((report) => (
        <Row key={report.id} report={report} isPending={isPending} onReview={onReview} />
      ))}
    </div>
  );
}

export function ListingReportsQueue({ reports }: { reports: ListingReportRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reviewing, setReviewing] = useState<ListingReportRow | null>(null);
  const [notes, setNotes] = useState("");

  const groups = useMemo(
    () => ({
      open: reports.filter((r) => r.status === "open"),
      under_review: reports.filter((r) => r.status === "under_review"),
      closed: reports.filter((r) => r.status === "resolved" || r.status === "dismissed"),
    }),
    [reports]
  );

  const act = (id: string, status: ReportStatus, adminNotes?: string) => {
    startTransition(async () => {
      const result = await updateListingReport(id, status, adminNotes);
      if (result.ok) {
        toast.success(`Report marked ${STATUS_UI[status].label.toLowerCase()}.`);
        setReviewing(null);
        setNotes("");
        router.refresh();
      } else {
        toast.error("That didn't work", { description: result.error });
      }
    });
  };

  const openReview = (report: ListingReportRow) => {
    setNotes(report.admin_notes ?? "");
    setReviewing(report);
  };

  return (
    <>
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open">
            Open
            {groups.open.length > 0 && (
              <span className="ml-2 rounded-full bg-ploy-gold/15 px-2 py-0.5 text-xs font-semibold text-ploy-gold">
                {groups.open.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="under_review">
            Under review
            {groups.under_review.length > 0 && (
              <span className="ml-2 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-300">
                {groups.under_review.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-4">
          <Panel
            items={groups.open}
            empty="No open reports."
            isPending={isPending}
            onReview={openReview}
          />
        </TabsContent>
        <TabsContent value="under_review" className="mt-4">
          <Panel
            items={groups.under_review}
            empty="Nothing under review."
            isPending={isPending}
            onReview={openReview}
          />
        </TabsContent>
        <TabsContent value="closed" className="mt-4">
          <Panel
            items={groups.closed}
            empty="No closed reports."
            isPending={isPending}
            onReview={openReview}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!reviewing} onOpenChange={(open) => !open && setReviewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review report</DialogTitle>
            <DialogDescription>
              A report is an allegation. Investigate before removing a listing or suspending a
              provider.
            </DialogDescription>
          </DialogHeader>

          {reviewing && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <p className="text-sm font-medium">{reviewing.employee?.name ?? "Listing removed"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {REASON_LABEL[reviewing.reason] ?? reviewing.reason}
                </p>
                {reviewing.detail && (
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                    {reviewing.detail}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="admin-notes">Internal notes</Label>
                <Textarea
                  id="admin-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What you checked and what you concluded."
                  className="min-h-24"
                />
                <p className="text-xs text-muted-foreground">
                  Visible to admins only — never to the reporter or the provider.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => act(reviewing.id, "under_review", notes)}
                >
                  Mark under review
                </Button>
                <Button size="sm" disabled={isPending} onClick={() => act(reviewing.id, "resolved", notes)}>
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => act(reviewing.id, "dismissed", notes)}
                >
                  Dismiss
                </Button>
              </div>

              {reviewing.employee && (
                <p className="text-xs text-muted-foreground">
                  To remove or suspend this listing, use{" "}
                  <Link href="/dashboard/admin/listings" className="text-ploy-gold hover:underline">
                    Listings
                  </Link>
                  .
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
