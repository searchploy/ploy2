"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, Edit, Trash2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/dashboard/alert-dialog";
import { deleteMyListing } from "./actions";
import type { Database } from "@/lib/types/database";

type Employee = Database["public"]["Tables"]["employees"]["Row"];

const STATUS_UI = {
  pending_review: {
    label: "Pending Approval",
    icon: Clock,
    badge: "bg-ploy-gold/15 text-ploy-gold",
    body: "Your listing is under review. We'll notify you when it's approved.",
  },
  published: {
    label: "Approved",
    icon: CheckCircle2,
    badge: "bg-green-500/15 text-green-400",
    body: "Your AI employee is live on the marketplace.",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badge: "bg-red-500/15 text-red-400",
    body: "Your listing was not approved.",
  },
} as const;

export function ListingManagementContent({ listing }: { listing: Employee }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const status = STATUS_UI[listing.status as keyof typeof STATUS_UI] ?? {
    label: listing.status,
    icon: Clock,
    badge: "bg-secondary text-muted-foreground",
    body: "",
  };
  const StatusIcon = status.icon;
  const isApproved = listing.status === "published";
  const isRejected = listing.status === "rejected";

  const handleDelete = () => {
    setConfirmDelete(false);
    startTransition(async () => {
      const result = await deleteMyListing();
      if (result.ok) {
        toast.success("Listing deleted", {
          description: "Your AI employee has been removed from Ploy.",
        });
        router.refresh();
      } else {
        toast.error("Couldn't delete your listing", { description: result.error });
      }
    });
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-start gap-4">
              {listing.thumbnail_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.thumbnail_url}
                  alt={listing.name}
                  className="h-24 w-24 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0">
                <h2 className="text-2xl font-bold">{listing.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{listing.tagline}</p>
                <span
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </span>
              </div>
            </div>

            {status.body && (
              <div
                className={`rounded-lg border p-4 text-sm ${
                  isRejected
                    ? "border-red-500/25 bg-red-500/5 text-red-300"
                    : isApproved
                      ? "border-green-500/25 bg-green-500/5 text-green-300"
                      : "border-ploy-gold/25 bg-ploy-gold/5 text-ploy-gold"
                }`}
              >
                <p>{status.body}</p>
                {isRejected && listing.rejection_reason && (
                  <p className="mt-2 opacity-90">
                    <span className="font-semibold">Reason: </span>
                    {listing.rejection_reason}
                  </p>
                )}
                {isRejected && (
                  <p className="mt-2 opacity-90">
                    Update your listing and resubmit it for review.
                  </p>
                )}
                {isApproved && (
                  <p className="mt-2 opacity-90">
                    Editing it sends the changes back for review and temporarily removes it from the
                    marketplace.
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">{listing.description}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
              {listing.avg_roi_percent != null && (
                <Stat label="Average ROI" value={`${listing.avg_roi_percent}%`} />
              )}
              {listing.expected_monthly_savings != null && (
                <Stat
                  label="Monthly Savings"
                  value={`$${Number(listing.expected_monthly_savings).toLocaleString()}`}
                />
              )}
              {listing.setup_time && <Stat label="Setup Time" value={listing.setup_time} />}
              {listing.price_monthly != null && (
                <Stat label="Price" value={`$${Number(listing.price_monthly).toLocaleString()}/mo`} />
              )}
            </div>
          </div>

          <div className="w-full shrink-0 space-y-2 sm:w-48">
            {isApproved && (
              <Button asChild variant="outline" className="w-full">
                <Link href={`/marketplace/${listing.slug}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Listing
                </Link>
              </Button>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/account/marketplace/listing/edit">
                <Edit className="mr-2 h-4 w-4" />
                {isRejected ? "Edit & Resubmit" : "Edit"}
              </Link>
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              disabled={isPending}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete your AI employee?"
        description={`"${listing.name}" will be removed from the marketplace and from your account. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
