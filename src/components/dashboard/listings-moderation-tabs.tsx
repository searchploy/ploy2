"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Check, X, Star, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog } from "@/components/dashboard/alert-dialog";
import { ListingReviewDialog, StatusPill } from "@/components/dashboard/listing-review-dialog";
import {
  approveListing,
  rejectListing,
  deleteListingAsAdmin,
  setListingFeatured,
} from "@/app/dashboard/admin/listings/actions";
import { cn } from "@/lib/utils";
import type { EmployeeWithCategory } from "@/lib/data/live-marketplace";

/**
 * The moderation centre. Every action here calls a server action that
 * re-checks admin status and writes to the database — the local list is only
 * refreshed from the server afterwards, never mutated as the source of truth.
 */
export function ListingsModerationTabs({ listings }: { listings: EmployeeWithCategory[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [reviewing, setReviewing] = useState<EmployeeWithCategory | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingDelete, setPendingDelete] = useState<EmployeeWithCategory | null>(null);

  const pendingReview = listings.filter((l) => l.status === "pending_review");
  const approved = listings.filter((l) => l.status === "published");
  const rejected = listings.filter((l) => l.status === "rejected");

  function run(action: () => Promise<{ ok: true } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(success);
        setReviewing(null);
        setRejectionReason("");
        router.refresh();
      } else {
        toast.error("That didn't work", { description: result.error });
      }
    });
  }

  const handleApprove = (id: string) =>
    run(() => approveListing(id), "Listing approved — it's live on the marketplace.");

  const handleReject = (id: string) =>
    run(() => rejectListing(id, rejectionReason), "Listing rejected.");

  const handleFeature = (listing: EmployeeWithCategory) =>
    run(
      () => setListingFeatured(listing.id, !listing.featured),
      listing.featured ? "Removed from featured." : "Marked as featured."
    );

  const handleDelete = () => {
    if (!pendingDelete) return;
    const name = pendingDelete.name;
    const id = pendingDelete.id;
    setPendingDelete(null);
    run(() => deleteListingAsAdmin(id), `${name} was deleted.`);
  };

  function Row({ listing, showReviewActions }: { listing: EmployeeWithCategory; showReviewActions: boolean }) {
    return (
      <div className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
        <button
          onClick={() => {
            setRejectionReason("");
            setReviewing(listing);
          }}
          className="min-w-0 flex-1 text-left"
        >
          <p className="truncate font-medium hover:text-ploy-gold">{listing.name}</p>
          <p className="truncate text-sm text-muted-foreground">
            {listing.agency_name ?? "—"}
            {listing.category ? ` · ${listing.category.name}` : ""}
          </p>
        </button>

        <div className="hidden w-28 shrink-0 text-sm sm:block">
          {listing.price_monthly != null ? `$${listing.price_monthly}/mo` : "—"}
        </div>

        <div className="hidden w-32 shrink-0 text-sm text-muted-foreground md:block">
          {new Date(listing.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {showReviewActions ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setReviewing(listing)} disabled={isPending}>
                <Eye className="h-3.5 w-3.5" /> Review
              </Button>
              <Button size="sm" onClick={() => handleApprove(listing.id)} disabled={isPending}>
                <Check className="h-3.5 w-3.5" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(listing.id)}
                disabled={isPending}
              >
                <X className="h-3.5 w-3.5" /> Reject
              </Button>
            </>
          ) : (
            <>
              {listing.status === "published" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleFeature(listing)}
                  disabled={isPending}
                  title="Toggle featured"
                >
                  <Star
                    className={cn("h-3.5 w-3.5", listing.featured && "fill-amber-400 text-amber-400")}
                  />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isPending}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setReviewing(listing)}>
                    <Eye className="h-3.5 w-3.5" /> View details
                  </DropdownMenuItem>
                  {listing.status === "published" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/marketplace/${listing.slug}`}>
                        <Eye className="h-3.5 w-3.5" /> View live
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {listing.status !== "rejected" && (
                    <DropdownMenuItem onClick={() => handleReject(listing.id)}>
                      <X className="h-3.5 w-3.5" /> Reject
                    </DropdownMenuItem>
                  )}
                  {listing.status !== "published" && (
                    <DropdownMenuItem onClick={() => handleApprove(listing.id)}>
                      <Check className="h-3.5 w-3.5" /> Approve
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setPendingDelete(listing)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    );
  }

  function Panel({
    items,
    empty,
    showReviewActions = false,
  }: {
    items: EmployeeWithCategory[];
    empty: string;
    showReviewActions?: boolean;
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
        <div className="flex items-center gap-4 border-b border-border bg-secondary/30 p-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="min-w-0 flex-1">Employee</div>
          <div className="hidden w-28 shrink-0 sm:block">Price</div>
          <div className="hidden w-32 shrink-0 md:block">Submitted</div>
          <div className="w-[260px] shrink-0 text-right">Actions</div>
        </div>
        {items.map((listing) => (
          <Row key={listing.id} listing={listing} showReviewActions={showReviewActions} />
        ))}
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending Review
            <Count value={pendingReview.length} className="bg-ploy-gold/15 text-ploy-gold" />
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Count value={approved.length} className="bg-green-500/15 text-green-400" />
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Count value={rejected.length} className="bg-red-500/15 text-red-400" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Panel items={pendingReview} empty="No listings awaiting review." showReviewActions />
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <Panel items={approved} empty="No approved listings." />
        </TabsContent>
        <TabsContent value="rejected" className="mt-4">
          <Panel items={rejected} empty="No rejected listings." />
        </TabsContent>
      </Tabs>

      <ListingReviewDialog
        listing={reviewing}
        open={!!reviewing}
        onOpenChange={(open) => !open && setReviewing(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
        busy={isPending}
      />

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete listing?"
        description={`This permanently removes "${pendingDelete?.name}" from the marketplace and from its owner's account. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  );
}

function Count({ value, className }: { value: number; className: string }) {
  if (value === 0) return null;
  return <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>{value}</span>;
}

export { StatusPill };
