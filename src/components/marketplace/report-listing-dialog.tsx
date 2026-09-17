"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reportListing } from "@/app/actions/legal";
import { LISTING_REPORT_REASONS, type ListingReportReason } from "@/lib/legal/constants";

/**
 * Lets a visitor flag a listing that looks misleading or fraudulent. Open to
 * signed-out visitors: whoever spots a scam listing is worth hearing from,
 * account or not. Abuse is handled by rate limiting inside the database
 * function rather than by requiring a login.
 */
export function ReportListingDialog({
  employeeId,
  employeeName,
}: {
  employeeId: string;
  employeeName: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ListingReportReason | null>(null);
  const [detail, setDetail] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    if (!reason) return;
    startTransition(async () => {
      const result = await reportListing(employeeId, reason, detail);
      if (result.ok) {
        toast.success("Report submitted", {
          description: "Thanks — our team will review this listing.",
        });
        setOpen(false);
        setReason(null);
        setDetail("");
      } else {
        toast.error("Couldn't submit your report", { description: result.error });
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        <Flag className="h-3 w-3" />
        Report this listing
      </button>

      <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report {employeeName}</DialogTitle>
            <DialogDescription>
              Tell us what looks wrong. Reports go to Ploy&apos;s moderation team and are not shown
              to the provider or to other users.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <fieldset className="flex flex-col gap-1">
              <legend className="mb-2 text-sm font-medium">What&apos;s the issue?</legend>
              {LISTING_REPORT_REASONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-secondary/50"
                >
                  <input
                    type="radio"
                    name="listing-report-reason"
                    value={option.value}
                    checked={reason === option.value}
                    onChange={() => setReason(option.value)}
                    className="h-4 w-4 accent-[hsl(var(--ploy-gold))]"
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="listing-report-detail">Anything else? (optional)</Label>
              <Textarea
                id="listing-report-detail"
                value={detail}
                maxLength={2000}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Add any detail that would help us review this."
                className="min-h-24"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Reporting a listing is not a finding against the provider. Ploy reviews every report
              before taking any action.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!reason || isPending}>
              {isPending ? "Submitting..." : "Submit report"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
