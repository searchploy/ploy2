"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProVisibilityDisclosure } from "@/components/legal/disclosures";

/*
 * Shown once, immediately after a free account submits a listing for review.
 * The listing is already saved by the time this opens — dismissing it is not
 * declining anything, so it closes to the listing page either way.
 *
 * Wording is deliberately conditional ("may", "eligible"). Ploy Pro buys
 * eligibility for placement, not placement itself, and the disclosure below
 * the list is the same one that sits beside every other visibility claim.
 */
const BENEFITS = [
  "Higher placement in marketplace results",
  "Eligible for featured placement and the gold badge",
  "List up to 5 AI tools instead of 1",
  "Considered for more AI Report recommendations",
  "Verified agency badge on your listing",
  "Priority review on new listings and edits",
  "Advanced and lead-conversion analytics",
  "Priority support",
];

export function ProUpsellDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <span className="flex items-center gap-1.5 eyebrow-caps text-[0.7rem] text-ploy-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Ploy Pro
          </span>
          <DialogTitle className="text-2xl">Your AI tool is in for review</DialogTitle>
          <DialogDescription>
            It will appear on the marketplace once approved. Ploy Pro changes how far it
            travels once it is there.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2.5 py-2 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <div key={benefit} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-ploy-gold" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        <ProVisibilityDisclosure />

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Button asChild>
            {/* The disclosure above carries its own "Learn more" to the terms,
                so this one is named for screen readers to tell them apart. */}
            <Link href="/for-agencies" aria-label="Learn more about Ploy Pro">
              Learn more
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
