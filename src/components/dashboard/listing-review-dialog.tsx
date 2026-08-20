"use client";

import { Check, X, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { EmployeeWithCategory } from "@/lib/data/live-marketplace";

/**
 * Full listing preview so the admin decides from the same information a
 * business would see on the marketplace, rather than from a table row.
 */
export function ListingReviewDialog({
  listing,
  open,
  onOpenChange,
  onApprove,
  onReject,
  rejectionReason,
  onRejectionReasonChange,
  busy,
}: {
  listing: EmployeeWithCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  rejectionReason: string;
  onRejectionReasonChange: (value: string) => void;
  busy: boolean;
}) {
  if (!listing) return null;

  const isPending = listing.status === "pending_review";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review listing</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary text-2xl">
              {listing.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.thumbnail_url} alt="" className="h-full w-full object-cover" />
              ) : (
                "🤖"
              )}
            </span>
            <div className="min-w-0">
              <h3 className="text-xl font-bold">{listing.name}</h3>
              {listing.tagline && <p className="mt-1 text-sm text-muted-foreground">{listing.tagline}</p>}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {listing.category && <Badge variant="blue">{listing.category.name}</Badge>}
                <StatusPill status={listing.status} />
              </div>
            </div>
          </div>

          <Field label="Description">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {listing.description}
            </p>
          </Field>

          {listing.primary_tasks && listing.primary_tasks.length > 0 && (
            <Field label="Primary tasks">
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {listing.primary_tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ploy-gold" />
                    {task}
                  </li>
                ))}
              </ul>
            </Field>
          )}

          {listing.industries && listing.industries.length > 0 && (
            <Field label="Best for">
              <div className="flex flex-wrap gap-1.5">
                {listing.industries.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
              {listing.best_for_description && (
                <p className="mt-2 text-sm text-muted-foreground">{listing.best_for_description}</p>
              )}
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company / agency">
              <p className="text-sm">{listing.agency_name ?? "—"}</p>
            </Field>
            <Field label="Price">
              <p className="text-sm">
                {listing.price_monthly != null ? `$${listing.price_monthly}/mo` : "Not listed"}
              </p>
            </Field>
            <Field label="Website">
              {listing.website_url ? (
                <a
                  href={listing.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-ploy-gold hover:underline"
                >
                  {listing.website_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </Field>
            <Field label="Submitted">
              <p className="text-sm">
                {new Date(listing.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </Field>
          </div>

          {listing.status === "rejected" && listing.rejection_reason && (
            <Field label="Rejection reason given">
              <p className="text-sm text-red-400">{listing.rejection_reason}</p>
            </Field>
          )}

          <div className="flex flex-col gap-3 border-t border-border pt-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rejection-reason">Rejection reason (optional)</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                placeholder="e.g. The description doesn't clearly explain what this AI employee does."
                className="min-h-20"
                onChange={(e) => onRejectionReasonChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Shown to the listing owner if you reject.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {listing.status !== "published" && (
                <Button onClick={() => onApprove(listing.id)} disabled={busy}>
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
              )}
              {listing.status !== "rejected" && (
                <Button variant="outline" onClick={() => onReject(listing.id)} disabled={busy}>
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              )}
              {!isPending && (
                <p className="self-center text-xs text-muted-foreground">
                  This listing has already been reviewed.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending_review: { label: "Pending Review", className: "bg-ploy-gold/15 text-ploy-gold" },
    published: { label: "Approved", className: "bg-green-500/15 text-green-400" },
    rejected: { label: "Rejected", className: "bg-red-500/15 text-red-400" },
  };
  const entry = map[status] ?? { label: status, className: "bg-secondary text-muted-foreground" };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.className}`}>
      {entry.label}
    </span>
  );
}
